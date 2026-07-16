/**
 * Trains the intent-classification head on intents.json using transfer
 * learning. Run via: npm run train-model
 *
 * Pipeline: load intents -> embed every pattern with the pretrained
 * Universal Sentence Encoder base model (frozen, its weights are never
 * updated) -> stratified 80/20 train/test split -> train the Dense
 * classification head for 200 epochs (with an internal validation split
 * for the loss/accuracy curves) -> evaluate on the held-out test split
 * (accuracy/precision/recall/F1/confusion matrix) -> persist head weights
 * + classes + model config + metrics to src/ml/artifacts/.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs';
import { embedTexts, BASE_MODEL_NAME, EMBEDDING_DIM } from './embedder';
import { buildModel } from './model';
import { computeMetrics } from './metrics';
import { evaluateBaselines, BaselineResult } from './baselines';
import { saveModel, saveCentroids, saveLogisticModel, METRICS_PATH, ARTIFACTS_DIR } from './io';

interface IntentDef {
  tag: string;
  patterns: string[];
  responses: string[];
  source: string;
}

interface Example {
  embedding: number[];
  classIdx: number;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function main() {
  const intentsPath = path.join(__dirname, 'intents.json');
  const { intents }: { intents: IntentDef[] } = JSON.parse(fs.readFileSync(intentsPath, 'utf-8'));

  // Dedupe, the dataset contains a handful of repeated tags; the classifier
  // needs one softmax output per unique intent (mirrors sorted(set(classes))
  // in the original training notebook).
  const classes = Array.from(new Set(intents.map((i) => i.tag))).sort();
  const totalPatterns = intents.reduce((s, i) => s + i.patterns.length, 0);
  console.log(`Loaded ${intents.length} intents, ${totalPatterns} total patterns.`);

  // Embed every pattern once with the frozen base model. Patterns are fed
  // to USE as raw text, it has its own tokenizer, so no manual
  // lemmatisation/Bag-of-Words step is needed (or wanted).
  const flat: Array<{ text: string; classIdx: number }> = intents.flatMap((intent) => {
    const classIdx = classes.indexOf(intent.tag);
    return intent.patterns.map((text) => ({ text, classIdx }));
  });

  console.log(`Embedding ${flat.length} patterns with ${BASE_MODEL_NAME} (base model)...`);
  const embeddings = await embedTexts(flat.map((f) => f.text));
  console.log(`Embeddings ready: ${embeddings.length} x ${EMBEDDING_DIM}`);

  // Group per class for the stratified split.
  const examplesByClass = new Map<number, Example[]>();
  flat.forEach((f, i) => {
    const group = examplesByClass.get(f.classIdx) ?? [];
    group.push({ embedding: embeddings[i], classIdx: f.classIdx });
    examplesByClass.set(f.classIdx, group);
  });

  const trainExamples: Example[] = [];
  const testExamples: Example[] = [];

  for (const group of examplesByClass.values()) {
    const shuffled = shuffle(group);
    const splitAt = Math.max(1, Math.floor(shuffled.length * 0.8));
    trainExamples.push(...shuffled.slice(0, splitAt));
    testExamples.push(...shuffled.slice(splitAt));
  }

  const trainShuffled = shuffle(trainExamples);
  const testShuffled = shuffle(testExamples);

  console.log(`Train: ${trainShuffled.length} examples, Test: ${testShuffled.length} examples.`);

  const xsTrain = tf.tensor2d(trainShuffled.map((e) => e.embedding));
  const ysTrain = tf.oneHot(
    tf.tensor1d(trainShuffled.map((e) => e.classIdx), 'int32'),
    classes.length,
  );

  const model = buildModel(EMBEDDING_DIM, classes.length);

  const EPOCHS = 200;
  const history = await model.fit(xsTrain, ysTrain, {
    epochs: EPOCHS,
    batchSize: 8,
    validationSplit: 0.2,
    shuffle: true,
    verbose: 0,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if ((epoch + 1) % 20 === 0 || epoch === 0) {
          console.log(
            `epoch ${epoch + 1}/${EPOCHS}, loss: ${logs?.loss.toFixed(4)} acc: ${logs?.acc?.toFixed(4)} val_loss: ${logs?.val_loss?.toFixed(4)} val_acc: ${logs?.val_acc?.toFixed(4)}`,
          );
        }
      },
    },
  });

  // Evaluate on the held-out test split (never seen during training).
  let testMetrics;
  if (testShuffled.length > 0) {
    const xsTest = tf.tensor2d(testShuffled.map((e) => e.embedding));
    const yTestIdx = testShuffled.map((e) => e.classIdx);
    const predictions = model.predict(xsTest) as tf.Tensor;
    const predictedIdx = Array.from(await predictions.argMax(-1).data());
    testMetrics = computeMetrics(yTestIdx, predictedIdx, classes);
    xsTest.dispose();
    predictions.dispose();

    console.log('\n--- Held-out test set evaluation ---');
    console.log(`Accuracy: ${(testMetrics.accuracy * 100).toFixed(2)}%`);
    console.log(`Macro F1 (all ${testMetrics.macroAvgEvaluated.classesTotal} classes, incl. zero-support): ${(testMetrics.macroAvg.f1 * 100).toFixed(2)}%`);
    console.log(
      `Macro F1 (${testMetrics.macroAvgEvaluated.classesEvaluated} classes with test data): ${(testMetrics.macroAvgEvaluated.f1 * 100).toFixed(2)}%`,
    );
    console.log(`Weighted F1: ${(testMetrics.weightedAvg.f1 * 100).toFixed(2)}%`);
    if (testMetrics.accuracy >= 0.995) {
      console.warn('WARNING: test accuracy is suspiciously close to 100%, check for data leakage or an overly small test set.');
    }
  } else {
    console.warn('No test examples available (every intent had too few patterns), skipping held-out evaluation.');
  }

  // Classical-ML baselines on the exact same split, for the evaluation
  // chapter's comparison table. Logistic regression consistently outscores
  // the trained head on this dataset's regime of many classes with few
  // patterns each, so its trained weights are also persisted below and used
  // by classifier.ts to decide the live answer.
  let baselines: BaselineResult[] = [];
  if (testShuffled.length > 0) {
    console.log('\nEvaluating baseline models on the same split...');
    const baselineEvaluation = await evaluateBaselines(
      trainShuffled.map((e) => e.embedding),
      trainShuffled.map((e) => e.classIdx),
      testShuffled.map((e) => e.embedding),
      testShuffled.map((e) => e.classIdx),
      classes,
    );
    baselines = baselineEvaluation.results;
    console.log('--- Baseline comparison (held-out test split) ---');
    for (const b of baselines) {
      console.log(
        `${b.name}: accuracy ${(b.accuracy * 100).toFixed(2)}% | macro F1 (evaluated) ${(b.macroF1Evaluated * 100).toFixed(2)}% | macro F1 (all) ${(b.macroF1 * 100).toFixed(2)}% | weighted F1 ${(b.weightedF1 * 100).toFixed(2)}%`,
      );
    }
    saveLogisticModel(baselineEvaluation.logisticModel);
    console.log('Logistic regression weights saved (used for live inference by classifier.ts).');
  }

  saveModel(model, { baseModel: BASE_MODEL_NAME, embeddingDim: EMBEDDING_DIM }, classes);

  // Per-class mean embedding, powers the classifier's semantic
  // out-of-domain gate (reject predictions when the message isn't actually
  // similar to any training pattern of the predicted intent).
  const centroids: number[][] = classes.map((_, classIdx) => {
    const group = examplesByClass.get(classIdx) ?? [];
    const centroid = new Array(EMBEDDING_DIM).fill(0);
    for (const example of group) {
      for (let d = 0; d < EMBEDDING_DIM; d++) centroid[d] += example.embedding[d];
    }
    if (group.length > 0) {
      for (let d = 0; d < EMBEDDING_DIM; d++) centroid[d] /= group.length;
    }
    return centroid;
  });
  saveCentroids(centroids);

  const trainAcc = history.history.acc as number[];
  const trainLoss = history.history.loss as number[];
  const valAcc = history.history.val_acc as number[];
  const valLoss = history.history.val_loss as number[];

  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.writeFileSync(
    METRICS_PATH,
    JSON.stringify(
      {
        trainedAt: new Date().toISOString(),
        baseModel: BASE_MODEL_NAME,
        embeddingDim: EMBEDDING_DIM,
        epochs: EPOCHS,
        numIntents: classes.length,
        trainExamples: trainShuffled.length,
        testExamples: testShuffled.length,
        finalTrainAccuracy: trainAcc[trainAcc.length - 1],
        finalTrainLoss: trainLoss[trainLoss.length - 1],
        finalValAccuracy: valAcc[valAcc.length - 1],
        finalValLoss: valLoss[valLoss.length - 1],
        trainingCurve: { accuracy: trainAcc, loss: trainLoss, valAccuracy: valAcc, valLoss: valLoss },
        testEvaluation: testMetrics ?? null,
        baselines,
      },
      null,
      2,
    ),
  );

  console.log(`\nHead weights, classes, config, and metrics saved to ${ARTIFACTS_DIR}`);
}

main().catch((err) => {
  console.error('Training failed:', err);
  process.exit(1);
});

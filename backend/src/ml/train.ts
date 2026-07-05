/**
 * Trains the intent-classification FFNN on intents.json.
 * Run via: npm run train-model
 *
 * Pipeline: load intents -> preprocess patterns (tokenise+lemmatise) ->
 * build BoW vocabulary -> stratified 80/20 train/test split -> train for
 * >=200 epochs (with an internal validation split for the loss/accuracy
 * curves) -> evaluate on the held-out test split (accuracy/precision/
 * recall/F1/confusion matrix) -> persist model + vocabulary + classes +
 * metrics to src/ml/artifacts/.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs';
import { preprocess, buildVocabulary, bagOfWords } from './nlp';
import { buildModel } from './model';
import { computeMetrics } from './metrics';
import { saveModel, METRICS_PATH, ARTIFACTS_DIR } from './io';

interface IntentDef {
  tag: string;
  patterns: string[];
  responses: string[];
  source: string;
}

interface Example {
  tokens: string[];
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

  const classes = intents.map((i) => i.tag).sort();
  console.log(`Loaded ${intents.length} intents, ${intents.reduce((s, i) => s + i.patterns.length, 0)} total patterns.`);

  // Preprocess every pattern once, build vocabulary from the full corpus.
  const allTokenized = intents.flatMap((intent) =>
    intent.patterns.map((p) => preprocess(p)),
  );
  const vocabulary = buildVocabulary(allTokenized);
  console.log(`Vocabulary size: ${vocabulary.length}`);

  // Build (tokens, classIdx) pairs, grouped by class for stratified split.
  const examplesByClass: Example[][] = intents.map((intent) => {
    const classIdx = classes.indexOf(intent.tag);
    return intent.patterns.map((p) => ({ tokens: preprocess(p), classIdx }));
  });

  const trainExamples: Example[] = [];
  const testExamples: Example[] = [];

  for (const group of examplesByClass) {
    const shuffled = shuffle(group);
    const splitAt = Math.max(1, Math.floor(shuffled.length * 0.8));
    trainExamples.push(...shuffled.slice(0, splitAt));
    testExamples.push(...shuffled.slice(splitAt));
  }

  const trainShuffled = shuffle(trainExamples);
  const testShuffled = shuffle(testExamples);

  console.log(`Train: ${trainShuffled.length} examples, Test: ${testShuffled.length} examples.`);

  const xTrain = trainShuffled.map((e) => bagOfWords(e.tokens, vocabulary));
  const yTrainIdx = trainShuffled.map((e) => e.classIdx);
  const xTest = testShuffled.map((e) => bagOfWords(e.tokens, vocabulary));
  const yTestIdx = testShuffled.map((e) => e.classIdx);

  const xsTrain = tf.tensor2d(xTrain);
  const ysTrain = tf.oneHot(tf.tensor1d(yTrainIdx, 'int32'), classes.length);

  const model = buildModel(vocabulary.length, classes.length);

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
            `epoch ${epoch + 1}/${EPOCHS} — loss: ${logs?.loss.toFixed(4)} acc: ${logs?.acc?.toFixed(4)} val_loss: ${logs?.val_loss?.toFixed(4)} val_acc: ${logs?.val_acc?.toFixed(4)}`,
          );
        }
      },
    },
  });

  // Evaluate on the held-out test split (never seen during training).
  let testMetrics;
  if (xTest.length > 0) {
    const xsTest = tf.tensor2d(xTest);
    const predictions = model.predict(xsTest) as tf.Tensor;
    const predictedIdx = Array.from(await predictions.argMax(-1).data());
    testMetrics = computeMetrics(yTestIdx, predictedIdx, classes);
    xsTest.dispose();
    predictions.dispose();

    console.log('\n--- Held-out test set evaluation ---');
    console.log(`Accuracy: ${(testMetrics.accuracy * 100).toFixed(2)}%`);
    console.log(`Macro F1: ${(testMetrics.macroAvg.f1 * 100).toFixed(2)}%`);
    console.log(`Weighted F1: ${(testMetrics.weightedAvg.f1 * 100).toFixed(2)}%`);
    if (testMetrics.accuracy >= 0.995) {
      console.warn('WARNING: test accuracy is suspiciously close to 100% — check for data leakage or an overly small test set.');
    }
  } else {
    console.warn('No test examples available (every intent had too few patterns) — skipping held-out evaluation.');
  }

  saveModel(model, vocabulary, classes);

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
        epochs: EPOCHS,
        vocabularySize: vocabulary.length,
        numIntents: classes.length,
        trainExamples: trainShuffled.length,
        testExamples: testShuffled.length,
        finalTrainAccuracy: trainAcc[trainAcc.length - 1],
        finalTrainLoss: trainLoss[trainLoss.length - 1],
        finalValAccuracy: valAcc[valAcc.length - 1],
        finalValLoss: valLoss[valLoss.length - 1],
        trainingCurve: { accuracy: trainAcc, loss: trainLoss, valAccuracy: valAcc, valLoss: valLoss },
        testEvaluation: testMetrics ?? null,
      },
      null,
      2,
    ),
  );

  console.log(`\nModel, vocabulary, classes, and metrics saved to ${ARTIFACTS_DIR}`);
}

main().catch((err) => {
  console.error('Training failed:', err);
  process.exit(1);
});

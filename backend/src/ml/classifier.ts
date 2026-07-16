/**
 * Inference-time intent classifier. Transfer-learning pipeline:
 * message -> Universal Sentence Encoder base model (frozen, embedder.ts)
 * -> trained logistic regression model -> intent.
 *
 * Went through two decision rules before this one. Originally used the
 * deeper Feedforward Neural Network head's softmax argmax (the head is
 * still trained and evaluated for the dissertation's model comparison, see
 * model.ts, train.ts, and metrics.json), but live testing found the head
 * doing worse than plain nearest-centroid matching on the same embeddings,
 * matching metrics.json's own comparison table. Nearest-centroid then
 * served as the live decision rule for a while. After the knowledge base
 * was expanded so every intent has real test data (previously ~370 of 510
 * intents had too few patterns to be evaluated at all), logistic regression
 * pulled ahead of nearest-centroid too (92% vs 90% accuracy, 91% vs 90%
 * macro F1), so it is what decides the live answer now. The out-of-domain
 * gate still uses cosine similarity to the predicted intent's training
 * centroid, this has been reliable throughout and is decision-rule agnostic.
 */
import * as tf from '@tensorflow/tfjs';
import { embedTexts, loadBaseModel } from './embedder';
import { buildLogisticModel } from './model';
import {
  loadConfigAndClasses,
  loadLogisticWeightsInto,
  loadCentroids,
  artifactsExist,
  logisticModelExists,
} from './io';

export interface Classification {
  intent: string;
  confidence: number;
}

// If the message embedding's cosine similarity to its predicted intent's
// training centroid is below this, the message is not actually about that
// intent (gibberish, off-topic, or a genuine knowledge base gap), so it
// returns 'unknown' instead of a confidently wrong answer. Related USE
// sentence pairs land around 0.5 to 0.8; unrelated text around 0.1 to 0.3.
const MIN_CENTROID_SIMILARITY = 0.4;

let cached: {
  model: tf.LayersModel;
  classes: string[];
  centroids: number[][] | null;
} | null = null;

async function getClassifierState() {
  if (cached) return cached;

  if (!artifactsExist()) {
    throw new Error(
      'No trained intent-classification model found. Run "npm run train-model" in backend/ before starting the server.',
    );
  }
  if (!logisticModelExists()) {
    throw new Error(
      'No logistic-weights.json found. Re-run "npm run train-model" in backend/ to generate it (older artifacts predate the logistic regression classifier).',
    );
  }

  // loadBaseModel() selects and initialises the tf backend (WASM, falling
  // back to CPU) as a side effect of loading the Universal Sentence
  // Encoder, which embedTexts() below depends on.
  await loadBaseModel();

  const { config, classes } = loadConfigAndClasses();
  const model = buildLogisticModel(config.embeddingDim, classes.length);
  loadLogisticWeightsInto(model);

  cached = { model, classes, centroids: loadCentroids() };
  return cached;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export async function classifyIntent(message: string): Promise<Classification> {
  const { model, classes, centroids } = await getClassifierState();

  if (!message.trim()) {
    return { intent: 'unknown', confidence: 0 };
  }

  const [embedding] = await embedTexts([message]);
  const input = tf.tensor2d([embedding]);
  const output = model.predict(input) as tf.Tensor;
  const probabilities = output.dataSync();
  input.dispose();
  output.dispose();

  let bestIdx = 0;
  for (let i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > probabilities[bestIdx]) bestIdx = i;
  }

  if (centroids?.[bestIdx]) {
    const similarity = cosineSimilarity(embedding, centroids[bestIdx]);
    if (similarity < MIN_CENTROID_SIMILARITY) {
      return { intent: 'unknown', confidence: 0 };
    }
  }

  return { intent: classes[bestIdx], confidence: probabilities[bestIdx] };
}

// Loads classifier state and the USE base model ahead of the first chat
// request so users don't pay the base model's download/initialisation cost
// mid-chat.
export async function warmupClassifier(): Promise<void> {
  await getClassifierState();
  await embedTexts(['warmup']);
}

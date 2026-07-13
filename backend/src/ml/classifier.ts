/**
 * Inference-time intent classifier. Transfer-learning pipeline:
 * message -> Universal Sentence Encoder base model (frozen, embedder.ts)
 * -> trained classification head (model.ts + saved weights) -> intent.
 * The head is loaded once (lazy singleton); the base model is loaded and
 * cached by embedder.ts.
 */
import * as tf from '@tensorflow/tfjs';
import { embedTexts, loadBaseModel } from './embedder';
import { buildModel } from './model';
import { loadConfigAndClasses, loadWeightsInto, loadCentroids, artifactsExist } from './io';

export interface Classification {
  intent: string;
  confidence: number;
}

// Semantic out-of-domain gate: if the message embedding's cosine similarity
// to the predicted intent's training centroid is below this, the message is
// not actually about that intent (gibberish, off-topic) — return 'unknown'
// instead of a confidently wrong answer. Related USE sentence pairs land
// around 0.5–0.8; unrelated text around 0.1–0.3.
const MIN_CENTROID_SIMILARITY = 0.4;

let cached: {
  model: tf.LayersModel;
  classes: string[];
  centroids: number[][] | null;
} | null = null;

async function getHead() {
  if (cached) return cached;

  if (!artifactsExist()) {
    throw new Error(
      'No trained intent-classification model found. Run "npm run train-model" in backend/ before starting the server.',
    );
  }

  // buildModel() below creates tensors (Dense layer weight init), which
  // needs an active tf backend. loadBaseModel() selects and initialises one
  // (WASM, falling back to CPU) as a side effect — await it first, since
  // WASM needs async setup unlike the old CPU-only default, which was
  // synchronously available and masked this ordering requirement.
  await loadBaseModel();

  const { config, classes } = loadConfigAndClasses();
  const model = buildModel(config.embeddingDim, classes.length);
  loadWeightsInto(model);

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
  const { model, classes, centroids } = await getHead();

  if (!message.trim()) {
    return { intent: 'unknown', confidence: 0 };
  }

  const [embedding] = await embedTexts([message]);
  const input = tf.tensor2d([embedding]);
  const output = model.predict(input) as tf.Tensor;
  const probabilities = output.dataSync();

  let bestIdx = 0;
  for (let i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > probabilities[bestIdx]) bestIdx = i;
  }

  input.dispose();
  output.dispose();

  if (centroids?.[bestIdx]) {
    const similarity = cosineSimilarity(embedding, centroids[bestIdx]);
    if (similarity < MIN_CENTROID_SIMILARITY) {
      return { intent: 'unknown', confidence: 0 };
    }
  }

  return { intent: classes[bestIdx], confidence: probabilities[bestIdx] };
}

// Loads the head and the USE base model ahead of the first chat request so
// users don't pay the base model's download/initialisation cost mid-chat.
export async function warmupClassifier(): Promise<void> {
  await getHead();
  await embedTexts(['warmup']);
}

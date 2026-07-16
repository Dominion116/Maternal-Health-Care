/**
 * Model persistence helpers.
 *
 * Pure `@tensorflow/tfjs` (used here since `@tensorflow/tfjs-node`'s native
 * bindings failed to build on this machine, no working Python for
 * node-gyp) has no 'file://' IOHandler; that's registered by tfjs-node.
 * Rather than reimplementing tf.io's ModelArtifacts/weight-manifest format,
 * we serialise each model's weights as plain JSON arrays and rebuild the
 * architecture via model.ts's builders before restoring them. Only trained
 * weights are persisted, the frozen Universal Sentence Encoder base model
 * is loaded from TF-Hub by embedder.ts.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs';

export const ARTIFACTS_DIR = path.join(__dirname, 'artifacts');
const WEIGHTS_PATH = path.join(ARTIFACTS_DIR, 'weights.json');
const LOGISTIC_WEIGHTS_PATH = path.join(ARTIFACTS_DIR, 'logistic-weights.json');
const CLASSES_PATH = path.join(ARTIFACTS_DIR, 'classes.json');
const CONFIG_PATH = path.join(ARTIFACTS_DIR, 'model-config.json');
const CENTROIDS_PATH = path.join(ARTIFACTS_DIR, 'centroids.json');
export const METRICS_PATH = path.join(ARTIFACTS_DIR, 'metrics.json');

// Left behind by the old Bag-of-Words pipeline, cleaned up on next save.
const LEGACY_VOCAB_PATH = path.join(ARTIFACTS_DIR, 'vocabulary.json');

export interface ModelConfig {
  baseModel: string;
  embeddingDim: number;
}

interface SerializedWeight {
  shape: number[];
  data: number[];
}

function saveWeightsTo(model: tf.LayersModel, filePath: string) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  const weights: SerializedWeight[] = model.getWeights().map((w) => ({
    shape: w.shape as number[],
    data: Array.from(w.dataSync()),
  }));
  fs.writeFileSync(filePath, JSON.stringify(weights));
}

function loadWeightsFrom(model: tf.LayersModel, filePath: string) {
  const serialized: SerializedWeight[] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  const tensors = serialized.map((w) => tf.tensor(w.data, w.shape));
  model.setWeights(tensors);
}

export function saveModel(model: tf.LayersModel, config: ModelConfig, classes: string[]) {
  saveWeightsTo(model, WEIGHTS_PATH);
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
  fs.writeFileSync(CLASSES_PATH, JSON.stringify(classes));

  if (fs.existsSync(LEGACY_VOCAB_PATH)) fs.unlinkSync(LEGACY_VOCAB_PATH);
}

export function loadConfigAndClasses(): { config: ModelConfig; classes: string[] } {
  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
  const classes = JSON.parse(fs.readFileSync(CLASSES_PATH, 'utf-8'));
  return { config, classes };
}

export function loadWeightsInto(model: tf.LayersModel) {
  loadWeightsFrom(model, WEIGHTS_PATH);
}

// Logistic regression is trained and evaluated alongside the FFNN head (see
// baselines.ts) purely for the dissertation's model comparison, but it's
// also what classifier.ts loads to decide the live answer, since it
// outperforms the deeper head on this dataset. Persisted separately so both
// models' weights can coexist on disk.
export function saveLogisticModel(model: tf.LayersModel) {
  saveWeightsTo(model, LOGISTIC_WEIGHTS_PATH);
}

export function loadLogisticWeightsInto(model: tf.LayersModel) {
  loadWeightsFrom(model, LOGISTIC_WEIGHTS_PATH);
}

export function logisticModelExists(): boolean {
  return fs.existsSync(LOGISTIC_WEIGHTS_PATH);
}

// Per-class mean embeddings (aligned with classes.json order), used as a
// semantic out-of-domain gate at inference time. Optional artifact: the
// classifier works without it, just without the gate.
export function saveCentroids(centroids: number[][]) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
  fs.writeFileSync(CENTROIDS_PATH, JSON.stringify(centroids));
}

export function loadCentroids(): number[][] | null {
  if (!fs.existsSync(CENTROIDS_PATH)) return null;
  return JSON.parse(fs.readFileSync(CENTROIDS_PATH, 'utf-8'));
}

export function artifactsExist(): boolean {
  return (
    fs.existsSync(WEIGHTS_PATH) && fs.existsSync(CLASSES_PATH) && fs.existsSync(CONFIG_PATH)
  );
}

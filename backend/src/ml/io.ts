/**
 * Model persistence helpers.
 *
 * Pure `@tensorflow/tfjs` (used here since `@tensorflow/tfjs-node`'s native
 * bindings failed to build on this machine — no working Python for
 * node-gyp) has no 'file://' IOHandler; that's registered by tfjs-node.
 * Rather than reimplementing tf.io's ModelArtifacts/weight-manifest format,
 * we serialise weights as plain JSON arrays and rebuild the architecture via
 * model.ts's buildModel() before restoring them — simpler and sufficient
 * since we never need to load this model outside this codebase.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as tf from '@tensorflow/tfjs';

export const ARTIFACTS_DIR = path.join(__dirname, 'artifacts');
const WEIGHTS_PATH = path.join(ARTIFACTS_DIR, 'weights.json');
const VOCAB_PATH = path.join(ARTIFACTS_DIR, 'vocabulary.json');
const CLASSES_PATH = path.join(ARTIFACTS_DIR, 'classes.json');
export const METRICS_PATH = path.join(ARTIFACTS_DIR, 'metrics.json');

interface SerializedWeight {
  shape: number[];
  data: number[];
}

export function saveModel(model: tf.LayersModel, vocabulary: string[], classes: string[]) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });

  const weights: SerializedWeight[] = model.getWeights().map((w) => ({
    shape: w.shape as number[],
    data: Array.from(w.dataSync()),
  }));

  fs.writeFileSync(WEIGHTS_PATH, JSON.stringify(weights));
  fs.writeFileSync(VOCAB_PATH, JSON.stringify(vocabulary));
  fs.writeFileSync(CLASSES_PATH, JSON.stringify(classes));
}

export function loadVocabAndClasses(): { vocabulary: string[]; classes: string[] } {
  const vocabulary = JSON.parse(fs.readFileSync(VOCAB_PATH, 'utf-8'));
  const classes = JSON.parse(fs.readFileSync(CLASSES_PATH, 'utf-8'));
  return { vocabulary, classes };
}

export function loadWeightsInto(model: tf.LayersModel) {
  const serialized: SerializedWeight[] = JSON.parse(fs.readFileSync(WEIGHTS_PATH, 'utf-8'));
  const tensors = serialized.map((w) => tf.tensor(w.data, w.shape));
  model.setWeights(tensors);
}

export function artifactsExist(): boolean {
  return fs.existsSync(WEIGHTS_PATH) && fs.existsSync(VOCAB_PATH) && fs.existsSync(CLASSES_PATH);
}

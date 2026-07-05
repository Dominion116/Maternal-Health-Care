/**
 * Inference-time intent classifier. Loads the trained model once (lazy
 * singleton) and exposes classifyIntent() for the chat pipeline.
 */
import * as tf from '@tensorflow/tfjs';
import { vectorizeText } from './nlp';
import { buildModel } from './model';
import { loadVocabAndClasses, loadWeightsInto, artifactsExist } from './io';

export interface Classification {
  intent: string;
  confidence: number;
}

let cached: { model: tf.LayersModel; vocabulary: string[]; classes: string[] } | null = null;

function getClassifier() {
  if (cached) return cached;

  if (!artifactsExist()) {
    throw new Error(
      'No trained intent-classification model found. Run "npm run train-model" in backend/ before starting the server.',
    );
  }

  const { vocabulary, classes } = loadVocabAndClasses();
  const model = buildModel(vocabulary.length, classes.length);
  loadWeightsInto(model);

  cached = { model, vocabulary, classes };
  return cached;
}

export function classifyIntent(message: string): Classification {
  const { model, vocabulary, classes } = getClassifier();

  const vector = vectorizeText(message, vocabulary);
  const input = tf.tensor2d([vector]);
  const output = model.predict(input) as tf.Tensor;
  const probabilities = output.dataSync();

  let bestIdx = 0;
  for (let i = 1; i < probabilities.length; i++) {
    if (probabilities[i] > probabilities[bestIdx]) bestIdx = i;
  }

  input.dispose();
  output.dispose();

  return { intent: classes[bestIdx], confidence: probabilities[bestIdx] };
}

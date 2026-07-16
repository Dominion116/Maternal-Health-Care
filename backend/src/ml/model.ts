/**
 * Trainable classification head for the transfer-learning pipeline:
 * USE sentence embedding (512 dims, from the frozen base model) ->
 * Dense(128, relu) + Dropout -> Dense(64, relu) + Dropout ->
 * Dense(numClasses, softmax). Adam optimiser, categorical cross-entropy loss.
 *
 * Dropout is 0.2 (down from 0.5 in the Bag-of-Words era): the pretrained
 * embeddings are already a strong, low-noise representation, and with ~1
 * pattern per intent the heavier rate made the head underfit, it trailed
 * the logistic-regression baseline until this was tuned.
 */
import * as tf from '@tensorflow/tfjs';

const DROPOUT_RATE = 0.2;

export function buildModel(embeddingDim: number, numClasses: number): tf.Sequential {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({ inputShape: [embeddingDim], units: 128, activation: 'relu' }),
  );
  model.add(tf.layers.dropout({ rate: DROPOUT_RATE }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: DROPOUT_RATE }));
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

/**
 * Multinomial logistic regression: a single Dense(numClasses, softmax) layer
 * directly on the USE embedding, no hidden layers. Evaluated in baselines.ts
 * as a classical-ML comparison for the dissertation, but empirically it also
 * outperforms the deeper head above on this dataset (many classes, few
 * patterns each, see metrics.json), so it is what classifier.ts actually
 * uses to decide the live answer. Same architecture and hyperparameters as
 * the version baselines.ts trains for evaluation, so the reported
 * comparison numbers match what is deployed.
 */
export function buildLogisticModel(embeddingDim: number, numClasses: number): tf.Sequential {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({ inputShape: [embeddingDim], units: numClasses, activation: 'softmax' }),
  );

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

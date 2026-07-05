/**
 * FFNN architecture per the methodology chapter: Bag-of-Words input ->
 * Dense(128, relu) + Dropout(0.5) -> Dense(64, relu) + Dropout(0.5) ->
 * Dense(numClasses, softmax). Adam optimiser, categorical cross-entropy loss.
 */
import * as tf from '@tensorflow/tfjs';

export function buildModel(vocabSize: number, numClasses: number): tf.Sequential {
  const model = tf.sequential();

  model.add(
    tf.layers.dense({ inputShape: [vocabSize], units: 128, activation: 'relu' }),
  );
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
  model.add(tf.layers.dropout({ rate: 0.5 }));
  model.add(tf.layers.dense({ units: numClasses, activation: 'softmax' }));

  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  return model;
}

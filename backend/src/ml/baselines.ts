/**
 * Classical-ML baseline models, trained and evaluated on exactly the same
 * embeddings and train/test split as the neural-network head so the
 * comparison in metrics.json is fair. Originally added purely to justify
 * the deep learning approach in the evaluation chapter ("our model vs
 * simpler baselines"), not to serve traffic, but logistic regression
 * ended up outscoring the trained head on this dataset, so its weights are
 * now also persisted (see train.ts) and used live by classifier.ts.
 *
 * - logistic_regression: single softmax layer (linear model) on the USE
 *   embeddings, the standard text-classification baseline.
 * - nearest_centroid: cosine similarity to each class's mean training
 *   embedding, no learned weights at all.
 *
 * (Tree boosters like XGBoost/LightGBM aren't available as maintained pure
 * JS packages; their native Node bindings don't build on this machine.)
 */
import * as tf from '@tensorflow/tfjs';
import { computeMetrics } from './metrics';
import { buildLogisticModel } from './model';

export interface BaselineResult {
  name: string;
  accuracy: number;
  macroF1: number;
  macroF1Evaluated: number;
  weightedF1: number;
}

export interface BaselineEvaluation {
  results: BaselineResult[];
  // The trained logistic regression model, so train.ts can persist the
  // exact weights that produced these metrics rather than retraining a
  // second copy that could differ slightly (different random init).
  logisticModel: tf.LayersModel;
}

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

async function evaluateLogisticRegression(
  xTrain: number[][],
  yTrain: number[],
  xTest: number[][],
  yTest: number[],
  classes: string[],
): Promise<{ result: BaselineResult; model: tf.LayersModel }> {
  const model = buildLogisticModel(xTrain[0].length, classes.length);

  const xs = tf.tensor2d(xTrain);
  const ys = tf.oneHot(tf.tensor1d(yTrain, 'int32'), classes.length);
  await model.fit(xs, ys, { epochs: 100, batchSize: 8, shuffle: true, verbose: 0 });
  xs.dispose();
  ys.dispose();

  const xsTest = tf.tensor2d(xTest);
  const predictions = model.predict(xsTest) as tf.Tensor;
  const predictedIdx = Array.from(await predictions.argMax(-1).data());
  xsTest.dispose();
  predictions.dispose();

  const m = computeMetrics(yTest, predictedIdx, classes);
  return {
    result: {
      name: 'logistic_regression',
      accuracy: m.accuracy,
      macroF1: m.macroAvg.f1,
      macroF1Evaluated: m.macroAvgEvaluated.f1,
      weightedF1: m.weightedAvg.f1,
    },
    model,
  };
}

function evaluateNearestCentroid(
  xTrain: number[][],
  yTrain: number[],
  xTest: number[][],
  yTest: number[],
  classes: string[],
): BaselineResult {
  const dim = xTrain[0].length;
  const sums = classes.map(() => new Array(dim).fill(0));
  const counts = new Array(classes.length).fill(0);

  yTrain.forEach((classIdx, i) => {
    counts[classIdx] += 1;
    for (let d = 0; d < dim; d++) sums[classIdx][d] += xTrain[i][d];
  });

  const centroids = sums.map((sum, c) =>
    counts[c] > 0 ? sum.map((v) => v / counts[c]) : null,
  );

  const predictedIdx = xTest.map((x) => {
    let best = 0;
    let bestSim = -Infinity;
    centroids.forEach((centroid, c) => {
      if (!centroid) return;
      const sim = cosine(x, centroid);
      if (sim > bestSim) {
        bestSim = sim;
        best = c;
      }
    });
    return best;
  });

  const m = computeMetrics(yTest, predictedIdx, classes);
  return {
    name: 'nearest_centroid',
    accuracy: m.accuracy,
    macroF1: m.macroAvg.f1,
    macroF1Evaluated: m.macroAvgEvaluated.f1,
    weightedF1: m.weightedAvg.f1,
  };
}

export async function evaluateBaselines(
  xTrain: number[][],
  yTrain: number[],
  xTest: number[][],
  yTest: number[],
  classes: string[],
): Promise<BaselineEvaluation> {
  const logistic = await evaluateLogisticRegression(xTrain, yTrain, xTest, yTest, classes);
  const centroid = evaluateNearestCentroid(xTrain, yTrain, xTest, yTest, classes);
  return { results: [logistic.result, centroid], logisticModel: logistic.model };
}

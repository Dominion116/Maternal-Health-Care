/**
 * Classification metrics computed on the held-out test split — no
 * scikit-learn available in JS, so these are implemented directly.
 */

export interface PerClassMetrics {
  intent: string;
  precision: number;
  recall: number;
  f1: number;
  support: number;
}

export interface EvaluationMetrics {
  accuracy: number;
  perClass: PerClassMetrics[];
  macroAvg: { precision: number; recall: number; f1: number };
  weightedAvg: { precision: number; recall: number; f1: number };
  confusionMatrix: number[][];
  classes: string[];
}

// confusionMatrix[actualIdx][predictedIdx]
export function computeMetrics(
  actual: number[],
  predicted: number[],
  classes: string[],
): EvaluationMetrics {
  const n = classes.length;
  const confusionMatrix: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < actual.length; i++) {
    confusionMatrix[actual[i]][predicted[i]]++;
  }

  const perClass: PerClassMetrics[] = classes.map((intent, classIdx) => {
    let tp = 0;
    let fp = 0;
    let fn = 0;
    let support = 0;

    for (let a = 0; a < n; a++) {
      for (let p = 0; p < n; p++) {
        const count = confusionMatrix[a][p];
        if (a === classIdx) support += count;
        if (a === classIdx && p === classIdx) tp += count;
        if (a !== classIdx && p === classIdx) fp += count;
        if (a === classIdx && p !== classIdx) fn += count;
      }
    }

    const precision = tp + fp === 0 ? 0 : tp / (tp + fp);
    const recall = tp + fn === 0 ? 0 : tp / (tp + fn);
    const f1 = precision + recall === 0 ? 0 : (2 * precision * recall) / (precision + recall);

    return { intent, precision, recall, f1, support };
  });

  const correct = actual.filter((a, i) => a === predicted[i]).length;
  const accuracy = actual.length === 0 ? 0 : correct / actual.length;

  const macroAvg = {
    precision: average(perClass.map((c) => c.precision)),
    recall: average(perClass.map((c) => c.recall)),
    f1: average(perClass.map((c) => c.f1)),
  };

  const totalSupport = perClass.reduce((sum, c) => sum + c.support, 0);
  const weightedAvg = {
    precision: weightedAverage(perClass, 'precision', totalSupport),
    recall: weightedAverage(perClass, 'recall', totalSupport),
    f1: weightedAverage(perClass, 'f1', totalSupport),
  };

  return { accuracy, perClass, macroAvg, weightedAvg, confusionMatrix, classes };
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : values.reduce((a, b) => a + b, 0) / values.length;
}

function weightedAverage(
  perClass: PerClassMetrics[],
  key: 'precision' | 'recall' | 'f1',
  totalSupport: number,
): number {
  if (totalSupport === 0) return 0;
  return perClass.reduce((sum, c) => sum + c[key] * c.support, 0) / totalSupport;
}

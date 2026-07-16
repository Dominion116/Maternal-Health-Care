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
  // Averaged over all classes, including ones with zero test examples
  // (support === 0), whose precision/recall/f1 are forced to 0 by
  // definition, not because the model did poorly on them. With many
  // sparsely-populated intents in this dataset, this number mostly reflects
  // how many classes had test data at all, not model quality; kept for
  // transparency, but macroAvgEvaluated below is the more honest headline
  // number.
  macroAvg: { precision: number; recall: number; f1: number };
  // Averaged only over classes that actually had at least one test example
  // (support > 0). This is what standard tools like scikit-learn recommend
  // for macro-averaging when some classes have zero support, since a
  // support=0 class contributes a meaningless forced-zero score rather than
  // a real measurement.
  macroAvgEvaluated: { precision: number; recall: number; f1: number; classesEvaluated: number; classesTotal: number };
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

  const evaluated = perClass.filter((c) => c.support > 0);
  const macroAvgEvaluated = {
    precision: average(evaluated.map((c) => c.precision)),
    recall: average(evaluated.map((c) => c.recall)),
    f1: average(evaluated.map((c) => c.f1)),
    classesEvaluated: evaluated.length,
    classesTotal: perClass.length,
  };

  const totalSupport = perClass.reduce((sum, c) => sum + c.support, 0);
  const weightedAvg = {
    precision: weightedAverage(perClass, 'precision', totalSupport),
    recall: weightedAverage(perClass, 'recall', totalSupport),
    f1: weightedAverage(perClass, 'f1', totalSupport),
  };

  return { accuracy, perClass, macroAvg, macroAvgEvaluated, weightedAvg, confusionMatrix, classes };
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

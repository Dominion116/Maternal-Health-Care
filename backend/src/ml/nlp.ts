/**
 * Shared preprocessing pipeline for the intent classifier — used identically
 * at training time (train.ts) and inference time (classifier.ts) so the
 * feature space never drifts between the two.
 *
 * Mirrors the chapters' NLTK-based pipeline (tokenise -> lemmatise -> Bag of
 * Words), reimplemented in TypeScript since this machine has no Python.
 * wink-lemmatizer stands in for NLTK's WordNetLemmatizer.
 */
import lemmatizer from 'wink-lemmatizer';

const IGNORE_WORDS = new Set(['?', '!', '.', ',', "'", '"', ':', ';']);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9']+/)
    .filter((w) => w.length > 0 && !IGNORE_WORDS.has(w));
}

// Tries verb -> noun -> adjective lemmatisation, same cascading approach
// commonly used since wink-lemmatizer has no POS tagger of its own; falls
// back to the original word if none of the three rule sets change it.
export function lemmatize(word: string): string {
  const verb = lemmatizer.verb(word);
  if (verb !== word) return verb;
  const noun = lemmatizer.noun(word);
  if (noun !== word) return noun;
  const adj = lemmatizer.adjective(word);
  if (adj !== word) return adj;
  return word;
}

export function preprocess(text: string): string[] {
  return tokenize(text).map(lemmatize);
}

export function buildVocabulary(documents: string[][]): string[] {
  const vocab = new Set<string>();
  for (const doc of documents) {
    for (const word of doc) vocab.add(word);
  }
  return Array.from(vocab).sort();
}

// Binary Bag-of-Words vector: 1 if the vocabulary word appears in the
// (already tokenised+lemmatised) input, 0 otherwise.
export function bagOfWords(tokens: string[], vocabulary: string[]): number[] {
  const tokenSet = new Set(tokens);
  return vocabulary.map((word) => (tokenSet.has(word) ? 1 : 0));
}

export function vectorizeText(text: string, vocabulary: string[]): number[] {
  return bagOfWords(preprocess(text), vocabulary);
}

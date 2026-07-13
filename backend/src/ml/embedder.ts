/**
 * Pretrained base model for the intent classifier: Google's Universal
 * Sentence Encoder (TensorFlow.js build).
 *
 * Transfer-learning setup:
 *   raw message text
 *     -> USE base model (frozen, pretrained by Google on large web corpora)
 *     -> 512-dimensional sentence embedding
 *     -> trainable classification head (model.ts) -> intent softmax
 *
 * The base model's weights are never updated during training — only the
 * head is trained on intents.json. The USE weights are downloaded from
 * TF-Hub on first load (requires internet access once per process) and
 * then kept in memory.
 */
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import * as use from '@tensorflow-models/universal-sentence-encoder';

export const BASE_MODEL_NAME = 'universal-sentence-encoder';
export const EMBEDDING_DIM = 512;

let loading: Promise<use.UniversalSentenceEncoder> | null = null;

const LOAD_ATTEMPTS = 3;
const RETRY_DELAY_MS = 5000;

export function loadBaseModel(): Promise<use.UniversalSentenceEncoder> {
  if (!loading) {
    loading = (async () => {
      // WASM is ~30x faster than the pure-JS CPU backend for USE's forward
      // pass (benchmarked: ~25ms/item vs ~730ms/item) and, unlike
      // @tensorflow/tfjs-node, needs no native compiler toolchain — just an
      // npm install. Falls back to the CPU backend if the WASM binary can't
      // be located at runtime (e.g. a serverless bundler drops non-JS
      // assets), so a bad deploy environment degrades gracefully instead of
      // crashing the classifier.
      try {
        await tf.setBackend('wasm');
        await tf.ready();
      } catch (err) {
        console.warn('[embedder] WASM backend unavailable, falling back to CPU:', (err as Error).message);
        await tf.setBackend('cpu');
        await tf.ready();
      }

      // The weights download from TF-Hub can hit transient connect timeouts
      // on flaky connections — retry before giving up.
      let lastError: unknown;
      for (let attempt = 1; attempt <= LOAD_ATTEMPTS; attempt++) {
        try {
          console.log(
            `[embedder] loading Universal Sentence Encoder base model (attempt ${attempt}/${LOAD_ATTEMPTS})...`,
          );
          const model = await use.load();
          console.log('[embedder] base model ready.');
          return model;
        } catch (err) {
          lastError = err;
          console.warn(`[embedder] load attempt ${attempt} failed:`, (err as Error).message);
          if (attempt < LOAD_ATTEMPTS) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS * attempt));
          }
        }
      }
      throw lastError;
    })();
    // Allow a fresh try on the next call after a failed download instead of
    // caching the rejection forever.
    loading.catch(() => {
      loading = null;
    });
  }
  return loading;
}

// Embeds texts in batches to bound memory on large inputs (training embeds
// every pattern in intents.json in one call).
export async function embedTexts(texts: string[], batchSize = 32): Promise<number[][]> {
  const model = await loadBaseModel();
  const out: number[][] = [];

  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const tensor = await model.embed(batch);
    const rows = (await tensor.array()) as number[][];
    out.push(...rows);
    tensor.dispose();
  }

  return out;
}

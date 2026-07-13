import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-wasm';
import * as use from '@tensorflow-models/universal-sentence-encoder';

async function main() {
  await tf.setBackend('wasm');
  await tf.ready();
  console.log('Backend:', tf.getBackend());

  const sample = Array.from(
    { length: 100 },
    (_, i) => `This is a sample maternal health question number ${i} about pregnancy symptoms and care.`,
  );

  const t0 = Date.now();
  const model = await use.load();
  const warmup = await model.embed(['warmup']);
  warmup.dispose();
  const t1 = Date.now();
  console.log(`Model load + first embed: ${(t1 - t0) / 1000}s`);

  const t2 = Date.now();
  for (let i = 0; i < sample.length; i += 32) {
    const batch = sample.slice(i, i + 32);
    const tensor = await model.embed(batch);
    await tensor.array();
    tensor.dispose();
  }
  const t3 = Date.now();
  const perItem = (t3 - t2) / sample.length;
  console.log(`Embedded ${sample.length} texts in ${(t3 - t2) / 1000}s (${perItem.toFixed(1)}ms/item)`);
  console.log(`Extrapolated for 20,000 items: ${((perItem * 20000) / 1000 / 60).toFixed(1)} minutes`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

import { classifyIntent } from '../src/ml/classifier';

const TEST_QUERIES = [
  'How do I register for ANC?',
  'What are you??',
  'Is it safe to have sex during pregnancy?',
  'Where can I get a blood test near me?',
  'Is iron safe with my diabetes?',
  'Hello',
  'Are you a doctor?',
  'What is a CHPS compound?', // should now generalize to PHC-related intent
];

async function main() {
  for (const q of TEST_QUERIES) {
    const result = await classifyIntent(q);
    console.log(`"${q}"`);
    console.log(`  -> intent: ${result.intent} | confidence: ${(result.confidence * 100).toFixed(1)}%`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

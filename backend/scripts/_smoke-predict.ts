import { predict } from '../src/services/model.service';

async function main() {
  const questions = [
    'I feel tired all the time',
    'How many ANC visits do I need?',
    'What should I eat during pregnancy?',
    'My legs are swollen, is that normal?',
    'I feel very sad since giving birth',
    'asdkjh qwerty zzz',
  ];

  for (const q of questions) {
    const r = await predict([{ role: 'user', content: q }]);
    console.log(`Q: ${q}`);
    console.log(`   intent="${r.intent}" confidence=${r.confidence.toFixed(2)}`);
    console.log(`   A: ${r.response.slice(0, 110)}...\n`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

/**
 * Adds explicit out-of-domain/meta intents to intents.json.
 *
 * Root cause of "What are you??" -> confidently wrong depression response:
 * all 493 existing intents are narrow medical topics. Nothing in the
 * training data represents "a question that isn't about maternal health",
 * so the softmax is always forced to pick a medical class, however
 * unrelated the input, and the single-example centroids weren't robust
 * enough to reliably catch it via the out-of-domain gate in classifier.ts.
 *
 * This adds five small, well-scoped intents (matching the existing
 * one-tag-per-topic convention) covering the meta questions and greetings
 * a chatbot actually receives, so they get a real class to land in instead
 * of a random nearby medical topic.
 *
 * Run: npx tsx scripts/add-out-of-domain-intents.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const INTENTS_PATH = path.join(__dirname, '..', 'src', 'ml', 'intents.json');

const NEW_INTENTS = [
  {
    tag: 'Bot Identity',
    context_set: 'Questions about what MamaGuide is',
    patterns: [
      'What are you?',
      'Who are you?',
      'Are you a robot?',
      'Are you a real person?',
      'Are you human?',
      'Are you an AI?',
      'What is MamaGuide?',
      'Is this a chatbot?',
    ],
    responses: [
      "I'm MamaGuide, an AI assistant that answers maternal health questions using information from WHO guidelines and Nigerian antenatal care protocols. I'm not a person and I can't examine you, but I can help you understand pregnancy, nutrition, danger signs, breastfeeding, birth preparation, and postpartum care. What would you like to know?",
    ],
  },
  {
    tag: 'Bot Capabilities',
    context_set: 'Questions about what MamaGuide can help with',
    patterns: [
      'What can you do?',
      'What can you help with?',
      'How do I use this?',
      'What topics can I ask about?',
      'What do you know?',
      'What kind of questions can I ask you?',
    ],
    responses: [
      'I can answer questions about antenatal care, nutrition, danger signs, breastfeeding, birth preparation, and postpartum care. Just ask in your own words, like "How do I register for ANC?" or "What foods should I avoid during pregnancy?" For personal medical decisions, please consult a licensed healthcare provider.',
    ],
  },
  {
    tag: 'Greeting',
    context_set: 'Opening greetings',
    patterns: [
      'Hello',
      'Hi',
      'Hey',
      'Good morning',
      'Good afternoon',
      'Good evening',
      "How's it going?",
    ],
    responses: [
      "Hello! I'm MamaGuide. Ask me anything about pregnancy, antenatal care, nutrition, danger signs, breastfeeding, birth preparation, or postpartum care.",
    ],
  },
  {
    tag: 'Is This A Doctor',
    context_set: 'Clarifying MamaGuide is not a medical professional',
    patterns: [
      'Are you a doctor?',
      'Are you a nurse?',
      'Can you diagnose me?',
      'Are you a medical professional?',
      'Can you tell me what is wrong with me?',
      'Can you prescribe medicine?',
    ],
    responses: [
      "No, I'm an educational AI assistant, not a doctor, nurse, or medical professional. I can't examine you, diagnose conditions, or prescribe treatment. For anything you're personally experiencing, especially anything urgent, please see a licensed healthcare provider or call 112 in an emergency.",
    ],
  },
  {
    tag: 'Farewell Thanks',
    context_set: 'Closing thanks and goodbyes',
    patterns: [
      'Thank you',
      'Thanks',
      'Bye',
      'Goodbye',
      'See you',
      'Thanks for your help',
    ],
    responses: [
      "You're welcome! Come back anytime you have a question about your pregnancy, take care of yourself.",
    ],
  },
];

function main() {
  const raw = fs.readFileSync(INTENTS_PATH, 'utf-8');
  const data: { intents: Array<{ tag: string }> } = JSON.parse(raw);

  const existingTags = new Set(data.intents.map((i) => i.tag));
  const toAdd = NEW_INTENTS.filter((i) => !existingTags.has(i.tag));

  data.intents.push(...toAdd);
  fs.writeFileSync(INTENTS_PATH, JSON.stringify(data, null, 4), 'utf-8');

  console.log(`Added ${toAdd.length} out-of-domain intents: ${toAdd.map((i) => i.tag).join(', ')}`);
  if (toAdd.length < NEW_INTENTS.length) {
    console.log('(skipped tags that already existed)');
  }
  console.log(`Total intents now: ${data.intents.length}`);
}

main();

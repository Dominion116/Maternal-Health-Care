/**
 * Bounded, hand-reviewed pass: adds Nigeria-appropriate response variants
 * to a small set of existing intents, adapted from Ghana dataset answers
 * whose underlying content was genuinely good but carried Ghana-specific
 * institutional framing (Ghana Health Service, NHIS-as-Ghana's-scheme,
 * Ghanaian food names).
 *
 * Scope note: of 34 high-confidence (>=0.85 similarity) matches whose
 * answer text mentioned Ghana-specific terms, most turned out to be
 * generic template filler ("Important information about X in Ghana...")
 * that doesn't actually answer its matched question and isn't worth
 * adapting. Only 4 had real, specific content worth rewriting. This is
 * additive only: appended as new responses, existing vetted responses are
 * never removed or replaced.
 *
 * Run: npx tsx scripts/add-nigeria-corrected-responses.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const INTENTS_PATH = path.join(__dirname, '..', 'src', 'ml', 'intents.json');

const ADDITIONS: Record<string, string> = {
  'Recommended Foods During Pregnancy':
    'Eat a balanced diet with proteins (fish, beans, eggs, meat), vegetables (ugu, ewedu, spinach, okro), fruits, whole grains, and dairy. Drink plenty of water. Avoid raw or undercooked foods, excessive salt, and alcohol. Traditional Nigerian soups and stews, made with these ingredients, are nutritious choices when well prepared.',
  'Antenatal Care Definition':
    "Focused ANC (FANC) is a goal-oriented approach the WHO recommends worldwide, including in Nigeria: rather than many routine visits, each visit has specific objectives, prioritising quality over quantity. The WHO's 2016 model recommends a minimum of 4 focused visits for healthy pregnancies, with 8 contacts being optimal.",
  'Antenatal Visits Frequency':
    "The WHO and Nigeria's Federal Ministry of Health recommend at least 4 ANC visits, but 8 is better for you and your baby. Roughly: first visit as soon as you know you're pregnant (before 16 weeks), then further visits through the second and third trimesters. Ask your ANC provider for your personalised schedule.",
  installation:
    "Ultrasound scans are safe and painless. They use sound waves, not radiation, so there's no harm to you or your baby. Costs and availability vary by facility, ask your ANC provider or health facility about ultrasound scheduling and cost when you book your visit.",
};

interface IntentDef {
  tag: string;
  responses: string[];
}

function main() {
  const raw = fs.readFileSync(INTENTS_PATH, 'utf-8');
  const data: { intents: IntentDef[] } = JSON.parse(raw);

  let added = 0;
  for (const [tag, response] of Object.entries(ADDITIONS)) {
    const intent = data.intents.find((i) => i.tag === tag);
    if (!intent) {
      console.warn(`WARNING: tag not found, skipped: ${tag}`);
      continue;
    }
    if (intent.responses.includes(response)) continue;
    intent.responses.push(response);
    added++;
    console.log(`Added Nigeria-adapted response to "${tag}" (now ${intent.responses.length} responses)`);
  }

  fs.writeFileSync(INTENTS_PATH, JSON.stringify(data, null, 4), 'utf-8');
  console.log(`\nDone. ${added} responses added.`);
}

main();

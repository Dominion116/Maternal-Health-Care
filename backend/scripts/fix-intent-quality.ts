/**
 * One-off cleanup pass over intents.json, run before the Ghana dataset
 * merge so the merge script works against clean data:
 *
 *  - Removes 'sperm_production' and 'anus_function': general reproductive
 *    anatomy, not maternal-health content, and both were dead weight
 *    (0-1 patterns, out of scope for this app).
 *  - Fixes 'Anemia': had a real, useful response but zero patterns, so it
 *    was permanently unreachable. Adds natural phrasings.
 *  - Merges the 6 remaining duplicate-tag pairs into one entry each,
 *    unioning patterns and responses (deduped). getIntentByTag() uses
 *    .find(), so the second entry's responses were previously unreachable.
 *
 * Run: npx tsx scripts/fix-intent-quality.ts
 */
import * as fs from 'fs';
import * as path from 'path';

interface IntentDef {
  tag: string;
  context_set?: string;
  source?: string;
  patterns: string[];
  responses: string[];
}

const INTENTS_PATH = path.join(__dirname, '..', 'src', 'ml', 'intents.json');

const REMOVE_TAGS = new Set(['sperm_production', 'anus_function']);

const ANEMIA_PATTERNS = [
  'What is anemia in pregnancy?',
  'Why am I anemic during pregnancy?',
  'What causes low blood levels during pregnancy?',
  'How do I know if I have anemia?',
  'Is anemia dangerous during pregnancy?',
];

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items.map((s) => s.trim()))).filter(Boolean);
}

function main() {
  const raw = fs.readFileSync(INTENTS_PATH, 'utf-8');
  const data: { intents: IntentDef[] } = JSON.parse(raw);

  const before = data.intents.length;

  // 1. Drop out-of-scope dead tags entirely.
  let intents = data.intents.filter((i) => !REMOVE_TAGS.has(i.tag));
  const removed = before - intents.length;

  // 2. Merge duplicate tags (union patterns + responses, dedupe).
  const byTag = new Map<string, IntentDef[]>();
  for (const intent of intents) {
    const group = byTag.get(intent.tag) ?? [];
    group.push(intent);
    byTag.set(intent.tag, group);
  }

  const merged: IntentDef[] = [];
  let mergedGroups = 0;
  for (const [tag, group] of byTag) {
    if (group.length === 1) {
      merged.push(group[0]);
      continue;
    }
    mergedGroups++;
    merged.push({
      tag,
      context_set: group.find((g) => g.context_set)?.context_set,
      source: group.find((g) => g.source)?.source,
      patterns: dedupe(group.flatMap((g) => g.patterns)),
      responses: dedupe(group.flatMap((g) => g.responses)),
    });
  }
  intents = merged;

  // 3. Fix Anemia's missing patterns.
  const anemia = intents.find((i) => i.tag === 'Anemia');
  if (anemia && anemia.patterns.length === 0) {
    anemia.patterns = ANEMIA_PATTERNS;
  }

  const stillDead = intents.filter((i) => i.patterns.length === 0);

  data.intents = intents;
  fs.writeFileSync(INTENTS_PATH, JSON.stringify(data, null, 4), 'utf-8');

  console.log(`Before: ${before} intents`);
  console.log(`Removed (out-of-scope, dead): ${removed} (${[...REMOVE_TAGS].join(', ')})`);
  console.log(`Merged duplicate-tag groups: ${mergedGroups}`);
  console.log(`Fixed Anemia patterns: ${anemia ? 'yes' : 'NOT FOUND'}`);
  console.log(`After: ${intents.length} intents`);
  if (stillDead.length > 0) {
    console.warn(`WARNING: still zero-pattern intents: ${stillDead.map((i) => i.tag).join(', ')}`);
  }
}

main();

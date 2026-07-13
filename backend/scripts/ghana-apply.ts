/**
 * Phase 2 of the Ghana dataset merge (fast, re-runnable): reads phase 1's
 * match results and applies them to intents.json.
 *
 *  - Matched questions (similarity >= MATCH_THRESHOLD) become new patterns
 *    on their matched intent, capped per intent and deduped against what's
 *    already there, so sparsity gets fixed without any one intent
 *    ballooning relative to the rest.
 *  - Ghana *answers* are never touched here. Only questions become
 *    patterns; response content is a separate, hand-reviewed step.
 *  - Unmatched questions (below threshold) are written to a topic-grouped
 *    report for the next step: deciding which represent real coverage
 *    gaps worth a new intent.
 *
 * Threshold choice: sampled match quality by hand across bands. >=0.8 was
 * consistently correct (7-8/8 sampled twice); 0.7-0.8 was mostly wrong
 * (e.g. "What is cesarean section?" matched to "Placental Complications",
 * "How do I care for my C-section wound?" matched to "Bleeding After
 * Implant"). This is training data, not a live-query accept gate, so the
 * bar is precision-first: 0.8 default, not the 0.4-0.5 range that's fine
 * for classifier.ts's runtime out-of-domain check.
 *
 * Also filters templated filler before matching: the dataset has batches
 * of near-identical stub questions ("Ultrasound question 0" ... "question
 * 19", "What nutritional guidance...? (Topic 43)") that are database
 * placeholders, not real user phrasings. Detected by stripping a trailing
 * "<word> <number>" counter and dropping any stem that recurs more than
 * twice, plus a natural-question shape check (>=4 words, and starts with a
 * question word or ends in '?').
 *
 * Run: npx tsx scripts/ghana-apply.ts [matchThreshold]
 * Default threshold: 0.8
 */
import * as fs from 'fs';
import * as path from 'path';

interface MatchResult {
  id: string;
  question: string;
  answer: string;
  topic: string;
  urgency: string;
  bestTag: string | null;
  similarity: number;
}

interface IntentDef {
  tag: string;
  context_set?: string;
  source?: string;
  patterns: string[];
  responses: string[];
}

const INTENTS_PATH = path.join(__dirname, '..', 'src', 'ml', 'intents.json');
const RESULTS_PATH = path.join(__dirname, 'output', 'ghana-match-results.json');
const UNMATCHED_REPORT_PATH = path.join(__dirname, 'output', 'unmatched-by-topic.json');

const MATCH_THRESHOLD = Number(process.argv[2]) || 0.8;
const MAX_NEW_PATTERNS_PER_INTENT = 15;

const QUESTION_WORDS = /^(what|how|why|when|where|who|which|can|is|are|should|do|does|will|could|would|did)\b/i;
// Strips a trailing "<label> <number>" counter, with or without
// parentheses: "question 17", "(Topic 43)", "prevention 5".
const COUNTER_SUFFIX = /\s*\(?\b[a-z]{3,15}\s*#?\d+\)?\.?\s*$/i;

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

function stem(s: string): string {
  return norm(s.replace(COUNTER_SUFFIX, ''));
}

function looksLikeARealQuestion(q: string): boolean {
  const words = q.trim().split(/\s+/);
  if (words.length < 4) return false;
  return QUESTION_WORDS.test(q.trim()) || q.trim().endsWith('?');
}

function filterTemplatedFiller(results: MatchResult[]): MatchResult[] {
  const stemCounts = new Map<string, number>();
  for (const r of results) {
    const s = stem(r.question);
    stemCounts.set(s, (stemCounts.get(s) ?? 0) + 1);
  }
  const seenStem = new Set<string>();
  const kept: MatchResult[] = [];
  let droppedTemplated = 0;
  let droppedNotQuestionShaped = 0;
  for (const r of results) {
    const s = stem(r.question);
    // Recurring stem (>2 occurrences) = database-generated filler. Keep at
    // most one representative so it doesn't vanish entirely, just stop
    // flooding the pool.
    if ((stemCounts.get(s) ?? 0) > 2) {
      if (seenStem.has(s)) {
        droppedTemplated++;
        continue;
      }
      seenStem.add(s);
    }
    if (!looksLikeARealQuestion(r.question)) {
      droppedNotQuestionShaped++;
      continue;
    }
    kept.push(r);
  }
  console.log(
    `Filtered filler: ${droppedTemplated} repeated-template duplicates, ${droppedNotQuestionShaped} not shaped like a question. ${kept.length} / ${results.length} remain.`,
  );
  return kept;
}

function main() {
  const rawResults: MatchResult[] = JSON.parse(fs.readFileSync(RESULTS_PATH, 'utf-8'));
  const results = filterTemplatedFiller(rawResults);
  const data: { intents: IntentDef[] } = JSON.parse(fs.readFileSync(INTENTS_PATH, 'utf-8'));

  const byTag = new Map<string, IntentDef>();
  for (const intent of data.intents) byTag.set(intent.tag, intent);

  const matched = results.filter((r) => r.bestTag && r.similarity >= MATCH_THRESHOLD);
  const unmatched = results.filter((r) => !r.bestTag || r.similarity < MATCH_THRESHOLD);

  // Group matches by tag, best similarity first, so the cap keeps the
  // strongest matches when a tag has more candidates than room.
  const matchesByTag = new Map<string, MatchResult[]>();
  for (const m of matched) {
    const group = matchesByTag.get(m.bestTag!) ?? [];
    group.push(m);
    matchesByTag.set(m.bestTag!, group);
  }

  let patternsAdded = 0;
  let intentsEnriched = 0;
  const perIntentAdds: Array<{ tag: string; added: number; before: number; after: number }> = [];

  for (const [tag, candidates] of matchesByTag) {
    const intent = byTag.get(tag);
    if (!intent) continue;

    candidates.sort((a, b) => b.similarity - a.similarity);
    const existingNorm = new Set(intent.patterns.map(norm));
    const before = intent.patterns.length;

    let added = 0;
    for (const c of candidates) {
      if (added >= MAX_NEW_PATTERNS_PER_INTENT) break;
      const key = norm(c.question);
      if (existingNorm.has(key)) continue;
      intent.patterns.push(c.question);
      existingNorm.add(key);
      added++;
    }

    if (added > 0) {
      patternsAdded += added;
      intentsEnriched++;
      perIntentAdds.push({ tag, added, before, after: intent.patterns.length });
    }
  }

  fs.writeFileSync(INTENTS_PATH, JSON.stringify(data, null, 4), 'utf-8');

  // Unmatched report, grouped by Ghana's topic metadata for the next step.
  const unmatchedByTopic = new Map<string, MatchResult[]>();
  for (const u of unmatched) {
    const group = unmatchedByTopic.get(u.topic) ?? [];
    group.push(u);
    unmatchedByTopic.set(u.topic, group);
  }
  const report = Array.from(unmatchedByTopic.entries())
    .map(([topic, items]) => ({
      topic,
      count: items.length,
      // A representative sample, not the full dump, for the next step's
      // human review.
      sample: items.slice(0, 15).map((i) => ({ question: i.question, answer: i.answer, urgency: i.urgency })),
    }))
    .sort((a, b) => b.count - a.count);
  fs.writeFileSync(UNMATCHED_REPORT_PATH, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`Threshold: ${MATCH_THRESHOLD}`);
  console.log(`Matched: ${matched.length} / ${results.length}`);
  console.log(`Unmatched: ${unmatched.length} / ${results.length}`);
  console.log(`Patterns added: ${patternsAdded} across ${intentsEnriched} intents`);
  console.log(`\nTop 15 most-enriched intents:`);
  perIntentAdds
    .sort((a, b) => b.added - a.added)
    .slice(0, 15)
    .forEach((p) => console.log(`  ${p.tag}: ${p.before} -> ${p.after} patterns (+${p.added})`));
  console.log(`\nUnmatched-by-topic report written to ${UNMATCHED_REPORT_PATH}`);
  report.forEach((r) => console.log(`  ${r.topic}: ${r.count} unmatched`));
}

main();

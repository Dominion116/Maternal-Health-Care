/**
 * Phase 1 of the Ghana dataset merge (expensive, run once): embeds every
 * existing intent's patterns (to get a fresh centroid per intent) and all
 * ~20,000 Ghana Q&A questions, then records each Ghana question's best
 * matching intent + similarity score to a JSON artifact.
 *
 * Deliberately does NOT touch intents.json — phase 2 (ghana-apply.ts) reads
 * this artifact and applies a similarity threshold + per-intent cap, so the
 * threshold can be tuned without re-running the ~8-10 minute embedding pass.
 *
 * Run: npx tsx scripts/ghana-match.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import { embedTexts } from '../src/ml/embedder';

interface IntentDef {
  tag: string;
  patterns: string[];
  responses: string[];
}

interface GhanaQA {
  id: string;
  question: string;
  answer: string;
  topic: string;
  urgency: string;
  batch: number;
}

const INTENTS_PATH = path.join(__dirname, '..', 'src', 'ml', 'intents.json');
const BATCHES_DIR = path.join(__dirname, '..', 'src', 'ml', 'batches');
const OUTPUT_DIR = path.join(__dirname, 'output');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'ghana-match-results.json');

function cosine(a: number[], b: number[]): number {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom === 0 ? 0 : dot / denom;
}

function loadGhanaQAs(): GhanaQA[] {
  const files = fs.readdirSync(BATCHES_DIR).filter((f) => f.endsWith('.json'));
  const all: GhanaQA[] = [];
  for (const file of files) {
    const raw = JSON.parse(fs.readFileSync(path.join(BATCHES_DIR, file), 'utf-8'));
    for (const qa of raw.qa_pairs) {
      all.push({
        id: qa.id,
        question: qa.question,
        answer: qa.answer,
        topic: qa.metadata?.topic ?? 'UNSPECIFIED',
        urgency: qa.metadata?.urgency ?? 'UNSPECIFIED',
        batch: raw.batch_metadata?.batch_number ?? 0,
      });
    }
  }
  return all;
}

async function main() {
  const { intents }: { intents: IntentDef[] } = JSON.parse(fs.readFileSync(INTENTS_PATH, 'utf-8'));
  console.log(`Loaded ${intents.length} existing intents.`);

  const ghanaQAs = loadGhanaQAs();
  console.log(`Loaded ${ghanaQAs.length} Ghana Q&A pairs from ${BATCHES_DIR}.`);

  // 1. Fresh centroid per existing intent, from its current patterns.
  console.log('Embedding existing intent patterns...');
  const t0 = Date.now();
  const allPatterns: string[] = [];
  const patternOwner: number[] = []; // index into intents[], parallel to allPatterns
  intents.forEach((intent, idx) => {
    for (const p of intent.patterns) {
      allPatterns.push(p);
      patternOwner.push(idx);
    }
  });
  const patternEmbeddings = await embedTexts(allPatterns, 64);
  console.log(`  ${allPatterns.length} patterns embedded in ${((Date.now() - t0) / 1000).toFixed(1)}s`);

  const centroids: number[][] = intents.map(() => []);
  const centroidCounts: number[] = intents.map(() => 0);
  patternEmbeddings.forEach((emb, i) => {
    const owner = patternOwner[i];
    if (centroids[owner].length === 0) centroids[owner] = new Array(emb.length).fill(0);
    for (let d = 0; d < emb.length; d++) centroids[owner][d] += emb[d];
    centroidCounts[owner]++;
  });
  centroids.forEach((c, i) => {
    if (centroidCounts[i] > 0) {
      for (let d = 0; d < c.length; d++) c[d] /= centroidCounts[i];
    }
  });

  // 2. Embed all Ghana questions.
  console.log('Embedding Ghana questions (this is the slow part)...');
  const t1 = Date.now();
  const ghanaEmbeddings = await embedTexts(
    ghanaQAs.map((q) => q.question),
    64,
  );
  console.log(`  ${ghanaQAs.length} questions embedded in ${((Date.now() - t1) / 1000 / 60).toFixed(1)}min`);

  // 3. Best-match each Ghana question against every intent centroid.
  console.log('Matching...');
  const results = ghanaQAs.map((qa, i) => {
    const emb = ghanaEmbeddings[i];
    let bestIdx = -1;
    let bestScore = -1;
    for (let c = 0; c < centroids.length; c++) {
      if (centroidCounts[c] === 0) continue;
      const score = cosine(emb, centroids[c]);
      if (score > bestScore) {
        bestScore = score;
        bestIdx = c;
      }
    }
    return {
      id: qa.id,
      question: qa.question,
      answer: qa.answer,
      topic: qa.topic,
      urgency: qa.urgency,
      bestTag: bestIdx >= 0 ? intents[bestIdx].tag : null,
      similarity: bestScore,
    };
  });

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(results), 'utf-8');
  console.log(`\nWrote ${results.length} match results to ${OUTPUT_PATH}`);

  // Quick score-distribution summary to inform the threshold choice in phase 2.
  const buckets = { '>=0.7': 0, '0.6-0.7': 0, '0.5-0.6': 0, '0.4-0.5': 0, '<0.4': 0 };
  for (const r of results) {
    if (r.similarity >= 0.7) buckets['>=0.7']++;
    else if (r.similarity >= 0.6) buckets['0.6-0.7']++;
    else if (r.similarity >= 0.5) buckets['0.5-0.6']++;
    else if (r.similarity >= 0.4) buckets['0.4-0.5']++;
    else buckets['<0.4']++;
  }
  console.log('Similarity distribution:', JSON.stringify(buckets, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

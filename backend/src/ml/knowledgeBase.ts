import * as fs from 'fs';
import * as path from 'path';

export interface IntentDef {
  tag: string;
  patterns: string[];
  responses: string[];
  source: string;
}

let cached: IntentDef[] | null = null;

export function getIntents(): IntentDef[] {
  if (cached) return cached;
  const intentsPath = path.join(__dirname, 'intents.json');
  const { intents } = JSON.parse(fs.readFileSync(intentsPath, 'utf-8'));
  cached = intents;
  return intents;
}

export function getIntentByTag(tag: string): IntentDef | undefined {
  return getIntents().find((i) => i.tag === tag);
}

// A short grounding snippet for the LLM prompt — picks the first (primary)
// validated response text rather than concatenating all of them.
export function getGroundingSnippet(tag: string): { text: string; source: string } | null {
  const intent = getIntentByTag(tag);
  if (!intent) return null;
  return { text: intent.responses[0], source: intent.source };
}

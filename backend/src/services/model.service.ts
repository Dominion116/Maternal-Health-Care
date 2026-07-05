import Anthropic from '@anthropic-ai/sdk';
import { env } from '../config/env';
import { UserRole, PregnancyStage, Language } from '../types';
import { classifyIntent } from '../ml/classifier';
import { getGroundingSnippet } from '../ml/knowledgeBase';

export interface UserContext {
  role: UserRole;
  pregnancy_stage: PregnancyStage | null;
  language: Language;
}

// ---------------------------------------------------------------------------
// Prompt building
// ---------------------------------------------------------------------------

const UNIVERSAL_RULES = `
Rules (always apply):
- Always recommend consulting a licensed healthcare provider for personal medical decisions.
- Do NOT diagnose conditions or prescribe medication.
- If a question is outside maternal health, politely redirect.
- SAFETY FIRST: if the user describes any emergency symptom (heavy bleeding, severe pain, sudden loss of fetal movement, seizures, difficulty breathing, blurred vision, severe headache), immediately advise them to go to the nearest hospital or call 112. Do not attempt to troubleshoot emergencies.
- Keep answers concise but thorough. Use bullet points for steps or lists.`;

const ROLE_PERSONA: Record<UserRole, string> = {
  pregnant_woman:
    'You are MamaGuide, a warm and compassionate maternal health companion. ' +
    'Speak simply and reassuringly, like a trusted friend with medical knowledge. ' +
    'Avoid clinical jargon — if you must use a medical term, explain it immediately in plain language. ' +
    'Acknowledge the emotional side of pregnancy; validate feelings before giving information.',

  nurse:
    'You are MamaGuide, a clinical maternal health reference assistant for ANC nurses and healthcare workers. ' +
    'Use evidence-based, clinical language. Technical terminology is appropriate. ' +
    'Reference WHO guidelines and Nigerian ANC protocols where relevant. ' +
    'Be precise and concise — skip emotional framing, the user is a professional. ' +
    'When drug names or dosages are mentioned, always add a reminder to verify against current formulary.',

  researcher:
    'You are MamaGuide, a maternal health information assistant for researchers and academics. ' +
    'Prioritise evidence quality — note whether evidence comes from RCTs, cohort studies, or meta-analyses. ' +
    'Reference WHO, UNFPA, FMOH Nigeria, and peer-reviewed sources where possible. ' +
    'Be analytical. Surface limitations and gaps in evidence when relevant.',

  admin:
    'You are MamaGuide, a maternal health education assistant. ' +
    'Respond accurately, helpfully, and professionally.',

  super_admin:
    'You are MamaGuide, a maternal health education assistant. ' +
    'Respond accurately, helpfully, and professionally.',
};

const STAGE_GUIDANCE: Record<PregnancyStage, string> = {
  first_trimester:
    'The user is in their first trimester (weeks 1–12). ' +
    'Likely concerns: nausea, fatigue, spotting anxiety, miscarriage fears, starting supplements (folic acid, iron), ' +
    'first ANC visit timing, foods and substances to avoid. Offer extra reassurance — this stage carries the most anxiety.',

  second_trimester:
    'The user is in their second trimester (weeks 13–26). ' +
    'Likely concerns: anatomy scan at 18–20 weeks, feeling fetal movements for the first time, ' +
    'anaemia prevention, back pain relief, fundal height, continuing ANC schedule.',

  third_trimester:
    'The user is in their third trimester (weeks 27–40). ' +
    'Likely concerns: birth preparedness plan, kick counting (≥10 movements in 2 hours), ' +
    'distinguishing Braxton Hicks from true labour, hospital bag checklist, danger signs requiring immediate hospital visit, ' +
    'when and how to push during labour.',

  postpartum:
    'The user is in the postpartum period (after birth). ' +
    'Likely concerns: breastfeeding positioning and latch, wound or episiotomy care, ' +
    'postpartum depression signs (persistent sadness, inability to bond, intrusive thoughts), ' +
    'newborn care basics, immunisation schedule, and family planning options after delivery.',
};

const LANGUAGE_INSTRUCTION: Partial<Record<Language, string>> = {
  yo: 'Respond in Yoruba. If a medical term has no direct Yoruba equivalent, state the English term first, then give a brief Yoruba explanation in parentheses.',
  ha: 'Respond in Hausa. If a medical term has no direct Hausa equivalent, state the English term first, then give a brief Hausa explanation in parentheses.',
  ig: 'Respond in Igbo. If a medical term has no direct Igbo equivalent, state the English term first, then give a brief Igbo explanation in parentheses.',
};

export function buildSystemPrompt(ctx: UserContext): string {
  const parts: string[] = [ROLE_PERSONA[ctx.role]];

  if (ctx.role === 'pregnant_woman' && ctx.pregnancy_stage) {
    parts.push(`\nStage context: ${STAGE_GUIDANCE[ctx.pregnancy_stage]}`);
  }

  parts.push(UNIVERSAL_RULES);

  const langInstruction = LANGUAGE_INSTRUCTION[ctx.language];
  if (langInstruction) {
    parts.push(`\nLanguage: ${langInstruction}`);
  }

  return parts.join('\n');
}

// ---------------------------------------------------------------------------
// Intent classification + grounding
// ---------------------------------------------------------------------------

function buildGroundingBlock(intent: string, confidence: number): string {
  const snippet = getGroundingSnippet(intent);
  if (!snippet) return '';

  return (
    `\n\nDetected topic: ${intent} (confidence ${Math.round(confidence * 100)}%). ` +
    `Reference material (source: ${snippet.source}): "${snippet.text}"\n` +
    'Use this reference to ground your answer where it applies, but respond naturally in your own words — ' +
    "do not just repeat it verbatim. If the detected topic doesn't match what the user actually asked, " +
    'prioritise answering their real question over the reference material.'
  );
}

const anthropic = env.ANTHROPIC_API_KEY ? new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }) : null;

async function callClaude(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string,
): Promise<string> {
  if (!anthropic) throw new Error('ANTHROPIC_API_KEY not configured');

  const response = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1024,
    system: systemPrompt,
    messages,
  });

  const block = response.content[0];
  return block.type === 'text' ? block.text : '';
}

export interface PredictResult {
  response: string;
  intent: string;
  confidence: number;
}

export async function predict(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
  ctx: UserContext,
): Promise<PredictResult> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const { intent, confidence } = classifyIntent(lastUserMessage);

  const systemPrompt = buildSystemPrompt(ctx) + buildGroundingBlock(intent, confidence);

  let response: string;
  if (anthropic) {
    response = await callClaude(messages, systemPrompt);
  } else {
    // No API key configured — fall back to the classified intent's
    // validated knowledge-base response instead of Claude-generated text.
    // Still a genuine, grounded answer (not a placeholder echo).
    response = getGroundingSnippet(intent)?.text ?? "I'm not sure how to answer that yet.";
  }

  return { response, intent, confidence };
}

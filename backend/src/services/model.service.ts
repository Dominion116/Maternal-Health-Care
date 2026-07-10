import { UserRole, PregnancyStage, Language } from '../types';
import { classifyIntent } from '../ml/classifier';
import { getIntentByTag } from '../ml/knowledgeBase';

export interface UserContext {
  role: UserRole;
  pregnancy_stage: PregnancyStage | null;
  language: Language;
}

// Minimum softmax probability before we trust the classified intent — the
// same threshold used when the model was evaluated during training.
const CONFIDENCE_THRESHOLD = 0.25;

const FALLBACK_RESPONSE =
  "I'm not sure I understood that correctly. Could you rephrase your question? " +
  'You can ask me about antenatal care, nutrition, danger signs, breastfeeding, ' +
  'birth preparation, or postpartum care. For personal medical decisions, please ' +
  'consult a licensed healthcare provider.';

// Pick among the intent's validated responses, avoiding an exact repeat of
// what the assistant said last so consecutive answers on the same topic vary.
function pickResponse(responses: string[], lastAssistantMessage: string | undefined): string {
  if (responses.length === 0) return FALLBACK_RESPONSE;

  const candidates =
    responses.length > 1 && lastAssistantMessage
      ? responses.filter((r) => r !== lastAssistantMessage)
      : responses;

  return candidates[Math.floor(Math.random() * candidates.length)];
}

export interface PredictResult {
  response: string;
  intent: string;
  confidence: number;
}

export async function predict(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>,
): Promise<PredictResult> {
  const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const lastAssistantMessage = [...messages].reverse().find((m) => m.role === 'assistant')?.content;

  const { intent, confidence } = await classifyIntent(lastUserMessage);

  if (confidence < CONFIDENCE_THRESHOLD) {
    return { response: FALLBACK_RESPONSE, intent, confidence };
  }

  const intentDef = getIntentByTag(intent);
  const response = pickResponse(intentDef?.responses ?? [], lastAssistantMessage);

  return { response, intent, confidence };
}

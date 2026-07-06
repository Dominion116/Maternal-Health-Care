import { supabaseAdmin } from '../../config/supabase';
import { predict, UserContext } from '../../services/model.service';
import { checkEmergency, buildEmergencyResponse } from '../../services/emergency.service';
import { Message, Conversation, UserProfile } from '../../types';

const CONTEXT_WINDOW = 10;

const DEFAULT_USER_CONTEXT: UserContext = {
  role: 'pregnant_woman',
  pregnancy_stage: null,
  language: 'en',
};

async function fetchUserContext(userId: string): Promise<UserContext> {
  const { data } = await supabaseAdmin
    .from('user_profiles')
    .select('role, pregnancy_stage, language')
    .eq('user_id', userId)
    .single<Pick<UserProfile, 'role' | 'pregnancy_stage' | 'language'>>();

  if (!data) return DEFAULT_USER_CONTEXT;

  return {
    role: data.role,
    pregnancy_stage: data.pregnancy_stage,
    language: data.language,
  };
}

export async function createSession(userId: string, title?: string): Promise<Conversation> {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .insert({ user_id: userId, title: title ?? null })
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to create session: ${error?.message ?? 'no data returned'}`);
  return data;
}

export interface SendMessageResult {
  conversation: Conversation;
  assistantMessage: Message;
  is_emergency: boolean;
  flagged_keyword: string | null;
}

export async function sendMessage(
  userId: string,
  message: string,
  conversationId?: string,
): Promise<SendMessageResult> {
  const [userContext, conversation] = await Promise.all([
    fetchUserContext(userId),
    resolveConversation(userId, message, conversationId),
  ]);

  const { isEmergency, detectedKeyword } = checkEmergency(message);

  let assistantContent: string;
  let intent: string | null = null;
  let intentConfidence: number | null = null;

  if (isEmergency) {
    // Bypass the model — return a pre-built response immediately.
    // Log to stdout so it appears in server/monitoring logs.
    console.warn(
      `[EMERGENCY] user=${userId} conversation=${conversation.id} keyword="${detectedKeyword}" message="${message.slice(0, 120)}"`,
    );
    assistantContent = buildEmergencyResponse(userContext.language);
  } else {
    const { data: history } = await supabaseAdmin
      .from('messages')
      .select('role, content')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: false })
      .limit(CONTEXT_WINDOW);

    const contextMessages = (history ?? []).reverse() as Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;

    contextMessages.push({ role: 'user', content: message });
    const result = await predict(contextMessages, userContext);
    assistantContent = result.response;
    intent = result.intent;
    intentConfidence = result.confidence;
  }

  const { error: insertError } = await supabaseAdmin.from('messages').insert([
    {
      conversation_id: conversation.id,
      role: 'user',
      content: message,
      flagged: isEmergency,
      flagged_keyword: detectedKeyword,
    },
    {
      conversation_id: conversation.id,
      role: 'assistant',
      content: assistantContent,
      intent,
      intent_confidence: intentConfidence,
    },
  ]);

  if (insertError) throw new Error(`Failed to save messages: ${insertError.message}`);

  const { data: savedAssistant } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('conversation_id', conversation.id)
    .eq('role', 'assistant')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return {
    conversation,
    assistantMessage: savedAssistant as Message,
    is_emergency: isEmergency,
    flagged_keyword: detectedKeyword,
  };
}

async function resolveConversation(
  userId: string,
  message: string,
  conversationId?: string,
): Promise<Conversation> {
  if (conversationId) {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .eq('user_id', userId)
      .single();

    if (error || !data) throw new Error('Conversation not found');
    return data;
  }

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .insert({ user_id: userId, title: message.slice(0, 60) })
    .select()
    .single();

  if (error || !data) throw new Error(`Failed to create conversation: ${error?.message ?? 'no data returned'}`);
  return data;
}

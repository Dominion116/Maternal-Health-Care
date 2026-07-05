import { supabaseAdmin } from '../../config/supabase';
import { SessionSummary, Message } from '../../types';

export async function getConversations(
  userId: string,
  page: number,
  limit: number,
): Promise<SessionSummary[]> {
  const from = (page - 1) * limit;

  const { data, error } = await supabaseAdmin
    .from('conversations')
    .select('*, messages(count)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) throw new Error(error.message);

  return (data ?? []).map((row: any) => ({
    ...row,
    message_count: row.messages?.[0]?.count ?? 0,
    messages: undefined,
  }));
}

export async function getMessages(
  userId: string,
  conversationId: string,
  page: number,
  limit: number,
): Promise<Message[]> {
  const { data: conversation, error: convError } = await supabaseAdmin
    .from('conversations')
    .select('id')
    .eq('id', conversationId)
    .eq('user_id', userId)
    .single();

  if (convError || !conversation) throw new Error('Conversation not found');

  const from = (page - 1) * limit;

  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .range(from, from + limit - 1);

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteConversation(userId: string, conversationId: string) {
  const { error } = await supabaseAdmin
    .from('conversations')
    .delete()
    .eq('id', conversationId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

export async function setSaved(userId: string, conversationId: string, isSaved: boolean) {
  const { data, error } = await supabaseAdmin
    .from('conversations')
    .update({ is_saved: isSaved })
    .eq('id', conversationId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) throw new Error('Conversation not found');
  return data;
}

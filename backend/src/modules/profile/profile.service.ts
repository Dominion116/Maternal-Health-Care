import { supabaseAdmin } from '../../config/supabase';
import { UserProfile } from '../../types';
import { UpdateProfileDtoType } from './profile.dto';

export async function getProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error || !data) throw new Error('Profile not found');
  return data;
}

export async function updateProfile(
  userId: string,
  dto: UpdateProfileDtoType,
): Promise<UserProfile> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .update({ ...dto, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) throw new Error('Failed to update profile');
  return data;
}

/**
 * Gather everything we store about a user into one JSON document
 * (profile, conversations + messages, research consent, feedback).
 */
export async function exportData(userId: string) {
  const profile = await getProfile(userId);

  const { data: conversations, error: convError } = await supabaseAdmin
    .from('conversations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (convError) throw new Error('Failed to export conversations');

  const conversationIds = (conversations ?? []).map((c) => c.id);
  let messages: unknown[] = [];
  if (conversationIds.length > 0) {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .in('conversation_id', conversationIds)
      .order('created_at', { ascending: true });
    if (error) throw new Error('Failed to export messages');
    messages = data ?? [];
  }

  const { data: consent } = await supabaseAdmin
    .from('research_consent')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  const { data: feedback } = await supabaseAdmin
    .from('feedback')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: true });

  return {
    exported_at: new Date().toISOString(),
    profile,
    conversations: conversations ?? [],
    messages,
    research_consent: consent ?? null,
    feedback: feedback ?? [],
  };
}

/**
 * Permanently delete the auth user. All app data (user_profiles,
 * conversations, messages, research_consent, sus_responses, feedback)
 * cascades via ON DELETE CASCADE foreign keys.
 */
export async function deleteAccount(userId: string): Promise<void> {
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw new Error('Failed to delete account');
}

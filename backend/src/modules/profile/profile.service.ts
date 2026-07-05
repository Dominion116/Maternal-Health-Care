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

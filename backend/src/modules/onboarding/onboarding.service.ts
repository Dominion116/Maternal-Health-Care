import { supabaseAdmin } from '../../config/supabase';
import { UserProfile } from '../../types';
import { OnboardingDtoType } from './onboarding.dto';

export async function completeOnboarding(
  userId: string,
  dto: OnboardingDtoType,
): Promise<UserProfile> {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      ...dto,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) throw new Error('Failed to complete onboarding');
  return data;
}

import { supabaseAdmin } from '../../config/supabase';
import { SusSubmitDtoType, FeedbackSubmitDtoType, ConsentDtoType } from './evaluation.dto';

// ---------------------------------------------------------------------------
// SUS score computation (standard formula)
// Odd-numbered questions (q1,q3…q9): contribution = response - 1
// Even-numbered questions (q2,q4…q10): contribution = 5 - response
// Total contributions × 2.5 → score on 0–100 scale
// ---------------------------------------------------------------------------
function computeSusScore(scores: SusSubmitDtoType['scores']): number {
  let sum = 0;
  for (let i = 1; i <= 10; i++) {
    const raw = scores[`q${i}` as keyof typeof scores];
    sum += i % 2 === 1 ? raw - 1 : 5 - raw;
  }
  return Math.round(sum * 2.5 * 100) / 100;
}

// ---------------------------------------------------------------------------
// Consent
// ---------------------------------------------------------------------------

export async function getConsent(userId: string) {
  const { data } = await supabaseAdmin
    .from('research_consent')
    .select('*')
    .eq('user_id', userId)
    .single();

  return data ?? null;
}

export async function submitConsent(userId: string, dto: ConsentDtoType) {
  const { data, error } = await supabaseAdmin
    .from('research_consent')
    .upsert(
      {
        user_id: userId,
        consented: dto.consented,
        consent_version: dto.consent_version,
        consented_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

/**
 * Withdraw research participation: flip the consent record to consented=false.
 * The row is kept (with the withdrawal timestamp) as an audit trail.
 */
export async function withdrawConsent(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('research_consent')
    .update({ consented: false, consented_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ?? null;
}

// ---------------------------------------------------------------------------
// SUS
// ---------------------------------------------------------------------------

export async function getSusResponse(userId: string) {
  const { data } = await supabaseAdmin
    .from('sus_responses')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })
    .limit(1)
    .single();

  return data ?? null;
}

export async function submitSus(userId: string, dto: SusSubmitDtoType) {
  const existing = await getSusResponse(userId);
  if (existing) throw new Error('SUS response already submitted');

  const sus_score = computeSusScore(dto.scores);

  const { data, error } = await supabaseAdmin
    .from('sus_responses')
    .insert({ user_id: userId, scores: dto.scores, sus_score })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export async function getFeedback(userId: string) {
  const { data } = await supabaseAdmin
    .from('feedback')
    .select('*')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  return data ?? [];
}

export async function submitFeedback(userId: string, dto: FeedbackSubmitDtoType) {
  const { data, error } = await supabaseAdmin
    .from('feedback')
    .insert({
      user_id: userId,
      rating: dto.rating,
      category: dto.category,
      comment: dto.comment ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

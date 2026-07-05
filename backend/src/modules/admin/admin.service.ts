import { supabaseAdmin } from '../../config/supabase';
import { env } from '../../config/env';
import {
  AdminUsersQueryDtoType,
  AdminConversationsQueryDtoType,
  UpdateRoleDtoType,
  InviteAdminDtoType,
} from './admin.dto';

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

// Only reachable behind superAdminMiddleware. Uses Supabase's built-in invite
// flow rather than a custom token table — Supabase creates the (unconfirmed)
// user and emails them a secure link to /auth/accept-invite, where they set
// a password. The invited role/name travel in user_metadata until then.
export async function inviteAdmin(dto: InviteAdminDtoType) {
  const { data, error } = await supabaseAdmin.auth.admin.inviteUserByEmail(dto.email, {
    data: { role: dto.role, full_name: dto.full_name ?? null },
    redirectTo: `${env.FRONTEND_URL}/auth/accept-invite`,
  });

  if (error) throw new Error(error.message);
  return { id: data.user.id, email: data.user.email, role: dto.role };
}

export async function listUsers(query: AdminUsersQueryDtoType) {
  const from = (query.page - 1) * query.limit;

  // Pull auth users (includes email) — paginated
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
    page: query.page,
    perPage: query.limit,
  });
  if (authError) throw new Error(authError.message);

  const userIds = authData.users.map((u) => u.id);
  if (userIds.length === 0) return [];

  // Pull matching profiles
  let profileQuery = supabaseAdmin
    .from('user_profiles')
    .select('*')
    .in('user_id', userIds);

  if (query.role) profileQuery = profileQuery.eq('role', query.role);

  const { data: profiles, error: profileError } = await profileQuery;
  if (profileError) throw new Error(profileError.message);

  const profileMap = new Map((profiles ?? []).map((p) => [p.user_id, p]));

  return authData.users
    .map((u) => ({ ...profileMap.get(u.id), email: u.email, last_sign_in: u.last_sign_in_at }))
    .filter((u) => (query.role ? u.role === query.role : true));
}

export async function getUserById(userId: string) {
  const [{ data: authUser, error: authErr }, { data: profile, error: profileErr }] =
    await Promise.all([
      supabaseAdmin.auth.admin.getUserById(userId),
      supabaseAdmin.from('user_profiles').select('*').eq('user_id', userId).single(),
    ]);

  if (authErr) throw new Error(authErr.message);
  if (profileErr) throw new Error('Profile not found');

  return { ...profile, email: authUser.user.email, last_sign_in: authUser.user.last_sign_in_at };
}

export async function updateUserRole(userId: string, dto: UpdateRoleDtoType) {
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .update({ role: dto.role, updated_at: new Date().toISOString() })
    .eq('user_id', userId)
    .select()
    .single();

  if (error || !data) throw new Error('Failed to update role');
  return data;
}

// ---------------------------------------------------------------------------
// Conversations
// ---------------------------------------------------------------------------

export async function listConversations(query: AdminConversationsQueryDtoType) {
  const from = (query.page - 1) * query.limit;

  let q = supabaseAdmin
    .from('conversations')
    .select('*, messages(count), flagged_messages:messages(count)')
    .order('updated_at', { ascending: false })
    .range(from, from + query.limit - 1);

  if (query.user_id) q = q.eq('user_id', query.user_id);

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  let results = (data ?? []).map((row: any) => ({
    id: row.id,
    user_id: row.user_id,
    title: row.title,
    created_at: row.created_at,
    updated_at: row.updated_at,
    message_count: row.messages?.[0]?.count ?? 0,
  }));

  // If filtering by flagged, get conversation IDs that have flagged messages
  if (query.flagged !== undefined) {
    const { data: flaggedConvs } = await supabaseAdmin
      .from('messages')
      .select('conversation_id')
      .eq('flagged', true);

    const flaggedIds = new Set((flaggedConvs ?? []).map((m: any) => m.conversation_id));

    results = results.filter((c) =>
      query.flagged ? flaggedIds.has(c.id) : !flaggedIds.has(c.id),
    );
  }

  return results;
}

export async function getConversationMessages(conversationId: string) {
  const { data, error } = await supabaseAdmin
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return data ?? [];
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

export async function getAnalytics() {
  const [
    { count: totalUsers },
    { count: totalConversations },
    { count: totalMessages },
    { count: emergencyMessages },
    { data: usersByRole },
    { data: recentEmergencies },
    { data: intentRows },
    { data: weeklyConversations },
    { data: allMessageTimestamps },
  ] = await Promise.all([
    supabaseAdmin.from('user_profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('conversations').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('messages').select('*', { count: 'exact', head: true }),
    supabaseAdmin
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('flagged', true),
    supabaseAdmin
      .from('user_profiles')
      .select('role')
      .then(async ({ data }) => ({
        data: data
          ? ['pregnant_woman', 'nurse', 'admin', 'researcher', 'super_admin'].map((role) => ({
              role,
              count: data.filter((u: any) => u.role === role).length,
            }))
          : [],
      })),
    supabaseAdmin
      .from('messages')
      .select('conversation_id, flagged_keyword, created_at')
      .eq('flagged', true)
      .order('created_at', { ascending: false })
      .limit(10),
    // Powers the "Top Intents" panel — real usage of the FFNN classifier,
    // not a fabricated stat.
    supabaseAdmin.from('messages').select('intent, intent_confidence').not('intent', 'is', null),
    // Lightweight timestamp-only fetches — bucketed in JS below — power the
    // "conversations this week" and "peak usage hours" charts.
    supabaseAdmin
      .from('conversations')
      .select('created_at')
      .gte('created_at', new Date(Date.now() - 7 * 86400000).toISOString()),
    supabaseAdmin.from('messages').select('created_at'),
  ]);

  const intentCounts = new Map<string, { count: number; confidenceSum: number }>();
  for (const row of intentRows ?? []) {
    const entry = intentCounts.get(row.intent) ?? { count: 0, confidenceSum: 0 };
    entry.count += 1;
    entry.confidenceSum += row.intent_confidence ?? 0;
    intentCounts.set(row.intent, entry);
  }
  const topIntents = Array.from(intentCounts.entries())
    .map(([intent, { count, confidenceSum }]) => ({
      intent,
      count,
      avg_confidence: Math.round((confidenceSum / count) * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const confidenceBuckets = { high: 0, medium: 0, low: 0 };
  for (const row of intentRows ?? []) {
    const c = row.intent_confidence ?? 0;
    if (c > 0.85) confidenceBuckets.high++;
    else if (c >= 0.65) confidenceBuckets.medium++;
    else confidenceBuckets.low++;
  }

  const dailyMap = new Map<string, number>();
  for (const row of weeklyConversations ?? []) {
    const day = new Date(row.created_at).toISOString().slice(0, 10);
    dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  }
  const dailyConversations = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const hourlyLoad = new Array(24).fill(0);
  for (const row of allMessageTimestamps ?? []) {
    hourlyLoad[new Date(row.created_at).getHours()]++;
  }

  return {
    totals: {
      users: totalUsers ?? 0,
      conversations: totalConversations ?? 0,
      messages: totalMessages ?? 0,
      emergency_messages: emergencyMessages ?? 0,
    },
    users_by_role: usersByRole ?? [],
    recent_emergencies: recentEmergencies ?? [],
    top_intents: topIntents,
    confidence_distribution: confidenceBuckets,
    daily_conversations: dailyConversations,
    hourly_load: hourlyLoad,
  };
}

// ---------------------------------------------------------------------------
// SUS
// ---------------------------------------------------------------------------

export async function listSusResponses(page: number, limit: number) {
  const from = (page - 1) * limit;

  const { data, error } = await supabaseAdmin
    .from('sus_responses')
    .select('*')
    .order('submitted_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) throw new Error(error.message);

  const { data: stats } = await supabaseAdmin
    .from('sus_responses')
    .select('sus_score');

  const scores = (stats ?? []).map((r: any) => r.sus_score).filter(Boolean);
  const avgScore =
    scores.length > 0
      ? Math.round((scores.reduce((a: number, b: number) => a + b, 0) / scores.length) * 100) / 100
      : null;

  return { responses: data ?? [], avg_sus_score: avgScore, total: scores.length };
}

// ---------------------------------------------------------------------------
// Feedback
// ---------------------------------------------------------------------------

export async function listFeedback(page: number, limit: number) {
  const from = (page - 1) * limit;

  const { data, error } = await supabaseAdmin
    .from('feedback')
    .select('*')
    .order('submitted_at', { ascending: false })
    .range(from, from + limit - 1);

  if (error) throw new Error(error.message);

  const { data: ratings } = await supabaseAdmin.from('feedback').select('rating, category');

  const allRatings = (ratings ?? []).map((r: any) => r.rating).filter(Boolean);
  const avgRating =
    allRatings.length > 0
      ? Math.round((allRatings.reduce((a: number, b: number) => a + b, 0) / allRatings.length) * 100) / 100
      : null;

  const byCategory = ['bug', 'suggestion', 'praise', 'other'].map((cat) => ({
    category: cat,
    count: (ratings ?? []).filter((r: any) => r.category === cat).length,
  }));

  return { feedback: data ?? [], avg_rating: avgRating, by_category: byCategory };
}

// ---------------------------------------------------------------------------
// Model metrics — real training/evaluation results from the FFNN intent
// classifier (backend/src/ml/train.ts), not fabricated "knowledge source" data.
// ---------------------------------------------------------------------------

export async function getModelMetrics() {
  const fs = await import('fs');
  const { METRICS_PATH } = await import('../../ml/io');
  const { getIntents } = await import('../../ml/knowledgeBase');

  const metrics = fs.existsSync(METRICS_PATH)
    ? JSON.parse(fs.readFileSync(METRICS_PATH, 'utf-8'))
    : null;

  const intents = getIntents().map((intent) => ({
    tag: intent.tag,
    pattern_count: intent.patterns.length,
    source: intent.source,
  }));

  return { metrics, intents };
}

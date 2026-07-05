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
          ? ['pregnant_woman', 'nurse', 'admin', 'researcher'].map((role) => ({
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
  ]);

  return {
    totals: {
      users: totalUsers ?? 0,
      conversations: totalConversations ?? 0,
      messages: totalMessages ?? 0,
      emergency_messages: emergencyMessages ?? 0,
    },
    users_by_role: usersByRole ?? [],
    recent_emergencies: recentEmergencies ?? [],
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

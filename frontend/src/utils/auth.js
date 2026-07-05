/**
 * Converts a raw Supabase user object into the flat shape the app expects.
 *
 * - App-level role/name/phone live in user_metadata (not the top-level `role`
 *   which is always "authenticated" in Supabase).
 * - Any app-added fields (pregnancyStage, pregnancyWeeks, etc.) that were
 *   merged via updateUser() are spread into the result so they survive
 *   re-normalization on store rehydration.
 */
export function normalizeUser(supabaseUser) {
  if (!supabaseUser) return null;

  const meta = supabaseUser.user_metadata || {};

  console.log(supabaseUser);

  // Strip Supabase-internal fields; keep id, email, and any app-level extras
  // eslint-disable-next-line no-unused-vars
  const {
    user_metadata,
    app_metadata,
    identities,
    aud,
    is_anonymous,
    created_at,
    updated_at,
    last_sign_in_at,
    confirmation_sent_at,
    confirmed_at,
    email_confirmed_at,
    phone_confirmed_at,
    role: _supabaseRole, // always "authenticated" — ignore
    ...appFields // id, email, phone, and any fields added by updateUser
  } = supabaseUser;

  return {
    ...appFields,
    name:
      meta.full_name ||
      meta.name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    role: meta.role || "pregnant_woman",
    phone: meta.phone_number || supabaseUser.phone || appFields.phone || "",
    emailVerified: !!supabaseUser.email_confirmed_at,
    avatarUrl: meta.avatar_url || null,
  };
}

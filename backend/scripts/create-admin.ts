/**
 * One-off bootstrap script: promote an existing registered user to
 * 'super_admin' (default) or 'admin'. There is no other way to create the
 * first admin — self-registration is restricted to
 * pregnant_woman/nurse/researcher, and POST /admin/invite itself requires an
 * existing super_admin to call it.
 *
 * Usage: npm run create-admin -- someone@example.com [admin|super_admin]
 */
import { supabaseAdmin } from '../src/config/supabase';

const VALID_ROLES = ['admin', 'super_admin'];

async function main() {
  const email = process.argv[2];
  const role = process.argv[3] || 'super_admin';

  if (!email) {
    console.error('Usage: npm run create-admin -- <email> [admin|super_admin]');
    process.exit(1);
  }

  if (!VALID_ROLES.includes(role)) {
    console.error(`Invalid role "${role}". Must be one of: ${VALID_ROLES.join(', ')}`);
    process.exit(1);
  }

  const { data: usersPage, error: listError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000,
  });

  if (listError) {
    console.error('Failed to list users:', listError.message);
    process.exit(1);
  }

  const user = usersPage.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  if (!user) {
    console.error(`No registered user found with email "${email}". They must register first.`);
    process.exit(1);
  }

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .update({ role, updated_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .select()
    .single();

  if (error || !data) {
    console.error('Failed to update role:', error?.message ?? 'unknown error');
    process.exit(1);
  }

  console.log(`✔ ${email} (${user.id}) is now a ${role}.`);
}

main();

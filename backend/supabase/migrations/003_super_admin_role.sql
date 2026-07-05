-- =============================================================================
-- Migration 003: super_admin role tier.
--
-- 'super_admin' is the only role permitted to invite/create new admins
-- (POST /admin/invite). Regular 'admin' retains all prior admin dashboard
-- permissions (user management, analytics, SUS/feedback review) but cannot
-- invite other admins.
-- Safe to run multiple times — all statements are idempotent.
-- =============================================================================

ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('pregnant_woman', 'nurse', 'admin', 'researcher', 'super_admin'));

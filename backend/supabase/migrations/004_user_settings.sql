-- =============================================================================
-- 004: Per-user settings blob on user_profiles
--
-- Stores UI preferences edited on /app/settings, e.g.:
--   { "notifications": { "healthReminders": true, "ancReminders": true,
--                        "weeklyTips": false, "researchUpdates": false } }
--
-- Written by PATCH /api/profile (settings key in UpdateProfileDto).
-- Safe to run multiple times.
-- =============================================================================

ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{}'::jsonb;

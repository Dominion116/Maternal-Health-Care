-- =============================================================================
-- MamaGuide Database Schema
-- Safe to run multiple times — all statements are idempotent.
--
-- Registration vs Onboarding split:
--   POST /api/auth/register   → sets: user_id, full_name, role, phone_number
--   PATCH /api/profile        → sets: language, pregnancy_stage, due_date (onboarding flow)
--   PATCH /admin/users/:id/role → sets: role = 'admin' (admin-only, not self-assignable)
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Shared trigger function: stamps updated_at = now() on any UPDATE.
-- Reused by user_profiles and can be added to future tables.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------------------
-- user_profiles  (1:1 with auth.users)
--
-- Lifecycle:
--   created  — immediately after auth.signUp() in auth.service.ts
--   updated  — PATCH /api/profile (onboarding steps + settings changes)
--
-- Column notes:
--   role            — 'admin' is valid in DB but NOT accepted at registration.
--                     Only PATCH /api/admin/users/:id/role can set it.
--   language        — defaults to 'en'. Set during /onboarding/language step.
--   pregnancy_stage — NULL for nurses/researchers. Set during /onboarding/pregnancy.
--   due_date        — optional, pregnant women only. Set during /onboarding/pregnancy.
--   phone_number    — collected at registration. Used for emergency alerts.
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS user_profiles (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name      TEXT,
  role           TEXT        NOT NULL DEFAULT 'pregnant_woman'
                   CHECK (role IN ('pregnant_woman', 'nurse', 'admin', 'researcher', 'super_admin')),
  phone_number   TEXT,
  -- set during onboarding, not at registration
  language       TEXT        NOT NULL DEFAULT 'en'
                   CHECK (language IN ('en', 'yo', 'ha', 'ig')),
  pregnancy_stage TEXT
                   CHECK (pregnancy_stage IN (
                     'first_trimester', 'second_trimester', 'third_trimester', 'postpartum'
                   )),
  due_date             DATE,
  onboarding_completed BOOLEAN     NOT NULL DEFAULT false,
  -- UI preferences edited on /app/settings (e.g. notification toggles).
  settings             JSONB       NOT NULL DEFAULT '{}'::jsonb,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Existing databases created before migration 004:
ALTER TABLE user_profiles
  ADD COLUMN IF NOT EXISTS settings JSONB NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

DROP TRIGGER IF EXISTS trg_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read and update their own profile" ON user_profiles;
CREATE POLICY "Users can read and update their own profile"
  ON user_profiles FOR ALL
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON user_profiles;
CREATE POLICY "Admins can read all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- conversations
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS conversations (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title      TEXT,
  is_saved   BOOLEAN     NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_conversations_user_id   ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_is_saved ON conversations(is_saved) WHERE is_saved = true;

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own conversations" ON conversations;
CREATE POLICY "Users can manage their own conversations"
  ON conversations FOR ALL
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- messages
--
-- Column notes:
--   role               — 'user' | 'assistant' (not the user's account role)
--   flagged            — true when emergency keywords detected in the user turn
--   flagged_keyword    — the specific keyword that triggered the flag
--   intent             — FFNN-classified intent tag for assistant replies (see src/ml)
--   intent_confidence  — softmax confidence (0-1) for the classified intent
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS messages (
  id                 UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id    UUID         NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role               TEXT         NOT NULL CHECK (role IN ('user', 'assistant')),
  content            TEXT         NOT NULL,
  flagged            BOOLEAN      NOT NULL DEFAULT false,
  flagged_keyword    TEXT,
  intent             TEXT,
  intent_confidence  NUMERIC(4,3),
  created_at         TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
-- Partial index: only indexes the small subset of flagged rows, used by admin emergency queries
CREATE INDEX IF NOT EXISTS idx_messages_flagged ON messages(flagged) WHERE flagged = true;
CREATE INDEX IF NOT EXISTS idx_messages_intent ON messages(intent);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage messages in their conversations" ON messages;
CREATE POLICY "Users can manage messages in their conversations"
  ON messages FOR ALL
  USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE user_id = auth.uid()
    )
  );

-- Bumps conversations.updated_at whenever a message is inserted
CREATE OR REPLACE FUNCTION touch_conversation_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE conversations SET updated_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_conversation ON messages;
CREATE TRIGGER trg_touch_conversation
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION touch_conversation_updated_at();

-- ---------------------------------------------------------------------------
-- research_consent  (one row per user, upserted — not append-only)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS research_consent (
  user_id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  consented       BOOLEAN     NOT NULL,
  consent_version TEXT        NOT NULL DEFAULT 'v1',
  consented_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE research_consent ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own consent" ON research_consent;
CREATE POLICY "Users can manage their own consent"
  ON research_consent FOR ALL
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- sus_responses  (one submission per user, enforced in application layer)
--
-- Column notes:
--   scores    — raw answers: { "q1": 1-5, "q2": 1-5, … "q10": 1-5 }
--   sus_score — computed by the server using the standard Brooke formula (0-100)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS sus_responses (
  id           UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID         NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  scores       JSONB        NOT NULL,
  sus_score    NUMERIC(5,2) NOT NULL,
  submitted_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sus_responses_user_id ON sus_responses(user_id);

ALTER TABLE sus_responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own SUS response" ON sus_responses;
CREATE POLICY "Users can insert their own SUS response"
  ON sus_responses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own SUS response" ON sus_responses;
CREATE POLICY "Users can read their own SUS response"
  ON sus_responses FOR SELECT
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- feedback  (multiple submissions per user allowed)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS feedback (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating       INTEGER     NOT NULL CHECK (rating BETWEEN 1 AND 5),
  category     TEXT        NOT NULL CHECK (category IN ('bug', 'suggestion', 'praise', 'other')),
  comment      TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user_id  ON feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_category ON feedback(category);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert their own feedback" ON feedback;
CREATE POLICY "Users can insert their own feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own feedback" ON feedback;
CREATE POLICY "Users can read their own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- contact_submissions  (public contact form — unauthenticated INSERT)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a contact form" ON contact_submissions;
CREATE POLICY "Anyone can submit a contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read contact submissions" ON contact_submissions;
CREATE POLICY "Admins can read contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

-- ---------------------------------------------------------------------------
-- contact_submissions  (public contact form — unauthenticated INSERT)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_submissions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit a contact form" ON contact_submissions;
CREATE POLICY "Anyone can submit a contact form"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read contact submissions" ON contact_submissions;
CREATE POLICY "Admins can read contact submissions"
  ON contact_submissions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles p
      WHERE p.user_id = auth.uid() AND p.role = 'admin'
    )
  );

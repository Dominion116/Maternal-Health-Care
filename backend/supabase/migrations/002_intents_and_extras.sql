-- =============================================================================
-- Migration 002: intent classification tracking, saved conversations,
-- and the contact_submissions table (previously referenced by contact.service.ts
-- but never defined in schema.sql).
-- Safe to run multiple times — all statements are idempotent.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- messages: persist the FFNN's classified intent + confidence per assistant
-- reply, so admin analytics can report real model-quality data instead of
-- placeholder numbers.
-- ---------------------------------------------------------------------------
ALTER TABLE messages ADD COLUMN IF NOT EXISTS intent TEXT;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS intent_confidence NUMERIC(4,3);

CREATE INDEX IF NOT EXISTS idx_messages_intent ON messages(intent);

-- ---------------------------------------------------------------------------
-- conversations: "saved" flag backing the frontend's Saved Chats view.
-- ---------------------------------------------------------------------------
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS is_saved BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_conversations_is_saved ON conversations(is_saved) WHERE is_saved = true;

-- ---------------------------------------------------------------------------
-- contact_submissions
--
-- Public contact form — unauthenticated INSERT, admin-only SELECT.
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

-- Add updated_at to existing conversations table
ALTER TABLE conversations ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Back-fill: set updated_at to the latest message time (or created_at if no messages)
UPDATE conversations c
SET updated_at = COALESCE(
  (SELECT MAX(m.created_at) FROM messages m WHERE m.conversation_id = c.id),
  c.created_at
);

-- Trigger function
CREATE OR REPLACE FUNCTION touch_conversation_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE conversations SET updated_at = now() WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_touch_conversation
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION touch_conversation_updated_at();

-- New index for efficient "most recently active" ordering
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);

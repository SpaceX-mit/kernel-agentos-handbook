-- Migration 093: Lock down shared_conversations reads (P0 security)
--
-- Migration 012 shipped a public SELECT policy with `USING (true)`, which
-- let anyone holding the anon key enumerate the ENTIRE table — every share's
-- messages JSON, owner user_id, title, and expiry — without knowing a share
-- UUID. The share link's UUID gave no confidentiality while full-table
-- enumeration over the REST API remained possible.
--
-- No legitimate client path needs anonymous table access:
--   • The public share VIEWER reads through the `shared-conversation` edge
--     function, which uses the service-role key (bypasses RLS), returns a
--     single share by id, and enforces `expires_at`. That IS the scoped,
--     validated access path.
--   • Direct client reads (SupabaseClient.ts) are all owner-scoped:
--     share-count-today and the "is this conversation already shared?" check.
--
-- So: drop the public policy, and let owners read only their own rows.

DROP POLICY IF EXISTS "Public can view shared conversations" ON shared_conversations;

CREATE POLICY "Owners can view their own shared conversations"
  ON shared_conversations FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT/DELETE owner policies from migration 012 remain in force.

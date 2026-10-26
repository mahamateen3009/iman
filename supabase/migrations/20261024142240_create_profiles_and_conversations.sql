/*
# Create profiles and conversations tables for user accounts

## Purpose
Enables per-user authentication, personalized greetings, voice customization,
and isolated chat history storage. Each user has a profile (name, age, gender,
voice preferences) and their own set of conversations.

## New Tables

### profiles
- `id` (uuid, PK, references auth.users) — one row per user
- `name` (text) — the display name used for personalized greetings
- `age` (integer) — used for voice tone selection (young vs mature)
- `gender` (text) — 'male' or 'female', used for voice selection
- `voice_pitch` (real, default 1.0) — speech synthesis pitch
- `voice_rate` (real, default 0.95) — speech synthesis rate
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### conversations
- `id` (uuid, PK)
- `user_id` (uuid, FK to auth.users, default auth.uid())
- `title` (text) — conversation title derived from first user message
- `messages` (jsonb) — array of ChatMessage objects
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Security
- RLS enabled on both tables.
- profiles: user can read/update only their own row. No INSERT policy (rows
  created via service or by the user themselves through an INSERT policy).
  Added INSERT policy so the frontend can create own profile on first login.
- conversations: full CRUD scoped to owner via auth.uid() = user_id.
- Grants: authenticated role gets SELECT/INSERT/UPDATE/DELETE on both tables.
- No anon access — the app requires sign-in.

## Notes
1. profiles.id matches auth.users.id (1:1 relationship).
2. conversations.user_id defaults to auth.uid() so frontend inserts that
   omit user_id still pass the RLS WITH CHECK.
3. Email confirmation is OFF — users can sign in immediately after signup.
*/
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT '',
  age integer,
  gender text CHECK (gender IN ('male', 'female')),
  voice_pitch real DEFAULT 1.0,
  voice_rate real DEFAULT 0.95,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON profiles TO authenticated;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Conversation',
  messages jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON conversations TO authenticated;

DROP POLICY IF EXISTS "select_own_conversations" ON conversations;
CREATE POLICY "select_own_conversations" ON conversations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_conversations" ON conversations;
CREATE POLICY "insert_own_conversations" ON conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_conversations" ON conversations;
CREATE POLICY "update_own_conversations" ON conversations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_conversations" ON conversations;
CREATE POLICY "delete_own_conversations" ON conversations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

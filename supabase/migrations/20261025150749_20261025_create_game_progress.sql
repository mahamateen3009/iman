/*
# Create game_progress table for Deen Explorers game

## Purpose
Persists each user's progress in the "Deen Explorers" Islamic learning game:
the tier they are placed into (based on age), the highest level completed, and
the rewards they have unlocked. One row per user.

## New Tables
### game_progress
- `id` (uuid, PK, references auth.users) — one row per user
- `tier` (integer, 1–3) — the curriculum tier the user is routed to
- `completed_levels` (jsonb) — array of completed level ids, e.g. ["t1-l1","t1-l2"]
- `unlocked_rewards` (jsonb) — array of reward ids unlocked, e.g. ["wooden_shield"]
- `current_level` (integer) — the next level the user should play (1-based)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

## Security
- RLS enabled on game_progress.
- Only the owner (auth.uid() = id) can read/insert/update their row.
- Grants: authenticated role gets SELECT/INSERT/UPDATE only (no DELETE —
  progress should never be lost).
- No anon access — the game requires sign-in.

## Notes
1. game_progress.id matches auth.users.id (1:1 relationship).
2. INSERT policy uses WITH CHECK (auth.uid() = id) so the user can create
   their own progress row on first game open.
3. No DELETE policy — progress is intentionally non-destructible.
*/

CREATE TABLE IF NOT EXISTS game_progress (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tier integer NOT NULL DEFAULT 1 CHECK (tier IN (1, 2, 3)),
  completed_levels jsonb NOT NULL DEFAULT '[]'::jsonb,
  unlocked_rewards jsonb NOT NULL DEFAULT '[]'::jsonb,
  current_level integer NOT NULL DEFAULT 1 CHECK (current_level >= 1 AND current_level <= 30),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE game_progress ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON game_progress TO authenticated;

DROP POLICY IF EXISTS "select_own_game_progress" ON game_progress;
CREATE POLICY "select_own_game_progress" ON game_progress FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_game_progress" ON game_progress;
CREATE POLICY "insert_own_game_progress" ON game_progress FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_game_progress" ON game_progress;
CREATE POLICY "update_own_game_progress" ON game_progress FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

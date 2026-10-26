/*
# Create prayer tracker table

## Purpose
Lets each signed-in user track the five daily prayers (Fajr, Dhuhr, Asr,
Maghrib, Isha) per day. One row per user per calendar day. The frontend
reads/updates today's row and can show a streak/week view.

## New Tables
### prayer_tracker
- `id` (uuid, PK)
- `user_id` (uuid, FK auth.users, default auth.uid()) — owner
- `prayer_date` (date, NOT NULL) — the calendar day this row covers
- `fajr` (boolean, default false) — Fajr prayed
- `dhuhr` (boolean, default false) — Dhuhr prayed
- `asr` (boolean, default false) — Asr prayed
- `maghrib` (boolean, default false) — Maghrib prayed
- `isha` (boolean, default false) — Isha prayed
- `created_at` (timestamptz)
- `updated_at` (timestamptz)
- UNIQUE (user_id, prayer_date) — one row per user per day

## Security
- RLS enabled.
- Grants: authenticated gets SELECT, INSERT, UPDATE, DELETE.
- Owner-scoped CRUD via auth.uid() = user_id.
- user_id defaults to auth.uid() so inserts omitting it still pass WITH CHECK.
*/
CREATE TABLE IF NOT EXISTS prayer_tracker (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  prayer_date date NOT NULL,
  fajr boolean NOT NULL DEFAULT false,
  dhuhr boolean NOT NULL DEFAULT false,
  asr boolean NOT NULL DEFAULT false,
  maghrib boolean NOT NULL DEFAULT false,
  isha boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id, prayer_date)
);

ALTER TABLE prayer_tracker ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON prayer_tracker TO authenticated;

DROP POLICY IF EXISTS "select_own_prayers" ON prayer_tracker;
CREATE POLICY "select_own_prayers" ON prayer_tracker FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_prayers" ON prayer_tracker;
CREATE POLICY "insert_own_prayers" ON prayer_tracker FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_prayers" ON prayer_tracker;
CREATE POLICY "update_own_prayers" ON prayer_tracker FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_prayers" ON prayer_tracker;
CREATE POLICY "delete_own_prayers" ON prayer_tracker FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

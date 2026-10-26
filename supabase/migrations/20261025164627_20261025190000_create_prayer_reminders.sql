/*
# Create prayer reminder preferences

1. New Tables
- `prayer_reminders` stores one signed-in user's reminder preferences.
- `id` (uuid, primary key)
- `user_id` (uuid, owner, defaults to the signed-in user)
- `enabled` (boolean, whether reminders are enabled)
- `fajr_time`, `dhuhr_time`, `asr_time`, `maghrib_time`, `isha_time` (time values shown in the user's local clock)
- `created_at`, `updated_at` timestamps
- A unique user_id ensures one preference row per user.

2. Security
- RLS is enabled.
- Only authenticated users can read and manage their own reminder preferences.
- Grants and four separate CRUD policies are included.

3. Notes
- Browser notification delivery is controlled by the device and browser; this table stores the user's selected reminder schedule.
*/
CREATE TABLE IF NOT EXISTS prayer_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  fajr_time time NOT NULL DEFAULT '05:30',
  dhuhr_time time NOT NULL DEFAULT '12:30',
  asr_time time NOT NULL DEFAULT '15:45',
  maghrib_time time NOT NULL DEFAULT '18:30',
  isha_time time NOT NULL DEFAULT '20:00',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE prayer_reminders ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON prayer_reminders TO authenticated;

DROP POLICY IF EXISTS "select_own_prayer_reminders" ON prayer_reminders;
CREATE POLICY "select_own_prayer_reminders" ON prayer_reminders FOR SELECT TO authenticated USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "insert_own_prayer_reminders" ON prayer_reminders;
CREATE POLICY "insert_own_prayer_reminders" ON prayer_reminders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "update_own_prayer_reminders" ON prayer_reminders;
CREATE POLICY "update_own_prayer_reminders" ON prayer_reminders FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "delete_own_prayer_reminders" ON prayer_reminders;
CREATE POLICY "delete_own_prayer_reminders" ON prayer_reminders FOR DELETE TO authenticated USING (auth.uid() = user_id);

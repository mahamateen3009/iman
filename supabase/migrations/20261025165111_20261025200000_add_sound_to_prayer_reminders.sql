/*
# Add sound preference to prayer reminders

1. Modified Tables
- `prayer_reminders.sound_enabled` controls whether an audible alert accompanies an in-app reminder.

2. Security
- Existing row-level security, ownership policies, and grants remain unchanged.

3. Notes
- The browser may require a user interaction before allowing audio playback.
*/
ALTER TABLE prayer_reminders ADD COLUMN IF NOT EXISTS sound_enabled boolean NOT NULL DEFAULT true;

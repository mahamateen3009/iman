/*
# Add profile age-group context

1. Purpose
- Adds a durable age-group label alongside each user's numeric age so the app can apply child, teen, or adult guidance consistently.

2. Modified Tables
- `profiles.age_group` (text, nullable during profile setup): stores `child`, `teen`, or `adult`.
- Existing profile rows are backfilled from their current `age` value.

3. Security
- Keeps the existing authenticated owner-only profile policies unchanged.
- Grants authenticated users access to the updated profile rows through the table's existing grants and RLS rules.

4. Age Rules
- Ages 0 through 12 are `child`.
- Ages 13 through 17 are `teen`.
- Ages 18 and above are `adult`.
- Unknown ages remain null until a profile is completed.

5. Notes
- This migration does not create authentication accounts or store passwords.
- The age-group check prevents unsupported labels from being saved.
*/

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS age_group text
  CHECK (age_group IN ('child', 'teen', 'adult'));

UPDATE public.profiles
SET age_group = CASE
  WHEN age BETWEEN 0 AND 12 THEN 'child'
  WHEN age BETWEEN 13 AND 17 THEN 'teen'
  WHEN age >= 18 THEN 'adult'
  ELSE NULL
END
WHERE age_group IS DISTINCT FROM CASE
  WHEN age BETWEEN 0 AND 12 THEN 'child'
  WHEN age BETWEEN 13 AND 17 THEN 'teen'
  WHEN age >= 18 THEN 'adult'
  ELSE NULL
END;

/*
# Add date_of_birth to profiles

## Purpose
Replaces the static "age" column with a date of birth so the user's age is
derived (today minus DOB) and updates automatically each year. Previously
age was a fixed integer captured once at sign-up and never changed, which
caused the Deen Explorers difficulty tier and the voice tone to drift out
of sync with the user's real age over time.

## Changes to existing tables

### profiles
- Adds `date_of_birth date` column (nullable for back-compat with rows
  created before this migration). New and existing users will be required
  by the application to fill this in once; the column itself stays
  nullable at the DB level so the migration is non-destructive.
- The existing `age integer` column is kept (NOT dropped/renamed) to
  avoid losing data. The application will treat `date_of_birth` as the
  source of truth and only use `age` as a fallback for legacy rows that
  have not yet supplied a DOB.

## Security
- No changes to existing RLS policies or grants. The new column is
  covered automatically by the existing per-column-equivalent grants
  (the table grant is not column-restricted, so authenticated users can
  read/write date_of_birth on their own row as before).
- profiles remains readable/updatable only by the owning authenticated
  user (auth.uid() = id).

## Important notes
1. This migration is idempotent (IF NOT EXISTS on the column add).
2. No data is deleted or transformed. Existing rows keep their `age`; a
   later backfill of `date_of_birth` for legacy rows is a separate concern
   handled by the app prompting the user once.
3. The application computes age as: floor((today - date_of_birth) / year).
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS date_of_birth date;

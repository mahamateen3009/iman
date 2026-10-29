/*
# Create app_secrets table for storing third-party API keys

1. New Tables
- `app_secrets`
  - `key` (text, primary key) — the secret name, e.g. "OPENROUTER_API_KEY"
  - `value` (text, not null) — the secret value
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

2. Security
- Enable RLS on `app_secrets`.
- Grant ALL to `service_role` only (edge functions use the service role key).
- NO grants to `anon` or `authenticated` — users must never read or write secrets.
- Deny-by-default: no policies for anon/authenticated. Only service_role can access,
  and service_role bypasses RLS.
*/

CREATE TABLE IF NOT EXISTS app_secrets (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE app_secrets ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON app_secrets TO service_role;

-- Insert the OpenRouter API key
INSERT INTO app_secrets (key, value)
VALUES ('OPENROUTER_API_KEY', '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')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();

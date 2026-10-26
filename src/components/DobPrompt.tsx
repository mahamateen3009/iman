import { useState } from 'react';
import { Calendar, Heart, ArrowRight } from 'lucide-react';
import { ageFromDateOfBirth, type UserProfile } from '../types/profile';

interface DobPromptProps {
  profile: UserProfile;
  onSubmit: (dateOfBirth: string) => Promise<void>;
}

/** One-time prompt for existing users who signed up before date-of-birth existed. */
export function DobPrompt({ profile, onSubmit }: DobPromptProps) {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dateOfBirth) return;
    const ageNum = ageFromDateOfBirth(dateOfBirth);
    if (ageNum == null || ageNum < 5 || ageNum > 120) {
      setError('Please enter a valid date of birth (age must be 5–120).');
      return;
    }
    setBusy(true);
    setError(null);
    await onSubmit(dateOfBirth);
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-cream-50 to-emerald-100 px-4 dark:from-ink-900 dark:via-ink-800 dark:to-ink-900">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg dark:from-gold-400 dark:to-gold-600">
            <Heart className="h-7 w-7 text-cream-50 dark:text-ink-900" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-emerald-900 dark:text-cream-50">
            One last thing, {profile.name}
          </h1>
          <p className="mt-1 text-sm text-emerald-700/70 dark:text-ink-300">
            We've switched to using your date of birth so your age stays accurate.
            Enter it once to keep your experience personalized.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-900/10 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-gold-400/10 dark:bg-ink-800/60">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-emerald-700/70 dark:text-ink-400">
                Date of Birth
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700/40 dark:text-ink-400" />
                <input
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                  max={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-xl border border-emerald-900/10 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-emerald-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-gold-400/10 dark:bg-ink-700 dark:text-cream-50"
                />
              </div>
              <p className="mt-1 text-xs text-emerald-700/50 dark:text-ink-400">
                Once saved, this can't be changed. It's used to keep your age
                current and tailor the Deen Explorers difficulty and voice tone.
              </p>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-800 py-2.5 text-sm font-medium text-cream-50 shadow-soft transition hover:from-emerald-800 hover:to-emerald-900 disabled:opacity-50 dark:from-gold-500 dark:to-gold-600 dark:text-ink-900"
            >
              {busy ? 'Saving…' : 'Save & Continue'}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

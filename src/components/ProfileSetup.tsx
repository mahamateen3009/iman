import { useState } from 'react';
import { User, Calendar, Heart, ArrowRight } from 'lucide-react';
import { ageFromDateOfBirth, type Gender } from '../types/profile';

interface ProfileSetupProps {
  email: string;
  onSubmit: (data: { name: string; age: number; dateOfBirth: string; gender: Gender }) => Promise<void>;
}

export function ProfileSetup({ email, onSubmit }: ProfileSetupProps) {
  const derivedName = email.split('@')[0].replace(/[._0-9]/g, ' ').trim();
  const [name, setName] = useState(derivedName || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dateOfBirth || !gender) return;
    const ageNum = ageFromDateOfBirth(dateOfBirth);
    if (ageNum == null || ageNum < 5 || ageNum > 120) {
      setError('Please enter a valid date of birth (age must be 5–120).');
      return;
    }
    setBusy(true);
    setError(null);
    await onSubmit({ name: name.trim(), age: ageNum, dateOfBirth, gender });
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
            Welcome to Iman
          </h1>
          <p className="mt-1 text-sm text-emerald-700/70 dark:text-ink-300">
            Let's personalize your experience. This helps me greet you properly
            and tailor my voice to suit you.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-900/10 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-gold-400/10 dark:bg-ink-800/60">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-emerald-700/70 dark:text-ink-400">
                Your Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700/40 dark:text-ink-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-xl border border-emerald-900/10 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-emerald-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-gold-400/10 dark:bg-ink-700 dark:text-cream-50"
                />
              </div>
              <p className="mt-1 text-xs text-emerald-700/50 dark:text-ink-400">
                I'll greet you by this name, like "Hey {name || 'friend'}, how have you been?"
              </p>
            </div>

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
                We use your date of birth to keep your age up to date and pick the right tone — softer for younger users, calm and mature for others.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-emerald-700/70 dark:text-ink-400">
                Gender
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition ${
                    gender === 'male'
                      ? 'border-emerald-600 bg-emerald-600 text-cream-50 dark:border-gold-400 dark:bg-gold-500 dark:text-ink-900'
                      : 'border-emerald-900/10 bg-cream-50 text-emerald-700 dark:border-gold-400/10 dark:bg-ink-700 dark:text-ink-300'
                  }`}
                >
                  Male
                </button>
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-medium transition ${
                    gender === 'female'
                      ? 'border-emerald-600 bg-emerald-600 text-cream-50 dark:border-gold-400 dark:bg-gold-500 dark:text-ink-900'
                      : 'border-emerald-900/10 bg-cream-50 text-emerald-700 dark:border-gold-400/10 dark:bg-ink-700 dark:text-ink-300'
                  }`}
                >
                  Female
                </button>
              </div>
              <p className="mt-1 text-xs text-emerald-700/50 dark:text-ink-400">
                This selects a matching voice for the spoken responses.
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
              {busy ? 'Setting up…' : 'Get Started'}
              {!busy && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

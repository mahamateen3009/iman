import { useState } from 'react';
import { Mail, Lock, Sparkles, Moon, Baby, GraduationCap } from 'lucide-react';

interface AuthScreenProps {
  onSignIn: (email: string, password: string) => Promise<{ error: string | null }>;
  onSignUp: (email: string, password: string) => Promise<{ error: string | null }>;
  onDemoLogin: (email: string, password: string) => Promise<{ error: string | null }>;
}

const demoAccounts = [
  { label: 'Age 5 Child', email: 'child5@test.com', password: 'Password123!', icon: Baby },
  { label: 'Age 8 Child', email: 'child8@test.com', password: 'Password123!', icon: Baby },
  { label: 'Age 13 Teen', email: 'teen13@test.com', password: 'Password123!', icon: GraduationCap },
] as const;

export function AuthScreen({ onSignIn, onSignUp, onDemoLogin }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setBusy(true);
    setError(null);
    const fn = mode === 'login' ? onSignIn : onSignUp;
    const result = await fn(email, password);
    setBusy(false);
    if (result.error) setError(result.error);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-cream-50 to-emerald-100 px-4 dark:from-ink-900 dark:via-ink-800 dark:to-ink-900">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-gold-300 shadow-soft dark:from-gold-400 dark:to-gold-600 dark:text-ink-900">
            <Moon className="h-6 w-6" />
          </span>
          <h1 className="font-serif text-3xl font-bold text-emerald-900 dark:text-cream-50">
            Iman
          </h1>
          <p className="mt-1 text-sm text-emerald-700/70 dark:text-ink-300">
            Your Islamic companion for guidance and comfort
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-900/10 bg-white/80 p-6 shadow-soft backdrop-blur dark:border-gold-400/10 dark:bg-ink-800/60">
          <div className="mb-5 flex gap-2 rounded-xl bg-emerald-50 p-1 dark:bg-ink-700">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                mode === 'login'
                  ? 'bg-white text-emerald-900 shadow-sm dark:bg-ink-600 dark:text-cream-50'
                  : 'text-emerald-700/60 dark:text-ink-400'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setMode('signup'); setError(null); }}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
                mode === 'signup'
                  ? 'bg-white text-emerald-900 shadow-sm dark:bg-ink-600 dark:text-cream-50'
                  : 'text-emerald-700/60 dark:text-ink-400'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-emerald-700/70 dark:text-ink-400">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700/40 dark:text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full rounded-xl border border-emerald-900/10 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-emerald-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-gold-400/10 dark:bg-ink-700 dark:text-cream-50"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-emerald-700/70 dark:text-ink-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-700/40 dark:text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-emerald-900/10 bg-cream-50 py-2.5 pl-10 pr-3 text-sm text-emerald-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 dark:border-gold-400/10 dark:bg-ink-700 dark:text-cream-50"
                />
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-800 py-2.5 text-sm font-medium text-cream-50 shadow-soft transition hover:from-emerald-800 hover:to-emerald-900 disabled:opacity-50 dark:from-gold-500 dark:to-gold-600 dark:text-ink-900"
            >
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-wider text-emerald-700/40 dark:text-ink-400">
            <span className="h-px flex-1 bg-emerald-900/10 dark:bg-gold-400/10" />
            <span>Demo login</span>
            <span className="h-px flex-1 bg-emerald-900/10 dark:bg-gold-400/10" />
          </div>
          <div className="grid gap-2">
            {demoAccounts.map(({ label, email: demoEmail, password: demoPassword, icon: Icon }) => (
              <button
                key={demoEmail}
                type="button"
                onClick={async () => {
                  setBusy(true);
                  setError(null);
                  const result = await onDemoLogin(demoEmail, demoPassword);
                  setBusy(false);
                  if (result.error) setError(result.error);
                }}
                disabled={busy}
                className="flex items-center justify-between rounded-xl border border-emerald-900/10 bg-cream-50 px-3 py-2.5 text-left text-xs font-medium text-emerald-900 transition hover:border-emerald-700/30 hover:bg-emerald-50 disabled:opacity-50 dark:border-gold-400/10 dark:bg-ink-700 dark:text-cream-50 dark:hover:bg-ink-600"
              >
                <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-emerald-700 dark:text-gold-300" />{label}</span>
                <span className="text-[10px] text-emerald-700/50 dark:text-ink-400">Test account</span>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-emerald-700/50 dark:text-ink-400">
          <Sparkles className="h-3 w-3" />
          Your conversations are private and saved to your account
        </p>
      </div>
    </div>
  );
}

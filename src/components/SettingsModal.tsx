import { useState } from 'react';
import {
  X,
  Check,
  AlertCircle,
  Loader2,
  User,
  Trash2,
} from 'lucide-react';
import type { UserProfile } from '../types/profile';

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  email: string | null;
  effectiveAge: number | null;
  onDeleteAccount: () => Promise<string | null>;
}

export function SettingsModal({
  open,
  onClose,
  profile,
  email,
  effectiveAge,
  onDeleteAccount,
}: SettingsModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  if (!open) return null;

  const initials = profile?.name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';
  const accountCreated = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    const err = await onDeleteAccount();
    setDeleting(false);
    if (err) {
      setDeleteError(err);
      setConfirmDelete(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-lg animate-fade-in-up flex-col overflow-hidden rounded-2xl border border-emerald-900/12 bg-cream-50 shadow-card dark:border-gold-400/15 dark:bg-ink-800">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-emerald-900/8 p-6 pb-4 dark:border-gold-400/10">
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-700 to-emerald-900 text-sm font-bold text-cream-50 shadow-soft dark:from-gold-400 dark:to-gold-600 dark:text-ink-900">
              {initials}
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-emerald-900 dark:text-cream-50">
                Profile
              </h2>
              <p className="text-[11px] text-emerald-900/50 dark:text-ink-400">
                Your account & data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-emerald-900/60 transition-colors hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10"
            aria-label="Close profile"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-6">
          {/* My Profile section (read-only) */}
          <div className="mb-5 rounded-xl border border-emerald-900/10 bg-white/50 p-4 dark:border-gold-400/10 dark:bg-ink-700/30">
            <div className="mb-3 flex items-center gap-2">
              <User className="h-4 w-4 text-emerald-700 dark:text-gold-300" />
              <h3 className="text-sm font-semibold text-emerald-900 dark:text-cream-50">
                My Profile
              </h3>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-emerald-900/60 dark:text-ink-300">
              These details were set when you created your account. They shape your
              greeting, voice, and the Deen Explorers difficulty tier. They can't be
              changed after sign-up.
            </p>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <ProfileField label="Name" value={profile?.name || '—'} />
              <ProfileField label="Email" value={email || '—'} />
              <ProfileField label="Gender" value={profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '—'} />
              <ProfileField label="Date of Birth" value={profile?.date_of_birth || '—'} />
              <ProfileField label="Age" value={effectiveAge != null ? `${effectiveAge} (auto from DOB)` : '—'} />
              <ProfileField label="Account created" value={accountCreated} />
            </dl>
          </div>

          {/* Delete Account section */}
          <div className="rounded-xl border border-rose-300/50 bg-rose-50/60 p-4 dark:border-rose-400/20 dark:bg-rose-900/10">
            <div className="mb-2 flex items-center gap-2">
              <Trash2 className="h-4 w-4 text-rose-600 dark:text-rose-300" />
              <h3 className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                Delete Account
              </h3>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-rose-700/70 dark:text-rose-200/70">
              Permanently delete your account, profile, conversations, and game
              progress. This cannot be undone.
            </p>
            {deleteError && (
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-200">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {deleteError}
              </div>
            )}
            {confirmDelete ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-rose-700 dark:text-rose-200">
                  Are you sure? This is permanent.
                </span>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  {deleting ? 'Deleting…' : 'Yes, delete forever'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100 dark:text-rose-200 dark:hover:bg-rose-900/30"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-rose-400/50 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-500/20 dark:border-rose-400/30 dark:text-rose-300 dark:hover:bg-rose-500/20"
              >
                <Trash2 className="h-4 w-4" />
                Delete my account
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-emerald-900/8 p-6 pt-4 dark:border-gold-400/10">
          <button
            onClick={onClose}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:from-emerald-700 hover:to-emerald-600"
          >
            <Check className="h-4 w-4" />
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-emerald-900/8 bg-white/50 px-3 py-2 dark:border-gold-400/10 dark:bg-ink-800/40">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900/50 dark:text-ink-400">
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-sm font-medium text-emerald-900 dark:text-cream-50">
        {value}
      </dd>
    </div>
  );
}

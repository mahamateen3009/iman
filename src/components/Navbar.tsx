import { PanelLeft, LogOut, UserCircle, CalendarDays, Gamepad2, Moon } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  onOpenCalendar: () => void;
  onOpenGame: () => void;
  onOpenPrayer: () => void;
  sidebarOpen: boolean;
  userName?: string;
  age?: number | null;
  onSignOut?: () => void;
}

export function Navbar({
  onToggleSidebar,
  onOpenSettings,
  onOpenCalendar,
  onOpenGame,
  onOpenPrayer,
  sidebarOpen,
  userName,
  age,
  onSignOut,
}: NavbarProps) {
  const showGame = age == null || age <= 14;
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-emerald-900/10 bg-cream-50/90 px-4 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-emerald-900 transition-colors hover:bg-emerald-900/10"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          <PanelLeft className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-gold-300 shadow-soft dark:from-gold-400 dark:to-gold-600 dark:text-ink-900">
            <Moon className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <h1 className="font-serif text-lg font-bold text-emerald-900">
              Iman
            </h1>
            <p className="hidden text-[11px] text-emerald-900/60 sm:block">
              Islamic AI guidance & comfort
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Prayer tracker */}
        <button
          onClick={onOpenPrayer}
          className="flex items-center gap-1.5 rounded-full border border-emerald-900/15 bg-white/70 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition-colors hover:bg-emerald-900/10"
          aria-label="Open prayer tracker"
        >
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Prayers</span>
        </button>

        {/* Islamic Calendar */}
        <button
          onClick={onOpenCalendar}
          className="flex items-center gap-1.5 rounded-full border border-emerald-900/15 bg-white/70 px-3 py-1.5 text-xs font-semibold text-emerald-900 transition-colors hover:bg-emerald-900/10"
          aria-label="Open Islamic calendar"
        >
          <CalendarDays className="h-4 w-4" />
          <span className="hidden sm:inline">Calendar</span>
        </button>

        {/* Deen Explorers game — only for users 14 and under */}
        {showGame && (
          <button
            onClick={onOpenGame}
            className="flex items-center gap-1.5 rounded-full border border-emerald-700/30 bg-gradient-to-r from-emerald-700/10 to-gold-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:from-emerald-700/20 hover:to-gold-400/20"
            aria-label="Open Deen Explorers game"
          >
            <Gamepad2 className="h-4 w-4" />
            <span className="hidden sm:inline">Deen Explorers</span>
          </button>
        )}

        {/* Profile */}
        <button
          onClick={onOpenSettings}
          className="rounded-lg p-2 text-emerald-900 transition-colors hover:bg-emerald-900/10"
          aria-label="Open profile"
        >
          <UserCircle className="h-5 w-5" />
        </button>

        {/* User name + sign out */}
        {userName && (
          <div className="flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white/70 px-3 py-1.5">
            <UserCircle className="h-4 w-4 text-emerald-700" />
            <span className="hidden text-xs font-medium text-emerald-900/80 sm:inline">
              {userName}
            </span>
            {onSignOut && (
              <button
                onClick={onSignOut}
                className="rounded-md p-1 text-emerald-700/60 transition-colors hover:bg-emerald-900/10 hover:text-emerald-900"
                aria-label="Sign out"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

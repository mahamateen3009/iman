import { useMemo, useState } from 'react';
import {
  X,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Star,
  Moon,
} from 'lucide-react';

interface IslamicCalendarModalProps {
  open: boolean;
  onClose: () => void;
}

interface IslamicEvent {
  hijriMonth: number; // 1-12 (Muharram=1 ... Dhul-Hijjah=12)
  hijriDay: number;
  title: string;
  description: string;
  type: 'major' | 'recommended' | 'seasonal';
}

// Authentic Islamic observances keyed by Hijri month/day.
// These follow the established, well-documented Islamic calendar.
const ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    hijriMonth: 1,
    hijriDay: 1,
    title: 'Islamic New Year (Hijri)',
    description:
      'Marks the beginning of the Islamic lunar calendar, commemorating the Hijra — the Prophet Muhammad \ufdfa migration from Makkah to Madinah in 622 CE. A time for reflection on renewal, patience, and the sacrifices made to establish the Muslim community.',
    type: 'major',
  },
  {
    hijriMonth: 1,
    hijriDay: 10,
    title: 'Day of Ashura',
    description:
      'The 10th of Muharram. The Prophet Musa (as) and his people were saved from Pharaoh on this day. The Prophet \ufdfa recommended fasting on Ashura, which expiates the sins of the preceding year. A day of gratitude and reflection on deliverance.',
    type: 'major',
  },
  {
    hijriMonth: 3,
    hijriDay: 12,
    title: 'Mawlid an-Nabi',
    description:
      'The 12th of Rabi al-Awwal, traditionally observed as the birthday of the Prophet Muhammad \ufdfa. Many Muslims use this occasion to reflect on his life, character (akhlaq), and teachings, and to increase salutations upon him.',
    type: 'seasonal',
  },
  {
    hijriMonth: 7,
    hijriDay: 1,
    title: 'Start of Rajab',
    description:
      'Rajab is one of the four sacred months in Islam. It marks the beginning of the spiritually significant "three months" leading to Ramadan — a time to increase voluntary worship, seek forgiveness, and prepare the heart for Ramadan.',
    type: 'recommended',
  },
  {
    hijriMonth: 7,
    hijriDay: 27,
    title: 'Laylat al-Mi\u2019raj (Shab-e-Mi\u2019raj)',
    description:
      'Commemorates the Night Journey (Isra) and Ascension (Mi\u2019raj) of the Prophet \ufdfa from Makkah to Jerusalem and then through the heavens. A night to reflect on the gift of salah (prayer) and the proximity of the believer to Allah.',
    type: 'recommended',
  },
  {
    hijriMonth: 8,
    hijriDay: 1,
    title: 'Start of Sha\u2019ban',
    description:
      'Sha\u2019ban is the month of preparation before Ramadan. The Prophet \ufdfa fasted much of Sha\u2019ban. It is a time to build good habits, increase Quran recitation, and ready oneself physically and spiritually for the blessed month.',
    type: 'recommended',
  },
  {
    hijriMonth: 8,
    hijriDay: 15,
    title: 'Laylat al-Bara\u2019ah (Shab-e-Barat)',
    description:
      'The 15th night of Sha\u2019ban. Many Muslims spend it in prayer, recitation, and seeking forgiveness, believing Allah\u2019s mercy is especially near. A night to reflect on one\u2019s deeds, seek pardon, and remember those who have passed on.',
    type: 'recommended',
  },
  {
    hijriMonth: 9,
    hijriDay: 1,
    title: 'First Day of Ramadan',
    description:
      'The beginning of the holy month of fasting. Ramadan is the month in which the Quran was first revealed. Muslims fast from dawn to sunset, increase prayer and charity, and seek Allah\u2019s pleasure and forgiveness throughout the month.',
    type: 'major',
  },
  {
    hijriMonth: 9,
    hijriDay: 27,
    title: 'Laylat al-Qadr (likely)',
    description:
      'The Night of Power, "better than a thousand months" (Quran 97:3). Most scholars locate it in the last ten odd nights of Ramadan, with the 27th being the most commonly observed. The night the Quran was revealed — worship on it is rewarded beyond measure.',
    type: 'major',
  },
  {
    hijriMonth: 10,
    hijriDay: 1,
    title: 'Eid al-Fitr',
    description:
      'The festival marking the end of Ramadan. Muslims gather for the Eid prayer, give Zakat al-Fitr to those in need, share meals with family and community, and express gratitude to Allah for the strength to complete the fast.',
    type: 'major',
  },
  {
    hijriMonth: 12,
    hijriDay: 8,
    title: 'Day of Tarwiyah (Hajj begins)',
    description:
      'The 8th of Dhul-Hijjah, the first formal day of Hajj. Pilgrims begin their journey to Mina. For non-pilgrims, it marks the start of the Days of Hajj — a recommended time to begin fasting the first nine days of Dhul-Hijjah.',
    type: 'recommended',
  },
  {
    hijriMonth: 12,
    hijriDay: 9,
    title: 'Day of Arafah',
    description:
      'The climax of Hajj, when pilgrims stand on the plain of Arafah. For non-pilgrims, fasting this day is highly recommended — the Prophet \ufdfa said it expiates the sins of the previous and coming year. A day of intense dua and seeking Allah\u2019s mercy.',
    type: 'major',
  },
  {
    hijriMonth: 12,
    hijriDay: 10,
    title: 'Eid al-Adha',
    description:
      'The Festival of Sacrifice, commemorating the willingness of Prophet Ibrahim (as) to sacrifice his son in obedience to Allah. Muslims offer the Udhiyah (Qurbani) sacrifice, distribute meat to family and the needy, and gather for the Eid prayer.',
    type: 'major',
  },
  {
    hijriMonth: 12,
    hijriDay: 11,
    title: 'Days of Tashreeq',
    description:
      'The 11th\u201313th of Dhul-Hijjah, days of eating, drinking, and remembrance of Allah following Eid al-Adha. Pilgrims complete the stoning of the Jamarat. For non-pilgrims, these are days of Takbeer and continued celebration of Eid.',
    type: 'seasonal',
  },
];

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  "Rabi\u2019 al-Awwal",
  "Rabi\u2019 ath-Thani",
  'Jumada al-Ula',
  'Jumada ath-Thani',
  'Rajab',
  "Sha\u2019ban",
  'Ramadan',
  'Shawwal',
  "Dhu\u2019l-Qa\u2019dah",
  "Dhu\u2019l-Hijjah",
];

const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TYPE_STYLES: Record<IslamicEvent['type'], string> = {
  major: 'bg-gradient-to-br from-emerald-700 to-emerald-900 text-cream-50 dark:from-gold-400 dark:to-gold-600 dark:text-ink-900',
  recommended: 'bg-emerald-700/15 text-emerald-800 dark:bg-gold-400/15 dark:text-gold-300',
  seasonal: 'bg-ink-200/50 text-ink-600 dark:bg-ink-600/40 dark:text-ink-300',
};

const TYPE_DOT: Record<IslamicEvent['type'], string> = {
  major: 'bg-emerald-700 dark:bg-gold-400',
  recommended: 'bg-emerald-500/70 dark:bg-gold-300/70',
  seasonal: 'bg-ink-400 dark:bg-ink-500',
};

const TYPE_LABEL: Record<IslamicEvent['type'], string> = {
  major: 'Major observance',
  recommended: 'Recommended',
  seasonal: 'Seasonal',
};

// Convert a Gregorian date to its Hijri month/day/year using the built-in
// Intl calendar API. This computes the Umm al-Qura tabular Hijri date and
// updates automatically as the actual date changes — no static data needed.
function toHijri(date: Date): { day: number; month: number; year: number } {
  try {
    const parts = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    }).formatToParts(date);
    const day = Number(parts.find((p) => p.type === 'day')?.value ?? 1);
    const month = Number(parts.find((p) => p.type === 'month')?.value ?? 1);
    const year = Number(parts.find((p) => p.type === 'year')?.value ?? 1446);
    return { day, month, year };
  } catch {
    // Fallback: approximate Hijri year only (rare — Intl is widely supported).
    return { day: 1, month: 1, year: 1446 };
  }
}

function formatHijriLong(date: Date): string {
  try {
    return new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return '';
  }
}

function eventsOnHijri(month: number, day: number): IslamicEvent[] {
  return ISLAMIC_EVENTS.filter((e) => e.hijriMonth === month && e.hijriDay === day);
}

function isSameGregorianDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function IslamicCalendarModal({ open, onClose }: IslamicCalendarModalProps) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<Date | null>(today);

  const todayHijri = useMemo(() => toHijri(today), [today]);
  const todayEvents = useMemo(
    () => eventsOnHijri(todayHijri.month, todayHijri.day),
    [todayHijri]
  );

  const calendarCells = useMemo(() => {
    const firstOfMonth = new Date(viewYear, viewMonth, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

    const cells: Array<{ date: Date | null }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ date: null });
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(viewYear, viewMonth, d) });
    }
    // Pad to a multiple of 7 for a clean grid.
    while (cells.length % 7 !== 0) cells.push({ date: null });
    return cells;
  }, [viewYear, viewMonth]);

  // Pre-compute Hijri month/day for every cell so events can be shown inline.
  const cellHijri = useMemo(
    () =>
      calendarCells.map((c) => (c.date ? toHijri(c.date) : null)),
    [calendarCells]
  );

  const selectedHijri = useMemo(
    () => (selectedDay ? toHijri(selectedDay) : null),
    [selectedDay]
  );
  const selectedEvents = useMemo(
    () => (selectedHijri ? eventsOnHijri(selectedHijri.month, selectedHijri.day) : []),
    [selectedHijri]
  );

  // Upcoming events: scan the next ~60 Gregorian days for the next few events.
  const upcoming = useMemo(() => {
    const list: Array<{ date: Date; event: IslamicEvent }> = [];
    const scan = new Date();
    for (let i = 0; i < 60 && list.length < 4; i++) {
      const d = new Date(scan.getFullYear(), scan.getMonth(), scan.getDate() + i);
      const h = toHijri(d);
      for (const ev of eventsOnHijri(h.month, h.day)) {
        if (i === 0) continue; // today handled separately
        list.push({ date: d, event: ev });
        break;
      }
    }
    return list;
  }, []);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };
  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };
  const goToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setSelectedDay(today);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-3xl animate-fade-in-up flex-col overflow-hidden rounded-2xl border border-emerald-900/12 bg-cream-50 shadow-card dark:border-gold-400/15 dark:bg-ink-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/10 bg-gradient-to-r from-emerald-800/8 to-gold-400/8 px-5 py-4 dark:border-gold-400/12 dark:from-emerald-700/12 dark:to-gold-400/8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700/12 text-emerald-800 dark:bg-gold-400/12 dark:text-gold-300">
              <CalendarDays className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-emerald-900 dark:text-cream-50">
                Islamic Calendar
              </h2>
              <p className="text-[11px] text-emerald-900/60 dark:text-ink-300">
                Hijri & Gregorian dates with authentic observances
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-emerald-900/60 transition-colors hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10"
            aria-label="Close calendar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Today banner */}
        <div className="border-b border-emerald-900/8 px-5 py-3 dark:border-gold-400/8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-900/50 dark:text-ink-400">
                Today
              </p>
              <p className="font-serif text-base font-semibold text-emerald-900 dark:text-cream-50">
                {today.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-800/80 dark:text-gold-200">
                <Moon className="h-3 w-3" />
                {formatHijriLong(today)} AH
              </p>
            </div>
            <button
              onClick={goToday}
              className="rounded-lg border border-emerald-700/25 bg-emerald-700/8 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-all hover:bg-emerald-700/15 dark:border-gold-400/25 dark:bg-gold-400/10 dark:text-gold-300 dark:hover:bg-gold-400/15"
            >
              Jump to today
            </button>
          </div>
          {todayEvents.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {todayEvents.map((ev) => (
                <span
                  key={ev.title}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${TYPE_STYLES[ev.type]}`}
                >
                  <Star className="h-3 w-3" />
                  {ev.title}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="grid min-h-0 flex-1 gap-0 overflow-y-auto md:grid-cols-[1.4fr_1fr]">
          {/* Calendar grid */}
          <div className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <button
                onClick={goPrevMonth}
                className="rounded-lg p-1.5 text-emerald-900/70 transition-colors hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <h3 className="font-serif text-base font-bold text-emerald-900 dark:text-cream-50">
                {GREGORIAN_MONTHS[viewMonth]} {viewYear}
              </h3>
              <button
                onClick={goNextMonth}
                className="rounded-lg p-1.5 text-emerald-900/70 transition-colors hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10"
                aria-label="Next month"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-1.5 grid grid-cols-7 gap-1">
              {WEEKDAYS.map((w) => (
                <div key={w} className="text-center text-[10px] font-semibold uppercase tracking-wide text-emerald-900/50 dark:text-ink-400">
                  {w}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarCells.map((cell, i) => {
                if (!cell.date) {
                  return <div key={i} className="aspect-square" />;
                }
                const h = cellHijri[i]!;
                const evs = eventsOnHijri(h.month, h.day);
                const isToday = isSameGregorianDay(cell.date, today);
                const isSelected = selectedDay ? isSameGregorianDay(cell.date, selectedDay) : false;
                const primaryEvent = evs[0];
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedDay(cell.date)}
                    className={`group relative flex aspect-square flex-col items-center justify-start rounded-lg border p-1 transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-700/12 ring-1 ring-emerald-600/30 dark:border-gold-400 dark:bg-gold-400/12 dark:ring-gold-400/30'
                        : isToday
                        ? 'border-emerald-700/40 bg-emerald-700/6 dark:border-gold-400/40 dark:bg-gold-400/6'
                        : 'border-transparent hover:border-emerald-900/15 hover:bg-emerald-900/6 dark:hover:border-gold-400/15 dark:hover:bg-gold-400/6'
                    }`}
                  >
                    <span
                      className={`mt-0.5 text-sm font-bold leading-none ${
                        isToday
                          ? 'text-emerald-800 dark:text-gold-300'
                          : 'text-emerald-900/80 dark:text-ink-200'
                      }`}
                    >
                      {cell.date.getDate()}
                    </span>
                    <span className="mt-0.5 text-[9px] leading-none text-emerald-900/45 dark:text-ink-400">
                      {h.day}
                    </span>
                    {primaryEvent && (
                      <span className={`mt-1 h-1.5 w-1.5 rounded-full ${TYPE_DOT[primaryEvent.type]}`} aria-hidden />
                    )}
                    {primaryEvent && (
                      <span className="mt-0.5 line-clamp-1 w-full text-center text-[7px] font-semibold leading-tight text-emerald-800 dark:text-gold-300">
                        {primaryEvent.title}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {(['major', 'recommended', 'seasonal'] as const).map((t) => (
                <div key={t} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${TYPE_DOT[t]}`} />
                  <span className="text-[10px] font-medium text-emerald-900/60 dark:text-ink-400">
                    {TYPE_LABEL[t]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar: selected day + upcoming */}
          <div className="border-t border-emerald-900/8 bg-white/40 p-5 dark:border-gold-400/8 dark:bg-ink-700/30">
            {selectedDay && selectedHijri && (
              <div className="mb-5">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-900/50 dark:text-ink-400">
                  Selected day
                </p>
                <p className="font-serif text-sm font-bold text-emerald-900 dark:text-cream-50">
                  {selectedDay.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-emerald-800/80 dark:text-gold-200">
                  <Moon className="h-3 w-3" />
                  {HIJRI_MONTHS[selectedHijri.month - 1]} {selectedHijri.day}, {selectedHijri.year} AH
                </p>

                {selectedEvents.length > 0 ? (
                  <div className="mt-3 space-y-2.5">
                    {selectedEvents.map((ev) => (
                      <EventCard key={ev.title} event={ev} />
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 rounded-lg bg-emerald-900/5 px-3 py-2 text-[11px] italic text-emerald-900/50 dark:bg-gold-400/5 dark:text-ink-400">
                    No special Islamic observance on this date.
                  </p>
                )}
              </div>
            )}

            {upcoming.length > 0 && (
              <div>
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-900/50 dark:text-ink-400">
                  Coming up
                </p>
                <ul className="space-y-2">
                  {upcoming.map(({ date, event }) => (
                    <li key={date.toISOString() + event.title}>
                      <button
                        onClick={() => {
                          setViewYear(date.getFullYear());
                          setViewMonth(date.getMonth());
                          setSelectedDay(date);
                        }}
                        className="w-full rounded-lg border border-emerald-900/10 bg-white/60 px-3 py-2 text-left transition-colors hover:bg-emerald-900/8 dark:border-gold-400/10 dark:bg-ink-700/40 dark:hover:bg-gold-400/8"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-emerald-800 dark:text-gold-300">
                            {date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                          </span>
                          <span className={`h-2 w-2 rounded-full ${TYPE_DOT[event.type]}`} />
                        </div>
                        <p className="mt-0.5 text-xs font-medium text-emerald-900/80 dark:text-ink-200">
                          {event.title}
                        </p>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventCard({ event }: { event: IslamicEvent }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl border border-emerald-900/12 bg-white/70 p-3 transition-all hover:shadow-soft dark:border-gold-400/12 dark:bg-ink-700/50"
    >
      <div className="flex items-start gap-2">
        <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${TYPE_DOT[event.type]}`} />
        <div className="min-w-0">
          <p className="text-xs font-bold text-emerald-900 dark:text-cream-50">
            {event.title}
          </p>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-900/45 dark:text-ink-400">
            {TYPE_LABEL[event.type]}
          </p>
        </div>
      </div>
      {hovered && (
        <p className="mt-2.5 animate-fade-in border-t border-emerald-900/8 pt-2.5 text-[11px] leading-relaxed text-emerald-900/80 dark:border-gold-400/8 dark:text-ink-200">
          {event.description}
        </p>
      )}
    </div>
  );
}

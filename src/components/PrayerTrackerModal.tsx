import { useCallback, useEffect, useMemo, useState } from 'react';
import { Bell, BellOff, Check, ChevronLeft, ChevronRight, CloudSun, Moon, Save, Sun, Sunrise, Sunset, X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface PrayerTrackerModalProps { open: boolean; onClose: () => void; userId: string; }
interface PrayerDay { id: string; prayer_date: string; fajr: boolean; dhuhr: boolean; asr: boolean; maghrib: boolean; isha: boolean; }
interface ReminderSettings { id?: string; enabled: boolean; sound_enabled: boolean; fajr_time: string; dhuhr_time: string; asr_time: string; maghrib_time: string; isha_time: string; }

const PRAYERS = [
  { key: 'fajr', label: 'Fajr', icon: Sunrise, hint: 'Dawn' },
  { key: 'dhuhr', label: 'Dhuhr', icon: Sun, hint: 'Noon' },
  { key: 'asr', label: 'Asr', icon: CloudSun, hint: 'Afternoon' },
  { key: 'maghrib', label: 'Maghrib', icon: Sunset, hint: 'Sunset' },
  { key: 'isha', label: 'Isha', icon: Moon, hint: 'Night' },
] as const;
type PrayerKey = (typeof PRAYERS)[number]['key'];
const COLUMNS = 'id, prayer_date, fajr, dhuhr, asr, maghrib, isha';
const DEFAULT_REMINDERS: ReminderSettings = { enabled: false, sound_enabled: true, fajr_time: '05:30', dhuhr_time: '12:30', asr_time: '15:45', maghrib_time: '18:30', isha_time: '20:00' };

function todayStr(date = new Date()): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`; }
function dayLabel(dateStr: string): string { return new Date(`${dateStr}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }); }
function formatTime(time: string): string { const [hours, minutes] = time.split(':').map(Number); return new Date(2000, 0, 1, hours, minutes).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }
function playAlertSound(): void { const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 660; gain.gain.setValueAtTime(0.08, context.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.5); oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + 0.5); void oscillator.addEventListener('ended', () => void context.close()); }

export function PrayerTrackerModal({ open, onClose, userId }: PrayerTrackerModalProps) {
  const [today, setToday] = useState<PrayerDay | null>(null);
  const [history, setHistory] = useState<PrayerDay[]>([]);
  const [weekStats, setWeekStats] = useState<PrayerDay[]>([]);
  const [month, setMonth] = useState(() => new Date());
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [showReminders, setShowReminders] = useState(false);
  const [loading, setLoading] = useState(false);
  const [savingReminders, setSavingReminders] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true); setError(null);
    const todayDate = todayStr();
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const last = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const { data: todayRow, error: todayErr } = await supabase.from('prayer_tracker').select(COLUMNS).eq('user_id', userId).eq('prayer_date', todayDate).maybeSingle();
    if (todayErr) { setError(todayErr.message); setLoading(false); return; }
    if (!todayRow) {
      const { data: inserted, error: insertErr } = await supabase.from('prayer_tracker').insert({ prayer_date: todayDate }).select(COLUMNS).maybeSingle();
      if (insertErr) { setError(insertErr.message); setLoading(false); return; }
      setToday(inserted as PrayerDay | null);
    } else setToday(todayRow as PrayerDay);
    const { data: rows, error: historyErr } = await supabase.from('prayer_tracker').select(COLUMNS).eq('user_id', userId).gte('prayer_date', todayStr(first)).lte('prayer_date', todayStr(last)).order('prayer_date', { ascending: true });
    if (historyErr) setError(historyErr.message);
    setHistory((rows as PrayerDay[]) ?? []);
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 6);
    const { data: statsRows } = await supabase.from('prayer_tracker').select(COLUMNS).eq('user_id', userId).gte('prayer_date', todayStr(weekStart)).lte('prayer_date', todayDate).order('prayer_date', { ascending: true });
    setWeekStats((statsRows as PrayerDay[]) ?? []);
    const { data: reminderRow, error: reminderErr } = await supabase.from('prayer_reminders').select('id, enabled, sound_enabled, fajr_time, dhuhr_time, asr_time, maghrib_time, isha_time').eq('user_id', userId).maybeSingle();
    if (reminderErr) setError(reminderErr.message);
    if (reminderRow) setReminders(reminderRow as ReminderSettings);
    setLoading(false);
  }, [month, userId]);

  useEffect(() => { if (open) void load(); }, [open, load]);

  const toggle = useCallback(async (key: PrayerKey) => {
    if (!today) return;
    const next = !today[key]; const optimistic = { ...today, [key]: next };
    setToday(optimistic); setHistory((previous) => previous.map((day) => day.id === today.id ? optimistic : day));
    const { error: updateErr } = await supabase.from('prayer_tracker').update({ [key]: next, updated_at: new Date().toISOString() }).eq('id', today.id);
    if (updateErr) { setError(updateErr.message); setToday(today); setHistory((previous) => previous.map((day) => day.id === today.id ? today : day)); }
  }, [today]);

  const saveReminders = async () => {
    if (!userId) return;
    setSavingReminders(true); setNotice(null); setError(null);
    if (reminders.enabled && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') { setReminders((current) => ({ ...current, enabled: false })); setError('Notifications are blocked in this browser. You can enable them in browser settings.'); setSavingReminders(false); return; }
    }
    const { data, error: saveErr } = await supabase.from('prayer_reminders').upsert({ ...reminders, user_id: userId, updated_at: new Date().toISOString() }, { onConflict: 'user_id' }).select('id, enabled, fajr_time, dhuhr_time, asr_time, maghrib_time, isha_time').maybeSingle();
    if (saveErr) setError(saveErr.message); else { setReminders(data as ReminderSettings); setNotice(reminders.enabled ? 'Daily prayer reminders are on for this device.' : 'Daily prayer reminders are off.'); }
    setSavingReminders(false);
  };

  useEffect(() => {
    if (!reminders.enabled || !('Notification' in window) || Notification.permission !== 'granted') return;
    const timer = window.setInterval(() => {
      const now = new Date(); const current = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const prayer = PRAYERS.find((item) => reminders[`${item.key}_time` as keyof ReminderSettings] === current);
        if (prayer) { if (reminders.sound_enabled) playAlertSound(); new Notification(`${prayer.label} prayer`, { body: `It is time for ${prayer.label}. Take a peaceful moment for salah.` }); }
    }, 60000);
    return () => window.clearInterval(timer);
  }, [reminders]);

  const completedToday = today ? [today.fajr, today.dhuhr, today.asr, today.maghrib, today.isha].filter(Boolean).length : 0;
  const streak = useMemo(() => {
    const complete = (day: PrayerDay) => day.fajr && day.dhuhr && day.asr && day.maghrib && day.isha;
    let count = 0;
    const sorted = [...history].sort((a, b) => a.prayer_date.localeCompare(b.prayer_date));
    for (let i = sorted.length - 1; i >= 0; i -= 1) { if (complete(sorted[i])) count += 1; else if (sorted[i].prayer_date !== todayStr()) break; }
    return count;
  }, [history]);
  const historyByDate = useMemo(() => new Map(history.map((day) => [day.prayer_date, day])), [history]);
  const weeklyPrayerCount = weekStats.reduce((total, day) => total + [day.fajr, day.dhuhr, day.asr, day.maghrib, day.isha].filter(Boolean).length, 0);
  const weeklyPossible = weekStats.length * 5;
  const calendarDays = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1); const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const leading = first.getDay(); return [...Array(leading).fill(null), ...Array.from({ length: total }, (_, index) => `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(index + 1).padStart(2, '0')}`)];
  }, [month]);
  const monthLabel = month.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-label="Close prayer tracker" />
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-lg animate-fade-in-up flex-col overflow-hidden rounded-2xl border border-emerald-900/12 bg-cream-50 shadow-card dark:border-gold-400/15 dark:bg-ink-800">
        <div className="flex shrink-0 items-center justify-between border-b border-emerald-900/8 p-6 pb-4 dark:border-gold-400/10">
          <div className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-900/10 text-emerald-800 dark:bg-gold-400/12 dark:text-gold-300"><Moon className="h-5 w-5" /></span><div><h2 className="font-serif text-lg font-bold text-emerald-900 dark:text-cream-50">Prayer Tracker</h2><p className="text-[11px] text-emerald-900/50 dark:text-ink-400">Build consistency, one salah at a time</p></div></div>
          <button onClick={onClose} className="rounded-lg p-2 text-emerald-900/60 hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10" aria-label="Close"><X className="h-4 w-4" /></button>
        </div>
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-6">
          {error && <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-300">{error}</p>}
          {notice && <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-900/20 dark:text-gold-300">{notice}</p>}
          <div className="mb-5 rounded-xl border border-emerald-900/10 bg-white/50 p-4 dark:border-gold-400/10 dark:bg-ink-700/30"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-emerald-900 dark:text-cream-50">Today</p><p className="text-xs text-emerald-700/70 dark:text-gold-300/70">{completedToday}/5 completed</p></div><div className="grid grid-cols-5 gap-2">{PRAYERS.map((prayer) => { const done = today ? today[prayer.key] : false; const Icon = prayer.icon; return <button key={prayer.key} onClick={() => toggle(prayer.key)} disabled={!today || loading} className={`relative flex flex-col items-center gap-1.5 rounded-xl border py-3 transition-all ${done ? 'border-emerald-600 bg-emerald-600 text-cream-50 dark:border-gold-400 dark:bg-gold-500 dark:text-ink-900' : 'border-emerald-900/10 bg-cream-50 text-emerald-900/70 hover:border-emerald-700/30 hover:bg-emerald-700/5 dark:border-gold-400/10 dark:bg-ink-800/50 dark:text-ink-300'}`} aria-pressed={done} aria-label={`Mark ${prayer.label}`}><Icon className="h-5 w-5" /><span className="text-[11px] font-medium leading-none">{prayer.label}</span>{done && <Check className="absolute right-1 top-1 h-3 w-3 opacity-80" />}</button>; })}</div>{completedToday === 5 && <p className="mt-3 text-center text-xs font-medium text-emerald-700 dark:text-gold-300">Masha'Allah — all five prayers complete today.</p>}</div>
          <div className="mb-5 flex items-center justify-between rounded-xl border border-gold-400/20 bg-gradient-to-r from-emerald-700/10 to-gold-400/10 px-4 py-3"><div className="flex items-center gap-2"><Moon className="h-5 w-5 text-gold-600 dark:text-gold-300" /><span className="text-sm font-semibold text-emerald-900 dark:text-cream-50">{streak}-day streak</span></div><span className="text-[11px] text-emerald-700/70 dark:text-gold-300/70">Complete all five each day</span></div>
          <div className="mb-5 rounded-xl border border-emerald-900/10 bg-white/50 p-4 dark:border-gold-400/10 dark:bg-ink-700/30"><div className="mb-3 flex items-center justify-between"><p className="text-sm font-semibold text-emerald-900 dark:text-cream-50">This week</p><span className="text-xs font-semibold text-emerald-700 dark:text-gold-300">{weeklyPrayerCount}/{weeklyPossible || 35} prayers</span></div><div className="mb-4 h-2 overflow-hidden rounded-full bg-emerald-900/10 dark:bg-ink-600"><div className="h-full rounded-full bg-emerald-600 transition-all dark:bg-gold-400" style={{ width: `${weeklyPossible ? Math.round((weeklyPrayerCount / weeklyPossible) * 100) : 0}%` }} /></div><div className="grid grid-cols-7 gap-1">{weekStats.map((day) => { const count = [day.fajr, day.dhuhr, day.asr, day.maghrib, day.isha].filter(Boolean).length; return <div key={day.id} className="text-center"><div className={`mx-auto h-2 w-2 rounded-full ${count === 5 ? 'bg-emerald-600 dark:bg-gold-400' : count > 0 ? 'bg-gold-400' : 'bg-emerald-900/15 dark:bg-ink-600'}`} /><p className="mt-1 text-[9px] text-emerald-900/55 dark:text-ink-400">{new Date(`${day.prayer_date}T00:00:00`).toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 2)}</p></div>; })}</div></div>
          <div className="mb-5 rounded-xl border border-emerald-900/10 bg-white/50 p-4 dark:border-gold-400/10 dark:bg-ink-700/30"><div className="mb-3 flex items-center justify-between"><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))} className="rounded-lg p-1.5 text-emerald-800 hover:bg-emerald-900/10 dark:text-gold-300" aria-label="Previous month"><ChevronLeft className="h-4 w-4" /></button><p className="text-sm font-semibold text-emerald-900 dark:text-cream-50">{monthLabel}</p><button onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))} className="rounded-lg p-1.5 text-emerald-800 hover:bg-emerald-900/10 dark:text-gold-300" aria-label="Next month"><ChevronRight className="h-4 w-4" /></button></div><div className="mb-2 grid grid-cols-7 text-center text-[10px] font-semibold uppercase text-emerald-900/45 dark:text-ink-400">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => <span key={day}>{day.slice(0, 2)}</span>)}</div><div className="grid grid-cols-7 gap-1.5">{calendarDays.map((date, index) => { if (!date) return <span key={`empty-${index}`} />; const record = historyByDate.get(date); const count = record ? [record.fajr, record.dhuhr, record.asr, record.maghrib, record.isha].filter(Boolean).length : 0; const isToday = date === todayStr(); return <div key={date} title={`${dayLabel(date)} · ${count}/5 prayers`} className={`flex min-h-10 flex-col items-center justify-center rounded-lg border text-xs ${isToday ? 'border-emerald-600 ring-1 ring-emerald-600/30' : 'border-transparent'} ${count === 5 ? 'bg-emerald-600 text-white' : count > 0 ? 'bg-gold-400/35 text-emerald-900' : 'bg-emerald-900/5 text-emerald-900/55 dark:bg-ink-800/50 dark:text-ink-400'}`}><span>{Number(date.slice(-2))}</span><span className="text-[9px] font-semibold">{count}/5</span></div>; })}</div><div className="mt-3 flex items-center justify-center gap-3 text-[10px] text-emerald-900/55 dark:text-ink-400"><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-600" />5/5</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-gold-400" />Partial</span><span><i className="mr-1 inline-block h-2 w-2 rounded-full bg-emerald-900/10" />Not tracked</span></div></div>
          <button onClick={() => setShowReminders((value) => !value)} className="mb-3 flex w-full items-center justify-between rounded-xl border border-emerald-900/10 bg-white/50 px-4 py-3 text-left dark:border-gold-400/10 dark:bg-ink-700/30"><span className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-cream-50">{reminders.enabled ? <Bell className="h-4 w-4 text-emerald-700 dark:text-gold-300" /> : <BellOff className="h-4 w-4 text-emerald-900/50 dark:text-ink-400" />} Daily prayer reminders</span><span className="text-xs text-emerald-700/65 dark:text-gold-300/65">{showReminders ? 'Hide' : reminders.enabled ? 'On' : 'Set up'}</span></button>
          {showReminders && <div className="mb-5 rounded-xl border border-emerald-900/10 bg-white/50 p-4 dark:border-gold-400/10 dark:bg-ink-700/30"><label className="mb-3 flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-cream-50">Notify me for each prayer<input type="checkbox" checked={reminders.enabled} onChange={(event) => setReminders((current) => ({ ...current, enabled: event.target.checked }))} className="h-4 w-4 accent-emerald-700" /></label><label className="mb-4 flex items-center justify-between text-xs text-emerald-900/75 dark:text-ink-200">Play a sound with reminders<input type="checkbox" checked={reminders.sound_enabled} onChange={(event) => setReminders((current) => ({ ...current, sound_enabled: event.target.checked }))} className="h-4 w-4 accent-emerald-700" /></label><div className="grid grid-cols-2 gap-2">{PRAYERS.map((prayer) => { const time = reminders[`${prayer.key}_time` as keyof ReminderSettings] as string; return <label key={prayer.key} className="flex items-center justify-between rounded-lg bg-emerald-900/5 px-3 py-2 text-xs text-emerald-900 dark:bg-ink-800/50 dark:text-ink-200"><span>{prayer.label}<span className="ml-1 text-[10px] text-emerald-900/50 dark:text-ink-400">{formatTime(time)}</span></span><input type="time" value={time} onChange={(event) => setReminders((current) => ({ ...current, [`${prayer.key}_time`]: event.target.value }))} className="rounded border border-emerald-900/15 bg-white px-1 py-0.5 text-xs text-emerald-900 dark:border-gold-400/15 dark:bg-ink-700 dark:text-cream-50" /></label>; })}</div><button onClick={() => void saveReminders()} disabled={savingReminders} className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"><Save className="h-3.5 w-3.5" />{savingReminders ? 'Saving…' : 'Save reminder settings'}</button><p className="mt-2 text-[10px] leading-relaxed text-emerald-900/50 dark:text-ink-400">Reminders work while this app is open in this browser. Your schedule is saved to your account.</p></div>}
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-emerald-900/50 dark:text-ink-400">Recent history</p>{history.length === 0 ? <p className="text-xs text-emerald-900/50 dark:text-ink-400">No history yet. Start tracking today.</p> : <ul className="space-y-1.5">{history.slice(-7).reverse().map((day) => { const count = [day.fajr, day.dhuhr, day.asr, day.maghrib, day.isha].filter(Boolean).length; return <li key={day.id} className="flex items-center justify-between rounded-lg border border-emerald-900/8 bg-white/40 px-3 py-2 dark:border-gold-400/8 dark:bg-ink-700/30"><span className="text-xs font-medium text-emerald-900/80 dark:text-ink-200">{dayLabel(day.prayer_date)}</span><span className="text-[11px] font-semibold text-emerald-700/70 dark:text-gold-300/70">{count}/5</span></li>; })}</ul>}
        </div>
      </div>
    </div>
  );
}

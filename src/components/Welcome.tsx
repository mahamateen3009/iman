import { Sparkles, Heart, BookOpen, HandHeart } from 'lucide-react';

interface WelcomeProps {
  onQuickStart: (prompt: string) => void;
  userName?: string;
}

const SUGGESTIONS = [
  { label: 'Feeling anxious', prompt: 'I have been feeling really anxious lately and my mind wont stop racing.', icon: Heart },
  { label: 'Need daily motivation', prompt: 'I need motivation to build better daily habits and stop procrastinating.', icon: Sparkles },
  { label: 'Seeking patience', prompt: 'I am going through a difficult trial and I need help finding patience.', icon: BookOpen },
  { label: 'Overcoming fear', prompt: 'I am struggling with fear and I want to overcome it with faith.', icon: HandHeart },
];

export function Welcome({ onQuickStart, userName }: WelcomeProps) {
  const greeting = userName
    ? `As-salamu alaykum ${userName}! How have you been?`
    : 'As-salamu alaykum';

  return (
    <div className="animate-fade-in flex flex-col items-center justify-center px-6 py-16 text-center">
      <h2 className="mb-2 font-serif text-3xl font-bold text-emerald-900 dark:text-cream-50">
        {greeting}
      </h2>
      <p className="mb-1 text-lg text-gold-600 dark:text-gold-300">
        Peace be upon you
      </p>
      <p className="mb-8 max-w-md text-sm leading-relaxed text-emerald-900/60 dark:text-ink-300">
        I am Iman — here to listen with empathy and share authentic
        Islamic guidance for the challenges of your day. What is on your heart today?
      </p>

      <div className="grid w-full max-w-lg gap-3 sm:grid-cols-2">
        {SUGGESTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.label}
              onClick={() => onQuickStart(s.prompt)}
              className="group flex items-center gap-3 rounded-xl border border-emerald-900/10 bg-white/70 px-4 py-3 text-left transition-all hover:border-emerald-700/30 hover:shadow-card dark:border-gold-400/12 dark:bg-ink-800/60 dark:hover:border-gold-400/30"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-900/8 text-emerald-800 transition-colors group-hover:bg-emerald-700/15 dark:bg-gold-400/10 dark:text-gold-300">
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="text-sm font-medium text-emerald-900 dark:text-cream-50">
                {s.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

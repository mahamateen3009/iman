import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import {
  X,
  Gamepad2,
  Lock,
  Check,
  ChevronLeft,
  Trophy,
  Shield,
  Sword,
  Sparkles,
  RotateCcw,
  BookOpen,
  Send,
  PartyPopper,
  ArrowRight,
  Star,
  Cloud,
  CloudRain,
  Compass,
  Crown,
  Feather,
  Flag,
  Flower2,
  Footprints,
  Gem,
  Gift,
  Hand,
  HandHeart,
  Heart,
  Home,
  Map as MapIcon,
  Medal,
  Moon,
  Scroll,
  Smile,
  Snowflake,
  Sun,
  TreePine,
  Wind,
  Award,
} from 'lucide-react';
import curriculumData from '../data/kids_curriculum.json';
import {
  tierForAge,
  REWARDS,
  type Curriculum,
  type CurriculumLevel,
  type CurriculumTier,
  type GameProgress,
  type TierId,
} from '../types/curriculum';
import { ensureGameProgress, saveGameProgress } from '../lib/gameProgress';
import { evaluateAnswer, evaluateMCQ, type EvaluationResult } from '../lib/questEvaluator';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';

const CURRICULUM = curriculumData as unknown as Curriculum;

const LEVEL_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  Award,
  BookOpen,
  Cloud,
  CloudRain,
  Compass,
  Crown,
  Feather,
  Flag,
  Flower2,
  Footprints,
  Gem,
  Gift,
  Hand,
  HandHeart,
  Heart,
  Home,
  Map: MapIcon,
  Medal,
  Moon,
  Scroll,
  Shield,
  Smile,
  Snowflake,
  Sparkles,
  Star,
  Sun,
  Sword,
  TreePine,
  Trophy,
  Wind,
};

function getLevelIcon(name: string): ComponentType<{ className?: string }> {
  return LEVEL_ICONS[name] ?? Star;
}

interface DeenExplorersProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  age: number | null;
}

type View = 'map' | 'level' | 'trophies';

const TIER_LABELS: Record<TierId, string> = {
  1: 'Little Explorers',
  2: 'Faith Seekers',
  3: 'Young Scholars',
};

function rewardForLevel(level: number) {
  return REWARDS.find((r) => r.level === level) ?? null;
}

export function DeenExplorers({ open, onClose, userId, age }: DeenExplorersProps) {
  const [progress, setProgress] = useState<GameProgress | null>(null);
  const [view, setView] = useState<View>('map');
  const [activeLevel, setActiveLevel] = useState<CurriculumLevel | null>(null);
  const [confetti, setConfetti] = useState(false);
  const loadedRef = useRef<string | null>(null);

  const expectedTier = useMemo(() => tierForAge(age), [age]);

  useEffect(() => {
    if (!open || !userId) return;
    if (loadedRef.current === userId && progress) return;
    loadedRef.current = userId;
    void (async () => {
      const p = await ensureGameProgress(userId, expectedTier);
      setProgress(p);
    })();
  }, [open, userId, expectedTier, progress]);

  const tierData: CurriculumTier | undefined = useMemo(
    () => CURRICULUM.tiers.find((t) => t.id === (progress?.tier ?? expectedTier)),
    [progress, expectedTier]
  );

  const persist = useCallback(
    (next: GameProgress) => {
      setProgress(next);
      void saveGameProgress(userId, next);
    },
    [userId]
  );

  const handleCompleteLevel = useCallback(
    (level: CurriculumLevel) => {
      if (!progress || !tierData) return;
      const levelId = level.id;
      if (progress.completedLevels.includes(levelId)) return;

      const completedLevels = [...progress.completedLevels, levelId];
      const reward = rewardForLevel(level.levelNumber);
      const unlockedRewards = reward
        ? [...progress.unlockedRewards, reward.id]
        : progress.unlockedRewards;

      const nextLevelNumber = Math.min(level.levelNumber + 1, tierData.levels.length);
      const next: GameProgress = {
        ...progress,
        completedLevels,
        unlockedRewards,
        currentLevel: nextLevelNumber,
      };
      persist(next);

      if (reward) {
        setConfetti(true);
        setTimeout(() => setConfetti(false), 5000);
      }
    },
    [progress, tierData, persist]
  );

  const openLevel = (level: CurriculumLevel) => {
    setActiveLevel(level);
    setView('level');
  };

  const closeLevel = () => {
    setActiveLevel(null);
    setView('map');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 flex max-h-[94vh] w-full max-w-4xl animate-fade-in-up flex-col overflow-hidden rounded-2xl border border-emerald-900/12 bg-cream-50 shadow-card dark:border-gold-400/15 dark:bg-ink-800">
        {confetti && <ConfettiOverlay />}

        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/10 bg-gradient-to-r from-emerald-800/8 to-gold-400/8 px-5 py-4 dark:border-gold-400/12 dark:from-emerald-700/12 dark:to-gold-400/8">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700/12 text-emerald-800 dark:bg-gold-400/12 dark:text-gold-300">
              <Gamepad2 className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-emerald-900 dark:text-cream-50">
                Deen Explorers
              </h2>
              <p className="text-[11px] text-emerald-900/60 dark:text-ink-300">
                {tierData ? `${TIER_LABELS[tierData.id as TierId]} \u00b7 ages ${tierData.ageMin}\u2013${tierData.ageMax}` : 'Loading your adventure\u2026'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-emerald-900/60 transition-colors hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10"
            aria-label="Close game"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-emerald-900/8 bg-white/40 px-4 py-2 dark:border-gold-400/8 dark:bg-ink-700/30">
          <TabButton active={view === 'map'} onClick={() => setView('map')} icon={BookOpen} label="Level Map" />
          <TabButton active={view === 'trophies'} onClick={() => setView('trophies')} icon={Trophy} label="Trophy Room" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {!progress || !tierData ? (
            <div className="flex h-full items-center justify-center p-10">
              <div className="flex flex-col items-center gap-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" />
                  <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" style={{ animationDelay: '0.2s' }} />
                  <span className="h-2 w-2 animate-pulse-soft rounded-full bg-emerald-600 dark:bg-gold-300" style={{ animationDelay: '0.4s' }} />
                </div>
                <p className="text-sm text-emerald-900/60 dark:text-ink-300">Preparing your adventure…</p>
              </div>
            </div>
          ) : view === 'map' ? (
            <LevelMap
              tier={tierData}
              progress={progress}
              onOpenLevel={openLevel}
            />
          ) : view === 'level' && activeLevel ? (
            <LevelCard
              level={activeLevel}
              tierId={tierData.id as TierId}
              siblingLevels={tierData.levels}
              onBack={closeLevel}
              onComplete={() => handleCompleteLevel(activeLevel)}
            />
          ) : view === 'trophies' ? (
            <TrophyRoom progress={progress} tier={tierData} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Trophy;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
        active
          ? 'bg-white text-emerald-900 shadow-soft dark:bg-ink-600 dark:text-cream-50'
          : 'text-emerald-900/60 hover:bg-emerald-900/8 dark:text-ink-300 dark:hover:bg-gold-400/8'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

function LevelMap({
  tier,
  progress,
  onOpenLevel,
}: {
  tier: CurriculumTier;
  progress: GameProgress;
  onOpenLevel: (level: CurriculumLevel) => void;
}) {
  const highestCompleted = progress.completedLevels.length;
  const pct = Math.round((highestCompleted / tier.levels.length) * 100);

  return (
    <div className="p-5">
      <div className="mb-5 rounded-xl border border-emerald-900/10 bg-white/60 p-4 dark:border-gold-400/10 dark:bg-ink-700/30">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-semibold text-emerald-900 dark:text-cream-50">
            Your progress
          </p>
          <p className="text-xs font-medium text-emerald-800/70 dark:text-gold-300">
            {highestCompleted} / {tier.levels.length} levels
          </p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-emerald-900/10 dark:bg-ink-600/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-gold-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-emerald-900/55 dark:text-ink-400">
          {pct}% complete · keep going to unlock rewards!
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {tier.levels.map((level) => {
          const completed = progress.completedLevels.includes(level.id);
          const isCurrent = level.levelNumber === progress.currentLevel && !completed;
          const locked = !completed && !isCurrent;
          const reward = rewardForLevel(level.levelNumber);
          return (
            <LevelNode
              key={level.id}
              level={level}
              completed={completed}
              isCurrent={isCurrent}
              locked={locked}
              hasReward={!!reward}
              onClick={() => !locked && onOpenLevel(level)}
            />
          );
        })}
      </div>
    </div>
  );
}

function LevelNode({
  level,
  completed,
  isCurrent,
  locked,
  hasReward,
  onClick,
}: {
  level: CurriculumLevel;
  completed: boolean;
  isCurrent: boolean;
  locked: boolean;
  hasReward: boolean;
  onClick: () => void;
}) {
  const Icon = getLevelIcon(level.icon);
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`group relative flex flex-col items-center gap-1.5 rounded-2xl border p-3 text-center transition-all ${
        completed
          ? 'border-emerald-600/40 bg-emerald-700/10 dark:border-gold-400/40 dark:bg-gold-400/10'
          : isCurrent
          ? 'border-emerald-700 bg-gradient-to-br from-emerald-700/15 to-gold-400/15 ring-2 ring-emerald-600/30 dark:border-gold-400 dark:ring-gold-400/30'
          : 'border-emerald-900/10 bg-white/40 dark:border-gold-400/10 dark:bg-ink-700/30'
      } ${locked ? 'cursor-not-allowed opacity-60' : 'hover:shadow-soft hover:-translate-y-0.5'}`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl ${
          completed
            ? 'bg-emerald-700/20 text-emerald-800 dark:bg-gold-400/20 dark:text-gold-300'
            : isCurrent
            ? 'bg-emerald-700 text-cream-50 dark:bg-gold-400 dark:text-ink-900'
            : 'bg-emerald-900/8 text-emerald-800/60 dark:bg-gold-400/8 dark:text-gold-300/60'
        }`}
      >
        {locked ? <Lock className="h-5 w-5" /> : <Icon className="h-5 w-5" />}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-900/50 dark:text-ink-400">
        Level {level.levelNumber}
      </span>
      <span className="line-clamp-2 text-[11px] font-semibold leading-tight text-emerald-900 dark:text-cream-50">
        {level.title}
      </span>
      {completed && (
        <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-soft dark:bg-gold-400 dark:text-ink-900">
          <Check className="h-3 w-3" />
        </span>
      )}
      {hasReward && !completed && (
        <span className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold-400 text-ink-900 shadow-soft">
          <Trophy className="h-3 w-3" />
        </span>
      )}
    </button>
  );
}

function LevelCard({
  level,
  tierId,
  siblingLevels,
  onBack,
  onComplete,
}: {
  level: CurriculumLevel;
  tierId: TierId;
  siblingLevels: CurriculumLevel[];
  onBack: () => void;
  onComplete: () => void;
}) {
  const [phase, setPhase] = useState<'story' | 'question' | 'correct' | 'retry'>('story');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [freeText, setFreeText] = useState('');
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    setPhase('story');
    setSelectedOption(null);
    setFreeText('');
    setEvaluation(null);
  }, [level.id]);

  const question = level.questions[0];
  const useFreeText = tierId !== 1 && question.acceptFreeText;
  const Icon = getLevelIcon(level.icon);

  const submit = () => {
    let result: EvaluationResult;
    if (useFreeText) {
      result = evaluateAnswer(freeText, question, siblingLevels);
    } else {
      result = evaluateMCQ(selectedOption, question);
    }
    setEvaluation(result);
    setPhase(result.correct ? 'correct' : 'retry');
  };

  const retry = () => {
    setSelectedOption(null);
    setFreeText('');
    setEvaluation(null);
    setPhase('story');
  };

  return (
    <div className="p-5">
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:text-emerald-600 dark:text-gold-300 dark:hover:text-gold-200"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to map
      </button>

      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700/12 text-emerald-800 dark:bg-gold-400/12 dark:text-gold-300">
          <Icon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-900/50 dark:text-ink-400">
            Level {level.levelNumber}
          </p>
          <h3 className="font-serif text-lg font-bold text-emerald-900 dark:text-cream-50">
            {level.title}
          </h3>
        </div>
      </div>

      {/* Story phase */}
      {phase === 'story' && (
        <div className="animate-fade-in rounded-2xl border border-emerald-900/12 bg-white/70 p-5 dark:border-gold-400/12 dark:bg-ink-700/40">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-700 dark:text-gold-300" />
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-900/60 dark:text-ink-300">
              Read the story
            </p>
          </div>
          <p className="text-base leading-relaxed text-emerald-900/90 dark:text-ink-100">
            {level.storyText}
          </p>
          <button
            onClick={() => setPhase('question')}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 px-4 py-3 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:from-emerald-700 hover:to-emerald-600 sm:w-auto sm:px-6"
          >
            I’ve read it — next
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Question phase */}
      {phase === 'question' && (
        <div className="animate-fade-in rounded-2xl border border-emerald-900/12 bg-white/70 p-5 dark:border-gold-400/12 dark:bg-ink-700/40">
          <p className="mb-4 text-base font-semibold text-emerald-900 dark:text-cream-50">
            {question.question}
          </p>

          {useFreeText ? (
            <FreeTextQuestion
              value={freeText}
              onChange={setFreeText}
              onSubmit={submit}
            />
          ) : (
            <div className="grid gap-2.5">
              {question.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedOption(i)}
                  className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm transition-all ${
                    selectedOption === i
                      ? 'border-emerald-600 bg-emerald-700/10 ring-1 ring-emerald-600/30 dark:border-gold-400 dark:bg-gold-400/10 dark:ring-gold-400/30'
                      : 'border-emerald-900/12 bg-white/60 hover:border-emerald-600/40 dark:border-gold-400/10 dark:bg-ink-700/40 dark:hover:border-gold-400/30'
                  }`}
                >
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                      selectedOption === i
                        ? 'bg-emerald-700 text-white dark:bg-gold-400 dark:text-ink-900'
                        : 'bg-emerald-900/10 text-emerald-800 dark:bg-gold-400/10 dark:text-gold-300'
                    }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-emerald-900 dark:text-cream-50">{opt}</span>
                </button>
              ))}
              <button
                onClick={submit}
                disabled={selectedOption === null}
                className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Submit answer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Correct phase */}
      {phase === 'correct' && (
        <div className="animate-fade-in-up rounded-2xl border border-emerald-600/40 bg-gradient-to-br from-emerald-50 to-gold-50 p-6 text-center dark:border-gold-400/40 dark:from-ink-700/60 dark:to-ink-800/60">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-soft dark:bg-gold-400 dark:text-ink-900">
            <Check className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-emerald-900 dark:text-cream-50">
            Masha’Allah! That’s right!
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-emerald-800/80 dark:text-ink-200">
            {evaluation?.feedback ?? question.explanation}
          </p>
          {rewardForLevel(level.levelNumber) && (
            <div className="mx-auto mt-4 max-w-sm rounded-xl border border-gold-400/40 bg-gold-50 px-4 py-3 dark:border-gold-400/30 dark:bg-gold-400/10">
              <p className="flex items-center justify-center gap-2 text-sm font-bold text-gold-700 dark:text-gold-300">
                <Trophy className="h-4 w-4" />
                Reward unlocked!
              </p>
              <p className="mt-1 text-xs text-emerald-800/80 dark:text-ink-200">
                {rewardForLevel(level.levelNumber)!.name}
              </p>
            </div>
          )}
          <button
            onClick={() => {
              onComplete();
              onBack();
            }}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 px-5 py-3 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:from-emerald-700 hover:to-emerald-600 sm:mx-auto sm:w-auto"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Retry phase — answers rejected; route back to the story */}
      {phase === 'retry' && evaluation && (
        <div className="animate-fade-in-up rounded-2xl border border-amber-300/60 bg-amber-50 p-6 text-center dark:border-amber-400/30 dark:bg-amber-900/20">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-400 text-amber-900 shadow-soft">
            <RotateCcw className="h-7 w-7" />
          </div>
          <h3 className="font-serif text-lg font-bold text-amber-800 dark:text-amber-300">
            Let’s re-read the story to find the right answer!
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-amber-700/80 dark:text-amber-200/70">
            {evaluation.feedback}
          </p>
          <button
            onClick={retry}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-amber-600 sm:mx-auto sm:w-auto"
          >
            <BookOpen className="h-4 w-4" />
            Re-read the story
          </button>
        </div>
      )}
    </div>
  );
}

function FreeTextQuestion({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  const speech = useSpeechRecognition();
  const listening = speech.listening;

  const toggleListen = () => {
    if (listening) {
      speech.stop();
    } else {
      speech.reset();
      speech.start();
    }
  };

  // Pipe recognized speech into the textarea.
  useEffect(() => {
    if (!speech.transcript) return;
    onChange(speech.transcript);
  }, [speech.transcript, onChange]);

  const display = listening && speech.interimTranscript
    ? `${value} ${speech.interimTranscript}`.trim()
    : value;

  return (
    <div>
      <textarea
        value={display}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder="Write or speak your answer in your own words…"
        className="w-full resize-none rounded-xl border border-emerald-900/15 bg-white/80 px-4 py-3 text-sm text-emerald-900 placeholder:text-emerald-900/40 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-gold-400/15 dark:bg-ink-800/60 dark:text-cream-50 dark:placeholder:text-ink-400"
      />
      {speech.supported && (
        <button
          type="button"
          onClick={toggleListen}
          className={`mt-2 flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            listening
              ? 'bg-rose-500 text-white'
              : 'bg-emerald-700/10 text-emerald-800 dark:bg-gold-400/10 dark:text-gold-300'
          }`}
        >
          {listening ? <span className="h-2 w-2 animate-pulse rounded-full bg-white" /> : <Sparkles className="h-3.5 w-3.5" />}
          {listening ? 'Stop' : 'Speak'}
        </button>
      )}
      {speech.error && (
        <p className="mt-1.5 text-[11px] text-rose-600 dark:text-rose-300">{speech.error}</p>
      )}
      <button
        onClick={onSubmit}
        disabled={value.trim().length < 3}
        className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 px-5 py-2.5 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Send className="h-4 w-4" />
        Submit answer
      </button>
    </div>
  );
}

function TrophyRoom({
  progress,
  tier,
}: {
  progress: GameProgress;
  tier: CurriculumTier;
}) {
  const pct = Math.round((progress.completedLevels.length / tier.levels.length) * 100);
  return (
    <div className="p-5">
      <div className="mb-5 rounded-xl border border-emerald-900/10 bg-white/60 p-4 dark:border-gold-400/10 dark:bg-ink-700/30">
        <div className="mb-2 flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900 dark:text-cream-50">
            <Sparkles className="h-4 w-4 text-gold-500 dark:text-gold-300" />
            {TIER_LABELS[tier.id as TierId]} — Trophy Room
          </p>
          <p className="text-xs font-medium text-emerald-800/70 dark:text-gold-300">{pct}% complete</p>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-emerald-900/10 dark:bg-ink-600/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-gold-400 transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {REWARDS.map((reward) => {
          const unlocked = progress.unlockedRewards.includes(reward.id);
          const Icon = reward.id === 'wooden_shield' ? Shield : reward.id === 'bronze_sword' ? Sword : Trophy;
          return (
            <div
              key={reward.id}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-center transition-all ${
                unlocked
                  ? 'border-gold-400/50 bg-gradient-to-br from-gold-50 to-cream-100 shadow-soft dark:border-gold-400/30 dark:from-ink-700/60 dark:to-ink-800/60'
                  : 'border-emerald-900/10 bg-white/40 opacity-70 dark:border-gold-400/10 dark:bg-ink-700/30'
              }`}
            >
              <span
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                  unlocked
                    ? 'bg-gradient-to-br from-gold-400 to-gold-600 text-ink-900 shadow-glow'
                    : 'bg-emerald-900/10 text-emerald-900/40 dark:bg-gold-400/8 dark:text-gold-300/40'
                }`}
              >
                {unlocked ? <Icon className="h-8 w-8" /> : <Lock className="h-7 w-7" />}
              </span>
              <p className={`text-sm font-bold ${unlocked ? 'text-gold-700 dark:text-gold-300' : 'text-emerald-900/50 dark:text-ink-400'}`}>
                {reward.name}
              </p>
              <p className="text-[11px] leading-relaxed text-emerald-900/70 dark:text-ink-300">
                {reward.description}
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-900/50 dark:text-ink-400">
                {unlocked ? 'Unlocked' : `Unlock at level ${reward.level}`}
              </p>
            </div>
          );
        })}
      </div>

      {progress.completedLevels.length === tier.levels.length && (
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-gold-400/40 bg-gold-50 px-4 py-3 text-sm font-bold text-gold-700 dark:border-gold-400/30 dark:bg-gold-400/10 dark:text-gold-300">
          <PartyPopper className="h-4 w-4" />
          You completed every level of {TIER_LABELS[tier.id as TierId]}!
        </div>
      )}
    </div>
  );
}

function ConfettiOverlay() {
  const pieces = useMemo(() => {
    return Array.from({ length: 80 }, (_, i) => {
      const left = Math.random() * 100;
      const delay = Math.random() * 1.5;
      const duration = 3 + Math.random() * 2;
      const size = 6 + Math.random() * 6;
      const colors = ['#1b8052', '#d4a84a', '#c3983a', '#146a41', '#e0c06a', '#f5ecd0'];
      const color = colors[i % colors.length];
      const rotate = Math.random() * 360;
      return { id: i, left, delay, duration, size, color, rotate };
    });
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: 'absolute',
            top: '-20px',
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size * 0.6}px`,
            backgroundColor: p.color,
            transform: `rotate(${p.rotate}deg)`,
            borderRadius: '2px',
            animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

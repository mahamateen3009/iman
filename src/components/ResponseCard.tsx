import { useState } from 'react';
import {
  Heart,
  BookOpen,
  ListChecks,
  Volume2,
  Square,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  ScrollText,
  AlertTriangle,
  ExternalLink,
  WifiOff,
  Cloud,
  LifeBuoy,
  Phone,
} from 'lucide-react';
import type { ChatMessage, CrisisResource, HadithReference, StudySuggestion, QAResponse } from '../types/chat';
import type { UserProfile } from '../types/profile';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';

interface ResponseCardProps {
  message: ChatMessage;
  bookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  profile?: UserProfile | null;
}

export function ResponseCard({ message, bookmarked, onToggleBookmark, profile }: ResponseCardProps) {
  const { speak, cancel, speaking, supported } = useSpeechSynthesis(profile);
  const [copied, setCopied] = useState(false);

  if (!message.response) return null;
  const { reflection, greeting, guidance, steps, dua, hadiths, hadithsFromApi, requiresDisclaimer, needsScholar, isCrisis, crisisResources, studySuggestion, followUpQuestion, qa } =
    message.response;

  const fullText = [
    greeting ? greeting + ' ' : '',
    followUpQuestion ? followUpQuestion + ' ' : '',
    qa ? qa.answer : '',
    reflection,
    guidance.translation,
    ...(hadiths.length > 0
      ? hadiths.map((h) => h.text)
      : []),
    steps.join('. '),
    dua.transliteration + '. ' + dua.english,
  ].filter(Boolean).join(' ');

  const handleSpeak = () => {
    if (speaking) {
      cancel();
    } else {
      speak(fullText);
    }
  };

  const handleCopy = () => {
    const plain: string = qa
      ? [
          'Your Question',
          qa.question,
          '',
          'Answer',
          qa.answer,
          '',
          'Sources',
          ...qa.sources.map((s) => `- ${s}`),
        ].join('\n')
      : [
          'Empathetic Reflection',
          reflection,
          '',
          'Islamic Guidance',
          guidance.translation,
          `Source: ${guidance.source}`,
      ...(hadiths.length > 0
        ? ['', 'Related Hadiths (Sahih)', ...hadiths.map((h) => `- ${h.text}\n  Arabic: ${h.arabic ?? ''}\n  Source: ${h.sourceLabel}\n  ${h.sourceUrl}`)]
        : []),
      '',
      "Actionable Steps & Du'a",
      ...steps.map((s, i) => `${i + 1}. ${s}`),
      '',
      `Du'a (Arabic): ${dua.arabic}`,
      `Transliteration: ${dua.transliteration}`,
      `English: ${dua.english}`,
      `Source: ${dua.source}`,
    ].join('\n');
    navigator.clipboard.writeText(plain).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="animate-fade-in-up rounded-2xl border border-emerald-900/10 bg-white/80 p-4 shadow-card dark:border-gold-400/12 dark:bg-ink-800/70 sm:p-6">
      {/* Fatwa disclaimer banner */}
      {requiresDisclaimer && !isCrisis && <FatwaDisclaimer />}

      {/* Crisis resource banner — shown for self-harm/suicide messages */}
      {isCrisis && crisisResources && <CrisisBanner resources={crisisResources} />}

      {/* Card action bar */}
      <div className="mb-3 flex items-center justify-end gap-1.5">
        {supported && (
          <button
            onClick={handleSpeak}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
              speaking
                ? 'bg-emerald-600 text-white dark:bg-gold-400 dark:text-ink-900'
                : 'bg-emerald-900/8 text-emerald-800 hover:bg-emerald-700/15 dark:bg-gold-400/10 dark:text-gold-300 dark:hover:bg-gold-400/20'
            }`}
          >
            {speaking ? <Square className="h-3 w-3 fill-current" /> : <Volume2 className="h-3.5 w-3.5" />}
            {speaking ? 'Stop' : 'Listen'}
          </button>
        )}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-900/8 px-2.5 py-1.5 text-[11px] font-medium text-emerald-800 transition-all hover:bg-emerald-700/15 dark:bg-gold-400/10 dark:text-gold-300 dark:hover:bg-gold-400/20"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
        {!qa && (
          <button
            onClick={() => onToggleBookmark(message.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-all ${
              bookmarked
                ? 'bg-gold-400/20 text-gold-600 dark:bg-gold-400/20 dark:text-gold-300'
                : 'bg-emerald-900/8 text-emerald-800 hover:bg-emerald-700/15 dark:bg-gold-400/10 dark:text-gold-300 dark:hover:bg-gold-400/20'
            }`}
          >
            {bookmarked ? <BookmarkCheck className="h-3.5 w-3.5" /> : <Bookmark className="h-3.5 w-3.5" />}
            {bookmarked ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      {/* Personalized Greeting */}
      {greeting && (
        <div className="mb-3 rounded-xl bg-gradient-to-r from-emerald-800/10 to-gold-400/10 px-4 py-2.5 dark:from-emerald-700/20 dark:to-gold-400/10">
          <p className="text-sm font-medium text-emerald-800 dark:text-gold-200">
            {greeting}
          </p>
        </div>
      )}

      {/* Q&A Answer — shown when a factual question was asked */}
      {qa && <QASection qa={qa} />}

      {/* Section A — Empathetic Reflection — only for emotional responses */}
      {!qa && (
        <Section icon={Heart} label="Empathetic Reflection" accent="rose">
          <p className="text-sm leading-relaxed text-emerald-900/90 dark:text-ink-100">
            {reflection}
          </p>
        </Section>
      )}

      {/* Section B — Islamic Guidance — only for emotional responses */}
      {!qa && (
      <Section icon={BookOpen} label="Islamic Guidance" accent="emerald">
        <blockquote className="relative overflow-hidden rounded-xl border-l-4 border-gold-500 bg-gradient-to-br from-emerald-900/5 to-gold-400/5 p-4 dark:from-emerald-800/20 dark:to-gold-400/8">
          {guidance.type === 'quran' && (
            <p
              dir="rtl"
              lang="ar"
              className="mb-3 text-right font-arabic text-xl leading-loose text-emerald-900 dark:text-gold-200"
            >
              {guidance.quote}
            </p>
          )}
          <p className="text-sm italic leading-relaxed text-emerald-900/85 dark:text-cream-100">
            {guidance.translation}
          </p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            <SourceTag text={guidance.source} />
          </div>
        </blockquote>
      </Section>
      )}

      {/* Scholar consultation notice — shown when no relevant hadiths found */}
      {needsScholar && !isCrisis && <ScholarNotice />}

      {/* Retrieved Hadiths section — only when relevant hadiths exist */}
      {hadiths.length > 0 && !needsScholar && (
        <Section icon={ScrollText} label={isCrisis ? 'Islamic Verdict on Suicide' : 'Hadith Reference'} accent="emerald">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium">
            {hadithsFromApi ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-700/10 px-2 py-0.5 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
                <Cloud className="h-3 w-3" />
                Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-ink-200/60 px-2 py-0.5 text-ink-500 dark:bg-ink-600/50 dark:text-ink-300">
                <WifiOff className="h-3 w-3" />
                Cache
              </span>
            )}
          </div>
          <ul className="space-y-2">
            {hadiths.map((h, i) => (
              <HadithItem key={i} hadith={h} />
            ))}
          </ul>
        </Section>
      )}

      {/* Section C — Actionable Step & Du'a — only for emotional responses */}
      {!qa && (
      <Section icon={ListChecks} label={isCrisis ? 'Immediate Steps & Du\u2019a' : "Actionable Step & Du'a"} accent="gold">
        <ul className="mb-4 space-y-2">
          {steps.map((step, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-emerald-900/85 dark:text-ink-100">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-700/15 text-[10px] font-bold text-emerald-800 dark:bg-gold-400/20 dark:text-gold-300">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>

        {/* Du'a card */}
        <div className="rounded-xl border border-gold-400/30 bg-gradient-to-br from-gold-50 to-cream-100 p-4 dark:border-gold-400/20 dark:from-ink-700/60 dark:to-ink-800/60">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gold-600 dark:text-gold-300">
            Du'a — Supplication
          </p>
          <p
            dir="rtl"
            lang="ar"
            className="mb-2 text-right font-arabic text-2xl leading-loose text-emerald-900 dark:text-gold-200"
          >
            {dua.arabic}
          </p>
          <p className="mb-1 text-sm font-medium italic text-emerald-800 dark:text-cream-100">
            {dua.transliteration}
          </p>
          <p className="mb-2 text-sm leading-relaxed text-emerald-900/75 dark:text-ink-200">
            {dua.english}
          </p>
          <SourceTag text={dua.source} />
        </div>
      </Section>
      )}

      {/* Study Suggestion */}
      {studySuggestion && (
        <Section icon={BookOpen} label="Study This Topic" accent="emerald">
          <StudySuggestionCard suggestion={studySuggestion} />
        </Section>
      )}
    </div>
  );
}

function QASection({ qa }: { qa: QAResponse }) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-300">
          <BookOpen className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-emerald-900 dark:text-cream-50">
          Clarification
        </h3>
        <span className="h-px flex-1 bg-emerald-900/10 dark:bg-gold-400/15" />
      </div>
      <div className="pl-1">
        <p className="mb-3 text-[11px] italic text-emerald-800/60 dark:text-ink-300">
          {qa.question}
        </p>
        <p className="text-sm leading-relaxed text-emerald-900/90 dark:text-ink-100">
          {qa.answer}
        </p>
        {qa.sources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {qa.sources.map((source, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-md bg-emerald-900/10 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-gold-400/15 dark:text-gold-200"
              >
                {source}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HadithItem({ hadith }: { hadith: HadithReference }) {
  return (
    <li className="rounded-lg border border-emerald-900/10 bg-cream-50/60 px-3 py-2.5 dark:border-gold-400/10 dark:bg-ink-700/40">
      <p className="mb-1.5 text-xs leading-relaxed text-emerald-900/85 dark:text-ink-100">
        {hadith.text.length > 180 ? hadith.text.slice(0, 177) + '…' : hadith.text}
      </p>
      {hadith.commentary && (
        <p className="mb-1.5 text-[11px] italic leading-relaxed text-emerald-800/70 dark:text-ink-300">
          {hadith.commentary}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-1">
        <a
          href={hadith.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-0.5 rounded-md bg-emerald-900/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-800 transition-colors hover:bg-emerald-700/20 dark:bg-gold-400/15 dark:text-gold-200 dark:hover:bg-gold-400/25"
        >
          {hadith.sourceLabel}
          <ExternalLink className="h-2.5 w-2.5" />
        </a>
        {hadith.grade && (
          <span className="inline-flex items-center rounded-md bg-emerald-700/12 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-300">
            {hadith.grade}
          </span>
        )}
      </div>
    </li>
  );
}

function CrisisBanner({ resources }: { resources: CrisisResource[] }) {
  return (
    <div className="mb-4 overflow-hidden rounded-xl border-2 border-red-500/40 bg-red-50 dark:border-red-400/30 dark:bg-red-900/15">
      <div className="flex items-center gap-2.5 border-b border-red-500/20 bg-red-500/10 px-4 py-2.5 dark:border-red-400/20 dark:bg-red-500/10">
        <LifeBuoy className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
        <p className="text-sm font-bold text-red-700 dark:text-red-300">
          You matter. Please reach out right now.
        </p>
      </div>
      <div className="space-y-2.5 px-4 py-3">
        <p className="text-xs leading-relaxed text-red-800/90 dark:text-red-200/80">
          What you are going through is not something to face alone. These services
          are free, confidential, and available right now:
        </p>
        {resources.map((r, i) => (
          <div key={i} className="rounded-lg border border-red-300/40 bg-white/70 px-3 py-2.5 dark:border-red-400/15 dark:bg-ink-800/50">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-red-800 dark:text-red-200">{r.name}</p>
              <span className="inline-flex items-center gap-1 rounded-md bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white dark:bg-red-500">
                <Phone className="h-2.5 w-2.5" />
                {r.contact}
              </span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-red-700/80 dark:text-red-200/60">
              {r.description}
            </p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-red-600/60 dark:text-red-300/50">{r.available}</span>
              {r.url && (
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-medium text-red-600 hover:text-red-700 dark:text-red-300 dark:hover:text-red-200"
                >
                  Visit website
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FatwaDisclaimer() {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 dark:border-amber-400/30 dark:bg-amber-900/20">
      <AlertTriangle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300">
          Note: Iman provides spiritual encouragement and verified Hadith references.
        </p>
        <p className="mt-0.5 text-xs text-amber-700/80 dark:text-amber-200/70">
          For formal legal rulings (Fiqh), please consult a qualified scholar.
        </p>
      </div>
    </div>
  );
}

function ScholarNotice() {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-emerald-700/30 bg-emerald-50/80 px-4 py-3.5 dark:border-gold-400/20 dark:bg-ink-700/40">
      <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700 dark:text-gold-300" />
      <div>
        <p className="text-sm font-semibold text-emerald-900 dark:text-cream-50">
          This topic needs deeper guidance
        </p>
        <p className="mt-1 text-xs leading-relaxed text-emerald-800/80 dark:text-ink-200">
          I was not able to find a verified hadith reference that closely matches
          your situation. For matters like this, I encourage you to reach out to a
          qualified scholar (Aalim) or your local Imam who can give you guidance
          tailored to your specific circumstances.
        </p>
        <p className="mt-1.5 text-xs text-emerald-700/70 dark:text-ink-300">
          In the meantime, the reflection and steps below may still offer some comfort.
        </p>
      </div>
    </div>
  );
}

function StudySuggestionCard({ suggestion }: { suggestion: StudySuggestion }) {
  return (
    <div className="rounded-xl border border-emerald-700/20 bg-gradient-to-br from-emerald-50 to-cream-100 p-4 dark:border-gold-400/15 dark:from-ink-700/50 dark:to-ink-800/50">
      <p className="mb-1 text-sm font-bold text-emerald-900 dark:text-gold-200">
        {suggestion.topic}
      </p>
      <p className="mb-2 text-xs leading-relaxed text-emerald-800/80 dark:text-ink-200">
        {suggestion.description}
      </p>
      <div className="flex items-start gap-1.5 rounded-lg bg-emerald-900/8 px-3 py-2 dark:bg-gold-400/10">
        <BookOpen className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700 dark:text-gold-300" />
        <p className="text-[11px] leading-relaxed text-emerald-700/80 dark:text-ink-300">
          {suggestion.resource}
        </p>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  label,
  accent,
  children,
}: {
  icon: typeof Heart;
  label: string;
  accent: 'rose' | 'emerald' | 'gold';
  children: React.ReactNode;
}) {
  const accentMap = {
    rose: 'text-rose-500 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-400/10',
    emerald: 'text-emerald-700 dark:text-emerald-300 bg-emerald-700/10 dark:bg-emerald-400/10',
    gold: 'text-gold-600 dark:text-gold-300 bg-gold-500/12 dark:bg-gold-400/10',
  };
  return (
    <div className="mb-4 last:mb-0">
      <div className="mb-2.5 flex items-center gap-2">
        <span className={`flex h-7 w-7 items-center justify-center rounded-lg ${accentMap[accent]}`}>
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-semibold text-emerald-900 dark:text-cream-50">{label}</h3>
        <span className="h-px flex-1 bg-emerald-900/10 dark:bg-gold-400/15" />
      </div>
      <div className="pl-1">{children}</div>
    </div>
  );
}

function SourceTag({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center rounded-md bg-emerald-900/10 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-gold-400/15 dark:text-gold-200">
      {text}
    </span>
  );
}

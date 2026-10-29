import { useState } from 'react';
import {
  X,
  Search,
  Globe,
  Sparkles,
  ExternalLink,
  Loader2,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { askGemini, isGeminiConfigured } from '../services/geminiService';
import { searchInternetLive } from '../services/islamicWebSearch';
import type { WebSource } from '../types/chat';

interface WebSearchModalProps {
  open: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  userName?: string;
  effectiveAge?: number | null;
}

interface SearchResult {
  query: string;
  answer: string;
  sources: WebSource[];
  fromGemini: boolean;
}

const SAMPLE_QUERIES = [
  'Is alcohol permissible in Islam?',
  'History of the Battle of Badr',
  'What was the House of Wisdom in Baghdad?',
  'Islamic dietary laws regarding seafood',
  'Who was Umar ibn al-Khattab?',
];

export function WebSearchModal({
  open,
  onClose,
  onOpenSettings,
  userName,
  effectiveAge,
}: WebSearchModalProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResult | null>(null);

  if (!open) return null;

  const handleSearch = async (searchTerm: string) => {
    const term = searchTerm.trim();
    if (!term) return;

    setLoading(true);
    setResult(null);

    try {
      // 1. Try Gemini with Google Search Grounding if configured
      if (isGeminiConfigured()) {
        const geminiResp = await askGemini(term, [], {
          userName,
          age: effectiveAge,
        });

        if (geminiResp?.text) {
          setResult({
            query: term,
            answer: geminiResp.text,
            sources: geminiResp.webSources,
            fromGemini: true,
          });
          setLoading(false);
          return;
        }
      }

      // 2. Otherwise run live internet web search & scraping
      const webResp = await searchInternetLive(term);
      if (webResp) {
        setResult({
          query: term,
          answer: webResp.text,
          sources: webResp.webSources,
          fromGemini: false,
        });
      } else {
        setResult({
          query: term,
          answer: `No relevant live web pages found for "${term}". Try rephrasing your search or using standard Islamic terms.`,
          sources: [],
          fromGemini: false,
        });
      }
    } catch {
      setResult({
        query: term,
        answer: 'An error occurred while connecting to web services. Please check your network connection.',
        sources: [],
        fromGemini: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void handleSearch(query);
  };

  const geminiReady = isGeminiConfigured();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/45 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl animate-fade-in-up flex-col overflow-hidden rounded-2xl border border-emerald-900/12 bg-cream-50 shadow-card dark:border-gold-400/15 dark:bg-ink-800">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-emerald-900/8 p-6 pb-4 dark:border-gold-400/10">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-gold-300 shadow-soft dark:from-gold-400 dark:to-gold-600 dark:text-ink-900">
              <Globe className="h-5 w-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-lg font-bold text-emerald-900 dark:text-cream-50">
                  AI Web Research & Scraping
                </h2>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-700/10 px-2 py-0.5 text-[10px] font-medium text-emerald-800 dark:bg-gold-400/15 dark:text-gold-200">
                  <Sparkles className="h-2.5 w-2.5" />
                  Live Web
                </span>
              </div>
              <p className="text-[11px] text-emerald-900/60 dark:text-ink-300">
                Search live internet sources for Islamic history, rulings, and teachings
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-emerald-900/60 transition-colors hover:bg-emerald-900/10 dark:text-ink-300 dark:hover:bg-gold-400/10"
            aria-label="Close research modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="border-b border-emerald-900/8 bg-white/60 p-4 dark:border-gold-400/10 dark:bg-ink-700/30">
          <form onSubmit={onSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-emerald-900/40 dark:text-ink-400">
                <Search className="h-4 w-4" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask or search anything (e.g. Is alcohol permissible in Islam?)"
                className="w-full rounded-xl border border-emerald-900/15 bg-white py-2.5 pl-9 pr-4 text-xs text-emerald-900 placeholder-emerald-900/40 shadow-sm transition focus:border-emerald-700 focus:outline-none focus:ring-1 focus:ring-emerald-700 dark:border-gold-400/20 dark:bg-ink-800 dark:text-cream-50 dark:placeholder-ink-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 px-4 py-2.5 text-xs font-semibold text-cream-50 shadow-soft transition hover:from-emerald-700 hover:to-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
              <span>Search Web</span>
            </button>
          </form>

          {/* Quick Prompts */}
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-medium text-emerald-900/50 dark:text-ink-400">
              Suggestions:
            </span>
            {SAMPLE_QUERIES.map((sq, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(sq);
                  void handleSearch(sq);
                }}
                className="rounded-lg border border-emerald-900/8 bg-white/70 px-2 py-1 text-[10px] text-emerald-900/80 transition hover:bg-emerald-900/10 dark:border-gold-400/10 dark:bg-ink-800/60 dark:text-ink-200 dark:hover:bg-gold-400/10"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="scrollbar-thin min-h-0 flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Loader2 className="mb-3 h-8 w-8 animate-spin text-emerald-700 dark:text-gold-400" />
              <p className="text-sm font-medium text-emerald-900 dark:text-cream-50">
                Searching the web and synthesizing live results…
              </p>
              <p className="mt-1 text-xs text-emerald-900/60 dark:text-ink-300">
                Querying live Wikipedia, Quran APIs, and web grounding
              </p>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-900/10 bg-white/80 p-5 shadow-card dark:border-gold-400/15 dark:bg-ink-800/80">
                <div className="mb-2 flex items-center justify-between border-b border-emerald-900/8 pb-2 dark:border-gold-400/10">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-emerald-700 dark:text-gold-300" />
                    <h3 className="text-xs font-semibold text-emerald-900/70 dark:text-gold-200">
                      Query: {result.query}
                    </h3>
                  </div>
                  <span className="rounded bg-emerald-900/8 px-2 py-0.5 text-[9px] font-semibold text-emerald-800 dark:bg-gold-400/10 dark:text-gold-200">
                    {result.fromGemini ? 'Gemini AI Grounding' : 'Live Internet Web Search'}
                  </span>
                </div>

                <div className="whitespace-pre-wrap text-sm leading-relaxed text-emerald-900 dark:text-cream-50">
                  {result.answer}
                </div>

                {result.sources.length > 0 && (
                  <div className="mt-4 border-t border-emerald-900/10 pt-3 dark:border-gold-400/10">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 dark:text-gold-300">
                      <Globe className="h-3.5 w-3.5" />
                      Live Web Citations & Sources:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {result.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-900/8 px-2.5 py-1 text-[11px] font-medium text-emerald-800 transition hover:bg-emerald-700/15 dark:bg-gold-400/10 dark:text-gold-200 dark:hover:bg-gold-400/20"
                        >
                          <span className="max-w-[220px] truncate">{s.title}</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!loading && !result && (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-700/10 text-emerald-700 dark:bg-gold-400/10 dark:text-gold-300">
                <Globe className="h-6 w-6" />
              </span>
              <h3 className="font-serif text-base font-bold text-emerald-900 dark:text-cream-50">
                Live Islamic Web Search
              </h3>
              <p className="mt-1 max-w-sm text-xs leading-relaxed text-emerald-900/60 dark:text-ink-300">
                Type any query above to run a search query on the internet. Results are scraped and compiled live with external citations.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-emerald-900/8 p-4 px-6 text-xs text-emerald-900/60 dark:border-gold-400/10 dark:text-ink-400">
          <div className="flex items-center gap-1.5">
            <span
              className={`h-2 w-2 rounded-full ${
                geminiReady ? 'bg-emerald-500' : 'bg-amber-400'
              }`}
            />
            <span>
              {geminiReady
                ? 'Gemini Search Grounding enabled'
                : 'Using Live Open Web Search'}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="inline-flex items-center gap-1 font-semibold text-emerald-700 hover:text-emerald-900 dark:text-gold-300 dark:hover:text-gold-200"
          >
            <span>Manage Key</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

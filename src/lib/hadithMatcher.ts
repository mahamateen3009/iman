import { searchHadiths, getActiveHadithSource } from '../services/hadithApi';
import { searchLocalFallback, hadithTagsMap } from '../services/localHadithSource';
import {
  extractKeywords,
  extractEmotions,
  filterByRelevance,
} from './relevance';
import type {
  HadithDataSource,
  HadithMatchResult,
  HadithResult,
} from '../types/hadith';

/** Phrases that signal a request for a formal legal ruling (Fiqh/Fatwa). */
const FATWA_TRIGGERS = [
  'is it haram', 'is it halal', 'is this haram', 'is that haram',
  'is it permissible', 'is it allowed', 'is it obligatory', 'is it a sin',
  'is it forbidden', 'can i pray', 'can i fast', 'fatwa', 'ruling', 'fiqh',
  'is drinking', 'is eating', 'is gambling', 'is music haram', 'is dating haram',
  'haram or halal', 'halal or haram', 'is it sunnah to', 'is it bidah',
  'is it makruh', 'is it wajib', 'should i divorce', 'is my marriage',
  'is my divorce', 'is interest', 'is riba', 'is it valid',
];

/** Returns true if the message appears to request a formal legal ruling. */
export function isFatwaRequest(message: string): boolean {
  const lower = message.toLowerCase();
  return FATWA_TRIGGERS.some((trigger) => lower.includes(trigger));
}

/** Race a promise against a timeout. Returns null if it times out. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

/**
 * Hybrid search: combines live API results (Islam 360 / Sunnah.com) with
 * the local tagged cache, then scores all results for relevance.
 *
 * Prefers live API results when available. Falls back to local cache.
 * When none qualify, `noMatch` is true so the UI can prompt the user
 * to consult a qualified scholar.
 */
export async function matchHadiths(
  message: string,
  limit = 1
): Promise<HadithMatchResult & { noMatch: boolean }> {
  const emotions = extractEmotions(message);
  const keywords = extractKeywords(message);

  const searchKeywords = emotions.length > 0
    ? emotions
    : keywords.slice(0, 5);

  const allResults: HadithResult[] = [];
  let fromApi = false;
  let sourceId: HadithDataSource = 'fallback';

  // Try live API first with a 4-second timeout (Islam360 downloads full
  // collections, so we give it time but don't block indefinitely).
  try {
    const source = getActiveHadithSource();
    const apiResults = await withTimeout(
      searchHadiths(searchKeywords, ['bukhari', 'muslim', 'nawawi40'], limit * 3),
      4000
    );
    if (apiResults && apiResults.length > 0) {
      allResults.push(...apiResults);
      fromApi = true;
      sourceId = source.id;
    }
  } catch {
    // API unavailable — fall through to local.
  }

  // Always also search local cache (it has tags for scoring).
  const localResults = searchLocalFallback(searchKeywords, 10);
  allResults.push(...localResults);

  // Deduplicate by sourceLabel, preferring API results (which come first).
  const seen = new Set<string>();
  const deduped = allResults.filter((h) => {
    if (seen.has(h.sourceLabel)) return false;
    seen.add(h.sourceLabel);
    return true;
  });

  // Score and filter by relevance.
  const scored = filterByRelevance(
    deduped,
    keywords,
    emotions,
    hadithTagsMap
  );
  const hadiths = scored.slice(0, limit).map((s) => s.result);

  return {
    hadiths,
    emotions,
    fromApi,
    sourceId,
    noMatch: hadiths.length === 0,
  };
}

import type {
  FallbackHadithEntry,
  HadithCollection,
  HadithDataSource,
  HadithResult,
  HadithSource,
} from '../types/hadith';
import fallbackData from '../data/hadith_db.json';

const data = fallbackData as FallbackHadithEntry[];

/** Emotion-to-tag synonym map for broader local search matching. */
const EMOTION_TAGS: Record<string, string[]> = {
  anxiety: ['anxiety', 'worry', 'fear', 'distress', 'comfort', 'trust', 'surrender', 'patience', 'hope', 'dhikr', 'remembrance'],
  sadness: ['sadness', 'sorrow', 'grief', 'pain', 'patience', 'comfort', 'hope', 'trial', 'loss', 'loneliness', 'tears'],
  patience: ['patience', 'trial', 'hardship', 'suffering', 'endurance', 'illness', 'reward', 'hope', 'trust', 'perseverance', 'steadfast'],
  hope: ['hope', 'trust', 'motivation', 'reward', 'paradise', 'comfort', 'ease', 'mercy', 'future', 'relief', 'salvation'],
  motivation: ['motivation', 'strength', 'action', 'courage', 'change', 'worship', 'dhikr', 'perseverance', 'strive', 'effort', 'diligence', 'discipline'],
  anger: ['anger', 'self-control', 'patience', 'character', 'relationships', 'forgiveness', 'mercy', 'restraint', 'silence', 'calm'],
  gratitude: ['gratitude', 'blessings', 'appreciation', 'joy', 'contentment', 'thankful', 'praise', 'favor', 'bounty', 'shukr', 'satisfaction'],
  forgiveness: ['forgiveness', 'repentance', 'guilt', 'sin', 'hope', 'mercy', 'pardon', 'expiat', 'return', 'tawbah', 'remorse', 'amend'],
  comfort: ['comfort', 'hope', 'patience', 'dhikr', 'remembrance', 'trust', 'peace', 'calm', 'ease', 'relief', 'solace', 'tranquility'],
  character: ['character', 'manners', 'kindness', 'mercy', 'compassion', 'love', 'integrity', 'honesty', 'truthful', 'dignity', 'noble', 'righteous', 'brotherhood', 'generosity', 'humility', 'virtue'],
  relationships: ['relationships', 'family', 'kinship', 'brotherhood', 'love', 'compassion', 'mercy', 'patience', 'anger', 'forgiveness', 'character', 'ties', 'reconciliation', 'peace'],
};

/** Expand a search keyword into all related tags using the synonym map. */
function expandKeywords(keywords: string[]): string[] {
  const expanded = new Set<string>(keywords.map((k) => k.toLowerCase()));
  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    if (EMOTION_TAGS[lower]) {
      EMOTION_TAGS[lower].forEach((t) => expanded.add(t));
    }
    // Also check partial matches on emotion names.
    for (const [emotion, tags] of Object.entries(EMOTION_TAGS)) {
      if (emotion.includes(lower) || lower.includes(emotion)) {
        tags.forEach((t) => expanded.add(t));
      }
    }
  }
  return [...expanded];
}

/**
 * Map from sourceLabel (e.g. "Sahih al-Bukhari #6114") to tags.
 */
export const hadithTagsMap = new Map<string, string[]>(
  data.map((h) => [h.sourceLabel, h.tags])
);

export const localHadithSource: HadithSource = {
  id: 'local',
  name: 'Local JSON Cache',
  requiresApiKey: false,

  async search(
    keywords: string[],
    _collections: HadithCollection[],
    limit: number
  ): Promise<HadithResult[]> {
    return searchSyncInternal(keywords, limit, 'local');
  },

  async isAvailable(): Promise<boolean> {
    return true;
  },
};

export function searchLocalFallback(
  keywords: string[],
  limit: number
): HadithResult[] {
  return searchSyncInternal(keywords, limit, 'fallback');
}

function searchSyncInternal(
  keywords: string[],
  limit: number,
  source: HadithDataSource
): HadithResult[] {
  if (keywords.length === 0) return [];
  const expanded = expandKeywords(keywords);
  const results: HadithResult[] = [];

  for (const hadith of data) {
    const tagMatch = expanded.some((k) => hadith.tags.includes(k));
    const textMatch = expanded.some((k) =>
      hadith.text.toLowerCase().includes(k)
    );
    if (tagMatch || textMatch) {
      results.push(toResult(hadith, source));
      if (results.length >= limit) break;
    }
  }
  return results;
}

declare module '../types/hadith' {
  interface HadithSource {
    searchSync?: (keywords: string[], limit: number) => HadithResult[];
  }
}
(localHadithSource as HadithSource & {
  searchSync: (kw: string[], limit: number) => HadithResult[];
}).searchSync = (keywords: string[], limit: number): HadithResult[] => {
  return searchSyncInternal(keywords, limit, 'fallback');
};

function toResult(
  h: FallbackHadithEntry,
  source: HadithDataSource
): HadithResult {
  return {
    collection: h.collection,
    hadithNumber: h.hadithNumber,
    text: h.text,
    arabic: h.arabic,
    chapter: h.chapter,
    grade: h.grade,
    sourceLabel: h.sourceLabel,
    sourceUrl: h.sourceUrl,
    retrievedFrom: source,
  };
}

import type {
  HadithCollection,
  HadithResult,
  HadithSource,
} from '../types/hadith';

/**
 * Sunnah.com Official API source.
 *
 * Requires an API key (obtainable from https://sunnah.com/developers).
 * When no key is configured this source reports unavailable and the
 * matcher falls back to other sources.
 */

const API_BASE = 'https://api.sunnah.com/v1/collections';

const COLLECTION_SLUGS: Record<HadithCollection, { slug: string; label: string }> = {
  bukhari: { slug: 'bukhari', label: 'Sahih al-Bukhari' },
  muslim: { slug: 'muslim', label: 'Sahih Muslim' },
  nawawi40: { slug: 'nawawi40', label: '40 Hadith of Nawawi' },
};

interface SunnahHadith {
  collection: string;
  bookNumber: string;
  hadithNumber: string;
  hadith: Array<{ lang: string; body: string }>;
  grades?: Array<{ graded_by: string; grade: string }>;
}

function extractEnglish(h: SunnahHadith): string {
  const en = h.hadith.find((x) => x.lang === 'en');
  // Strip HTML tags from the API body.
  return en ? en.body.replace(/<[^>]*>/g, '').trim() : '';
}

function extractGrade(h: SunnahHadith): string | undefined {
  if (!h.grades || h.grades.length === 0) return undefined;
  return h.grades.find((g) => g.grade.toLowerCase().includes('sahih'))?.grade ?? h.grades[0].grade;
}

function toResult(collection: HadithCollection, raw: SunnahHadith): HadithResult {
  const meta = COLLECTION_SLUGS[collection];
  const num = parseInt(raw.hadithNumber, 10);
  return {
    collection: meta.label,
    hadithNumber: num,
    text: extractEnglish(raw),
    grade: extractGrade(raw),
    sourceLabel: `${meta.label} #${num}`,
    sourceUrl: `https://sunnah.com/${meta.slug}:${num}`,
    retrievedFrom: 'sunnah',
  };
}

/**
 * Creates a Sunnah.com official API source bound to the given API key.
 * Returns `null` if no key is provided.
 */
export function createSunnahOfficialSource(apiKey: string): HadithSource | null {
  if (!apiKey.trim()) return null;

  const headers: HeadersInit = {
    'X-API-Key': apiKey.trim(),
    Accept: 'application/json',
  };

  return {
    id: 'sunnah',
    name: 'Sunnah.com Official API',
    requiresApiKey: true,

    async search(
      keywords: string[],
      collections: HadithCollection[],
      limit: number
    ): Promise<HadithResult[]> {
      if (keywords.length === 0) return [];
      const lowerKeywords = keywords.map((k) => k.toLowerCase());
      const results: HadithResult[] = [];
      const query = lowerKeywords.join(' ');

      for (const collection of collections) {
        if (results.length >= limit) break;
        const slug = COLLECTION_SLUGS[collection].slug;
        try {
          const res = await fetch(
            `${API_BASE}/${slug}/hadiths?search=${encodeURIComponent(query)}&limit=${limit}`,
            { headers, mode: 'cors' }
          );
          if (!res.ok) continue;
          const payload = (await res.json()) as { data: SunnahHadith[] };
          if (!payload.data) continue;
          for (const raw of payload.data) {
            if (results.length >= limit * 3) break;
            const text = extractEnglish(raw);
            if (!text) continue;
            const textLower = text.toLowerCase();
            const matches = lowerKeywords.some((k) => textLower.includes(k));
            if (!matches) continue;
            results.push(toResult(collection, raw));
          }
        } catch {
          // continue to next collection
        }
      }
      return results;
    },

    async getByNumber(
      collection: HadithCollection,
      hadithNumber: number
    ): Promise<HadithResult | null> {
      const slug = COLLECTION_SLUGS[collection].slug;
      try {
        const res = await fetch(
          `${API_BASE}/${slug}/hadiths/${hadithNumber}`,
          { headers, mode: 'cors' }
        );
        if (!res.ok) return null;
        const raw = (await res.json()) as SunnahHadith;
        return toResult(collection, raw);
      } catch {
        return null;
      }
    },

    async isAvailable(): Promise<boolean> {
      try {
        const res = await fetch(`${API_BASE}/bukhari/hadiths?limit=1`, { headers, mode: 'cors' });
        return res.ok;
      } catch {
        return false;
      }
    },
  };
}

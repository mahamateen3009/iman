import type {
  HadithCollection,
  HadithResult,
  HadithSource,
} from '../types/hadith';

/**
 * Islam 360 open API source (fawazahmed0/hadith-api on jsDelivr CDN).
 *
 * No API key required. Provides structured JSON for canonical collections
 * with chapter metadata, hadith numbers, and grades.
 * Downloads collection editions on-demand and caches them.
 * Uses synonym-expanded keyword matching for more relevant results.
 */

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions';

const COLLECTION_FILES: Record<HadithCollection, { en: string; sunnahPrefix: string; label: string }> = {
  bukhari: { en: 'eng-bukhari.json', sunnahPrefix: 'https://sunnah.com/bukhari:', label: 'Sahih al-Bukhari' },
  muslim: { en: 'eng-muslim.json', sunnahPrefix: 'https://sunnah.com/muslim:', label: 'Sahih Muslim' },
  nawawi40: { en: 'eng-nawawi40.json', sunnahPrefix: 'https://sunnah.com/nawawi40:', label: '40 Hadith of Nawawi' },
};

/** Expand search keywords with synonyms for broader matching. */
const SYNONYMS: Record<string, string[]> = {
  anxiety: ['worry', 'grief', 'fear', 'distress', 'anxious', 'concern', 'restless', 'nervous', 'panic', 'dread', 'uneasy', 'tense', 'apprehens'],
  sad: ['sorrow', 'grief', 'sadness', 'mourning', 'weep', 'tears', 'cry', 'heartbroken', 'devastated', 'unhappy', 'miserable', 'anguish'],
  sadness: ['sorrow', 'grief', 'sad', 'mourning', 'weep', 'tears', 'heartbroken', 'devastated', 'unhappy'],
  depress: ['sad', 'sorrow', 'grief', 'hopeless', 'despair', 'darkness', 'empty', 'numb', 'miserable'],
  anger: ['angry', 'wrath', 'rage', 'fury', 'irritat', 'frustrat', 'resent', 'bitter', 'furious', 'outrag', 'livid', 'fuming', 'seething', 'enrag', 'infuriat', 'provok'],
  fight: ['argu', 'dispute', 'conflict', 'clash', 'confront', 'quarrel', 'contention'],
  hate: ['hate', 'hatred', 'despis', 'detest', 'loathe', 'hostile', 'enmity', 'animosity'],
  beat: ['strike', 'hit', 'harm', 'hurt', 'attack', 'assault', 'violence', 'aggress'],
  patience: ['patient', 'endurance', 'perseverance', 'steadfast', 'sabr', 'forbear', 'tolerate', 'withstand', 'persist', 'steadfast'],
  hope: ['hopeful', 'optimism', 'expectation', 'trust', 'relief', 'ease', 'salvation', 'mercy', 'future'],
  despair: ['hopeless', 'darkness', 'lost', 'despondent', 'forsaken', 'abandoned', 'no way out'],
  fear: ['afraid', 'terrified', 'dread', 'anxiety', 'frightened', 'scared', 'panic', 'terror', 'horror', 'alarm'],
  forgiveness: ['forgive', 'pardon', 'repentance', 'repent', 'mercy', 'expiat', 'absolve', 'excuse', 'overlook', 'conceal'],
  guilt: ['guilty', 'shame', 'remorse', 'regret', 'blame', 'fault', 'wrong', 'sin', 'transgress'],
  sin: ['transgress', 'wrong', 'evil', 'disobey', 'offend', 'iniquity', 'trespass'],
  repent: ['repentance', 'return', 'turn back', 'seek forgiveness', 'tawbah', 'remorse', 'amend'],
  gratitude: ['grateful', 'thankful', 'thanks', 'appreciation', 'praise', 'bless', 'favor', 'bounty', 'shukr'],
  blessed: ['blessing', 'favor', 'gift', 'bounty', 'grace', 'bestow', 'grant', 'mercy'],
  lonely: ['alone', 'lonely', 'isolated', 'solitude', 'forsaken', 'abandoned', 'desolate', 'companionless'],
  alone: ['lonely', 'isolated', 'forsaken', 'abandoned', 'desolate', 'single', 'individual'],
  stress: ['stress', 'burden', 'pressure', 'overwhelm', 'strain', 'tension', 'weight', 'load', 'crush'],
  motivation: ['strive', 'effort', 'diligence', 'perseverance', 'action', 'strong', 'strive', 'compete', 'race', 'hasten', 'eager', 'earnest'],
  lazy: ['laziness', 'sloth', 'idle', 'indolent', 'sluggish', 'lethargic', 'inactive', 'torpor', 'languid'],
  comfort: ['relief', 'ease', 'comfort', 'consolation', 'solace', 'rest', 'tranquil', 'calm', 'peace', 'serenity', 'stillness'],
  peace: ['tranquil', 'calm', 'serenity', 'rest', 'stillness', 'quiet', 'ease', 'relief', 'security', 'safety'],
  trial: ['trial', 'test', 'affliction', 'hardship', 'difficulty', 'calamity', 'adversity', 'tribulation', 'misfortune', 'disaster'],
  hardship: ['difficult', 'difficulty', 'trial', 'test', 'adversity', 'calamity', 'affliction', 'suffering', 'toil', 'labor', 'exert'],
  suffering: ['pain', 'agony', 'anguish', 'torment', 'affliction', 'hardship', 'trial', 'persecution', 'oppression'],
  illness: ['sick', 'disease', 'ailment', 'malady', 'affliction', 'fever', 'pain', 'wound', 'injury', 'frail', 'weak'],
  weakness: ['weak', 'weakness', 'incapable', 'helpless', 'powerless', 'feeble', 'frail', 'faint', 'impotent'],
  debt: ['debt', 'loan', 'borrow', 'owing', 'creditor', 'obligation', 'liability'],
  character: ['manner', 'moral', 'virtue', 'conduct', 'behavior', 'decent', 'honest', 'truthful', 'integrity', 'dignity', 'noble', 'righteous', 'upright'],
  kindness: ['kind', 'gentle', 'tender', 'compassion', 'merciful', 'affection', 'care', 'sympathy', 'benevolence'],
  mercy: ['merciful', 'compassion', 'pardon', 'forgive', 'clemency', 'leniency', 'tenderness', 'pity', 'sympathy'],
  love: ['affection', 'devotion', 'attachment', 'care', 'cherish', 'adore', 'fondness', 'tender'],
  family: ['kin', 'kinship', 'relative', 'blood', 'household', 'family', 'ties', 'sibling', 'parent', 'offspring', 'progeny'],
  sister: ['sibling', 'kin', 'family', 'blood', 'relative', 'brother', 'parent'],
  brother: ['sibling', 'kin', 'family', 'blood', 'relative', 'sister', 'parent'],
  mother: ['parent', 'family', 'kin', 'womb', 'maternal', 'childbirth', 'nurture', 'care'],
  father: ['parent', 'family', 'kin', 'paternal', 'provider', 'guardian', 'care'],
  kinship: ['kin', 'family', 'ties', 'blood', 'relative', 'womb', 'relation', 'connection', 'lineage'],
  relationships: ['family', 'kin', 'kinship', 'ties', 'relative', 'sibling', 'spouse', 'marriage', 'friend', 'companion', 'brotherhood'],
  marriage: ['spouse', 'wife', 'husband', 'matrimony', 'union', 'partner', 'companion', 'household'],
  jealousy: ['envy', 'jealous', 'envious', 'covet', 'resent', 'begrudge', 'malice', 'spite'],
  oppress: ['oppress', 'wrong', 'injustice', 'unfair', 'tyranny', 'persecution', 'coerce', 'compel'],
  injustice: ['oppress', 'wrong', 'unfair', 'tyranny', 'persecution', 'transgress', 'violate'],
};

function expandKeywords(keywords: string[]): string[] {
  const expanded = new Set<string>(keywords.map((k) => k.toLowerCase()));
  for (const kw of keywords) {
    const lower = kw.toLowerCase();
    if (SYNONYMS[lower]) {
      SYNONYMS[lower].forEach((s) => expanded.add(s));
    }
    // Check partial matches on synonym keys.
    for (const [key, syns] of Object.entries(SYNONYMS)) {
      if (key.includes(lower) || lower.includes(key)) {
        syns.forEach((s) => expanded.add(s));
      }
    }
  }
  return [...expanded];
}

interface RawEdition {
  metadata: { name: string };
  hadiths: Array<{
    hadithnumber: number;
    text: string;
    grades?: Array<{ name: string; grade: string }>;
  }>;
}

const editionCache = new Map<string, RawEdition>();

async function fetchEdition(collection: HadithCollection): Promise<RawEdition | null> {
  const file = COLLECTION_FILES[collection].en;
  if (editionCache.has(file)) return editionCache.get(file)!;
  try {
    const res = await fetch(`${CDN_BASE}/${file}`, { mode: 'cors' });
    if (!res.ok) return null;
    const data = (await res.json()) as RawEdition;
    editionCache.set(file, data);
    return data;
  } catch {
    return null;
  }
}

function extractGrade(grades?: Array<{ name: string; grade: string }>): string | undefined {
  if (!grades || grades.length === 0) return undefined;
  return grades.find((g) => g.grade.toLowerCase().includes('sahih'))?.grade ?? grades[0].grade;
}

function toResult(
  collection: HadithCollection,
  hadithNumber: number,
  text: string,
  grade?: string
): HadithResult {
  const meta = COLLECTION_FILES[collection];
  return {
    collection: meta.label,
    hadithNumber,
    text,
    grade,
    sourceLabel: `${meta.label} #${hadithNumber}`,
    sourceUrl: `${meta.sunnahPrefix}${hadithNumber}`,
    retrievedFrom: 'islam360',
  };
}

/** Count how many expanded keywords appear in the text — for relevance ranking. */
function countMatches(textLower: string, keywords: string[]): number {
  let count = 0;
  for (const kw of keywords) {
    if (textLower.includes(kw)) count++;
  }
  return count;
}

export const islam360Source: HadithSource = {
  id: 'islam360',
  name: 'Islam 360 (Open API)',
  requiresApiKey: false,

  async search(
    keywords: string[],
    collections: HadithCollection[],
    limit: number
  ): Promise<HadithResult[]> {
    if (keywords.length === 0) return [];
    const expanded = expandKeywords(keywords);
    const scored: Array<{ result: HadithResult; score: number }> = [];

    for (const collection of collections) {
      const edition = await fetchEdition(collection);
      if (!edition) continue;
      for (const h of edition.hadiths) {
        const textLower = h.text.toLowerCase();
        if (!textLower || textLower.length < 20) continue;
        const matchCount = countMatches(textLower, expanded);
        if (matchCount === 0) continue;
        scored.push({
          result: toResult(collection, h.hadithnumber, h.text, extractGrade(h.grades)),
          score: matchCount,
        });
      }
    }

    // Sort by relevance score (most keyword matches first).
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map((s) => s.result);
  },

  async getByNumber(
    collection: HadithCollection,
    hadithNumber: number
  ): Promise<HadithResult | null> {
    const edition = await fetchEdition(collection);
    if (!edition) return null;
    const h = edition.hadiths.find((x) => x.hadithnumber === hadithNumber);
    if (!h) return null;
    return toResult(collection, h.hadithnumber, h.text, extractGrade(h.grades));
  },

  async isAvailable(): Promise<boolean> {
    const edition = await fetchEdition('bukhari');
    return edition !== null;
  },
};

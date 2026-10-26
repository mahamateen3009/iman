import type { HadithResult, HadithDataSource } from './hadith';

export type DuaCategory =
  | 'anxiety' | 'sadness' | 'patience' | 'hope' | 'motivation'
  | 'anger' | 'gratitude' | 'forgiveness' | 'comfort' | 'character'
  | 'worship' | 'provision' | 'knowledge' | 'death' | 'pride'
  | 'greed' | 'envy' | 'relationships' | 'general';

export const DUA_CATEGORY_LABELS: Record<DuaCategory, string> = {
  anxiety: 'Anxiety & Worry',
  sadness: 'Sadness & Grief',
  patience: 'Patience & Perseverance',
  hope: 'Hope & Trust',
  motivation: 'Motivation & Habits',
  anger: 'Anger Management',
  gratitude: 'Gratitude & Thankfulness',
  forgiveness: 'Forgiveness & Repentance',
  comfort: 'Comfort & Solace',
  character: 'Character & Manners',
  worship: 'Worship & Prayer',
  provision: 'Provision & Sustenance',
  knowledge: 'Knowledge & Learning',
  death: 'Grief & Loss',
  pride: 'Humility & Pride',
  greed: 'Contentment & Greed',
  envy: 'Envy & Comparison',
  relationships: 'Family & Relationships',
  general: 'General Duas',
};

export interface Dua {
  arabic: string;
  transliteration: string;
  english: string;
  source: string;
  category?: DuaCategory;
}

export interface HadithReference {
  collection: string;
  hadithNumber: number;
  text: string;
  arabic?: string;
  sourceLabel: string;
  sourceUrl: string;
  grade?: string;
  chapter?: string;
  retrievedFrom: HadithDataSource;
  commentary?: string;
}

export interface GuidanceEntry {
  id: string;
  triggers: string[];
  reflection: string;
  reflections?: string[];
  guidanceQuote: string;
  guidanceTranslation: string;
  guidanceSource: string;
  guidanceType: 'quran' | 'hadith';
  steps: string[];
  stepsVariants?: string[][];
  dua: Dua;
}

export interface GuidanceSection {
  quote: string;
  translation: string;
  source: string;
  type: 'quran' | 'hadith';
}

export interface StudySuggestion {
  topic: string;
  description: string;
  resource: string;
}

export interface QAResponse {
  question: string;
  answer: string;
  sources: string[];
  relatedHadiths?: HadithReference[];
}

export interface AssistantResponse {
  reflection: string;
  greeting?: string;
  guidance: GuidanceSection;
  steps: string[];
  dua: Dua;
  hadiths: HadithReference[];
  hadithsFromApi: boolean;
  requiresDisclaimer: boolean;
  needsScholar: boolean;
  isCrisis: boolean;
  crisisResources?: CrisisResource[];
  studySuggestion?: StudySuggestion;
  followUpQuestion?: string;
  qa?: QAResponse;
}

export interface CrisisResource {
  name: string;
  description: string;
  contact: string;
  url?: string;
  available: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  response?: AssistantResponse;
  bookmarked?: boolean;
  simpleText?: string;
}

export type { HadithResult };

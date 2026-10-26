/**
 * Shared TypeScript interfaces for the Hadith retrieval subsystem.
 *
 * Every data source (local JSON, Islam 360 open API, Sunnah.com official API)
 * implements the same `HadithSource` interface so they can be swapped or
 * composed without touching the UI layer.
 */

/** Canonical hadith collections supported across all sources. */
export type HadithCollection = 'bukhari' | 'muslim' | 'nawawi40';

/**
 * A single retrieved hadith, normalized so the UI never needs to know
 * which source produced it.
 */
export interface HadithResult {
  collection: string;
  hadithNumber: number;
  text: string;
  arabic?: string;
  chapter?: string;
  grade?: string;
  sourceLabel: string;
  sourceUrl: string;
  retrievedFrom: HadithDataSource;
}

/** Identifies which source produced a result. */
export type HadithDataSource = 'local' | 'islam360' | 'sunnah' | 'fallback';

/** The data-source mode the user has selected in settings. */
export type HadithSourceMode = 'hybrid' | 'sunnahOfficial';

/** Configuration persisted to localStorage. */
export interface HadithSourceConfig {
  mode: HadithSourceMode;
  sunnahApiKey: string;
}

/**
 * Every source implements this contract. The matcher calls `search` and
 * optionally `getByNumber`; the UI only ever sees `HadithResult[]`.
 */
export interface HadithSource {
  /** Unique identifier for this source. */
  readonly id: HadithDataSource;
  /** Human-readable name shown in the UI. */
  readonly name: string;
  /** Whether this source requires an API key to function. */
  readonly requiresApiKey: boolean;
  /** Search for hadiths matching all keywords; returns up to `limit`. */
  search(
    keywords: string[],
    collections: HadithCollection[],
    limit: number
  ): Promise<HadithResult[]>;
  /** Fetch a single hadith by collection + number (optional). */
  getByNumber?(
    collection: HadithCollection,
    hadithNumber: number
  ): Promise<HadithResult | null>;
  /** Quick reachability check for status display. */
  isAvailable(): Promise<boolean>;
}

/** Shape of entries in the local fallback JSON file. */
export interface FallbackHadithEntry {
  id: string;
  collection: string;
  hadithNumber: number;
  chapter: string;
  grade: string;
  text: string;
  arabic?: string;
  sourceLabel: string;
  sourceUrl: string;
  tags: string[];
}

/** Result returned by the hybrid matcher to the chat layer. */
export interface HadithMatchResult {
  hadiths: HadithResult[];
  emotions: string[];
  /** True when results came from a live API (not the local cache). */
  fromApi: boolean;
  /** Which source produced the results — surfaced in the UI badge. */
  sourceId: HadithDataSource;
  /** True when no hadiths met the relevance threshold. */
  noMatch?: boolean;
}

/**
 * Provider-agnostic Hadith API facade.
 *
 * Resolves the active `HadithSource` based on the user's configuration
 * (Hybrid mode or Sunnah.com Official mode) and delegates all calls to it.
 * The UI and matcher never need to know which source is active — they call
 * `getActiveHadithSource()` and `searchHadiths()`.
 */

import type {
  HadithCollection,
  HadithResult,
  HadithSource,
  HadithSourceConfig,
  HadithSourceMode,
} from '../types/hadith';
import { localHadithSource } from './localHadithSource';
import { islam360Source } from './islam360Source';
import { createSunnahOfficialSource } from './sunnahOfficialSource';

/** Default config — Hybrid mode, no API key. */
export const DEFAULT_HADITH_CONFIG: HadithSourceConfig = {
  mode: 'hybrid',
  sunnahApiKey: '',
};

let activeConfig: HadithSourceConfig = { ...DEFAULT_HADITH_CONFIG };

/**
 * Set the active configuration. Called when the user changes settings.
 * Re-resolves the active source on next access.
 */
export function setHadithConfig(config: HadithSourceConfig): void {
  activeConfig = { ...config };
}

/** Get the current config (read-only copy). */
export function getHadithConfig(): HadithSourceConfig {
  return { ...activeConfig };
}

/**
 * Resolve the active source based on the current config.
 *
 * - `hybrid`: composes Islam 360 (live) with local JSON fallback.
 * - `sunnahOfficial`: uses the Sunnah.com official API (requires key).
 */
export function getActiveHadithSource(): HadithSource {
  if (activeConfig.mode === 'sunnahOfficial') {
    const official = createSunnahOfficialSource(activeConfig.sunnahApiKey);
    if (official) return official;
    // No key configured — gracefully fall back to hybrid.
  }
  return islam360Source;
}

/**
 * Get the local fallback source (always available, no network needed).
 */
export function getLocalFallbackSource(): HadithSource {
  return localHadithSource;
}

/**
 * Search across the active source. Returns up to `limit` results.
 * Delegates to the resolved source's `search` method.
 */
export async function searchHadiths(
  keywords: string[],
  collections: HadithCollection[] = ['bukhari', 'muslim'],
  limit = 5
): Promise<HadithResult[]> {
  const source = getActiveHadithSource();
  return source.search(keywords, collections, limit);
}

/**
 * Fetch a single hadith by number from the active source.
 */
export async function fetchHadithByNumber(
  collection: HadithCollection,
  hadithNumber: number
): Promise<HadithResult | null> {
  const source = getActiveHadithSource();
  if (source.getByNumber) {
    return source.getByNumber(collection, hadithNumber);
  }
  return null;
}

/** Check whether the active source is reachable. */
export async function checkHadithApiAvailable(): Promise<boolean> {
  const source = getActiveHadithSource();
  return source.isAvailable();
}

/** Human-readable label for the current mode, for status display. */
export function getActiveSourceLabel(): string {
  if (activeConfig.mode === 'sunnahOfficial' && activeConfig.sunnahApiKey.trim()) {
    return 'Sunnah.com Official API';
  }
  return 'Hybrid: Islam 360 + Local Cache';
}

/** Re-export types for backward compatibility with existing imports. */
export type { HadithCollection, HadithResult, HadithSource, HadithSourceConfig, HadithSourceMode };

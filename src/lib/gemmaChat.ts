import { supabase } from './supabaseClient';
import type { HadithReference } from '../types/chat';

interface GemmaHadithContext {
  collection: string;
  hadithNumber: number;
  text: string;
  sourceLabel: string;
  sourceUrl: string;
}

interface GemmaChatResult {
  reflection: string;
  steps: string[];
}

interface HistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Calls the Gemma 4 edge function to generate a natural, personalized
 * reflection and action steps grounded in the provided hadiths.
 *
 * Returns null when the AI service is unavailable or returns an error,
 * so the caller can fall back to the curated response system.
 */
export async function generateGemmaResponse(
  message: string,
  history: HistoryMessage[],
  emotions: string[],
  hadiths: HadithReference[],
  profile: { name: string; ageGroup: string | null; gender: string | null }
): Promise<GemmaChatResult | null> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const accessToken = sessionData?.session?.access_token;
    if (!accessToken) return null;

    const hadithContext: GemmaHadithContext[] = hadiths.map((h) => ({
      collection: h.collection,
      hadithNumber: h.hadithNumber,
      text: h.text,
      sourceLabel: h.sourceLabel,
      sourceUrl: h.sourceUrl,
    }));

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/gemma-chat`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        message,
        history,
        emotions,
        hadiths: hadithContext,
        profile,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (data.error || data.fallback) {
      return null;
    }

    if (typeof data.reflection !== 'string' || data.reflection.length < 10) {
      return null;
    }

    return {
      reflection: data.reflection,
      steps: Array.isArray(data.steps) ? data.steps.filter((s: unknown) => typeof s === 'string') : [],
    };
  } catch {
    return null;
  }
}

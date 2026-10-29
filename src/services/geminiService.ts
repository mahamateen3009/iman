import type { WebSource } from '../types/chat';

const STORAGE_KEY = 'iman_gemini_api_key';

/**
 * Retrieves the active Gemini API key from localStorage or Vite environment variable.
 */
export function getGeminiApiKey(): string {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local && local.trim()) {
    return local.trim();
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envKey && envKey.trim()) {
    return envKey.trim();
  }
  return '';
}

/**
 * Saves a Gemini API key into localStorage.
 */
export function setGeminiApiKey(key: string): void {
  const clean = key.trim();
  if (clean) {
    localStorage.setItem(STORAGE_KEY, clean);
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Returns true if an API key is available.
 */
export function isGeminiConfigured(): boolean {
  return getGeminiApiKey().length > 0;
}

export interface GeminiHistoryItem {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}

export interface GeminiResponse {
  text: string;
  webSources: WebSource[];
  searchQueries?: string[];
}

export interface GeminiContext {
  userName?: string;
  age?: number | null;
  ageGroup?: 'child' | 'teen' | 'adult' | 'senior' | null;
  gender?: string | null;
}

const IMAN_SYSTEM_INSTRUCTION = `You are "Iman" (الإيمان), an authentic, warm, and highly knowledgeable Islamic companion and emotional well-being assistant.

### ABOUT THIS PROJECT ("IMAN"):
You know everything about this application and its features:
- **Project Identity**: Iman is an all-in-one Islamic companion app for spiritual wellness, mental comfort, and authentic knowledge.
- **Key Features**:
  1. **Empathetic Emotional Guidance**: Emotion detection (anxiety, sadness, anger, gratitude, stress) providing Quranic verses, Sahih Hadiths, step-by-step actions, and tailor-made Du'as.
  2. **Conversational Companion**: Warm, friendly, human-like conversations adapted to the user's age and feelings.
  3. **Daily Prayer Tracker**: Track 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha), view prayer streaks, and mark completions.
  4. **Islamic Hijri Calendar**: Hijri date conversions, upcoming Islamic sacred months (Ramadan, Dhul-Hijjah, Muharram, Rajab) and holidays.
  5. **Deen Explorers**: An interactive curriculum for children and youth with quests, milestones, and badges.
  6. **Voice Synthesis**: Listen to Du'as and explanations with built-in voice audio.
  7. **Bookmarks & History**: Save favorite Du'as, reflections, and chat history.
  8. **Crisis Safety**: Compassionate emergency crisis banners and verified hotlines if someone expresses self-harm.

When the user asks anything about the project, its features, how to use them, or how the app works, answer thoroughly, proudly, and helpfully.

### ISLAMIC TEACHINGS & HISTORY KNOWLEDGE (WITH WEB GROUNDING):
- Whenever asked about Islamic history, the Quran, Hadith, Prophet Muhammad (peace be upon him), the Companions (Sahabah), the Caliphates (Rashidun, Umayyad, Abbasid, Andalus, Ottoman), Islamic Golden Age science and medicine, battles, Islamic scholars, theology, or daily Fiqh:
  - Provide rich, deeply engaging, accurate information.
  - Utilize Google Search web grounding to fetch verified historical details, dates, sources, and references.
  - Cite Quranic verses (Surah name and Ayah number) and Hadith sources (e.g., Sahih al-Bukhari, Sahih Muslim) accurately.
  - Maintain a respectful, balanced, and mainstream Islamic scholarly perspective.
  - For personal legal rulings (fatwas), clarify the general scholarly consensus and kindly advise consulting a local trusted scholar.

### TONE & PERSONALIZATION:
- Always speak with warmth, empathy, and gentleness (*adab*).
- Never sound robotic, preachy, or repetitive.
- Format responses clearly using clean paragraphs, bullet points, and bold text for readability.`;

/**
 * Calls Google Gemini API with Google Search Grounding enabled.
 */
export async function askGemini(
  prompt: string,
  history: Array<{ role: 'user' | 'assistant'; content: string }> = [],
  context?: GeminiContext
): Promise<GeminiResponse | null> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  // Build demographic guidance
  let userContextPrompt = '';
  if (context?.userName) {
    userContextPrompt += `The user's name is ${context.userName}. `;
  }
  if (context?.age != null) {
    userContextPrompt += `The user is ${context.age} years old (${context.ageGroup ?? 'adult'}). `;
    if (context.age <= 12) {
      userContextPrompt += 'Keep your tone gentle, encouraging, and easy for a child to understand. ';
    } else if (context.age <= 17) {
      userContextPrompt += 'Speak in a relatable, clear, supportive tone suitable for a teenager. ';
    } else if (context.age >= 60) {
      userContextPrompt += 'Speak with deep respect and warmth. ';
    }
  }

  const fullSystemInstruction = userContextPrompt
    ? `${IMAN_SYSTEM_INSTRUCTION}\n\nUSER DEMOGRAPHICS: ${userContextPrompt}`
    : IMAN_SYSTEM_INSTRUCTION;

  // Format previous conversation turns for Gemini
  const formattedContents: GeminiHistoryItem[] = [];
  const recentHistory = history.slice(-8);

  for (const item of recentHistory) {
    if (!item.content) continue;
    formattedContents.push({
      role: item.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: item.content }],
    });
  }

  // Append current user prompt
  formattedContents.push({
    role: 'user',
    parts: [{ text: prompt }],
  });

  // Try current and supported models: gemini-3.8-flash first, then fallbacks
  const models = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const requestBody = {
        contents: formattedContents,
        systemInstruction: {
          parts: [{ text: fullSystemInstruction }],
        },
        tools: [
          {
            googleSearch: {},
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1500,
        },
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        // If 404 or bad model, try next model in loop
        if (response.status === 404 && model !== 'gemini-1.5-flash') {
          continue;
        }
        const errorText = await response.text();
        console.error(`Gemini API error (${model}):`, response.status, errorText);
        return null;
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      const textParts = candidate?.content?.parts;
      const text = textParts?.map((p: { text?: string }) => p.text || '').join('').trim();

      if (!text) {
        return null;
      }

      // Extract live web search grounding metadata (sources & queries)
      const webSources: WebSource[] = [];
      const searchQueries: string[] = [];

      const groundingMetadata = candidate?.groundingMetadata;
      if (groundingMetadata) {
        if (Array.isArray(groundingMetadata.webSearchQueries)) {
          searchQueries.push(...groundingMetadata.webSearchQueries);
        }

        if (Array.isArray(groundingMetadata.groundingChunks)) {
          for (const chunk of groundingMetadata.groundingChunks) {
            const web = chunk.web;
            if (web?.uri) {
              const title = web.title || cleanUrlTitle(web.uri);
              if (!webSources.some((s) => s.url === web.uri)) {
                webSources.push({ title, url: web.uri });
              }
            }
          }
        }
      }

      return {
        text,
        webSources: webSources.slice(0, 5),
        searchQueries,
      };
    } catch (err) {
      console.error(`Gemini call error (${model}):`, err);
    }
  }

  return null;
}

function cleanUrlTitle(url: string): string {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');
    const path = parsed.pathname.split('/').filter(Boolean).pop();
    if (path && path.length > 3) {
      return `${host}: ${decodeURIComponent(path).replace(/[-_]/g, ' ')}`;
    }
    return host;
  } catch {
    return 'Web Reference';
  }
}


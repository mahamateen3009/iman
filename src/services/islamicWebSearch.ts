import type { WebSource } from '../types/chat';

export interface ScrapedIslamicData {
  title: string;
  extract: string;
  sourceUrl: string;
}

/**
 * Checks if a query is asking about the Iman project, its features, or how to use the app.
 */
export function isProjectQuestion(message: string): boolean {
  const q = message.toLowerCase();
  return (
    /\b(what is (this|iman)|about (this project|iman)|features|how to use (this|the app|iman)|what can you do|who made (you|this)|who created (you|this)|deen explorers|prayer tracker|prayer times|hijri calendar|how does this work|app features)\b/i.test(
      q
    ) ||
    (/\b(tell me about (the app|this website|iman))\b/i.test(q))
  );
}

/**
 * Returns a detailed, structured answer about the Iman project and its features.
 */
export function getProjectAnswer(message: string, userName?: string): string {
  const q = message.toLowerCase();
  const nameGreet = userName ? `, ${userName}` : '';

  if (q.includes('prayer') || q.includes('salah') || q.includes('namaz')) {
    return (
      `**Prayer Tracker in Iman** 🕌\n\n` +
      `Iman includes a dedicated Daily Prayer Tracker to help you maintain consistency across all 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, and Isha):\n\n` +
      `• **Open the Tracker**: Click the Prayer Tracker icon in the navigation bar at the top.\n` +
      `• **Mark Prayers**: Check off each prayer as you complete it during the day.\n` +
      `• **Streaks & Progress**: Track your weekly completion rate and build a lasting habit.\n\n` +
      `*"Indeed, prayer has been decreed upon the believers a decree of specified times."* — Surah An-Nisa (4:103)`
    );
  }

  if (q.includes('calendar') || q.includes('hijri') || q.includes('date') || q.includes('ramadan')) {
    return (
      `**Islamic Hijri Calendar in Iman** 📅\n\n` +
      `You can access the Hijri Calendar directly from the top navigation bar:\n\n` +
      `• **Current Hijri Date**: View today's accurate Islamic lunar date and month (e.g., Jumada al-Awwal, Rajab, Sha'ban, Ramadan).\n` +
      `• **Sacred Months & Holidays**: See upcoming Islamic milestones including the start of Ramadan, Eid al-Fitr, Day of Arafah, and Eid al-Adha.\n` +
      `• **Daily Alignment**: Easily convert between Gregorian and lunar Hijri dates.`
    );
  }

  if (q.includes('deen explorer') || q.includes('game') || q.includes('kids') || q.includes('curriculum')) {
    return (
      `**Deen Explorers Curriculum & Quest** 🌟\n\n` +
      `Deen Explorers is Iman's interactive learning quest designed for youth, young Muslims, and curious learners:\n\n` +
      `• **Step-by-Step Quests**: Explore the 5 Pillars of Islam, Seerah (the life of Prophet Muhammad ﷺ), beautiful character (Akhlaq), and inspiring Quranic stories.\n` +
      `• **Knowledge Checks**: Answer fun interactive questions to test and solidify what you learned.\n` +
      `• **Badges & Milestones**: Earn badges as you progress through each Islamic knowledge level!\n\n` +
      `Click the Game Controller icon in the navbar to launch Deen Explorers anytime!`
    );
  }

  return (
    `**Welcome to Iman (الإيمان)**${nameGreet}! 🌙\n\n` +
    `Iman is a comprehensive Islamic companion and emotional well-being platform designed to bring spiritual peace, authentic knowledge, and daily consistency to your life.\n\n` +
    `**Core Features of this Project:**\n\n` +
    `1. 💬 **Empathetic & Conversational Chat**: Share how you feel (stress, anxiety, sadness, gratitude) to receive comforting Quranic verses, Sahih Hadiths, action steps, and tailored Du'as — or just chat naturally like with a wise, caring friend.\n` +
    `2. 🕌 **Prayer Tracker**: Keep track of your 5 daily prayers (Fajr, Dhuhr, Asr, Maghrib, Isha) and build prayer streaks.\n` +
    `3. 📅 **Islamic Calendar**: Check current Hijri dates and stay ahead of sacred months and blessed Islamic events.\n` +
    `4. 🌟 **Deen Explorers**: An engaging interactive curriculum with quests, stories, and badges for learners of all ages.\n` +
    `5. 🎙️ **Voice Audio**: Listen to recitations and responses with built-in voice playback.\n` +
    `6. 🔖 **Bookmarks**: Save important Du'as and reflections to your profile for easy review.\n` +
    `7. 🌐 **Live Islamic Web Research**: Powered by Google Gemini with live web search to answer questions about Islamic history, Quran, and Hadith.\n\n` +
    `How can I assist you with any of these features today?`
  );
}

/**
 * Checks if a query is asking about Islamic history, historical figures, or teachings.
 */
export function isIslamicHistoryOrTeachingQuestion(message: string): boolean {
  const q = message.toLowerCase();
  const keywords = [
    'history', 'caliph', 'khalifa', 'rashidun', 'abu bakr', 'umar ibn', 'uthman', 'ali ibn abi talib',
    'badr', 'uhud', 'khandaq', 'mecca', 'medina', 'seerah', 'prophet', 'andalus', 'spain', 'ottoman',
    'abbasid', 'umayyad', 'salahuddin', 'saladin', 'crusades', 'bukhari', 'muslim', 'tirmidhi',
    'golden age', 'house of wisdom', 'ibn sina', 'al-razi', 'al-khwarizmi', 'kaaba', 'conquest',
    'treaty of hudaybiyyah', 'battle of', 'fatimid', 'islamic empire', 'who was', 'who were',
    'how did islam spread', 'story of', 'companion', 'sahaba'
  ];
  return keywords.some((kw) => q.includes(kw));
}

/**
 * Extracts a search topic from an Islamic history query.
 */
function extractHistoryTopic(query: string): string {
  const cleaned = query
    .toLowerCase()
    .replace(/[?!.,;:]+$/, '')
    .replace(/\b(who was|who were|tell me about|what is the history of|what happened at|story of|explain|history of)\b/g, '')
    .trim();

  // Keyword to Wikipedia article title mapping for high precision
  const topicMap: Record<string, string> = {
    'badr': 'Battle_of_Badr',
    'uhud': 'Battle_of_Uhud',
    'khandaq': 'Battle_of_the_Trench',
    'trench': 'Battle_of_the_Trench',
    'abu bakr': 'Abu_Bakr',
    'umar': 'Umar',
    'uthman': 'Uthman',
    'ali': 'Ali_ibn_Abi_Talib',
    'salahuddin': 'Saladin',
    'saladin': 'Saladin',
    'golden age': 'Islamic_Golden_Age',
    'house of wisdom': 'House_of_Wisdom',
    'andalus': 'Al-Andalus',
    'ottoman': 'Ottoman_Empire',
    'bukhari': 'Muhammad_al-Bukhari',
    'hudaybiyyah': 'Treaty_of_al-Hudaybiya',
    'kaaba': 'Kaaba',
    'rashidun': 'Rashidun_Caliphate',
  };

  for (const [key, slug] of Object.entries(topicMap)) {
    if (cleaned.includes(key)) {
      return slug;
    }
  }

  return cleaned.split(' ').slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('_');
}

/**
 * Scrapes factual Islamic history information from Wikipedia REST API.
 * Free, open, and requires no API key.
 */
export async function scrapeIslamicHistory(query: string): Promise<ScrapedIslamicData | null> {
  try {
    const slug = extractHistoryTopic(query);
    if (!slug) return null;

    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!res.ok) return null;
    const data = await res.json();

    if (!data.extract || data.extract.length < 30) return null;

    return {
      title: data.title || slug.replace(/_/g, ' '),
      extract: data.extract,
      sourceUrl: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${slug}`,
    };
  } catch {
    return null;
  }
}

import type { WebSource } from '../types/chat';

export interface LiveWebSearchResult {
  text: string;
  webSources: WebSource[];
}

/**
 * Normalizes common spelling variations and typos in user questions.
 */
function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/\balchol\b|\balcohal\b|\balchohol\b/g, 'alcohol')
    .replace(/\bpermissbile\b|\bpermissable\b|\bpremissible\b/g, 'permissible')
    .replace(/\boslam\b|\bislamic\b|\bislaam\b/g, 'islam')
    .replace(/\bquaran\b|\bkuran\b|\bquranic\b/g, 'quran')
    .replace(/\bhadis\b|\bhadeeth\b|\bhadees\b/g, 'hadith')
    .replace(/\bmohammed\b|\bmohammad\b|\bmuhamad\b/g, 'muhammad')
    .replace(/\bprophit\b|\bpropht\b/g, 'prophet')
    .replace(/\bharam\b|\bharaam\b/g, 'haram')
    .replace(/\bhalal\b|\bhalaal\b/g, 'halal')
    .replace(/[?!.,;:]+$/, '')
    .trim();
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
    `7. 🌐 **Live Web Research**: Live internet search engine and Google Gemini to answer questions with real-time web citations.\n\n` +
    `How can I assist you with any of these features today?`
  );
}

/**
 * Searches the live internet for articles, summaries, and scriptural references.
 * Does NOT read from any local database.
 */
export async function searchInternetLive(query: string): Promise<LiveWebSearchResult | null> {
  try {
    const normalized = normalizeQuery(query);
    if (!normalized || normalized.length < 3) return null;

    // 1. Live Web Search via Wikipedia API
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(normalized)}&utf8=&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    if (!searchRes.ok) return null;

    const searchData = await searchRes.json();
    const hits: Array<{ title: string; snippet: string }> = searchData?.query?.search || [];
    if (hits.length === 0) return null;

    // Re-score/prioritize hits based on exact subject match
    const keywords = normalized.split(/\s+/).filter((w) => w.length > 3);
    const sortedHits = [...hits].sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;
      for (const kw of keywords) {
        if (a.title.toLowerCase().includes(kw)) scoreA += 5;
        if (b.title.toLowerCase().includes(kw)) scoreB += 5;
      }
      // Specific high-value Islamic terms
      if (/khamr|dietary|alcohol/i.test(a.title) && normalized.includes('alcohol')) scoreA += 10;
      if (/khamr|dietary|alcohol/i.test(b.title) && normalized.includes('alcohol')) scoreB += 10;
      return scoreB - scoreA;
    });

    const webSources: WebSource[] = [];
    const articleExtracts: Array<{ title: string; extract: string; url: string }> = [];

    // Fetch summaries for top 2 relevant hits
    for (const hit of sortedHits.slice(0, 2)) {
      try {
        const slug = hit.title.replace(/ /g, '_');
        const sumUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(slug)}`;
        const sumRes = await fetch(sumUrl);
        if (sumRes.ok) {
          const sumData = await sumRes.json();
          if (sumData.extract && sumData.extract.length > 40) {
            const pageUrl = sumData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${slug}`;
            articleExtracts.push({
              title: sumData.title,
              extract: sumData.extract,
              url: pageUrl,
            });
            webSources.push({
              title: sumData.title,
              url: pageUrl,
            });
          }
        }
      } catch {}
    }

    // 2. Also search live Quran web API if relevant
    let quranQuote = '';
    const quranKeywords = ['alcohol', 'wine', 'intoxicant', 'fasting', 'prayer', 'charity', 'patience', 'parents', 'zakat', 'marriage', 'justice'];
    const matchedQuranKeyword = quranKeywords.find((kw) => normalized.includes(kw));

    if (matchedQuranKeyword) {
      try {
        const searchKeyword = matchedQuranKeyword === 'alcohol' ? 'intoxicants' : matchedQuranKeyword;
        const quranUrl = `https://api.alquran.cloud/v1/search/${encodeURIComponent(searchKeyword)}/all/en`;
        const quranRes = await fetch(quranUrl);
        if (quranRes.ok) {
          const quranData = await quranRes.json();
          const matches = quranData?.data?.matches;
          if (Array.isArray(matches) && matches.length > 0) {
            const firstMatch = matches[0];
            quranQuote = `• **Quran Reference (Live Web)**:\n*"${firstMatch.text.trim()}"*\n— Surah ${firstMatch.surah.englishName} (${firstMatch.surah.number}:${firstMatch.numberInSurah})`;
            webSources.push({
              title: `Quran.com (${firstMatch.surah.number}:${firstMatch.numberInSurah})`,
              url: `https://quran.com/${firstMatch.surah.number}/${firstMatch.numberInSurah}`,
            });
          }
        }
      } catch {}
    }

    if (articleExtracts.length === 0 && !quranQuote) {
      return null;
    }

    // 3. Format the live internet search answer
    const sections: string[] = [];

    sections.push(`**Live Internet Search Findings** 🌐`);

    for (const art of articleExtracts) {
      sections.push(`• **${art.title}**:\n${art.extract}`);
    }

    if (quranQuote) {
      sections.push(quranQuote);
    }

    sections.push(`*(Information queried live from the web. For personalized fatwas, always consult a local scholar.)*`);

    return {
      text: sections.join('\n\n'),
      webSources: webSources.slice(0, 4),
    };
  } catch {
    return null;
  }
}

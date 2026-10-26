/**
 * Suggests an Islamic study topic, du'a name, or practice based on the
 * emotions detected in the user's message. Maps emotional themes to
 * relevant Islamic concepts the user can study further.
 */

interface StudySuggestion {
  topic: string;
  description: string;
  resource: string;
}

const SUGGESTION_MAP: Record<string, StudySuggestion> = {
  anxiety: {
    topic: 'Tawakkul (Reliance on Allah)',
    description:
      'Study the concept of tawakkul — entrusting your affairs to Allah after taking reasonable steps. It directly addresses the root of anxiety: trying to control what only Allah controls.',
    resource: 'Surah At-Talaq 65:2-3 and the tafsir of Ibn Kathir on reliance',
  },
  sadness: {
    topic: 'Sabr (Patience through hardship)',
    description:
      'Study the different types of sabr — patience with trials, patience in obedience, and patience against sin. Understanding sabr transforms grief from something endured into something rewarded.',
    resource: 'Surah Al-Baqarah 2:153-157 and "Patience and Gratitude" by Ibn Qayyim',
  },
  patience: {
    topic: 'The Wisdom of Trials (Hikmat al-Ibtila)',
    description:
      'Study why Allah tests His servants. The scholars explain that trials are not punishment but refinement — they purify, elevate, and bring the believer closer to Allah.',
    resource: 'Surah Al-Baqarah 2:155 and the chapter on trials in "Uddat as-Sabirin" by Ibn Qayyim',
  },
  hope: {
    topic: 'Husn al-Dhann (Good expectation of Allah)',
    description:
      'Study the principle of having a good opinion of Allah. The Prophet said Allah says: "I am as my servant thinks of Me." Hope is not wishful thinking — it is a form of worship.',
    resource: 'Hadith Qudsi in Sahih al-Bukhari #6502 and Surah Az-Zumar 39:53',
  },
  motivation: {
    topic: 'Sincerity in Action (Ikhlas)',
    description:
      'Study ikhlas — doing actions purely for Allah. When intention is pure, even small deeds carry weight. This is the key to sustainable motivation that does not fade.',
    resource: 'Surah Al-Asr 103 and the first hadith of Nawawi (intention)',
  },
  anger: {
    topic: 'Self-Mastery (Mujahadat an-Nafs)',
    description:
      'Study the Prophet\u2019s guidance on anger management. He gave specific, practical tools: sitting down, making wudu, silence, and seeking refuge from Shaytan. This is a complete anger management curriculum.',
    resource: 'Sahih al-Bukhari #6114 and "The Book of Manners" by Al-Bayhaqi',
  },
  gratitude: {
    topic: 'Shukr (Gratitude as worship)',
    description:
      'Study the three levels of shukr: gratitude of the heart, gratitude of the tongue, and gratitude through action. Each level deepens your connection with Allah and increases barakah.',
    resource: 'Surah Ibrahim 14:7 and "Patience and Gratitude" by Ibn Qayyim',
  },
  forgiveness: {
    topic: 'Tawbah (Repentance)',
    description:
      'Study the conditions of a valid tawbah: immediate cessation, sincere regret, firm resolve not to repeat, and restoring rights if others were harmed. Tawbah is not just asking — it is returning.',
    resource: 'Surah Al-Baqarah 2:222 and the hadith of Sayyid al-Istighfar (Bukhari #6306)',
  },
  comfort: {
    topic: 'Dhikr as Healing',
    description:
      'Study the healing power of dhikr. Allah says hearts find rest in His remembrance. Specific adhkar — like the morning and evening remembrances — are a daily medicine for the heart.',
    resource: 'Surah Ar-Ra\u2019d 13:28 and "Hisn al-Muslim" (Fortress of the Muslim) for daily adhkar',
  },
  character: {
    topic: 'Husn al-Khuluq (Excellent Character)',
    description:
      'Study the character of the Prophet ﷺ. He was the living Quran. Good character is the heaviest thing on the scale and the highest form of da\u2019wah. Start with his patience, mercy, and honesty.',
    resource: 'Surah Al-Qalam 68:4 and "Riyad as-Salihin" chapter on good character',
  },
  relationships: {
    topic: 'Silat ar-Rahim (Maintaining Family Ties)',
    description:
      'Study the Islamic rulings on family ties — what counts as maintaining them, when it is difficult, and the rewards promised. The Prophet tied it to expanded provision and extended life.',
    resource: 'Surah An-Nisa 4:1 and Sahih al-Bukhari #5985',
  },
  worship: {
    topic: 'Khushu in Salah (Presence of heart in prayer)',
    description:
      'Study khushu — the inner dimension of prayer. Learn the meaning of what you recite, understand the movements, and prepare your heart before standing before Allah. This transforms prayer from ritual to refuge.',
    resource: 'Surah Al-Mu\u2019minun 23:1-2 and "Inner Dimensions of Prayer" by Ibn Qayyim',
  },
  provision: {
    topic: 'Tawakkul and Rizq',
    description:
      'Study the relationship between effort and trust in Allah for provision. Allah has guaranteed rizq for every creature. Your job is to take halal steps; His job is to provide. Understanding this frees the heart from financial anxiety.',
    resource: 'Surah Hud 11:6 and Surah At-Talaq 65:2-3',
  },
  knowledge: {
    topic: 'Adab al-Talab (Etiquette of seeking knowledge)',
    description:
      'Study the manners of a student of knowledge — sincerity, consistency, humility, and acting upon what you learn. The scholars say knowledge without adab is like a tree without roots.',
    resource: 'Surah Al-Mujadila 58:11 and the introduction to "Ta\u2019lim al-Muta\u2019allim"',
  },
  death: {
    topic: 'Dhikr al-Mawt (Remembering death)',
    description:
      'Study the Islamic understanding of death and the afterlife. Remembering death is not morbid — the Prophet called it the destroyer of pleasures, a tool that puts this world in perspective and prioritizes the Hereafter.',
    resource: 'Surah Al-Imran 3:185 and the hadith "Remember the destroyer of pleasures" (Tirmidhi)',
  },
  pride: {
    topic: 'Tawadu (Humility)',
    description:
      'Study the disease of kibr (pride) and its cure. The Prophet said no one with a seed of arrogance enters Paradise. Humility is not low self-esteem — it is recognizing that every blessing is from Allah, not from yourself.',
    resource: 'Sahih al-Bukhari #6125 and "The Disease and the Cure" by Ibn Qayyim',
  },
  greed: {
    topic: 'Zuhd (Detachment from the world)',
    description:
      'Study zuhd — not abandoning the world, but not letting it own your heart. The Prophet said be in this world as a stranger. Zuhd is freedom: possessing without being possessed.',
    resource: 'Surah At-Takathur 102 and the chapter on asceticism in "Riyad as-Salihin"',
  },
  envy: {
    topic: 'Hasad and its Cure (Envy and contentment)',
    description:
      'Study the disease of hasad (envy) — the first sin committed in Paradise by Iblis. Its cure is gratitude, making du\u2019a for the envied person, and recognizing that everyone\u2019s provision was written before birth.',
    resource: 'Surah Al-Falaq 113 and the chapter on envy in "The Disease and the Cure" by Ibn Qayyim',
  },
};

const DEFAULT_SUGGESTION: StudySuggestion = {
  topic: 'Tawheed (Oneness of Allah)',
  description:
    'Study the foundation of Islam — tawheed. Everything flows from knowing Allah: His names, His attributes, His rights over us. This is the starting point for every spiritual journey.',
  resource: 'Surah Al-Fatihah and "The Three Fundamental Principles" by Muhammad ibn Abdul-Wahhab',
};

export function suggestStudyTopic(emotions: string[]): StudySuggestion {
  for (const emotion of emotions) {
    if (SUGGESTION_MAP[emotion]) {
      return SUGGESTION_MAP[emotion];
    }
  }
  return DEFAULT_SUGGESTION;
}

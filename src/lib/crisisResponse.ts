import type { AssistantResponse, CrisisResource, GuidanceSection, Dua } from '../types/chat';

/**
 * Crisis detection and response system.
 *
 * When a user expresses thoughts of self-harm or suicide, the app must
 * respond with both Islamic guidance (suicide is haram, life is a sacred
 * trust from Allah) and professional psychiatric resources — combining
 * the roles of a mufti and a psychiatrist.
 */

/** Keywords and phrases that indicate a crisis message. */
const CRISIS_INDICATORS = [
  'end my life', 'end it all', 'ending my life', 'ending it all',
  'kill myself', 'killing myself', 'want to die', 'wanting to die',
  'wish i was dead', 'wish i were dead', 'better off dead',
  'suicide', 'suicidal', 'commit suicide',
  'self harm', 'self-harm', 'selfharm', 'cutting myself',
  'take my life', 'taking my life', 'take my own life',
  'no reason to live', 'no point living', 'no point in living',
  'dont want to live', "don't want to live", 'dont want to be here',
  "don't want to be here", 'cant go on', "can't go on",
  'end everything', 'over it all', 'done with life',
  'jump off', 'overdose', 'hang myself',
  'planning to end', 'plan to end', 'thoughts of ending',
  'tired of living', 'cant live anymore', "can't live anymore",
  'no will to live', 'lost the will',
  'i want to end', 'ready to end',
  'not worth living', 'life isnt worth', "life isn't worth",
  'hurt myself', 'harming myself',
  'i just want it to end', 'want it to end',
];

/** Returns true if the message contains crisis indicators. */
export function isCrisisMessage(message: string): boolean {
  const lower = message.toLowerCase();
  return CRISIS_INDICATORS.some((indicator) => lower.includes(indicator));
}

const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: 'iCall (Tata Institute of Social Sciences)',
    description: 'Free, confidential psychosocial helpline offering emotional support and crisis intervention across India.',
    contact: 'Call 9152987821',
    url: 'https://icallhelpline.org',
    available: 'Mon–Sat, 8 AM to 10 PM — India (toll-free)',
  },
  {
    name: 'Vandrevala Foundation Helpline',
    description: '24/7 mental health crisis helpline providing free, confidential counselling for depression, anxiety, and suicidal thoughts.',
    contact: 'Call 1860-2662-345 or 9999 666 555',
    url: 'https://www.vandrevalafoundation.com',
    available: '24 hours, 7 days a week — India',
  },
  {
    name: 'Kiran Helpline (Govt. of India, MoSJE)',
    description: 'Government-run mental health support helpline offering help in 13 languages for people in emotional distress.',
    contact: 'Call 1800-599-0019 (toll-free)',
    url: 'https://www.kiranmentalhealthhelpline.gov.in',
    available: '24 hours, 7 days a week — India',
  },
  {
    name: 'AASRA (Association for Suicide Prevention)',
    description: 'Community-based crisis helpline for individuals feeling suicidal or emotionally overwhelmed, run by trained volunteers.',
    contact: 'Call 98204 66726 or 022-2754 6669',
    url: 'https://www.aasra.info',
    available: '24 hours, 7 days a week — India',
  },
];

const CRISIS_REFLECTIONS = [
  "I hear you, and I am not going to look away from what you just said. The pain that brought you to this point is real, and I want to acknowledge how heavy it must be to carry. But I need you to hear something right now: your life is not yours to end. It is a trust from Allah, and the pain you feel today does not have the final word on your story. Please, before anything else, reach out to one of the resources below — right now, today.",
  "Thank you for trusting me enough to say this out loud. That took courage, even if it does not feel like it. What you are feeling is overwhelming, but it is not permanent — even though it feels like it will never end. Islam is absolutely clear: taking your own life is haram, and it is not the answer Allah wants for you. He wants you to stay, to reach out, to let someone help carry this. Please call one of the numbers below right now.",
  "I am sitting with you in this moment, and I am not leaving. The darkness you are describing is one of the hardest things a human being can face, and I want you to know two things at once: first, that Allah considers your life sacred and has forbidden you from ending it — and second, that this pain is treatable, and people can and do get through this with help. You do not have to do this alone. Please reach out to one of the crisis lines below, right now.",
];

const CRISIS_VERSES: GuidanceSection[] = [
  {
    quote: 'وَلَا تَقْتُلُوا أَنفُسَكُمْ ۚ إِنَّ اللَّهَ كَانَ بِكُمْ رَحِيمًا',
    translation: 'And do not kill yourselves. Indeed, Allah is to you ever Merciful. (Qur\u2019an 4:29)',
    source: 'Qur\u2019an, Surah An-Nisa 4:29',
    type: 'quran',
  },
  {
    quote: 'وَلَا تُلْقُوا بِأَيْدِيكُمْ إِلَى التَّهْلُكَةِ',
    translation: 'And do not throw yourselves into destruction. (Qur\u2019an 2:195)',
    source: 'Qur\u2019an, Surah Al-Baqarah 2:195',
    type: 'quran',
  },
  {
    quote: 'وَلَا تَيْأَسُوا مِن رَّوْحِ اللَّهِ ۖ إِنَّهُ لَا يَيْأَسُ مِن رَّوْحِ اللَّهِ إِلَّا الْقَوْمُ الْكَافِرُونَ',
    translation: 'And do not despair of the mercy of Allah. Indeed, no one despairs of the mercy of Allah except the disbelieving people. (Qur\u2019an 12:87)',
    source: 'Qur\u2019an, Surah Yusuf 12:87',
    type: 'quran',
  },
];

const CRISIS_STEPS = [
  [
    'Right now, this minute: call iCall at 9152987821 or Kiran at 1800-599-0019 (toll-free). Do not wait. Someone is waiting to listen.',
    'If you are alone, go to where other people are — a family member, a friend, a mosque, a coffee shop. Do not stay isolated.',
    'Remove any means of harm from your immediate reach. Give them to someone else or put them out of access.',
    'Make wudu and pray two units of salah. Even if you cannot find the words, the physical act of prayer grounds the body and the heart.',
  ],
  [
    'Contact a crisis line right now — this is not optional. Call iCall (9152987821) or AASRA (98204 66726). The people on the other end are trained to sit with you in this exact moment.',
    'Tell one person you trust what you are feeling. You do not have to explain everything — just say: "I am not safe right now, and I need you here."',
    'If you are in immediate danger, call 112 (emergency services in India) or go to the nearest hospital emergency room.',
    'Schedule an appointment with a mental health professional this week. Depression is treatable — this is a medical condition, not a spiritual failure.',
  ],
  [
    'Do one thing right now: call Vandrevala Foundation at 1860-2662-345. A trained crisis counsellor will talk you through this moment.',
    'Do not make any irreversible decision while in this emotional state. Feelings of this intensity often pass within hours or days, even when they feel permanent.',
    'Reach out to your local Imam or a trusted scholar — they can provide spiritual support alongside the professional help you need.',
    'Remember: seeking professional help is not a lack of faith. The Prophet (peace be upon him) said: "Seek treatment, for Allah has not made a disease without making a cure for it." (Sunan Abi Dawud 3855)',
  ],
];

const CRISIS_DUA: Dua = {
  arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ وَالْبُخْلِ وَالْجُبْنِ وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ',
  transliteration: 'Allahumma inni a\u2019udhu bika minal-hammi wal-hazan wal-\u2018ajzi wal-kasal wal-bukhli wal-jubn wa dala\u2019id-dayn wa ghalabatir-rijal',
  english: 'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from stinginess and cowardice, from the burden of debt and from being overpowered by men.',
  source: 'Sahih al-Bukhari 6369',
};

const CRISIS_HADITH_TEXT =
  'The Prophet (peace be upon him) said: "Whoever kills himself with a piece of iron, he will come on the Day of Resurrection with that iron in his hand, stabbing himself with it in the Fire of Hell, dwelling therein eternally. And whoever kills himself by drinking poison, he will be sipping it in the Fire of Hell, dwelling therein eternally. And whoever throws himself off a mountain, he will be thrown into the Fire of Hell, dwelling therein eternally."';

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Build a crisis response that combines the role of a mufti
 * (clear Islamic verdict: suicide is haram) and a psychiatrist
 * (professional crisis resources and grounding steps).
 */
export function buildCrisisResponse(): AssistantResponse {
  const reflection = pickRandom(CRISIS_REFLECTIONS);
  const guidance = pickRandom(CRISIS_VERSES);
  const steps = pickRandom(CRISIS_STEPS);

  return {
    reflection,
    guidance,
    steps,
    dua: CRISIS_DUA,
    hadiths: [
      {
        collection: 'Sahih al-Bukhari',
        hadithNumber: 5778,
        text: CRISIS_HADITH_TEXT,
        sourceLabel: 'Sahih al-Bukhari #5778',
        sourceUrl: 'https://sunnah.com/bukhari:5778',
        grade: 'Sahih',
        chapter: 'Book of Medicine',
        retrievedFrom: 'local',
      },
    ],
    hadithsFromApi: false,
    requiresDisclaimer: true,
    needsScholar: false,
    isCrisis: true,
    crisisResources: CRISIS_RESOURCES,
  };
}

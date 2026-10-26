import type { GuidanceEntry } from '../types/chat';

/**
 * Curated Islamic guidance entries. Each entry is mapped to emotional
 * / situational keywords and produces a structured 3-section response.
 * Sources are cited with established reference numbers.
 */
export const guidanceLibrary: GuidanceEntry[] = [
  {
    id: 'anxiety',
    triggers: ['anxious', 'anxiety', 'worried', 'worry', 'panic', 'nervous', 'stress', 'stressed', 'overwhelm', 'overwhelmed'],
    reflection:
      "I hear how heavy this feels for you right now. Anxiety can make the chest tight and the mind race, and it is completely human to feel that way. You are not weak for feeling anxious — you are carrying something real, and it takes courage to reach out and name it. I want you to know that this moment, however difficult, will pass, and you do not have to carry it alone.",
    reflections: [
      "I hear how heavy this feels for you right now. Anxiety can make the chest tight and the mind race, and it is completely human to feel that way. You are not weak for feeling anxious — you are carrying something real, and it takes courage to reach out and name it. I want you to know that this moment, however difficult, will pass, and you do not have to carry it alone.",
      "The weight you are describing is real, and I want to acknowledge how exhausting it is to carry that anxious energy in your chest and mind. What you are feeling is not a flaw in your faith or your character — it is a human response to something difficult. The fact that you are here, looking for a way through, already shows the strength you carry inside.",
      "It takes courage to put into words what anxiety feels like from the inside — that racing, restless energy that makes it hard to breathe or rest. You are not overreacting, and you are not alone in this. Let us take a moment together to find some ground beneath your feet, drawing from the wisdom that has steadied hearts for centuries.",
    ],
    guidanceQuote: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    guidanceTranslation:
      'Verily, in the remembrance of Allah do hearts find rest. (Qur\u2019an 13:28)',
    guidanceSource: 'Qur\u2019an, Surah Ar-Ra\u2019d 13:28',
    guidanceType: 'quran',
    steps: [
      'Pause and take five slow breaths, inhaling for 4 counts and exhaling for 6.',
      'Write down one specific worry, then ask: "Is this within my control today?"',
      'Keep a small dhikr counter or bead nearby and repeat your remembrance during tense moments.',
      'Limit news and social media intake in the hour before sleep.',
    ],
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
      transliteration: 'Allahumma inni a\u2019udhu bika minal-hammi wal-hazan',
      english:
        'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness.',
      source: 'Sahih al-Bukhari 6369',
    },
  },
  {
    id: 'sadness',
    triggers: ['sad', 'sadness', 'depress', 'depressed', 'down', 'low', 'unhappy', 'cry', 'crying', 'grief', 'grieving', 'loss', 'lonely', 'loneliness'],
    reflection:
      "Thank you for trusting me with something this tender. Sadness has a way of making the world feel quieter and heavier at the same time, and I want to honor that what you are feeling matters. Grief and sadness are not signs of weak faith — even the Prophets (peace be upon them) wept and grieved. You are allowed to feel this, and you are allowed to ask for comfort.",
    reflections: [
      "Thank you for trusting me with something this tender. Sadness has a way of making the world feel quieter and heavier at the same time, and I want to honor that what you are feeling matters. Grief and sadness are not signs of weak faith — even the Prophets (peace be upon them) wept and grieved. You are allowed to feel this, and you are allowed to ask for comfort.",
      "What you are carrying is heavy, and I am glad you chose to share it here. Sadness can feel isolating, like you are the only one moving through fog while the world carries on. You are not. Your grief is valid, your tears are valid, and the tradition we are drawing from has always made space for broken hearts to heal.",
      "There is a particular kind of ache in sadness that words rarely capture fully, but I want you to know that what you are feeling is seen and matters. The Prophets themselves knew grief deeply — Yakub wept until his sight faded, and the Messenger of Allah held his heart in his hands for the loss of those he loved. You are in good company, and this will not last forever.",
    ],
    guidanceQuote:
      'وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ',
    guidanceTranslation:
      'And give glad tidings to the patient — those who, when afflicted with calamity, say: "To Allah we belong, and to Him we shall return." (Qur\u2019an 2:155-156)',
    guidanceSource: 'Qur\u2019an, Surah Al-Baqarah 2:155-156',
    guidanceType: 'quran',
    steps: [
      'Reach out to one person today — even a short message counts as connection.',
      'Spend 10 minutes outdoors in daylight; natural light gently lifts the heart.',
      'Do one small, kind act for yourself today (a warm meal, a shower, a walk).',
      'Speak to a trusted scholar, counselor, or doctor if the heaviness persists for weeks.',
    ],
    dua: {
      arabic: 'اللَّهُمَّ اكْشِفْ عَنِّي الْهَمَّ وَالْحَزَنَ',
      transliteration: 'Allahumma-kshif \u2018anni wal-hazan',
      english:
        'O Allah, remove from me my worry and sadness, my weakness and laziness, my stinginess and cowardice.',
      source: 'Sahih al-Bukhari 6369 (excerpt)',
    },
  },
  {
    id: 'motivation',
    triggers: ['motivation', 'motivate', 'lazy', 'laziness', 'procrastinat', 'unproductive', 'stuck', 'routine', 'daily', 'habit', 'discipline'],
    reflection:
      "It sounds like you are wanting more from your days but feel a gap between intention and action — that is such a common and honest place to be. The fact that you are asking for motivation means a part of you already believes change is possible, and that part is worth listening to. Let\u2019s build momentum gently, one small step at a time, so the progress actually lasts.",
    reflections: [
      "It sounds like you are wanting more from your days but feel a gap between intention and action — that is such a common and honest place to be. The fact that you are asking for motivation means a part of you already believes change is possible, and that part is worth listening to. Let\u2019s build momentum gently, one small step at a time, so the progress actually lasts.",
      "That feeling of being stuck — knowing you want to do more but not being able to get moving — is one of the most frustrating places to be. But notice something: you reached out today, which means the part of you that wants growth is still very much alive. That is the part we will work with, gently and without judgment.",
      "It takes honesty to admit you are struggling with motivation, and that honesty is actually the first sign of change. The gap between where you are and where you want to be is not a character flaw — it is a signal that something in your rhythm needs adjusting. Let us find that rhythm together, starting small.",
    ],
    guidanceQuote:
      'وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ',
    guidanceTranslation:
      'And that there is not for man except that [good] for which he strives. (Qur\u2019an 53:39)',
    guidanceSource: 'Qur\u2019an, Surah An-Najm 53:39',
    guidanceType: 'quran',
    steps: [
      'Pick ONE small task for tomorrow and complete it before anything else.',
      'Anchor a new habit to an existing one: "After Fajr, I will [new habit]."',
      'Use the 5-minute rule: start the task for just 5 minutes; momentum often follows.',
      'End each day by writing down one thing you accomplished, however small.',
    ],
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ',
      transliteration: 'Allahumma inni a\u2019udhu bika minal-\u2018ajzi wal-kasal',
      english:
        'O Allah, I seek refuge in You from incapacity and laziness, from cowardice and old age.',
      source: 'Sahih al-Bukhari 6369 (excerpt)',
    },
  },
  {
    id: 'patience',
    triggers: ['patience', 'patient', 'sabr', 'endure', 'endurance', 'hardship', 'difficult', 'trial', 'tests', 'tested', 'suffer'],
    reflection:
      "What you are going through asks a lot of you, and I want to acknowledge the strength it takes just to keep showing up. Patience in Islam is not about silently swallowing pain — it is about facing hardship with dignity, trust, and persistence, even when it is hard. The fact that you are seeking patience is already a form of it. You are further along than you think.",
    reflections: [
      "What you are going through asks a lot of you, and I want to acknowledge the strength it takes just to keep showing up. Patience in Islam is not about silently swallowing pain — it is about facing hardship with dignity, trust, and persistence, even when it is hard. The fact that you are seeking patience is already a form of it. You are further along than you think.",
      "The trial you are facing is not invisible to me, even through these words. It takes something out of you to keep going when every day feels like an uphill walk. But patience (sabr) in our tradition was never about pretending things do not hurt — it is about staying upright while they do, trusting that the weight will ease. You are already doing that.",
      "I want to pause and recognize what it costs you to keep showing up through something this difficult. Sabr is often misunderstood as passive endurance, but it is really an active, beautiful struggle — holding onto trust when it would be easier to let go. You are here, asking for patience. That asking is itself a form of it.",
    ],
    guidanceQuote:
      'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ',
    guidanceTranslation:
      'Indeed, the patient will be given their reward without account. (Qur\u2019an 39:10)',
    guidanceSource: 'Qur\u2019an, Surah Az-Zumar 39:10',
    guidanceType: 'quran',
    steps: [
      'Name the trial honestly to yourself — patience begins with truthful acknowledgement.',
      'Break the hard period into smaller "one day at a time" segments.',
      'Each morning, set one intention: "Today I will respond with patience, not reaction."',
      'Reflect each evening on one moment you handled with grace; thank Allah for it.',
    ],
    dua: {
      arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا',
      transliteration: 'Rabbana afrigh \u2018alayna sabran wa thabbit aqdamana',
      english:
        'Our Lord, pour upon us patience and plant firmly our feet and give us victory over the disbelieving people.',
      source: 'Qur\u2019an, Surah Al-Baqarah 2:250',
    },
  },
  {
    id: 'fear',
    triggers: ['fear', 'afraid', 'scared', 'terrified', 'phobia', 'frightened', 'dread', 'nervous about'],
    reflection:
      "Fear can feel like it shrinks the whole world down to one threat, and I understand how exhausting that is. It takes real bravery to name a fear out loud — doing so is already loosening its grip. You are not alone in this, and there is guidance that has comforted hearts facing fear for over a thousand years. Let\u2019s walk through it together.",
    reflections: [
      "Fear can feel like it shrinks the whole world down to one threat, and I understand how exhausting that is. It takes real bravery to name a fear out loud — doing so is already loosening its grip. You are not alone in this, and there is guidance that has comforted hearts facing fear for over a thousand years. Let\u2019s walk through it together.",
      "Naming what scares you is an act of courage most people never take. Fear has a way of making the world feel small and dangerous, but you reached out today, which means a part of you knows there is something bigger than the fear. Let us look at what the tradition says about holding fear with faith.",
      "I hear you, and I want you to know that what you are feeling is not weakness. Fear is one of the most powerful emotions we carry, and it takes real strength to face it rather than run from it. The Companions felt it too, and the Prophet taught them — and us — how to meet fear with trust and remembrance.",
    ],
    guidanceQuote:
      'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    guidanceTranslation:
      'And whoever fears Allah, He will make for him a way out. (Qur\u2019an 65:2)',
    guidanceSource: 'Qur\u2019an, Surah At-Talaq 65:2',
    guidanceType: 'quran',
    steps: [
      'When fear spikes, ground yourself: name 5 things you see, 4 you can touch, 3 you hear.',
      'Identify whether the fear is a real, present danger or a projected "what-if" — respond accordingly.',
      'Recite the morning and evening adhkar consistently; they were taught specifically for protection.',
      'If fear is disrupting daily life, speak with a trusted professional — seeking help is encouraged.',
    ],
    dua: {
      arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ',
      transliteration: 'Hasbunallahu wa ni\u2019mal wakeel',
      english:
        'Allah is sufficient for us, and He is the best disposer of affairs.',
      source: 'Sunan Abi Dawud, reported by Ibn Abbas',
    },
  },
  {
    id: 'anger',
    triggers: ['angry', 'anger', 'furious', 'rage', 'irritat', 'frustrat', 'mad'],
    reflection:
      "Anger is a powerful emotion, and it usually shows up when something we care about feels threatened or disrespected. I hear that something has stirred that in you. The goal is not to never feel anger — that would be inhuman — but to meet it with awareness so it does not make our choices for us. Let\u2019s look at how the Sunnah guides us to handle it.",
    reflections: [
      "Anger is a powerful emotion, and it usually shows up when something we care about feels threatened or disrespected. I hear that something has stirred that in you. The goal is not to never feel anger — that would be inhuman — but to meet it with awareness so it does not make our choices for us. Let\u2019s look at how the Sunnah guides us to handle it.",
      "Something has clearly touched a nerve, and I want to validate that — anger usually rises when something we value has been crossed. The Sunnah does not ask us to never feel it; it asks us to not let it drive. There is real wisdom in how the Prophet handled anger, and it starts with something surprisingly simple.",
      "I can feel the heat behind what you wrote, and that tells me you care deeply about something that feels wronged right now. Anger itself is not the enemy — it is what we do with it that matters. The Prophet gave us practical, body-level tools for meeting anger before it takes over, and they still work today.",
    ],
    guidanceQuote:
      'لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ، إِنَّمَا الشَّدِيدُ الَّذِي يَمْلِكُ نَفْسَهُ عِنْدَ الْغَضَبِ',
    guidanceTranslation:
      'The strong person is not the one who overcomes others in wrestling, but the one who controls himself when angry.',
    guidanceSource: 'Sahih al-Bukhari 6114 | Sunnah.com',
    guidanceType: 'hadith',
    steps: [
      'When anger rises, stop and sit down if you are standing; if still angry, lie down.',
      'Make wudu \u2014 water on the face and arms cools both body and temper.',
      'Practice silence: if you cannot speak good, stay quiet until the wave passes.',
      'Seek refuge in Allah from Shaytan: say "A\u2019udhu billahi minash-shaytanir-rajim."',
    ],
    dua: {
      arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      transliteration: 'A\u2019udhu billahi minash-shaytanir-rajim',
      english:
        'I seek refuge in Allah from the accursed Shaytan.',
      source: 'Sahih al-Bukhari 6115',
    },
  },
  {
    id: 'gratitude',
    triggers: ['grateful', 'gratitude', 'thankful', 'blessing', 'blessed', 'thank', 'shukr', 'appreciate'],
    reflection:
      "It is beautiful that you are turning your heart toward gratitude — that alone is a sign of a soft, alive faith. Gratitude does not erase hardship, but it shifts the heart so it can see light even in heavy seasons. Let\u2019s deepen this feeling with guidance and a practice you can carry into each day.",
    reflections: [
      "It is beautiful that you are turning your heart toward gratitude — that alone is a sign of a soft, alive faith. Gratitude does not erase hardship, but it shifts the heart so it can see light even in heavy seasons. Let\u2019s deepen this feeling with guidance and a practice you can carry into each day.",
      "The fact that you are pausing to give thanks, even in the middle of whatever you are walking through, says something beautiful about your heart. Gratitude is not about ignoring difficulty — it is about training the eye to see the blessings that coexist with the hardship. Let us build on that instinct.",
      "There is a particular brightness in someone who chooses gratitude, and I can sense it in your message. Shukr is more than just saying thank you — it is a way of living that keeps the heart soft and open. Let us look at how to deepen that practice so it becomes a daily rhythm, not just a moment.",
    ],
    guidanceQuote:
      'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    guidanceTranslation:
      'And [recall] when your Lord proclaimed: "If you are grateful, I will surely increase you." (Qur\u2019an 14:7)',
    guidanceSource: 'Qur\u2019an, Surah Ibrahim 14:7',
    guidanceType: 'quran',
    steps: [
      'Each morning, name three specific blessings before checking your phone.',
      'Pair gratitude with prayer: after each salah, thank Allah for one thing.',
      'Tell one person something you appreciate about them today.',
      'Keep a small "blessings" note on your phone and add to it weekly.',
    ],
    dua: {
      arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ',
      transliteration: 'Alhamdulillahil-ladhi bi-ni\u2019matihi tatimmus-salihat',
      english:
        'All praise is for Allah, by Whose blessing good deeds are completed.',
      source: 'Sunan Ibn Majah 3803',
    },
  },
  {
    id: 'forgiveness',
    triggers: ['forgive', 'forgiveness', 'guilt', 'guilty', 'sin', 'sinned', 'repent', 'repentance', 'mistake', 'wrong', 'ashamed', 'regret'],
    reflection:
      "Whatever weighs on your conscience, I want you to know that turning back to Allah is itself a gift He places in the heart. The very fact that you feel regret is a sign your faith is alive, not dead. Allah\u2019s mercy is vast beyond what any of us can measure, and He loves the one who returns to Him again and again. Let\u2019s take this step together.",
    reflections: [
      "Whatever weighs on your conscience, I want you to know that turning back to Allah is itself a gift He places in the heart. The very fact that you feel regret is a sign your faith is alive, not dead. Allah\u2019s mercy is vast beyond what any of us can measure, and He loves the one who returns to Him again and again. Let\u2019s take this step together.",
      "The guilt you are carrying is heavy, but I want to reframe it for you: that ache in your heart is not a punishment — it is evidence that your faith is still alive. A heart that has gone cold does not feel regret. You are being pulled back, and that pull itself is mercy. Let us walk through the door of tawbah together.",
      "What you are feeling — that weight of having done something wrong — is actually one of the most hopeful signs in the spiritual life. It means your heart is still soft, still awake. Allah does not turn away the one who returns; He runs toward them. Let us take this step of repentance together, one breath at a time.",
    ],
    guidanceQuote:
      'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
    guidanceTranslation:
      'Say, "O My servants who have transgressed against themselves, do not despair of the mercy of Allah." (Qur\u2019an 39:53)',
    guidanceSource: 'Qur\u2019an, Surah Az-Zumar 39:53',
    guidanceType: 'quran',
    steps: [
      'Make a sincere, private istighfar right now — name the wrong and ask for pardon.',
      'If the wrong harmed another person, plan to make amends to them directly.',
      'Commit to the "Sayyid al-Istighfar" each morning with presence.',
      'Replace the sin\u2019s time and place with a good habit so the door does not reopen.',
    ],
    dua: {
      arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ',
      transliteration:
        'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana \u2018abduk',
      english:
        'O Allah, You are my Lord; there is no god but You. You created me and I am Your servant. (Sayyid al-Istighfar)',
      source: 'Sahih al-Bukhari 6306',
    },
  },
  {
    id: 'hope',
    triggers: ['hope', 'hopeless', 'despair', 'give up', 'future', 'lost', 'direction', 'purpose', 'meaning'],
    reflection:
      "When the future feels unclear, it can be hard to imagine things getting better — I understand that quiet heaviness. But hope in Islam is not blind optimism; it is trust in the One who has always held our story, even in chapters we did not understand at the time. You being here, asking for hope, is itself a flicker of it. Let\u2019s tend to that flicker.",
    reflections: [
      "When the future feels unclear, it can be hard to imagine things getting better — I understand that quiet heaviness. But hope in Islam is not blind optimism; it is trust in the One who has always held our story, even in chapters we did not understand at the time. You being here, asking for hope, is itself a flicker of it. Let\u2019s tend to that flicker.",
      "The place you are in — where everything feels uncertain and the road ahead is hidden — is one of the hardest places to stand. But I want you to notice something: you are still here, still looking for a reason to hope. That is not nothing. That is the seed we will water together, using the wisdom of those who walked through darkness before us.",
      "It takes a particular kind of courage to admit you feel hopeless, because it means you still care enough to want things to be different. Hope in our tradition was never about pretending everything is fine — it is about trusting the One who turns the chapters, even when this one hurts. You asking today is already hope in action.",
    ],
    guidanceQuote:
      'لَا تَقْنَطُوا مِن رَّوْحِ اللَّهِ',
    guidanceTranslation:
      'Do not despair of the relief of Allah. (Qur\u2019an 12:87)',
    guidanceSource: 'Qur\u2019an, Surah Yusuf 12:87',
    guidanceType: 'quran',
    steps: [
      'Write down one past difficulty that eventually eased \u2014 let it remind you this too will pass.',
      'Set one small, hopeful goal for the coming week and take a first step today.',
      'Guard your inner talk: when "I can\u2019t" arises, gently add "...yet, with Allah\u2019s help."',
      'Reconnect with your "why" \u2014 your values, your people, your hopes for the Hereafter.',
    ],
    dua: {
      arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
      transliteration: 'Allahumma inni as\u2019alukal-huda wat-tuqa wal-\u2018afafa wal-ghina',
      english:
        'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.',
      source: 'Sahih Muslim 2721',
    },
  },
  {
    id: 'default',
    triggers: [],
    reflection:
      "Thank you for sharing what is on your heart. Whatever you are carrying, know that this is a safe space to reflect, seek guidance, and find comfort. I am here to listen and to offer what wisdom the Islamic tradition holds for your situation. Could you tell me a little more about what you are feeling or going through?",
    reflections: [
      "Thank you for sharing what is on your heart. Whatever you are carrying, know that this is a safe space to reflect, seek guidance, and find comfort. I am here to listen and to offer what wisdom the Islamic tradition holds for your situation. Could you tell me a little more about what you are feeling or going through?",
      "I am glad you reached out today. Whatever brought you here — whether it is something specific weighing on you or a more general sense of needing direction — this is a space for you to slow down and reflect. Tell me a little more about what is on your mind, and we will find guidance together.",
      "Sometimes the hardest part is knowing where to begin, and you have already done that by being here. Whatever you are walking through, the Islamic tradition has wisdom for it — for the heart, for the mind, for the body. Share a bit more about what you are feeling, and we will explore it together.",
    ],
    guidanceQuote:
      'وَقُل رَّبِّ زِدْنِي عِلْمًا',
    guidanceTranslation:
      'And say, "My Lord, increase me in knowledge." (Qur\u2019an 20:114)',
    guidanceSource: 'Qur\u2019an, Surah Ta-Ha 20:114',
    guidanceType: 'quran',
    steps: [
      'Take a moment to name, in a few words, exactly what you are feeling right now.',
      'Consider what you most need today: comfort, guidance, motivation, or patience.',
      'Try one of the quick-start topics from the sidebar if you are unsure where to begin.',
    ],
    dua: {
      arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
      transliteration: 'Rabbish-rahli sadri wa yassirli amri',
      english:
        'My Lord, expand for me my chest and ease for me my task.',
      source: 'Qur\u2019an, Surah Ta-Ha 20:25-26',
    },
  },
];

/**
 * Find the best matching guidance entry for a user message.
 * Falls back to the default entry when no keywords match.
 */
export function findGuidance(message: string): GuidanceEntry {
  const lower = message.toLowerCase();
  let best: GuidanceEntry | null = null;
  let bestScore = 0;

  for (const entry of guidanceLibrary) {
    if (entry.id === 'default') continue;
    let score = 0;
    for (const trigger of entry.triggers) {
      if (lower.includes(trigger)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  const entry = best ?? guidanceLibrary.find((g) => g.id === 'default')!;

  // Pick a random reflection variant if available.
  if (entry.reflections && entry.reflections.length > 1) {
    const idx = Math.floor(Math.random() * entry.reflections.length);
    return { ...entry, reflection: entry.reflections[idx] };
  }

  return entry;
}

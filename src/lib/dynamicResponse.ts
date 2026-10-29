import type { Dua, GuidanceSection } from '../types/chat';
import type { DuaCategory } from '../types/chat';
import { extractEmotions } from './relevance';

/**
 * Dynamic response builder. Instead of a single static reflection/verse/dua
 * per emotion, this module composes each response from multiple pools so
 * repeated messages about the same topic still get varied, rich responses.
 */

interface VersePool {
  quote: string;
  translation: string;
  source: string;
}

interface DuaPool {
  arabic: string;
  transliteration: string;
  english: string;
  source: string;
}

interface ReflectionPool {
  reflections: string[];
  verses: VersePool[];
  steps: string[][];
  duas: DuaPool[];
}

const POOLS: Record<string, ReflectionPool> = {
  anxiety: {
    reflections: [
      "I hear how heavy this feels for you right now. Anxiety can make the chest tight and the mind race, and it is completely human to feel that way. You are not weak for feeling anxious — you are carrying something real, and it takes courage to reach out and name it.",
      "The weight you are describing is real, and I want to acknowledge how exhausting it is to carry that anxious energy. What you are feeling is not a flaw in your faith — it is a human response to something difficult. The fact that you are here already shows the strength you carry.",
      "It takes courage to put into words what anxiety feels like — that restless energy that makes it hard to breathe or rest. You are not overreacting, and you are not alone. Let us take a moment together to find some ground beneath your feet.",
    ],
    verses: [
      { quote: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', translation: 'Verily, in the remembrance of Allah do hearts find rest. (Qur\u2019an 13:28)', source: 'Qur\u2019an, Surah Ar-Ra\u2019d 13:28' },
      { quote: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا', translation: 'And whoever fears Allah, He will make for him a way out. (Qur\u2019an 65:2)', source: 'Qur\u2019an, Surah At-Talaq 65:2' },
      { quote: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', translation: 'Allah is sufficient for us, and He is the best disposer of affairs. (Qur\u2019an 3:173)', source: 'Qur\u2019an, Surah Al-Imran 3:173' },
    ],
    steps: [
      [
        'Pause and take five slow breaths, inhaling for 4 counts and exhaling for 6.',
        'Write down one specific worry, then ask: "Is this within my control today?"',
        'Keep a small dhikr counter nearby and repeat your remembrance during tense moments.',
        'Limit news and social media in the hour before sleep.',
      ],
      [
        'Place your hand on your chest and say "La ilaha illa Allah" seven times, slowly.',
        'Identify the single most immediate concern — not every worry, just the one closest to you right now.',
        'Drink a glass of cold water; the physical sensation helps reset the nervous system.',
        'Recite the morning or evening adhkar if you have not yet today.',
      ],
      [
        'Ground yourself right now: name 5 things you see, 4 you can touch, 3 you hear.',
        'Ask yourself: "What is one small thing I can do in the next 10 minutes?" Then do it.',
        'Send a short message to someone you trust — you do not have to explain everything.',
        'Pray two units of salah with the intention of seeking calm, even if it is outside the usual times.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', transliteration: 'Allahumma inni a\u2019udhu bika minal-hammi wal-hazan', english: 'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness, from cowardice and miserliness.', source: 'Sahih al-Bukhari 6369' },
      { arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', transliteration: 'Hasbunallahu wa ni\u2019mal wakeel', english: 'Allah is sufficient for us, and He is the best disposer of affairs.', source: 'Qur\u2019an 3:173, reported by Ibn Abbas in Sahih al-Bukhari 4573' },
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْكَرْبِ', transliteration: 'Allahumma inni a\u2019udhu bika minal-hammi wal-karab', english: 'O Allah, I seek refuge in You from anxiety and sorrow, from inability and laziness.', source: 'Sahih al-Bukhari 6369' },
    ],
  },
  sadness: {
    reflections: [
      "Thank you for trusting me with something this tender. Sadness has a way of making the world feel quieter and heavier. Grief and sadness are not signs of weak faith — even the Prophets (peace be upon them) wept and grieved. You are allowed to feel this, and you are allowed to ask for comfort.",
      "What you are carrying is heavy, and I am glad you chose to share it here. Sadness can feel isolating, like you are the only one moving through fog. You are not. Your grief is valid, your tears are valid, and the tradition we are drawing from has always made space for broken hearts to heal.",
      "There is a particular kind of ache in sadness that words rarely capture, but I want you to know that what you are feeling is seen and matters. The Prophets themselves knew grief deeply — Yaqub wept until his sight faded, and the Messenger of Allah held his heart in his hands for the loss of those he loved.",
    ],
    verses: [
      { quote: 'وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', translation: 'And give glad tidings to the patient — those who, when afflicted with calamity, say: "To Allah we belong, and to Him we shall return." (Qur\u2019an 2:155-156)', source: 'Qur\u2019an, Surah Al-Baqarah 2:155-156' },
      { quote: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease. (Qur\u2019an 94:6)', source: 'Qur\u2019an, Surah Ash-Sharh 94:6' },
      { quote: 'وَلَا تَهِنُوا وَلَا تَحْزَنُوا وَأَنتُمُ الْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ', translation: 'So do not weaken and do not grieve, and you will be superior if you are believers. (Qur\u2019an 3:139)', source: 'Qur\u2019an, Surah Al-Imran 3:139' },
    ],
    steps: [
      [
        'Reach out to one person today — even a short message counts as connection.',
        'Spend 10 minutes outdoors in daylight; natural light gently lifts the heart.',
        'Do one small, kind act for yourself today (a warm meal, a shower, a walk).',
        'Speak to a trusted scholar, counselor, or doctor if the heaviness persists for weeks.',
      ],
      [
        'Write down what you are grieving — giving it words helps the heart process it.',
        'Make wudu and pray two units of salah, asking Allah for ease and comfort.',
        'Recite "La hawla wa la quwwata illa billah" when the sadness feels overwhelming.',
        'Connect with someone who knew the person or situation you are grieving — shared memory heals.',
      ],
      [
        'Allow yourself to cry if you need to — tears are not weakness, they are the heart\'s way of releasing.',
        'Listen to the Quran recitation of Surah Ar-Rahman or Surah Al-Fatihah for 10 minutes.',
        'Eat something nourishing even if you do not feel hungry — sadness can suppress appetite.',
        'Set one gentle intention for tomorrow, nothing ambitious — just one small good thing.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ اكْشِفْ عَنِّي الْهَمَّ وَالْحَزَنَ', transliteration: 'Allahumma-kshif \u2018anni wal-hazan', english: 'O Allah, remove from me my worry and sadness, my weakness and laziness, my stinginess and cowardice.', source: 'Sahih al-Bukhari 6369 (excerpt)' },
      { arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimeen', english: 'There is no god but You, glory to You. Indeed, I have been of the wrongdoers. (Du\u2019a of Yunus)', source: 'Qur\u2019an 21:87 — Sunan at-Tirmidhi 3505' },
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ وَالْعَجْزِ وَالْكَسَلِ', transliteration: 'Allahumma inni a\u2019udhu bika minal-hammi wal-hazan wal-\u2018ajzi wal-kasal', english: 'O Allah, I seek refuge in You from worry and sadness, from weakness and laziness.', source: 'Sahih al-Bukhari 6369' },
    ],
  },
  patience: {
    reflections: [
      "What you are going through asks a lot of you, and I want to acknowledge the strength it takes just to keep showing up. Patience in Islam is not about silently swallowing pain — it is about facing hardship with dignity, trust, and persistence. You are further along than you think.",
      "The trial you are facing is not invisible to me, even through these words. It takes something out of you to keep going when every day feels like an uphill walk. But sabr in our tradition was never about pretending things do not hurt — it is about staying upright while they do.",
      "I want to pause and recognize what it costs you to keep showing up through something this difficult. Sabr is often misunderstood as passive endurance, but it is really an active, beautiful struggle — holding onto trust when it would be easier to let go.",
    ],
    verses: [
      { quote: 'إِنَّمَا يُوَفَّى الصَّابِرُونَ أَجْرَهُم بِغَيْرِ حِسَابٍ', translation: 'Indeed, the patient will be given their reward without account. (Qur\u2019an 39:10)', source: 'Qur\u2019an, Surah Az-Zumar 39:10' },
      { quote: 'وَبَشِّرِ الصَّابِرِينَ', translation: 'And give glad tidings to the patient. (Qur\u2019an 2:155)', source: 'Qur\u2019an, Surah Al-Baqarah 2:155' },
      { quote: 'وَاللَّهُ يُحِبُّ الصَّابِرِينَ', translation: 'And Allah loves the patient. (Qur\u2019an 3:146)', source: 'Qur\u2019an, Surah Al-Imran 3:146' },
    ],
    steps: [
      [
        'Name the trial honestly to yourself — patience begins with truthful acknowledgement.',
        'Break the hard period into smaller "one day at a time" segments.',
        'Each morning, set one intention: "Today I will respond with patience, not reaction."',
        'Reflect each evening on one moment you handled with grace; thank Allah for it.',
      ],
      [
        'Write down what you are enduring and what you are learning from it — both matter.',
        'When the trial intensifies, recite "Inna lillahi wa inna ilayhi raji\u2019oon" slowly and with presence.',
        'Find one person who has walked a similar path and talk to them — shared endurance strengthens.',
        'Keep a small journal of the moments Allah gave you strength you did not know you had.',
      ],
      [
        'Accept that some things cannot be changed — sabr begins where control ends.',
        'Make du\u2019a specifically for strength to bear this, not just for the trial to end.',
        'Look for one blessing hidden inside the hardship, even if it is small.',
        'Remember that the Prophet (peace be upon him) said trials expiate sins — this is not wasted pain.',
      ],
    ],
    duas: [
      { arabic: 'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا وَثَبِّتْ أَقْدَامَنَا', transliteration: 'Rabbana afrigh \u2018alayna sabran wa thabbit aqdamana', english: 'Our Lord, pour upon us patience and plant firmly our feet.', source: 'Qur\u2019an, Surah Al-Baqarah 2:250' },
      { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الصَّبْرَ وَالْيَقِينَ', transliteration: 'Allahumma inni as\u2019alukas-sabra wal-yaqeen', english: 'O Allah, I ask You for patience and certainty.', source: 'Sahih Ibn Hibban 992' },
      { arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', transliteration: 'Inna lillahi wa inna ilayhi raji\u2019oon', english: 'To Allah we belong, and to Him we shall return.', source: 'Qur\u2019an 2:156 — Sahih al-Bukhari 1302' },
    ],
  },
  hope: {
    reflections: [
      "When the future feels unclear, it can be hard to imagine things getting better. But hope in Islam is not blind optimism — it is trust in the One who has always held our story, even in chapters we did not understand at the time. You being here, asking for hope, is itself a flicker of it.",
      "The place you are in — where everything feels uncertain and the road ahead is hidden — is one of the hardest places to stand. But you are still here, still looking for a reason to hope. That is not nothing. That is the seed we will water together.",
      "It takes a particular kind of courage to admit you feel hopeless, because it means you still care enough to want things to be different. Hope in our tradition was never about pretending everything is fine — it is about trusting the One who turns the chapters.",
    ],
    verses: [
      { quote: 'لَا تَقْنَطُوا مِن رَّوْحِ اللَّهِ', translation: 'Do not despair of the relief of Allah. (Qur\u2019an 12:87)', source: 'Qur\u2019an, Surah Yusuf 12:87' },
      { quote: 'وَمَن يَقْتَرِفْ حَسَنَةً نَّزِدْ لَهُ فِيهَا حُسْنًا', translation: 'And whoever does a good deed, We increase for him therein good. (Qur\u2019an 42:23)', source: 'Qur\u2019an, Surah Ash-Shura 42:23' },
      { quote: 'إِنَّ اللَّهَ يُحِبُّ الْمُتَوَكِّلِينَ', translation: 'Indeed, Allah loves those who trust in Him. (Qur\u2019an 3:159)', source: 'Qur\u2019an, Surah Al-Imran 3:159' },
    ],
    steps: [
      [
        'Write down one past difficulty that eventually eased — let it remind you this too will pass.',
        'Set one small, hopeful goal for the coming week and take a first step today.',
        'Guard your inner talk: when "I can\u2019t" arises, gently add "...yet, with Allah\u2019s help."',
        'Reconnect with your "why" — your values, your people, your hopes for the Hereafter.',
      ],
      [
        'Recite "Ya Hayyu Ya Qayyum, bi-rahmatika astagheeth" when despair feels heavy.',
        'Look at one area of your life that is still good — however small — and name it out loud.',
        'Reach out to someone who reminds you of who you are when you forget.',
        'Read the story of Yusuf (peace be upon him) — a reminder that Allah\u2019s plans unfold in ways we cannot see.',
      ],
      [
        'Make a list of three things you are looking forward to, even small ones.',
        'Pray salah and make sujud — the closest a servant is to their Lord is in prostration.',
        'Replace one hopeless thought today with "Allahu ma\u2019i" (Allah is with me).',
        'Take one concrete action toward the future you want, no matter how tiny.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى', transliteration: 'Allahumma inni as\u2019alukal-huda wat-tuqa wal-\u2018afafa wal-ghina', english: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.', source: 'Sahih Muslim 2721' },
      { arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ', transliteration: 'Ya Hayyu Ya Qayyum, bi-rahmatika astagheeth', english: 'O Living, O Sustaining, by Your mercy I seek help.', source: 'Sunan at-Tirmidhi 3522' },
      { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', transliteration: 'Rabbish-rahli sadri wa yassirli amri', english: 'My Lord, expand for me my chest and ease for me my task.', source: 'Qur\u2019an, Surah Ta-Ha 20:25-26' },
    ],
  },
  motivation: {
    reflections: [
      "It sounds like you are wanting more from your days but feel a gap between intention and action. The fact that you are asking for motivation means a part of you already believes change is possible. Let us build momentum gently, one small step at a time.",
      "That feeling of being stuck — knowing you want to do more but not being able to get moving — is one of the most frustrating places to be. But you reached out today, which means the part of you that wants growth is still very much alive.",
      "It takes honesty to admit you are struggling with motivation, and that honesty is actually the first sign of change. The gap between where you are and where you want to be is not a character flaw — it is a signal that something in your rhythm needs adjusting.",
    ],
    verses: [
      { quote: 'وَأَن لَّيْسَ لِلْإِنسَانِ إِلَّا مَا سَعَىٰ', translation: 'And that there is not for man except that [good] for which he strives. (Qur\u2019an 53:39)', source: 'Qur\u2019an, Surah An-Najm 53:39' },
      { quote: 'فَاعْبُدْنِي وَأَقِمِ الصَّلَاةَ لِذِكْرِي', translation: 'So worship Me and establish prayer for My remembrance. (Qur\u2019an 20:14)', source: 'Qur\u2019an, Surah Ta-Ha 20:14' },
      { quote: 'وَقُلِ اعْمَلُوا فَسَيَرَى اللَّهُ عَمَلَكُمْ', translation: 'And say: Act, for Allah will see your deeds. (Qur\u2019an 9:105)', source: 'Qur\u2019an, Surah At-Tawbah 9:105' },
    ],
    steps: [
      [
        'Pick ONE small task for tomorrow and complete it before anything else.',
        'Anchor a new habit to an existing one: "After Fajr, I will [new habit]."',
        'Use the 5-minute rule: start the task for just 5 minutes; momentum often follows.',
        'End each day by writing down one thing you accomplished, however small.',
      ],
      [
        'Break your biggest goal into the smallest possible first step — then do only that step.',
        'Set a daily Fajr alarm; starting the day with prayer sets the tone for everything after.',
        'Remove one distraction from your environment for 24 hours — just one.',
        'Find an accountability partner and share your one goal for this week.',
      ],
      [
        'Write your goal on paper and place it where you will see it first thing in the morning.',
        'Time-block 25 minutes for focused work, then rest 5 (the Pomodoro method).',
        'Read Surah Al-Asr — it is a reminder that time and faith are deeply connected.',
        'Do not wait to feel motivated — act first, and motivation often follows the action.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْعَجْزِ وَالْكَسَلِ', transliteration: 'Allahumma inni a\u2019udhu bika minal-\u2018ajzi wal-kasal', english: 'O Allah, I seek refuge in You from incapacity and laziness.', source: 'Sahih al-Bukhari 6369' },
      { arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', transliteration: 'Allahumma a\u2019inni \u2018ala dhikrika wa shukrika wa husni \u2018ibadatik', english: 'O Allah, help me to remember You, thank You, and worship You in the best manner.', source: 'Sunan Abi Dawud 1521' },
      { arabic: 'رَبِّ زِدْنِي عِلْمًا', transliteration: 'Rabbi zidni ilma', english: 'My Lord, increase me in knowledge.', source: 'Qur\u2019an, Surah Ta-Ha 20:114' },
    ],
  },
  anger: {
    reflections: [
      "Anger is a powerful emotion, and it usually shows up when something we care about feels threatened or disrespected. The goal is not to never feel anger — that would be inhuman — but to meet it with awareness so it does not make our choices for us.",
      "Something has clearly touched a nerve, and I want to validate that — anger usually rises when something we value has been crossed. The Sunnah does not ask us to never feel it; it asks us to not let it drive.",
      "I can feel the heat behind what you wrote, and that tells me you care deeply about something that feels wronged right now. Anger itself is not the enemy — it is what we do with it that matters.",
    ],
    verses: [
      { quote: 'وَالْكَاظِمِينَ الْغَيْظَ', translation: 'And those who restrain anger. (Qur\u2019an 3:134)', source: 'Qur\u2019an, Surah Al-Imran 3:134' },
      { quote: 'وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا', translation: 'And when the ignorant address them, they say words of peace. (Qur\u2019an 25:63)', source: 'Qur\u2019an, Surah Al-Furqan 25:63' },
      { quote: 'ادْفَعْ بِالَّتِي هِيَ أَحْسَنُ', translation: 'Repel [evil] with that which is better. (Qur\u2019an 23:96)', source: 'Qur\u2019an, Surah Al-Mu\u2019minun 23:96' },
    ],
    steps: [
      [
        'When anger rises, stop and sit down if you are standing; if still angry, lie down.',
        'Make wudu — water on the face and arms cools both body and temper.',
        'Practice silence: if you cannot speak good, stay quiet until the wave passes.',
        'Seek refuge in Allah: say "A\u2019udhu billahi minash-shaytanir-rajim."',
      ],
      [
        'Walk away from the situation physically — distance changes perspective.',
        'Drink cold water slowly; the physical cooling calms the nervous system.',
        'Write what you are angry about instead of saying it — paper can absorb what a person cannot.',
        'Wait 24 hours before responding to whatever triggered you; the anger will shrink by then.',
      ],
      [
        'Take three deep breaths before saying anything at all — just three.',
        'Ask yourself: "Will I be proud of what I am about to say in one hour?"',
        'Make istighfar 10 times — each one loosens the grip of anger on the chest.',
        'Identify what value was threatened — understanding the root calms the reaction.',
      ],
    ],
    duas: [
      { arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', transliteration: 'A\u2019udhu billahi minash-shaytanir-rajim', english: 'I seek refuge in Allah from the accursed Shaytan.', source: 'Sahih al-Bukhari 6115' },
      { arabic: 'اللَّهُمَّ اغْفِرْ لِي ذَنْبِي كُلَّهُ', transliteration: 'Allahumma-ghfir li dhanbi kullahu', english: 'O Allah, forgive my sin, all of it — the first and the last, the public and the private.', source: 'Sahih Muslim 4867' },
      { arabic: 'لَا إِلَهَ إِلَّا اللَّهُ', transliteration: 'La ilaha illallah', english: 'There is no god but Allah. (A simple remembrance that calms the heart)', source: 'Sahih al-Bukhari 6405' },
    ],
  },
  gratitude: {
    reflections: [
      "It is beautiful that you are turning your heart toward gratitude — that alone is a sign of a soft, alive faith. Gratitude does not erase hardship, but it shifts the heart so it can see light even in heavy seasons.",
      "The fact that you are pausing to give thanks, even in the middle of whatever you are walking through, says something beautiful about your heart. Gratitude is not about ignoring difficulty — it is about training the eye to see the blessings that coexist with it.",
      "There is a particular brightness in someone who chooses gratitude, and I can sense it in your message. Shukr is more than just saying thank you — it is a way of living that keeps the heart soft and open.",
    ],
    verses: [
      { quote: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ', translation: 'And [recall] when your Lord proclaimed: "If you are grateful, I will surely increase you." (Qur\u2019an 14:7)', source: 'Qur\u2019an, Surah Ibrahim 14:7' },
      { quote: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ', translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me. (Qur\u2019an 2:152)', source: 'Qur\u2019an, Surah Al-Baqarah 2:152' },
      { quote: 'مَّا يَفْعَلُ اللَّهُ بِعَذَابِكُمْ إِن شَكَرْتُمْ وَآمَنتُمْ', translation: 'Why should Allah punish you if you are grateful and believe? (Qur\u2019an 4:147)', source: 'Qur\u2019an, Surah An-Nisa 4:147' },
    ],
    steps: [
      [
        'Each morning, name three specific blessings before checking your phone.',
        'Pair gratitude with prayer: after each salah, thank Allah for one thing.',
        'Tell one person something you appreciate about them today.',
        'Keep a small "blessings" note on your phone and add to it weekly.',
      ],
      [
        'After each prayer, spend 30 seconds thanking Allah for something specific — not general.',
        'Write a heartfelt message to someone who has helped you — gratitude expressed multiplies.',
        'Look at something you use daily and reflect on what life would be without it.',
        'Give sadaqah today, even something small — gratitude and giving go hand in hand.',
      ],
      [
        'Before sleep, replay the day and find three moments of ease — however small.',
        'Say "Alhamdulillah" with presence 100 times today, using a counter if needed.',
        'Notice one person in your life you take for granted and do something kind for them.',
        'Read Surah Ar-Rahman — it is a meditation on gratitude for Allah\u2019s countless blessings.',
      ],
    ],
    duas: [
      { arabic: 'الْحَمْدُ لِلَّهِ الَّذِي بِنِعْمَتِهِ تَتِمُّ الصَّالِحَاتُ', transliteration: 'Alhamdulillahil-ladhi bi-ni\u2019matihi tatimmus-salihat', english: 'All praise is for Allah, by Whose blessing good deeds are completed.', source: 'Sunan Ibn Majah 3803' },
      { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: 'Alhamdulillahi Rabbil-\u2018alameen', english: 'All praise is for Allah, the Lord of all the worlds.', source: 'Qur\u2019an, Surah Al-Fatihah 1:2' },
      { arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ', transliteration: 'Allahumma a\u2019inni \u2018ala dhikrika wa shukrika', english: 'O Allah, help me to remember You and be grateful to You.', source: 'Sunan Abi Dawud 1521' },
    ],
  },
  forgiveness: {
    reflections: [
      "Whatever weighs on your conscience, I want you to know that turning back to Allah is itself a gift He places in the heart. The very fact that you feel regret is a sign your faith is alive. Allah\u2019s mercy is vast beyond measure, and He loves the one who returns to Him again and again.",
      "The guilt you are carrying is heavy, but let me reframe it: that ache in your heart is not a punishment — it is evidence that your faith is still alive. A heart that has gone cold does not feel regret. You are being pulled back, and that pull itself is mercy.",
      "What you are feeling — that weight of having done something wrong — is actually one of the most hopeful signs in the spiritual life. It means your heart is still soft, still awake. Allah does not turn away the one who returns; He runs toward them.",
    ],
    verses: [
      { quote: 'قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ', translation: 'Say, "O My servants who have transgressed against themselves, do not despair of the mercy of Allah." (Qur\u2019an 39:53)', source: 'Qur\u2019an, Surah Az-Zumar 39:53' },
      { quote: 'إِنَّ اللَّهَ يُحِبُّ التَّوَّابِينَ', translation: 'Indeed, Allah loves those who are constantly repentant. (Qur\u2019an 2:222)', source: 'Qur\u2019an, Surah Al-Baqarah 2:222' },
      { quote: 'وَهُوَ الَّذِي يَقْبَلُ التَّوْبَةَ عَنْ عِبَادِهِ', translation: 'And it is He who accepts repentance from His servants. (Qur\u2019an 42:25)', source: 'Qur\u2019an, Surah Ash-Shura 42:25' },
    ],
    steps: [
      [
        'Make a sincere, private istighfar right now — name the wrong and ask for pardon.',
        'If the wrong harmed another person, plan to make amends to them directly.',
        'Commit to the "Sayyid al-Istighfar" each morning with presence.',
        'Replace the sin\u2019s time and place with a good habit so the door does not reopen.',
      ],
      [
        'Perform wudu and pray two units of salah with the intention of repentance (Salat al-Tawbah).',
        'Write down what you did wrong, then write "Astaghfirullah" beneath it — then tear the paper up.',
        'If someone was harmed by your action, reach out and apologize today, not later.',
        'Pick one good deed to do in the next 24 hours as a sign of your return to Allah.',
      ],
      [
        'Recite "Astaghfirullah" 100 times today — the Prophet did this daily.',
        'Identify what triggered the wrong and put a barrier between you and that trigger.',
        'Read the du\u2019a of Sayyid al-Istighfar morning and evening for the next week.',
        'Remember: Allah\u2019s mercy is bigger than your sin. He has forgiven worse. He will forgive you.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ', transliteration: 'Allahumma anta Rabbi la ilaha illa anta, khalaqtani wa ana \u2018abduk', english: 'O Allah, You are my Lord; there is no god but You. You created me and I am Your servant. (Sayyid al-Istighfar)', source: 'Sahih al-Bukhari 6306' },
      { arabic: 'رَبَّنَا ظَلَمْنَا أَنفُسَنَا وَإِن لَّمْ تَغْفِرْ لَنَا وَتَرْحَمْنَا لَنَكُونَنَّ مِنَ الْخَاسِرِينَ', transliteration: 'Rabbana zalamna anfusana wa in lam taghfir lana wa tarhamna lanakoonanna minal-khasireen', english: 'Our Lord, we have wronged ourselves, and if You do not forgive us and have mercy on us, we will surely be among the losers.', source: 'Qur\u2019an, Surah Al-A\u2019raf 7:23' },
      { arabic: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيَّ الْقَيُّومَ وَأَتُوبُ إِلَيْهِ', transliteration: 'Astaghfirullahal-\u2018azeem alladhi la ilaha illa huwal-hayyul-qayyoomu wa atoobu ilayh', english: 'I seek forgiveness from Allah, the Mighty, besides whom there is no god, the Living, the Sustainer, and I turn to Him in repentance.', source: 'Sunan Abi Dawud 1517' },
    ],
  },
  comfort: {
    reflections: [
      "Whatever is hurting you right now, I want you to know that you do not have to carry it in silence. The ache you feel is real, and reaching out — even in this small way — is already a step toward relief. Let us find some comfort together from the One who made the heart and knows how to still it.",
      "I hear a hurting in what you wrote, and I want to sit with you in it for a moment before offering anything. The pain of feeling alone or distressed is one of the heaviest kinds of weight. You are not as alone as it feels right now — the One who is closer to you than your jugular vein is listening.",
      "Sometimes the heart just needs to be told: it is okay. It is okay to feel broken. It is okay to not have the words. The Prophet (peace be upon him) taught us that even silence, when it is turned toward Allah, is a form of worship. Let us sit together in that silence and let it heal.",
    ],
    verses: [
      { quote: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ', translation: 'Verily, in the remembrance of Allah do hearts find rest. (Qur\u2019an 13:28)', source: 'Qur\u2019an, Surah Ar-Ra\u2019d 13:28' },
      { quote: 'وَنُنَزِّلُ مِنَ الْقُرْآنِ مَا هُوَ شِفَاءٌ وَرَحْمَةٌ لِّلْمُؤْمِنِينَ', translation: 'And We send down of the Quran that which is healing and mercy for the believers. (Qur\u2019an 17:82)', source: 'Qur\u2019an, Surah Al-Isra 17:82' },
      { quote: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', translation: 'And He is with you wherever you are. (Qur\u2019an 57:4)', source: 'Qur\u2019an, Surah Al-Hadid 57:4' },
    ],
    steps: [
      [
        'Place your right hand on your chest and say "Allahu Akbar" three times, slowly.',
        'Recite Surah Al-Ikhlas three times — it is short and brings immediate calm.',
        'Make a cup of tea or warm drink and sit somewhere quiet for 10 minutes.',
        'Text someone you trust: "I am having a hard day. Can you pray for me?"',
      ],
      [
        'Listen to a recitation of Surah Al-Mulk or Ar-Rahman with your eyes closed.',
        'Make wudu — the act of washing each limb is itself a form of renewal.',
        'Go outside and look at the sky for a few minutes — vastness puts pain in perspective.',
        'Write what is hurting you on paper, then write "Allah is with me" beneath it.',
      ],
      [
        'Hold your prayer beads and say "Subhanallah" 33 times, slowly and with presence.',
        'Wrap yourself in a warm blanket and make du\u2019a — Allah hears the whispered prayer.',
        'Call or visit someone who loves you — do not isolate, even though it feels easier.',
        'Remind yourself: "This pain is temporary. Allah\u2019s mercy is permanent."',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ', transliteration: 'Allahumma inni a\u2019udhu bika minal-hammi wal-hazan', english: 'O Allah, I seek refuge in You from worry and grief, from incapacity and laziness.', source: 'Sahih al-Bukhari 6369' },
      { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', transliteration: 'Rabbish-rahli sadri wa yassirli amri', english: 'My Lord, expand for me my chest and ease for me my task.', source: 'Qur\u2019an, Surah Ta-Ha 20:25-26' },
      { arabic: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ', transliteration: 'La ilaha illa anta subhanaka inni kuntu minaz-zalimeen', english: 'There is no god but You, glory to You. Indeed, I have been of the wrongdoers.', source: 'Qur\u2019an 21:87 — Sunan at-Tirmidhi 3505' },
    ],
  },
  character: {
    reflections: [
      "The fact that you are thinking about character and how you treat others tells me your heart is in the right place. Good character in Islam is not just about being nice — it is about embodying the qualities Allah loves: mercy, honesty, patience, and generosity of spirit.",
      "Character is one of the heaviest things on the scale on the Day of Judgment, and you are here asking about it — that itself is a sign of a heart that wants to grow. Let us look at what the Sunnah teaches about becoming someone whose presence brings ease to others.",
      "I love that you are reflecting on this. The Prophet (peace be upon him) was the best of character, and he said that nothing is heavier on the scale than good character. It touches everything — your prayer, your relationships, your standing with Allah.",
    ],
    verses: [
      { quote: 'وَإِنَّكَ لَعَلَىٰ خُلُقٍ عَظِيمٍ', translation: 'And indeed, you are of a great moral character. (Qur\u2019an 68:4)', source: 'Qur\u2019an, Surah Al-Qalam 68:4' },
      { quote: 'خَذِ الْعَفْوَ وَأْمُرْ بِالْعُرْفِ وَأَعْرِضْ عَنِ الْجَاهِلِينَ', translation: 'Take what is given freely, enjoin what is good, and turn away from the ignorant. (Qur\u2019an 7:199)', source: 'Qur\u2019an, Surah Al-A\u2019raf 7:199' },
      { quote: 'وَقُولُوا لِلنَّاسِ حُسْنًا', translation: 'And speak to people good words. (Qur\u2019an 2:83)', source: 'Qur\u2019an, Surah Al-Baqarah 2:83' },
    ],
    steps: [
      [
        'Smile at the next three people you meet — it is a form of charity.',
        'Listen fully in your next conversation without planning your response.',
        'Forgive one small wrong done to you today — let it go intentionally.',
        'Speak one honest, kind word to someone who needs to hear it.',
      ],
      [
        'Before speaking, ask: "Is this true? Is it kind? Is it necessary?" Let two of three guide you.',
        'Make eye contact with the next person who serves you (cashier, waiter, family) and thank them sincerely.',
        'Hold back one sharp comment today — restraint is a form of character.',
        'Read about the Prophet\u2019s character in "Riyad as-Salihin" for 10 minutes.',
      ],
      [
        'Do one act of kindness today that no one will see — character is what you do in private.',
        'Apologize to someone you wronged, even if it was weeks ago — humility is strength.',
        'Make du\u2019a for someone you find difficult — it softens your heart toward them.',
        'Reflect tonight: "Who was easier to deal with because of me today?"',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ حَسِّنْ خُلُقِي كَمَا حَسَّنْتَ خَلْقِي', transliteration: 'Allahumma hassin khuluqi kama hassanta khalqi', english: 'O Allah, make my character good as You have made my form good.', source: 'Sahih Muslim 2610' },
      { arabic: 'اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَعْمَالِ وَأَحْسَنِ الْأَخْلَاقِ', transliteration: 'Allahumma-hdini li-ahsanil-a\u2019mali wa-ahsanil-akhlaq', english: 'O Allah, guide me to the best of deeds and the best of character.', source: 'Sunan an-Nasa\u2019i 1033' },
      { arabic: 'رَبِّ هَبْ لِي حُسْنًا وَزَيِّنْنِي بِالْحُسْنِ', transliteration: 'Rabbi hab li husnan wa zayyinni bil-husn', english: 'My Lord, grant me good and beautify me with good character.', source: 'Based on Qur\u2019an 49:3, adapted' },
    ],
  },
  worship: {
    reflections: [
      "The desire to strengthen your prayer and deepen your connection with Allah is itself a sign of a living heart. The fact that you care about your worship means your faith is active, not dormant. Sometimes the hardest part is not the prayer itself but the gap between where we are and where we want to be. Let us close that gap gently.",
      "Struggling with worship is one of the most honest struggles a believer can name. You are not alone in this — every Muslim goes through seasons where prayer feels heavy or mechanical. The Prophet himself taught that prayer is the ascension of the believer, and like any ascent, it has steep sections. The key is not to stop climbing.",
      "What you are feeling is not a failure of faith — it is the beginning of a deeper one. The heart that worries about its prayer is a heart that has not given up. Allah sees your striving, even the striving you cannot articulate. Let us work together on making your worship feel less like a duty and more like a refuge.",
    ],
    verses: [
      { quote: 'أَقِمِ الصَّلَاةَ لِذِكْرِي', translation: 'Establish prayer for My remembrance. (Qur\u2019an 20:14)', source: 'Qur\u2019an, Surah Ta-Ha 20:14' },
      { quote: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ', translation: 'Establish prayer, give zakah, and bow with those who bow. (Qur\u2019an 2:43)', source: 'Qur\u2019an, Surah Al-Baqarah 2:43' },
      { quote: 'إِنَّ الصَّلَاةَ تَنْهَىٰ عَنِ الْفَحْشَاءِ وَالْمُنكَرِ', translation: 'Indeed, prayer prohibits immorality and wrongdoing. (Qur\u2019an 29:45)', source: 'Qur\u2019an, Surah Al-Ankabut 29:45' },
    ],
    steps: [
      [
        'Start with just one prayer on time today — let it be Fajr or Isha. Build from there.',
        'Before each salah, take 30 seconds to pause and set your intention. Say to yourself: "I am about to stand before Allah."',
        'Keep a small note with "Allah is watching" near your prayer area.',
        'After each prayer, sit for two extra minutes making dhikr. This extends the connection.',
      ],
      [
        'Use a prayer app or alarm for each prayer time. When the alarm sounds, stop what you are doing.',
        'Make wudu with intention — feel the water and remember that you are preparing to meet your Lord.',
        'Learn the meaning of what you recite in salah. Understanding Surah Al-Fatihah transforms the prayer.',
        'Pray one extra unit (nafl) after Isha — just one. Small consistency beats large bursts.',
      ],
      [
        'Listen to a beautiful recitation of the Quran for 5 minutes before prayer to soften your heart.',
        'Choose one prayer to perform in congregation at the mosque this week.',
        'Write down one thing you are grateful for before each prayer — gratitude opens the heart.',
        'When distraction comes during salah, gently return to your recitation. Do not fight the thought — just return.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', transliteration: 'Allahumma a\u2019inni \u2018ala dhikrika wa shukrika wa husni \u2018ibadatik', english: 'O Allah, help me to remember You, thank You, and worship You in the best manner.', source: 'Sunan Abi Dawud 1521' },
      { arabic: 'رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي', transliteration: 'Rabbij-\u2018alni muqeem as-salati wa min dhurriyyati', english: 'My Lord, make me an establisher of prayer and many of my descendants.', source: 'Qur\u2019an, Surah Ibrahim 14:40' },
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ قَلْبٍ لَا يَخْشَعُ', transliteration: 'Allahumma inni a\u2019udhu bika min qalbin la yakhsha\u2019', english: 'O Allah, I seek refuge in You from a heart that does not humble itself.', source: 'Sunan an-Nasa\u2019i (adapted)' },
    ],
  },
  provision: {
    reflections: [
      "Financial stress is one of the heaviest burdens a person can carry, and I want you to know that Allah sees every unpaid bill, every sleepless night, every moment you swallowed your pride. Your worth is not measured by your bank account. The Prophet himself experienced hunger and poverty, and he taught us that rizq is in Allah\u2019s hands, not ours.",
      "The weight you are carrying is real, and it is not a sign of weak faith. Some of the most beloved people to Allah were among the poorest. What you are going through is a test of patience and trust, not a punishment. Your job is to take the steps you can and leave the result to the One who provides for every creature on earth.",
      "I hear the stress in your words, and I do not want to minimize it. Money problems touch everything — your family, your dignity, your peace of mind. But remember: Allah has promised to provide for every living thing. Your provision was written before you were born, and it will reach you. The anxiety is natural, but it does not change what Allah has already decreed.",
    ],
    verses: [
      { quote: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا ۝ وَيَرْزُقْهُ مِنْ حَيْثُ لَا يَحْتَسِبُ', translation: 'And whoever fears Allah, He will make for him a way out, and provide for him from where he does not expect. (Qur\u2019an 65:2-3)', source: 'Qur\u2019an, Surah At-Talaq 65:2-3' },
      { quote: 'وَفِي السَّمَاءِ رِزْقُكُمْ وَمَا تُوعَدُونَ', translation: 'And in the heaven is your provision and whatever you are promised. (Qur\u2019an 51:22)', source: 'Qur\u2019an, Surah Adh-Dhariyat 51:22' },
      { quote: 'وَمَا مِن دَابَّةٍ فِي الْأَرْضِ إِلَّا عَلَى اللَّهِ رِزْقُهَا', translation: 'And there is no creature on earth but that upon Allah is its provision. (Qur\u2019an 11:6)', source: 'Qur\u2019an, Surah Hud 11:6' },
    ],
    steps: [
      [
        'Sit down and list your actual needs versus wants. Clarity is the first step toward barakah.',
        'Make istighfar 10 times after each prayer — the Quran promises it brings provision.',
        'Reach out to your local masjid or Islamic charity — there is no shame in asking for help.',
        'Make a sincere du\u2019a during sujud asking Allah for halal provision. Sujud is the closest you are to Him.',
      ],
      [
        'Review your spending for one week and identify one non-essential you can cut.',
        'Give even a small sadaqah daily — charity does not decrease wealth; it increases barakah in it.',
        'Wake up 15 minutes before Fajr and pray two units seeking Allah\u2019s help with your situation.',
        'Update your CV or reach out to one contact about work opportunities today.',
      ],
      [
        'Recite "Astaghfirullah" 100 times today — the Prophet linked istighfar to expanded provision.',
        'Maintain ties of kinship — the Prophet said it expands rizq and extends life.',
        'Make a specific plan for one halal income stream you can pursue, even a small one.',
        'Trust Allah\u2019s timing. Your provision is coming. Your job is to take the steps, not control the outcome.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ اكْفِنِي بِحَلَالِكَ عَنْ حَرَامِكَ وَأَغْنِنِي بِفَضْلِكَ عَمَّنْ سِوَاكَ', transliteration: 'Allahumma-kfini bi-halalika \u2018an haramika wa aghnini bi-fadlika \u2018amman siwak', english: 'O Allah, suffice me with what You have made halal so I do not need what You have made haram, and enrich me with Your bounty so I do not need anyone but You.', source: 'Sunan at-Tirmidhi 3563' },
      { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى', transliteration: 'Allahumma inni as\u2019alukal-huda wat-tuqa wal-\u2018afafa wal-ghina', english: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.', source: 'Sahih Muslim 2721' },
      { arabic: 'اللَّهُمَّ ارْزُقْنِي حَلَالًا طَيِّبًا', transliteration: 'Allahumma-rzuqni halalan tayyiban', english: 'O Allah, provide me with halal and pure sustenance.', source: 'Based on Prophetic supplications' },
    ],
  },
  knowledge: {
    reflections: [
      "The fact that you are seeking knowledge and wanting to improve yourself is a beautiful sign. The Prophet said that whoever Allah wishes good for, He gives him understanding of the religion. Your desire to learn is not random — it is a sign that Allah wants good for you.",
      "Struggling with studies or feeling like you are not smart enough is something so many people go through, but it does not define your potential. Knowledge in Islam is not about being the cleverest person in the room — it is about sincerity, consistency, and asking Allah to open your understanding. Your effort is the seed; barakah is the harvest.",
      "The pressure you are feeling — whether it is exams, assignments, or the weight of expectations — is real. But remember that seeking knowledge is one of the highest forms of worship. Every minute you spend learning with a sincere intention is recorded as a good deed. You are not just studying; you are worshiping.",
    ],
    verses: [
      { quote: 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ', translation: 'Allah will raise those who have believed among you and those who were given knowledge, by degrees. (Qur\u2019an 58:11)', source: 'Qur\u2019an, Surah Al-Mujadila 58:11' },
      { quote: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', translation: 'And say: My Lord, increase me in knowledge. (Qur\u2019an 20:114)', source: 'Qur\u2019an, Surah Ta-Ha 20:114' },
      { quote: 'إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ', translation: 'Only those fear Allah, from among His servants, who have knowledge. (Qur\u2019an 35:28)', source: 'Qur\u2019an, Surah Fatir 35:28' },
    ],
    steps: [
      [
        'Begin every study session with "Bismillah" and the du\u2019a "Rabbi zidni ilma" — ask Allah to open your understanding.',
        'Break your study into 25-minute focused blocks with 5-minute breaks (Pomodoro). Consistency beats intensity.',
        'Teach what you just learned to someone else — even explaining it aloud solidifies it in your mind.',
        'Review your notes before sleep — the brain consolidates information during rest.',
      ],
      [
        'Make wudu before studying — purity helps focus, and barakah begins with intention.',
        'Eliminate one distraction during study time: put your phone in another room.',
        'Set one realistic goal per session: "I will master this one concept today."',
        'Make du\u2019a after each study session thanking Allah for what you learned and asking for retention.',
      ],
      [
        'Find a study partner or group — accountability and shared learning double the motivation.',
        'Use the 80/20 rule: identify the 20% of material that will yield 80% of results.',
        'Take care of your body — sleep, hydration, and exercise directly affect memory and focus.',
        'Do not compare yourself to others. Your journey with knowledge is between you and Allah.',
      ],
    ],
    duas: [
      { arabic: 'رَبِّ زِدْنِي عِلْمًا', transliteration: 'Rabbi zidni ilma', english: 'My Lord, increase me in knowledge.', source: 'Qur\u2019an, Surah Ta-Ha 20:114' },
      { arabic: 'اللَّهُمَّ انْفَعْنِي بِمَا عَلَّمْتَنِي وَعَلِّمْنِي مَا يَنْفَعُنِي وَزِدْنِي عِلْمًا', transliteration: 'Allahumma-nfa\u2019ni bima \u2018allamtani wa \u2018allimni ma yanfa\u2019uni wa zidni ilma', english: 'O Allah, benefit me with what You have taught me, teach me what will benefit me, and increase me in knowledge.', source: 'Sunan at-Tirmidhi (adapted)' },
      { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي وَاحْلُلْ عُقْدَةً مِنْ لِسَانِي', transliteration: 'Rabbish-rahli sadri wa yassirli amri wa-hlul uqdatan min lisani', english: 'My Lord, expand for me my chest, ease my task, and loosen the knot from my tongue.', source: 'Qur\u2019an, Surah Ta-Ha 20:25-27' },
    ],
  },
  death: {
    reflections: [
      "Grief is the price we pay for love, and the depth of what you are feeling is a measure of how deeply you loved the one you lost. Islam does not ask you to stop feeling the ache — even the Prophet wept for his loved ones and said: The eye tears, the heart grieves, and we only say what pleases our Lord. Your tears are not a lack of faith. They are the overflow of love.",
      "What you are going through is one of the hardest experiences a human being can face. Loss changes the shape of everything — your days, your thoughts, your sense of the world. But I want you to hold onto one truth: the one you lost is in the hands of the Most Merciful, and every tear you shed, every sleepless night, every moment of grief is recorded. Nothing is wasted.",
      "There are no words that can fill the space left by someone you loved. But there is something real in knowing that this separation is not permanent. The Prophet promised that the believer will be reunited with their loved ones in Paradise. This grief is a passage, not a destination. You will see them again, by Allah\u2019s mercy.",
    ],
    verses: [
      { quote: 'وَبَشِّرِ الصَّابِرِينَ ۝ الَّذِينَ إِذَا أَصَابَتْهُم مُّصِيبَةٌ قَالُوا إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', translation: 'And give glad tidings to the patient — those who, when afflicted with calamity, say: "To Allah we belong, and to Him we shall return." (Qur\u2019an 2:155-156)', source: 'Qur\u2019an, Surah Al-Baqarah 2:155-156' },
      { quote: 'كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ ۖ وَإِنَّمَا تُوَفَّوْنَ أُجُورَكُمْ يَوْمَ الْقِيَامَةِ', translation: 'Every soul will taste death, and you will only be given your reward on the Day of Resurrection. (Qur\u2019an 3:185)', source: 'Qur\u2019an, Surah Al-Imran 3:185' },
      { quote: 'إِنَّ الْمُتَّقِينَ فِي جَنَّاتٍ وَنَهَرٍ ۝ فِي مَقْعَدِ صِدْقٍ عِندَ مَلِيكٍ مُّقْتَدِرِ', translation: 'Indeed, the righteous will be in gardens and rivers, in the seat of honor with a Sovereign, Perfect in Ability. (Qur\u2019an 54:54-55)', source: 'Qur\u2019an, Surah Al-Qamar 54:54-55' },
    ],
    steps: [
      [
        'Allow yourself to grieve without judgment. Tears are not weakness — the Prophet himself wept.',
        'Make du\u2019a for the one you lost: "Allahumma-ghfir lahu/arhamhu" — this benefits them and heals you.',
        'Give sadaqah on their behalf — it keeps their good deeds flowing and connects you to their legacy.',
        'Speak to someone who knew them. Shared memories are a form of healing.',
      ],
      [
        'Recite "Inna lillahi wa inna ilayhi raji\u2019oon" when the grief surges. It reconnects you to Allah\u2019s plan.',
        'Write a letter to the one you lost. Say everything you did not get to say.',
        'Maintain your prayers even if they feel empty right now. Structure carries you when emotion cannot.',
        'Be gentle with yourself. Grief has no timeline. Do not rush your healing.',
      ],
      [
        'Visit their grave and make du\u2019a — the Prophet taught that the dead hear and benefit from the prayers of the living.',
        'If you are afraid of death yourself, use that fear as motivation to prepare — strengthen your faith and repent.',
        'Remember: the one you lost would want you to keep living, keep praying, keep hoping.',
        'When you are ready, do something good in their name — a habit, a charity, a prayer. It keeps them alive in your actions.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ اغْفِرْ لَهُ وَارْحَمْهُ وَعَافِهِ وَاعْفُ عَنْهُ', transliteration: 'Allahumma-ghfir lahu warhamhu wa \u2018afihi wa\u2019fu \u2018anhu', english: 'O Allah, forgive him/her, have mercy on him/her, grant him/her well-being, and pardon him/her.', source: 'Sahih Muslim 964' },
      { arabic: 'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', transliteration: 'Inna lillahi wa inna ilayhi raji\u2019oon', english: 'To Allah we belong, and to Him we shall return.', source: 'Qur\u2019an 2:156 — Sahih al-Bukhari 1302' },
      { arabic: 'اللَّهُمَّ اجْعَلْ قَبْرِي فِي جَنَّتِكَ وَلَا تُضِلَّنِي بَعْدَ إِذْ هَدَيْتَنِي', transliteration: 'Allahummaj-\u2018al qabri fi jannatika wa la tudillani ba\u2019da idh hadaytani', english: 'O Allah, make my grave a garden from Your Paradise, and do not let me go astray after You have guided me.', source: 'Based on Prophetic supplications' },
    ],
  },
  pride: {
    reflections: [
      "The fact that you are aware of your pride and want to change it is itself the beginning of humility. A truly arrogant person never asks this question. The heart that says \u2018I need to work on my pride\u2019 is a heart that is already softening. That softening is a gift from Allah.",
      "Pride is one of the most subtle diseases of the heart because it disguises itself as confidence, competence, or even religiousness. But the Prophet gave us the diagnosis: arrogance is rejecting the truth and looking down on people. The cure is not to think less of yourself — it is to think of yourself less.",
      "What you are struggling with is something every sincere believer battles at some point. The companions of the Prophet themselves feared pride in their hearts. The fact that you are concerned about it shows your faith is alive and fighting. That fight is the proof that humility is winning.",
    ],
    verses: [
      { quote: 'وَلَا تُصَعِّرْ خَدَّكَ لِلنَّاسِ وَلَا تَمْشِ فِي الْأَرْضِ مَرَحًا', translation: 'And do not turn your cheek away from people, and do not walk through the earth exultantly. (Qur\u2019an 31:18)', source: 'Qur\u2019an, Surah Luqman 31:18' },
      { quote: 'إِنَّ اللَّهَ لَا يُحِبُّ كُلَّ مُخْتَالٍ فَخُورٍ', translation: 'Indeed, Allah does not like every arrogant and boastful person. (Qur\u2019an 31:18)', source: 'Qur\u2019an, Surah Luqman 31:18' },
      { quote: 'وَعِبَادُ الرَّحْمَنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا', translation: 'And the servants of the Most Merciful are those who walk upon the earth easily. (Qur\u2019an 25:63)', source: 'Qur\u2019an, Surah Al-Furqan 25:63' },
    ],
    steps: [
      [
        'Sit on the floor to eat, at least once a day — the Prophet recommended this as a humility practice.',
        'Serve someone today without being asked and without seeking acknowledgment.',
        'Ask someone you respect for advice on something you think you already know — listen without correcting.',
        'Make istighfar 100 times today — recognizing your own sins is the antidote to pride.',
      ],
      [
        'Greet people first, even those you consider "below" you in status. The Prophet always greeted first.',
        'Visit a hospital or graveyard — nothing puts the ego in its place like seeing human fragility.',
        'Thank Allah for every ability you have, recognizing it is a gift, not your own achievement.',
        'Apologize to someone you wronged, even if it was small. Swallowing pride is medicine for the heart.',
      ],
      [
        'Reflect on your origin: dust, a drop of fluid, a body that will return to dust. Pride has no foundation.',
        'Sit in the company of people more knowledgeable or pious than you — it naturally humbles the heart.',
        'Do a task you consider "beneath" you: clean, serve, carry something for someone.',
        'Make du\u2019a specifically for humility: "Allahumma-hassin khuluqi" — ask Allah to soften your heart.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ حَسِّنْ خُلُقِي كَمَا حَسَّنْتَ خَلْقِي', transliteration: 'Allahumma hassin khuluqi kama hassanta khalqi', english: 'O Allah, make my character good as You have made my form good.', source: 'Sahih Muslim 2610' },
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكِبْرِ', transliteration: 'Allahumma inni a\u2019udhu bika minal-kibr', english: 'O Allah, I seek refuge in You from arrogance.', source: 'Based on Prophetic supplications' },
      { arabic: 'اللَّهُمَّ اجْعَلْ فِي قَلْبِي خُشُوعًا وَفِي نَفْسِي تَوَاضُعًا', transliteration: 'Allahummaj-\u2018al fi qalbi khushu\u2019an wa fi nafs tawadu\u2019an', english: 'O Allah, place humility in my heart and meekness in my soul.', source: 'Based on Prophetic supplications' },
    ],
  },
  greed: {
    reflections: [
      "The desire for more is built into human nature — the Prophet told us that if a person had a valley of gold, they would want two. You are not broken for feeling this way. The work is not to eliminate desire but to channel it toward what lasts: the Hereafter. The heart that is attached to this world is never at rest; the heart that is attached to Allah is content with whatever He gives.",
      "What you are experiencing is the tension between what the world tells you to want and what your soul actually needs. Materialism promises satisfaction but always moves the finish line. Islam offers something different: contentment. Not having everything you want, but wanting what you have. That is the freedom the Prophet lived and taught.",
      "The pull you feel toward accumulation — whether it is money, possessions, or status — is not something to be ashamed of. It is something to be aware of. The Companions who were wealthy were not condemned for their wealth; they were praised for their generosity. The issue was never having; it was holding too tightly. Loosen your grip and your heart will lighten.",
    ],
    verses: [
      { quote: 'أَلْهَاكُمُ التَّكَاثُرُ ۖ حَتَّىٰ زُرْتُمُ الْمَقَابِرَ', translation: 'Competition in worldly increase distracts you, until you visit the graves. (Qur\u2019an 102:1-2)', source: 'Qur\u2019an, Surah At-Takathur 102:1-2' },
      { quote: 'وَمَا الْحَيَاةُ الدُّنْيَا إِلَّا لَعِبٌ وَلَهْوٌ وَلَلدَّارُ الْآخِرَةُ خَيْرٌ لِّلَّذِينَ يَتَّقُونَ', translation: 'The life of this world is nothing but amusement and diversion, and the Home of the Hereafter is best for those who fear Allah. (Qur\u2019an 6:32)', source: 'Qur\u2019an, Surah Al-An\u2019am 6:32' },
      { quote: 'إِنَّمَا أَمْوَالُكُمْ وَأَوْلَادُكُمْ فِتْنَةٌ ۚ وَاللَّهُ عِندَهُ أَجْرٌ عَظِيمٌ', translation: 'Your wealth and your children are but a trial, and Allah has with Him a great reward. (Qur\u2019an 64:15)', source: 'Qur\u2019an, Surah At-Taghabun 64:15' },
    ],
    steps: [
      [
        'Identify one thing you own that you do not need. Give it away today.',
        'Set a fixed sadaqah amount — even small — to give regularly. Giving breaks the grip of greed.',
        'Fast one day this week. Hunger teaches the body that it needs less than it thinks.',
        'Write down three things you already have that others pray for.',
      ],
      [
        'Go 24 hours without buying anything non-essential. Notice the urges and let them pass.',
        'Spend 10 minutes in nature — trees, sky, earth — and reflect on how little you truly need to be content.',
        'Make a "contentment list": write everything you are grateful for right now, in this moment.',
        'Read Surah At-Takathur — it is a direct diagnosis of the disease of accumulation.',
      ],
      [
        'Invite someone over for a meal. Generosity with food was the way of the Prophet.',
        'Audit your attachment: pick one possession and ask, "If I lost this tomorrow, would my faith survive?"',
        'Volunteer at a shelter or food bank. Seeing poverty firsthand realigns the heart.',
        'Make du\u2019a for contentment, not abundance. The Prophet taught us to ask for "hawa\u2019l-qana\u2019ah" — satisfaction with what Allah gives.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ قَنِّعْنِي بِمَا رَزَقْتَنِي وَبَارِكْ لِي فِيهِ', transliteration: 'Allahumma qanni\u2019ni bima razaqtani wa barik li fihi', english: 'O Allah, make me content with what You have provided me and bless it for me.', source: 'Based on Prophetic supplications' },
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكَسَلِ وَالْجُبْنِ وَالْهَمِّ وَالْعَجْزِ', transliteration: 'Allahumma inni a\u2019udhu bika minal-kasal wal-jubn wal-ham wal-\u2018ajz', english: 'O Allah, I seek refuge in You from laziness, cowardice, worry, and incapacity.', source: 'Sahih al-Bukhari 6369' },
      { arabic: 'اللَّهُمَّ أَغْنِنِي بِالْإِسْلَامِ', transliteration: 'Allahumma aghnini bil-Islam', english: 'O Allah, enrich me with Islam.', source: 'Based on Prophetic supplications' },
    ],
  },
  envy: {
    reflections: [
      "What you are feeling — that painful awareness of what others have that you do not — is one of the most common and most difficult emotions to name. The fact that you are naming it honestly is already the first step toward healing. Hasad (envy) is a disease of the heart, but it is not incurable. The cure is not to suppress the feeling but to transform it into something beautiful: happiness for others and gratitude for what you have.",
      "Comparison is a thief that steals the joy of your own blessings by pointing at someone else\u2019s. What you see of others\u2019 lives — especially on social media — is a highlight reel, not the full picture. Everyone has struggles you cannot see. Your path is your own, and Allah\u2019s plan for you is not measured against anyone else\u2019s.",
      "The envy you are feeling does not make you a bad Muslim. It makes you human. The Prophet acknowledged this when he said: envy is permitted only in two cases — a person Allah has given the Quran and who recites it night and day, and a person Allah has given wealth and who spends it in charity. The desire to be better is not envy. The desire to deprive others of their blessings is. You are already on the right side of that line by asking for help.",
    ],
    verses: [
      { quote: 'أَمْ يَحْسُدُونَ النَّاسَ عَلَىٰ مَا آتَاهُمُ اللَّهُ مِن فَضْلِهِ', translation: 'Or do they envy people for what Allah has given them of His bounty? (Qur\u2019an 4:54)', source: 'Qur\u2019an, Surah An-Nisa 4:54' },
      { quote: 'وَلَا تَتَمَنَّوْا مَا فَضَّلَ اللَّهُ بِهِ بَعْضَكُمْ عَلَىٰ بَعْضٍ', translation: 'And do not wish for that by which Allah has made some of you exceed others. (Qur\u2019an 4:32)', source: 'Qur\u2019an, Surah An-Nisa 4:32' },
      { quote: 'وَإِنَّ كَثِيرًا مِّنَ الْخُلَطَاءِ لَيَبْغِي بَعْضُهُمْ عَلَىٰ بَعْضٍ إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ', translation: 'Many associates oppress one another, except those who believe and do righteous deeds. (Qur\u2019an 38:24)', source: 'Qur\u2019an, Surah Sad 38:24' },
    ],
    steps: [
      [
        'When you see something you envy in someone, immediately say "Mashallah, la quwwata illa billah" — it breaks the grip of envy.',
        'Make du\u2019a for the person you envied. This is the most powerful antidote — it transforms bitterness into love.',
        'Limit social media for one week. Notice how your heart feels when the comparison feed is off.',
        'Write down five blessings in your life that you would not trade for what you envied.',
      ],
      [
        'Practice "gratitude bombing": every time envy strikes, counter it with three things you are grateful for.',
        'Reflect on what the envied person might be struggling with that you cannot see. Everyone carries hidden weight.',
        'Give sadaqah when you feel envy — it breaks the attachment and redirects the heart toward generosity.',
        'Remember: if Allah gave you what they have, He might also give you what they carry. Be careful what you wish for.',
      ],
      [
        'Make a habit of celebrating others\u2019 successes genuinely. Fake it until the heart follows.',
        'Read Surah Al-Falaq regularly — it includes seeking refuge from the envious when he envies.',
        'Channel the energy of comparison into self-improvement, not self-pity. Use it as fuel, not poison.',
        'Sit with your thoughts and ask: "What is the root of this envy?" Is it insecurity? Fear? Address the root.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ صَلِّ عَلَى مَا رَزَقْتَنِي وَبَارِكْ لِي فِيهِ', transliteration: 'Allahumma salli \u2018ala ma razaqtani wa barik li fihi', english: 'O Allah, bless what You have provided me and make it sufficient for me.', source: 'Based on Prophetic supplications' },
      { arabic: 'أَعُوذُ بِاللَّهِ مِنَ الْحَسَدِ وَالْحِقْدِ', transliteration: 'A\u2019udhu billahi minal-hasad wal-hiqd', english: 'I seek refuge in Allah from envy and malice.', source: 'Based on Prophetic supplications' },
      { arabic: 'اللَّهُمَّ اهْدِنِي لِأَحْسَنِ الْأَعْمَالِ وَأَحْسَنِ الْأَخْلَاقِ', transliteration: 'Allahumma-hdini li-ahsanil-a\u2019mali wa-ahsanil-akhlaq', english: 'O Allah, guide me to the best of deeds and the best of character.', source: 'Sunan an-Nasa\u2019i 1033' },
    ],
  },
  relationships: {
    reflections: [
      "What you are feeling toward your family member is real, and I want to acknowledge the pain and anger underneath it. When someone close to us hurts us, the wound cuts deeper because of the love that was supposed to be there. But I need you to hear something: in Islam, maintaining family ties is not optional — it is one of the most beloved acts to Allah, even when it is hard. The anger you feel is valid; what you do with it is what matters.",
      "Conflict with family is one of the most painful kinds of conflict, because these are the people Allah chose to place closest to you. The heat you are feeling right now is human, and the Prophet (peace be upon him) himself experienced disputes within his own family. But Islam draws a firm line: cutting ties of kinship is a serious sin, and the one who reconciles is praised. Let us find a way through this together.",
      "I can feel how hurt and angry you are, and I do not want to minimize that. Family fights can bring out the most intense emotions because the stakes feel so high. But before you act on that anger, I want you to pause and remember: the Prophet (peace be upon him) said that whoever would be pleased to have his provision expanded and his life prolonged should maintain ties of kinship. Even when it is hard. Especially when it is hard.",
    ],
    verses: [
      { quote: 'وَاتَّقُوا اللَّهَ الَّذِي تَسَاءَلُونَ بِهِ وَالْأَرْحَامَ', translation: 'And fear Allah, through whom you ask one another, and the wombs (family ties). (Qur\u2019an 4:1)', source: 'Qur\u2019an, Surah An-Nisa 4:1' },
      { quote: 'فَهَلْ عَسَيْتُمْ إِن تَوَلَّيْتُمْ أَن تُفْسِدُوا فِي الْأَرْضِ وَتُقَطِّعُوا أَرْحَامَكُمْ', translation: 'Would you then, if you were given authority, cause corruption on earth and sever your ties of kinship? (Qur\u2019an 47:22)', source: 'Qur\u2019an, Surah Muhammad 47:22' },
      { quote: 'وَالَّذِينَ يَصِلُونَ مَا أَمَرَ اللَّهُ بِهِ أَن يُوصَلَ', translation: 'And those who join that which Allah has ordered to be joined (family ties). (Qur\u2019an 13:21)', source: 'Qur\u2019an, Surah Ar-Ra\u2019d 13:21' },
    ],
    steps: [
      [
        'Right now, before anything else: sit down. If you are standing, sit. If you are still angry, lie down. Do not act on this anger while it is hot.',
        'Make wudu — the cooling of water on your skin will calm your body. Then pray two units of salah seeking Allah\u2019s help with this situation.',
        'Say "A\u2019udhu billahi minash-shaytanir-rajim" out loud. The anger you feel is being fueled by Shaytan, who loves nothing more than broken family ties.',
        'Wait 24 hours before confronting your family member. The anger will shrink, and you will think more clearly tomorrow.',
      ],
      [
        'Write down everything you are feeling — every hurt, every frustration. Let the paper absorb what your family member cannot right now.',
        'Ask yourself: "What is the root of this anger?" Is it a specific wrong, or is it accumulated resentment? Naming the root takes away its power.',
        'Plan to reconcile within 3 days. You do not have to agree with what happened — you just have to keep the door open. The Prophet said the one who reconciles is not the one who cuts ties.',
        'Send a simple message: "I am upset right now, but I do not want this to break us. Let us talk when things cool down."',
      ],
      [
        'Remember: maintaining kinship does not mean accepting abuse. It means keeping the door open and not cutting the relationship permanently.',
        'Make du\u2019a for your family member — even silently. The Prophet said: "The one who seeks reconciliation, Allah will help him."',
        'Identify one good quality in the person you are angry with. Hold onto it while the anger is hot — it will not let the anger consume you entirely.',
        'If the conflict involves harm, seek a trusted mediator — an elder in the family, an Imam, or a counselor. Reconciliation often needs a third voice.',
      ],
    ],
    duas: [
      { arabic: 'اللَّهُمَّ أَلِّفْ بَيْنَ قُلُوبِنَا', transliteration: 'Allahumma allif bayna quloobina', english: 'O Allah, unite our hearts and reconcile between us.', source: 'Based on the Prophet\u2019s du\u2019a for reconciliation, Sunan Abi Dawud' },
      { arabic: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ', transliteration: 'A\u2019udhu billahi minash-shaytanir-rajim', english: 'I seek refuge in Allah from the accursed Shaytan, who seeks to destroy family ties.', source: 'Sahih al-Bukhari 6115' },
      { arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ غَلَبَةِ الْغَضَبِ', transliteration: 'Allahumma inni a\u2019udhu bika min ghalabatil-ghadab', english: 'O Allah, I seek refuge in You from being overcome by anger.', source: 'Based on the Prophet\u2019s guidance on anger management' },
    ],
  },
};

const DEFAULT_POOL: ReflectionPool = {
  reflections: [
    "Thank you for sharing what is on your heart. Whatever you are carrying, know that this is a safe space to reflect, seek guidance, and find comfort. Could you tell me a little more about what you are feeling or going through?",
    "I am glad you reached out today. Whatever brought you here — whether it is something specific weighing on you or a more general sense of needing direction — this is a space for you to slow down and reflect.",
    "Sometimes the hardest part is knowing where to begin, and you have already done that by being here. Whatever you are walking through, the Islamic tradition has wisdom for it. Share a bit more about what you are feeling.",
  ],
  verses: [
    { quote: 'وَقُل رَّبِّ زِدْنِي عِلْمًا', translation: 'And say, "My Lord, increase me in knowledge." (Qur\u2019an 20:114)', source: 'Qur\u2019an, Surah Ta-Ha 20:114' },
    { quote: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', translation: 'Indeed, with hardship comes ease. (Qur\u2019an 94:6)', source: 'Qur\u2019an, Surah Ash-Sharh 94:6' },
    { quote: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ', translation: 'And He is with you wherever you are. (Qur\u2019an 57:4)', source: 'Qur\u2019an, Surah Al-Hadid 57:4' },
  ],
  steps: [
    [
      'Take a moment to name, in a few words, exactly what you are feeling right now.',
      'Consider what you most need today: comfort, guidance, motivation, or patience.',
      'Try one of the quick-start topics from the sidebar if you are unsure where to begin.',
    ],
    [
      'Write down what is on your mind in three sentences — no more, no less.',
      'Make wudu and sit quietly for two minutes before doing anything else.',
      'Identify one thing you can do today that would make tomorrow a little easier.',
    ],
    [
      'Breathe deeply three times and ask Allah for clarity in whatever you are facing.',
      'Reach out to someone you trust and share what is on your mind.',
      'Pick one verse from the Quran to read and reflect on for five minutes today.',
    ],
  ],
  duas: [
    { arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي', transliteration: 'Rabbish-rahli sadri wa yassirli amri', english: 'My Lord, expand for me my chest and ease for me my task.', source: 'Qur\u2019an, Surah Ta-Ha 20:25-26' },
    { arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى', transliteration: 'Allahumma inni as\u2019alukal-huda wat-tuqa wal-\u2018afafa wal-ghina', english: 'O Allah, I ask You for guidance, piety, chastity, and self-sufficiency.', source: 'Sahih Muslim 2721' },
    { arabic: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ', transliteration: 'Allahumma a\u2019inni \u2018ala dhikrika wa shukrika wa husni \u2018ibadatik', english: 'O Allah, help me to remember You, thank You, and worship You in the best manner.', source: 'Sunan Abi Dawud 1521' },
  ],
};

/** Extract the core phrase from a user message to make reflections feel specific. */
function extractCorePhrase(message: string): string {
  const cleaned = message.trim().replace(/\s+/g, ' ');
  if (cleaned.length <= 120) return cleaned;

  // Try to split on natural sentence boundaries
  const sentences = cleaned.split(/[.!?]+/).filter((s) => s.trim().length > 10);
  if (sentences.length > 0) {
    const first = sentences[0].trim();
    return first.length <= 120 ? first : first.slice(0, 117) + '...';
  }
  return cleaned.slice(0, 117) + '...';
}

/** Opening phrases that acknowledge what was shared — varied so it doesn't feel scripted. */
const ACKNOWLEDGMENTS = [
  "What you shared about {core} — that takes real courage to put into words.",
  "I can feel the weight behind what you said about {core}. That is not a small thing.",
  "Reading your words about {core}, I want you to know — what you are feeling is valid.",
  "The fact that you reached out about {core} tells me something important: you have not given up.",
  "When you said {core}, I could hear how much this is affecting you. Let us sit with that for a moment.",
  "Thank you for trusting me with this. What you described — {core} — is genuinely hard.",
  "{core} — I hear you. That is a heavy thing to carry, and you do not have to carry it alone right now.",
];

/** Connecting phrases that bridge the acknowledgment to the emotional context — varied. */
const CONNECTIONS = [
  "What you are going through is not a sign of weakness.",
  "Your feelings are not a flaw in your character — they are a human response to something real.",
  "This is one of those moments where being honest about the pain is itself an act of strength.",
  "Sometimes the hardest part is not the struggle itself but feeling like no one understands it.",
  "You are not the first person to feel this way, and you will not be the last — but your experience is uniquely yours.",
  "It takes something out of you to keep going through something like this.",
  "What I want you to hold onto is that this moment does not define your whole story.",
];

/** Concluding thoughts that offer gentle perspective without being preachy — varied. */
const CONCLUSIONS = [
  "Be gentle with yourself right now. You do not have to figure everything out today.",
  "The steps below are not a to-do list — they are just small ways to lighten the load, one at a time.",
  "You do not have to have all the answers right now. Sometimes just showing up is enough.",
  "Take what resonates from the steps below and leave the rest. This is your journey.",
  "Whatever you decide to do, know that reaching out today was already a meaningful step.",
  "There is no timeline for this. You move at your own pace, and that pace is exactly right.",
];

export function buildDynamicResponse(message: string): {
  reflection: string;
  guidance: GuidanceSection;
  steps: string[];
  dua: Dua;
} {
  const emotions = extractEmotions(message);
  const poolKey = emotions[0] ?? 'general';
  const pool = POOLS[poolKey] ?? DEFAULT_POOL;

  const core = extractCorePhrase(message);
  const acknowledgment = pickRandom(ACKNOWLEDGMENTS).replace('{core}', core);
  const connection = pickRandom(CONNECTIONS);
  const conclusion = pickRandom(CONCLUSIONS);

  const reflection = `${acknowledgment} ${connection} ${conclusion}`;

  const verse = pickRandom(pool.verses);
  const stepSet = pickRandom(pool.steps);
  const dua = { ...pickRandom(pool.duas), category: (emotions[0] ?? 'general') as Dua['category'] };

  return {
    reflection,
    guidance: {
      quote: verse.quote,
      translation: verse.translation,
      source: verse.source,
      type: 'quran',
    },
    steps: stepSet,
    dua,
  };
}

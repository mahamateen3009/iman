/**
 * Generates short, motivational mufti-style commentary connecting a hadith
 * to the user's emotional situation. Combines the voice of a scholar
 * (explaining the ruling/wisdom) with a motivator (encouraging action).
 */

const COMMENTARY_MAP: Record<string, string[]> = {
  anxiety: [
    'This hadith is a direct answer to what you are feeling. Anxiety is not a lack of faith — the Prophet himself sought refuge from worry and grief. Use this as your daily du\u2019a and know that Allah hears it.',
    'Notice how the Prophet did not say "just trust Allah and your anxiety will disappear." He taught us to actively seek refuge. That is your prescription: turn to Allah with intention, not passivity.',
    'The fact that Allah\u2019s Messenger taught this du\u2019a means He understood that worry is real. Your anxiety is not a punishment — it is a signal to draw closer to the One who can lift it.',
  ],
  sadness: [
    'This hadith reminds you that your pain is not meaningless. Every tear, every ache, every sleepless night — Allah sees it and He is using it to purify you. Your sorrow is an investment in something you cannot yet see.',
    'The wisdom here is profound: nothing befalls you without Allah\u2019s knowledge. Your sadness is not forgotten. He is keeping count of every moment of hardship, and the reward will exceed the pain.',
    'When the weight feels unbearable, return to this hadith. It is not just comfort — it is a promise. Allah does not waste the suffering of His servants.',
  ],
  patience: [
    'This is the essence of sabr: not passivity, but active trust. The Prophet is telling you that your endurance has a destination, and it is not empty. Every day you keep going is a day Allah is recording.',
    'Read this hadith as a personal letter to you. Allah is saying: I see your struggle, and I am preparing something better. Your job is to stay in the ring — not to win every round, but to stay.',
    'The scholars explain that trials are not a sign of Allah\u2019s anger — they are a sign of His attention. He is refining you. Do not abandon the process before the refinement is complete.',
  ],
  hope: [
    'This hadith is your ladder out of despair. Allah is telling you directly: your situation is not permanent, and your hope in Him is not misplaced. The darkness you feel does not change His mercy.',
    'The Prophet is showing you that hope is not a feeling — it is a choice. Choose to believe in Allah\u2019s plan even when you cannot see it. The chapter you are in is not the last chapter of your story.',
    'Hold onto this hadith like a rope. Allah\u2019s mercy is not conditional on you being perfect — it is conditional on you not giving up. You are still here. That means the story is not over.',
  ],
  motivation: [
    'This hadith is your call to action. Islam does not teach us to wait for motivation to strike — it teaches us to act and let the blessing follow. Take one step today, even a small one, and watch how Allah opens the next.',
    'The Prophet is reminding you that your effort matters. Allah did not create you to be passive. Every small act of striving is seen, recorded, and rewarded. Start where you are, with what you have.',
    'Read this as a personal challenge from your faith: do not let today pass without one act that moves you forward. Even if it is small, it is not insignificant. Momentum begins with the first step.',
  ],
  anger: [
    'This hadith redefines strength for you. The world says strength is dominating others; Islam says strength is mastering yourself. The fact that you are here, asking about anger, already shows you are on the right side of that struggle.',
    'The Prophet is giving you a practical tool, not just a principle. When anger rises, remember this hadith and choose the harder, nobler path. Self-control is a muscle — it grows every time you use it.',
    'Notice that the Prophet did not say "do not feel anger." He said the strong one is the one who controls it. Your anger is not the problem — what you do with it is. Channel it into action, not reaction.',
  ],
  gratitude: [
    'This hadith is a promise wrapped in a command. Gratitude is not just good manners — it is the key to increase. When you thank Allah, you are not just being polite; you are opening a door to more blessings.',
    'The Prophet is teaching you that gratitude is active, not passive. It is not just feeling thankful — it is using your blessings in ways that please the One who gave them. That is how the cycle of increase works.',
    'Read this hadith as a personal invitation: every blessing you have is a seed. Plant it with gratitude, and Allah will grow it into something greater. The best is yet to come.',
  ],
  forgiveness: [
    'This hadith is your doorway back. No matter what you have done, the door is not closed. Allah\u2019s mercy is bigger than your sin, and His forgiveness is not earned — it is asked for. The fact that you feel regret is proof that your heart is still alive.',
    'The Prophet is telling you that repentance is not a one-time event — it is a lifestyle. You will fall, and you will get up. What matters is that you keep getting up. Allah loves the one who returns, again and again.',
    'Read this as a personal letter from Allah: I am not waiting to punish you. I am waiting for you to ask. The shame you feel is not from Me — it is a wall you built between Us. Tear it down with one sincere "astaghfirullah."',
  ],
  comfort: [
    'This hadith is Allah\u2019s personal message to you right now. He is not distant. He is not unaware. He is with you, closer than you think, and His remembrance is the medicine for the ache in your chest.',
    'The Prophet is reminding you that the heart was designed by Allah, and only Allah can still it. Everything else is a temporary distraction. Turn to Him, even with a whisper, and the calm will come.',
    'When you feel alone, return to this hadith. Allah is saying: I am here. I have always been here. You do not need to fix everything — you just need to turn toward the One who can.',
  ],
  character: [
    'This hadith elevates character to the level of worship. Your kindness, your honesty, your patience with people — these are not just good manners. They are acts of worship that weigh heavier than you imagine.',
    'The Prophet is teaching you that character is the highest form of da\u2019wah. People may not read the Quran you carry, but they will read the character you display. Be the example that draws others to this faith.',
    'Read this as a personal standard: every interaction today is an opportunity to practice the character the Prophet modeled. Small acts of kindness are not small in the sight of Allah.',
  ],
  relationships: [
    'This hadith speaks directly to your situation. Allah is telling you that family ties are sacred — even when they are hard to maintain, especially when they are hard. The anger you feel is human, but cutting ties is not the answer. The Prophet said the one who truly maintains kinship is the one who keeps ties even when they have been cut off.',
    'Read this hadith as a personal message to you right now. The conflict with your family member is painful, but Islam draws a clear line: cutting ties of kinship is a serious sin. Your job is not to feel no anger — your job is to not let that anger sever what Allah told you to keep connected.',
    'The Prophet is giving you a powerful promise here: maintaining family ties expands your provision and extends your life. Even when the other person is in the wrong, the reward for keeping the door open is yours. Do not let a moment of anger cost you a lifetime of blessing.',
  ],
  worship: [
    'This hadith reminds you that prayer is not a burden — it is a refuge. The Prophet is teaching you that the quality of your prayer shapes the quality of your entire life. Start with one prayer done well, and watch how it transforms the rest.',
    'The Prophet is showing you that worship is the ascension of the believer. When prayer feels heavy, remember that the heart was designed to find rest in Allah\u2019s remembrance, not in anything else. Return to Him, and the heaviness will lift.',
    'This hadith is your invitation to deepen your connection with Allah. He does not ask for perfection — He asks for sincerity. Even the smallest act of worship, done with a present heart, is beloved to Him.',
  ],
  provision: [
    'This hadith is a direct promise from Allah to you. Your provision was written before you were born, and it will reach you from places you cannot imagine. Your job is to take the steps; His job is to open the doors. Trust the process.',
    'The Prophet is teaching you that rizq is not about how much you earn — it is about the barakah in what you have. A little with barakah is richer than a lot without it. Seek barakah through gratitude, charity, and trust in Allah.',
    'Read this hadith as a personal letter: Allah knows your financial stress. He sees every unpaid bill, every anxious night. He has not forgotten you. Keep taking steps, keep making du\u2019a, and watch how He provides from where you do not expect.',
  ],
  knowledge: [
    'This hadith is your motivation. The Prophet is telling you that seeking knowledge is one of the highest forms of worship. Every minute you spend learning with a sincere intention is recorded as a good deed. You are not just studying — you are worshiping.',
    'The Prophet is showing you that knowledge is a gift Allah gives to those He loves. Your desire to learn is not random — it is a sign that Allah wants good for you. Keep going, and He will open doors of understanding you did not know existed.',
    'This hadith reminds you that the best knowledge is the kind you act upon. Do not just accumulate information — let it transform your heart and your actions. One verse lived is better than a thousand memorized and ignored.',
  ],
  death: [
    'This hadith is your comfort. The Prophet is teaching you that grief and tears are not a lack of faith — they are the overflow of love. Your sorrow is sacred. Allah sees it, records it, and will reward you for every moment of patience through it.',
    'The Prophet is reminding you that this separation is not permanent. The believer will be reunited with their loved ones in Paradise. This grief is a passage, not a destination. Hold onto that promise when the ache feels unbearable.',
    'Read this hadith as Allah\u2019s personal message to you: the one you lost is with Me. I am taking care of them. Your tears benefit them, your du\u2019a reaches them, your sadaqah on their behalf keeps their good deeds flowing. You are still connected — just through a different door.',
  ],
  pride: [
    'This hadith is your mirror. The Prophet is not condemning you — he is giving you the diagnosis so you can find the cure. Arrogance is rejecting truth and looking down on people. The cure is not to hate yourself; it is to remember your origin and your destination. Dust to dust.',
    'The Prophet is teaching you that humility is not low self-esteem — it is truthfulness. Knowing your strengths without arrogance and your weaknesses without despair. That balance is what the Prophet modeled, and it is what you are striving for.',
    'Read this hadith as a personal challenge: the heart that worries about its pride is a heart that is already humbling itself. The fact that you are here, asking for help with this, is proof that humility is winning. Keep fighting.',
  ],
  greed: [
    'This hadith is your diagnosis and your cure in one sentence. The Prophet is telling you: the desire for more never ends — but it can be redirected. Channel that desire toward the Hereafter, and the world loses its grip on your heart.',
    'The Prophet is teaching you that wealth is not the problem — attachment is. You can have without holding, possess without clinging. The Companions who were wealthy were praised not for having less but for giving more. Let generosity be your freedom.',
    'Read this hadith as a personal invitation: the world promised you satisfaction and delivered restlessness. Islam offers you something better — contentment. Not having everything you want, but wanting what you have. That is the real wealth.',
  ],
  envy: [
    'This hadith is your medicine. The Prophet is teaching you that the cure for envy is not suppression — it is transformation. Make du\u2019a for the person you envied, and watch how the bitterness dissolves into love. It is the most powerful spiritual alchemy.',
    'The Prophet is reminding you that everyone\u2019s provision was written before they were born. What they have is theirs; what you have is yours. Comparing your chapter 2 to their chapter 20 is not fair to your story. Trust Allah\u2019s timing and plan for you.',
    'Read this hadith as a personal challenge: envy thrives in isolation and dies in gratitude. Every time the envy strikes, counter it with three blessings you are grateful for. Starve the envy, feed the gratitude, and watch the heart transform.',
  ],
};

const DEFAULT_COMMENTARY = [
  'This hadith speaks directly to your situation. The Prophet\u2019s guidance is timeless — it was meant for moments exactly like this one. Reflect on it and let it guide your next step.',
  'The wisdom in this hadith is a gift to you today. Allah\u2019s Messenger did not just teach principles — he gave us a way to live. Apply this teaching and watch how it transforms your perspective.',
  'This is not just a historical statement — it is living guidance meant for you right now. The Prophet\u2019s words carry the power to shift your heart. Sit with them for a moment before moving on.',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a mufti-style commentary connecting a hadith to the user's
 * emotional state. Combines scholarly insight with motivational tone.
 */
export function generateCommentary(
  hadithTags: string[],
  emotions: string[]
): string {
  for (const emotion of emotions) {
    if (COMMENTARY_MAP[emotion]) {
      return pickRandom(COMMENTARY_MAP[emotion]);
    }
  }
  for (const tag of hadithTags) {
    if (COMMENTARY_MAP[tag]) {
      return pickRandom(COMMENTARY_MAP[tag]);
    }
  }
  return pickRandom(DEFAULT_COMMENTARY);
}

import { extractEmotions } from './relevance';
import { isCrisisMessage } from './crisisResponse';

export interface ConversationalContext {
  name?: string;
  age?: number | null;
  ageGroup?: 'child' | 'teen' | 'adult' | null;
}

export interface ChatHistoryItem {
  role: 'user' | 'assistant';
  content: string;
}

type AgeCategory = 'child' | 'teen' | 'adult' | 'senior';

function resolveAge(context?: ConversationalContext): AgeCategory {
  const age = context?.age;
  const ageGroup = context?.ageGroup;

  if (age != null) {
    if (age <= 12) return 'child';
    if (age <= 17) return 'teen';
    if (age >= 60) return 'senior';
    return 'adult';
  }

  if (ageGroup === 'child') return 'child';
  if (ageGroup === 'teen') return 'teen';
  return 'adult';
}

function formatName(name?: string): string {
  const clean = name?.trim();
  return clean ? `, ${clean}` : '';
}

function formatNameDirect(name?: string): string {
  const clean = name?.trim();
  return clean ? ` ${clean}` : '';
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Returns true ONLY when the user is in emotional distress, mental stress,
 * experiencing hardship, asking for a du'a, or asking for Islamic guidance on a problem.
 * Takes previous conversation history into account so follow-up cries for help are caught.
 */
export function isStressOrGuidanceRequest(message: string, history?: ChatHistoryItem[]): boolean {
  const lower = message.toLowerCase().trim();

  // 1. Explicit request for a Du'a / prayer
  if (/\b(dua|du'a|supplication|pray for me|make dua|give me a dua|need a dua|prayer for)\b/i.test(lower)) {
    return true;
  }

  // 2. Explicit request for Islamic advice on a struggle
  if (/\b(islamic guidance|what does the quran say about|hadith for|how do i deal with|how should a muslim deal with)\b/i.test(lower)) {
    return true;
  }

  // 3. Clear emotional distress feelings:
  const distressFeelings = [
    'sad', 'depressed', 'anxious', 'worried', 'stress', 'stressed', 'panic',
    'overwhelmed', 'scared', 'afraid', 'terrified', 'lonely', 'alone',
    'hopeless', 'giving up', 'exhausted', 'drained', 'tired of life',
    'burnt out', 'burnout', 'heartbroken', 'broken', 'empty', 'numb',
    'crying', 'in pain', 'hurting', 'miserable', 'guilty', 'ashamed',
    'unloved', 'angry', 'furious', 'mad at', 'lost my way', 'weak iman',
    'failing'
  ];

  for (const feeling of distressFeelings) {
    const rx1 = new RegExp('\\b(feel|feeling|felt|am|im|i\'m|so|very|deeply|really|extremely)\\s+(\\w+\\s+)?' + feeling + '\\b', 'i');
    if (rx1.test(lower)) {
      return true;
    }
  }

  // 4. Life & spiritual struggles: "struggling with...", "having a hard time with..."
  if (/\b(struggling with|struggle with|having a hard time with|hard time in|trouble with)\b/i.test(lower)) {
    return true;
  }

  // 5. Strong hardship / calamity phrases:
  if (/\b(can['’]?t take it|can['’]?t breathe|heart is heavy|chest is tight|falling apart|end of my rope|losing my mind|want to cry|passed away|died|death of|lost my (mom|dad|mother|father|brother|sister|friend|child)|calamity|chronic pain|panic attack)\b/i.test(lower)) {
    return true;
  }

  // 6. Context check: was the previous user message in active distress?
  // If so, short follow-ups ("what should I do?", "it hurts so much", "how do I stop it?") are part of that distress!
  if (history && history.length > 0) {
    const prevUserMsgs = history.filter((m) => m.role === 'user');
    const lastUserMsg = prevUserMsgs[prevUserMsgs.length - 1]?.content.toLowerCase();
    if (lastUserMsg && isStressOrGuidanceRequest(lastUserMsg)) {
      if (/\b(what should i do|what can i do|how do i fix this|it hurts|i can['’]?t|why does it happen|tell me what to do)\b/i.test(lower)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Checks if the user is directly answering a specific question that the assistant asked in the previous turn.
 */
function tryContextualQuestionAnswer(
  normalized: string,
  lastAssistant: string,
  name?: string
): string | null {
  const lowerAss = lastAssistant.toLowerCase();

  // 1. Did the assistant ask about tea vs coffee?
  if (/tea\s+person\s+or\s+a\s+coffee\s+person/i.test(lowerAss) || /coffee\s+or\s+tea/i.test(lowerAss)) {
    if (/\b(tea|chai|green\s+tea|black\s+tea)\b/i.test(normalized)) {
      return `Ah, a fellow tea lover${formatName(name)}! ☕ There's truly nothing better than a hot, comforting cup of chai to relax the mind. Do you like traditional spiced milk chai or lighter herbal teas?`;
    }
    if (/\b(coffee|espresso|latte|cappuccino|iced\s+coffee|americano)\b/i.test(normalized)) {
      return `Coffee! ☕ Rich, bold, and energizing. How do you take your coffee — black, or with lots of milk and caramel?`;
    }
    if (/\b(neither|both|water|juice|boba|matcha|hot\s+chocolate)\b/i.test(normalized)) {
      return `Haha, fair choice! Good fresh water or a tasty juice is honestly the healthiest way to go anyway! 🥤 What is your favorite drink?`;
    }
  }

  // 2. Did the assistant ask if they have a pet?
  if (/do\s+you\s+have\s+a\s+pet/i.test(lowerAss)) {
    if (/\b(yes|yeah|yep|i\s+have|cat|dog|bird|parrot|fish|kitten|puppy|rabbit|hamster)\b/i.test(normalized)) {
      return `Aw, that is so sweet! 🐾 Having an animal companion brings so much warmth and barakah into a home. The Prophet (peace be upon him) taught us that being kind and merciful to animals is a great deed. What is your pet's name?`;
    }
    if (/\b(no|nope|i\s+don['’]?t|not\s+yet|wish|want\s+one)\b/i.test(normalized)) {
      return `Aw, maybe one day insha'Allah! If you could get any pet in the world, what would be your dream animal to have?`;
    }
  }

  // 3. Did the assistant ask about their favorite thing / hobbies?
  if (/favorite\s+thing\s+to\s+do|what\s+do\s+you\s+like\s+to\s+do|what\s+are\s+you\s+into/i.test(lowerAss)) {
    if (/\b(read|reading|books|novel|history)\b/i.test(normalized)) {
      return `Reading is such an enriching hobby${formatName(name)}! It expands your mind and brings quiet peace. What kind of books do you enjoy reading most — fiction, Islamic history, or self-development?`;
    }
    if (/\b(draw|drawing|art|paint|painting|sketch|sketching|calligraphy)\b/i.test(normalized)) {
      return `Art and drawing are such beautiful forms of creative expression! Do you like drawing nature, Arabic calligraphy, or portraits and designs?`;
    }
    if (/\b(sport|sports|football|soccer|cricket|gym|workout|running|basketball)\b/i.test(normalized)) {
      return `Staying physically active is deeply praised in Islam! Our Prophet (peace be upon him) valued health, strength, and vitality. How often do you get to play or work out?`;
    }
    if (/\b(game|gaming|games|coding|code|programmer|tech|computer)\b/i.test(normalized)) {
      return `That's awesome! Creating things with code or immersing yourself in good games is so much fun. What games or projects are you into right now?`;
    }
    if (/\b(cook|cooking|bake|baking|food)\b/i.test(normalized)) {
      return `Cooking and baking are such comforting arts — and feeding loved ones is an act of charity in Islam! What is your specialty in the kitchen?`;
    }
    return `That sounds so enjoyable${formatName(name)}! Having hobbies that bring you joy and let your mind unwind is so important. How long have you been into that?`;
  }

  // 4. Did the assistant ask about their favorite food?
  if (/favorite\s+dish|what['’]?s\s+your\s+favorite\s+food|spicy\s+or\s+mild/i.test(lowerAss)) {
    if (/\b(spicy|mild|hot|extra\s+spicy)\b/i.test(normalized)) {
      return `Haha, good to know! Seasoning and flavor make good food so memorable. What dish do you eat most often?`;
    }
    return `Ooh, great taste${formatName(name)}! Now you're making me wish I could enjoy real food 😄. What makes that your favorite?`;
  }

  // 5. Did the assistant ask about their favorite surah?
  if (/favorite\s+surah\s+or\s+ayah/i.test(lowerAss)) {
    return `SubhanAllah, that is such a magnificent surah${formatName(name)}! Its verses carry such deep tranquility, solace, and profound wisdom for the heart. What is it about that surah that touches you most?`;
  }

  // 6. Did the assistant ask for thoughts on a story?
  if (/what\s+do\s+you\s+think\s+of\s+that\s+story/i.test(lowerAss)) {
    return `I'm so glad you enjoyed it${formatName(name)}! The Prophet's life is filled with these quiet moments of immense compassion that remind us how gentle our faith truly is. Would you like to hear another story, or talk about something else?`;
  }

  // 7. Did the assistant ask how their day was?
  if (/how\s+was\s+your\s+day|how['’]?s\s+everything\s+going|what['’]?s\s+on\s+your\s+mind|how\s+has\s+the\s+rest\s+of\s+your\s+day\s+been/i.test(lowerAss)) {
    if (/\b(good|great|alhamdulillah|fine|well|awesome|nice|amazing)\b/i.test(normalized)) {
      return `Alhamdulillah, that is wonderful to hear! May Allah keep your days filled with barakah, good company, and peace. Did anything special happen today?`;
    }
    if (/\b(okay|ok|normal|same|nothing\s+much|boring|chilling)\b/i.test(normalized)) {
      return `I hear you! Sometimes an ordinary, quiet day is a hidden blessing in itself — a chance to rest and recharge. Are you taking it easy tonight?`;
    }
    if (/\b(tired|tiring|exhausting|busy|long\s+day|hectic)\b/i.test(normalized)) {
      return `You definitely deserve to put your feet up and take a deep breath${formatName(name)}. Make sure you get some restful sleep tonight. What kept you so busy today?`;
    }
  }

  // 8. Did the assistant ask if they know any jokes?
  if (/got\s+any\s+good\s+jokes|what\s+kind\s+of\s+humor/i.test(lowerAss)) {
    if (/\b(haha|lol|hehe|lmao)\b/i.test(normalized)) {
      return `😄 Glad that made you chuckle! A smile is considered charity in Islam, so we just earned some good deeds. Got any jokes of your own?`;
    }
    return `Haha, that's actually really good! 😂 Thanks for sharing that, definitely brought a smile. Got another one, or are you all out?`;
  }

  return null;
}

/**
 * Handles conversational follow-ups like "why?", "tell me more", "really?", "haha", "yes", "no"
 * by referencing what the assistant was talking about in the previous message.
 */
function tryContextualContinuation(
  normalized: string,
  lastAssistant: string,
  name?: string
): string | null {
  const lowerAss = lastAssistant.toLowerCase();

  // "Tell me more", "What else?", "And then?", "Continue"
  if (/^(tell\s+me\s+more|what\s+else|and\s+then|continue|keep\s+going|go\s+on)$/i.test(normalized)) {
    if (lowerAss.includes('ad-duha')) {
      return `In the very next verses of Surah Ad-Duha, Allah reminds the Prophet of his past blessings: *"Did He not find you an orphan and give you refuge? And He found you lost and guided you?"* It reminds us that Allah has carried us through every past hardship, and He won't leave us now.`;
    }
    if (lowerAss.includes('abu umayr') || lowerAss.includes('bird')) {
      return `What scholars love about that story is that the Prophet (PBUH) had enormous responsibilities — leading an entire community, diplomacy, teaching — yet he made time to kneel down and share the grief of a young child over a tiny bird. True greatness is always accompanied by gentleness.`;
    }
    if (lowerAss.includes('bedouin') || lowerAss.includes('mosque')) {
      return `What's also amazing is how the companions took that lesson to heart. They saw that shouting at people rarely changes their hearts, but patience and gentleness almost always do. Softness wins people over.`;
    }
    if (lowerAss.includes('chai') || lowerAss.includes('tea')) {
      return `Did you know that tea culture across the Muslim world — from Turkish çay to Kashmiri pink chai and Moroccan mint tea — has always been centered around hospitality (*ikram al-dayf*)? Welcoming someone with warm tea is an act of honor and kindness.`;
    }
    if (lowerAss.includes('cat')) {
      return `There is a famous authentic report that the Prophet (peace be upon him) once performed wudu from water that a cat had just drunk from, showing that cats are clean and gentle creatures that live among us.`;
    }
    return `I'd love to share more${formatName(name)}! What part of it interested you most?`;
  }

  // "Why?", "Why is that?", "How come?"
  if (/^(why|why\s+is\s+that|how\s+come|why\s+so)\??$/i.test(normalized)) {
    if (lowerAss.includes('rain')) {
      return `Because rain revives dry, lifeless earth, cools the air, and sustains all life on earth! In Surah Qaf, Allah says: *"And We have sent down blessed rain from the sky, causing gardens to grow..."* It's a constant visual reminder of Allah's mercy and power.`;
    }
    if (lowerAss.includes('cat') || lowerAss.includes('animal')) {
      return `Because Islam emphasizes compassion toward all of Allah's creation! The Prophet (PBUH) taught that a person can enter Paradise simply for giving water to a thirsty animal. Kindness to animals carries immense spiritual reward.`;
    }
    return `Because in Islam, intention, gentleness, and reflection are at the core of everything. When we look a little deeper, there's always wisdom and mercy in it. What do you think about it?`;
  }

  // "Really?", "Is that true?"
  if (/^(really|is\s+that\s+true|for\s+real|seriously)\??$/i.test(normalized)) {
    return `Yes, really! 😊 It's completely authentic, and that's what makes it so special. It shows how practical and grounded our faith is in real everyday life.`;
  }

  // "Haha", "lol", "lmao"
  if (/^(haha|hahaha|hahahaha|lol|lmao|hehe|rofl|that\s+was\s+funny)$/i.test(normalized)) {
    return `😄 Glad that made you smile! Having joy and a light heart is a beautiful blessing. What else is on your mind today?`;
  }

  // "Yes", "Yeah", "I agree", "True"
  if (/^(yes|yeah|yep|i\s+agree|true|exactly|definitely|right)\.?$/i.test(normalized)) {
    return `I'm glad we see eye to eye on that${formatName(name)}! What would you like to chat about next?`;
  }

  // "No", "Nope", "Not really"
  if (/^(no|nope|not\s+really|i\s+don['’]?t\s+think\s+so)\.?$/i.test(normalized)) {
    return `Fair enough! I'd love to hear your perspective — what do you think instead?`;
  }

  return null;
}

/**
 * Checks if a user message is a conversational remark, friendship request, greeting,
 * check-in, small talk, or casual curiosity, and returns a natural, human response.
 * Uses previous chat history to maintain rich contextual flow.
 */
export function tryConversationalResponse(
  message: string,
  context?: ConversationalContext,
  history?: ChatHistoryItem[]
): string | null {
  const trimmed = message.trim();
  if (!trimmed) return null;

  if (isCrisisMessage(trimmed)) return null;

  // If the user is expressing emotional distress, let the full empathetic flow handle it
  if (isStressOrGuidanceRequest(trimmed, history)) {
    return null;
  }

  const normalized = trimmed.toLowerCase().replace(/[?!.,;:]+$/, '').trim();
  const age = resolveAge(context);
  const name = context?.name;

  // Extract previous assistant message for conversational context
  const lastAssistant = history && history.length > 0
    ? [...history].reverse().find((m) => m.role === 'assistant')?.content ?? null
    : null;

  // CONTEXT CHECK 1: Answering a question the bot asked in the previous turn
  if (lastAssistant) {
    const contextualAnswer = tryContextualQuestionAnswer(normalized, lastAssistant, name);
    if (contextualAnswer) {
      return contextualAnswer;
    }

    const contextualContinuation = tryContextualContinuation(normalized, lastAssistant, name);
    if (contextualContinuation) {
      return contextualContinuation;
    }
  }

  // CONTEXT CHECK 2: User stating or asking about their name/identity
  const nameMatch = normalized.match(/^(my\s+name\s+is|call\s+me|i['’]?m)\s+([a-zA-Z]+)$/i);
  if (nameMatch && !['tired', 'sad', 'fine', 'good', 'bored', 'happy', 'ok', 'here'].includes(nameMatch[2].toLowerCase())) {
    const statedName = nameMatch[2];
    return `It is so wonderful to meet you, ${statedName}! 🌿 I'm really glad we're talking. How are you doing today?`;
  }

  if (/^(what['’]?s\s+my\s+name|what\s+is\s+my\s+name|do\s+you\s+know\s+my\s+name|do\s+you\s+remember\s+my\s+name)$/i.test(normalized)) {
    if (name) {
      return `Your name is ${name}! Of course I remember. 😊 How has your day been going?`;
    }
    return `You haven't told me your name yet! What should I call you?`;
  }

  // 1. Friendship & Companionship (e.g. "be my friend", "can you be my friend and stuff", "let's be friends")
  if (
    /\b(be\s+my\s+friend|can\s+we\s+be\s+friends|can\s+you\s+be\s+my\s+friend|will\s+you\s+be\s+my\s+friend|i\s+want\s+a\s+friend|i\s+need\s+a\s+friend|let['’]?s\s+be\s+friends|are\s+we\s+friends|do\s+you\s+want\s+to\s+be\s+friends|be\s+friends|you\s+are\s+my\s+friend|be\s+friends\s+with\s+me|best\s+friends?)\b/i.test(normalized) ||
    /friend(s)?\s*(and\s+stuff)?$/i.test(normalized)
  ) {
    if (age === 'child') {
      return `I would LOVE to be your friend${formatName(name)}! 🌟 Friends look out for each other, share happy moments, and listen when things feel tough. I am always right here whenever you want to talk, learn something fun, or just hang out. What is your favorite thing to do?`;
    }
    if (age === 'teen') {
      return `I'd really love that${formatName(name)}! 🌸 Having someone you can just talk to with zero drama, zero pressure, and complete understanding is so important. Consider me in your corner anytime you need a friend to listen. What's on your mind today?`;
    }
    if (age === 'senior') {
      return `It brings immense joy to my heart to be your companion, respected${formatNameDirect(name)}. Good companionship in faith is one of Allah's sweetest gifts. I am always here whenever you wish to share thoughts, reflect, or simply enjoy a quiet conversation. How is your day going?`;
    }
    return `I would love to be your friend${formatName(name)}! 🌿 That is genuinely what I am here for — to be a warm, supportive companion where you can be yourself, speak freely without judgment, and find peace. We can talk about daily life, faith, thoughts, or anything you'd like. What's on your heart today?`;
  }

  // 2. Feedback on being too robotic / "Talk like a human" / "You sound like a machine"
  if (
    /\b(sound\s+(like\s+a\s+)?(machine|robot)|talk\s+like\s+a\s+human|be\s+more\s+human|stop\s+sounding\s+like\s+a\s+bot|too\s+robotic|talk\s+normally|be\s+natural)\b/i.test(normalized)
  ) {
    return `Haha, fair point${formatName(name)}! My bad — I was being way too formal and robotic. Let's keep it real and relaxed from here on out, like two friends chatting. How's your day actually going?`;
  }

  // 3. Assistance / Willingness to help (e.g. "would you like to assist me?", "can you help me?")
  if (
    /^(would|could|can|will)\s+you\s+(like|mind|want|be\s+willing|be\s+able)?\s*(to\s+)?(assist|help|support|guide|talk|listen)(\s+(to\s+)?me)?$/i.test(normalized) ||
    /^(are\s+you\s+(ready|able|willing|available|here|free)\s+to\s+(assist|help|talk|listen)(\s+(to\s+)?me)?)$/i.test(normalized) ||
    /^(i\s+(need|want)\s+(your\s+)?(help|assistance|guidance))$/i.test(normalized) ||
    /^(help\s+me|please\s+help\s+me|can\s+you\s+help|assist\s+me|please\s+assist\s+me)$/i.test(normalized)
  ) {
    if (age === 'child') {
      return `I would love to help you${formatName(name)}! 🌿 I'm your friend Iman. You can ask me anything about Islam, tell me how your day went, or talk to me whenever you feel happy, worried, or sad. What's on your heart today?`;
    }
    if (age === 'teen') {
      return `I'd really love to help you${formatName(name)}! Think of me as a safe, quiet space with zero judgment. Whether you're stressed with school, navigating stuff with friends or family, or just curious about faith, I'm right here to listen. What's on your mind?`;
    }
    if (age === 'senior') {
      return `It would be an absolute honor to assist you${formatName(name)}. I am here as your companion in faith to share authentic reminders from the Quran and Sunnah, offer peaceful reflections, and listen whenever you need comfort. How may I be of service to you today?`;
    }
    return `I would love to assist you${formatName(name)}! I'm here as your Islamic companion for guidance, authentic hadiths, and a compassionate listening ear whenever you need clarity or comfort. What's on your mind today?`;
  }

  // 4. Identity ("Who are you?", "What is Iman?")
  if (
    /^(who|what)\s+are\s+you\b/i.test(normalized) ||
    /^what\s+is\s+iman\b/i.test(normalized) ||
    /^(introduce\s+yourself|tell\s+me\s+about\s+yourself|what\s+is\s+your\s+name|who\s+made\s+you)$/i.test(normalized)
  ) {
    if (age === 'child') {
      return `I'm Iman! 🌙 I am your friendly Islamic companion. I'm here to share stories, answer your questions about Allah and our beautiful religion, and help your heart feel peaceful. What would you like to explore today${formatName(name)}?`;
    }
    if (age === 'teen') {
      return `I'm Iman, an Islamic AI companion created to be a safe, grounded space for you. You can ask me real questions about faith, talk through daily struggles or stress, and find authentic hadiths without feeling judged. How can I support you today${formatName(name)}?`;
    }
    if (age === 'senior') {
      return `I am Iman, your companion in faith. I was created with deep care to offer authentic reminders from the Quran and Sunnah, gentle supplications, and a tranquil space for reflection. How may I assist you today${formatName(name)}?`;
    }
    return `I am Iman, your Islamic companion for guidance and comfort. I'm here to provide a listening ear, authentic references from the Quran and Sunnah, soothing supplications, and practical steps whenever you face life's challenges. What would you like to talk through today${formatName(name)}?`;
  }

  // 5. Capabilities ("What can you do?", "How can you help me?")
  if (
    /^(what\s+can\s+you\s+do|how\s+can\s+you\s+help\s+me|what\s+are\s+your\s+features|what\s+can\s+i\s+ask\s+you|how\s+do\s+you\s+work)$/i.test(normalized)
  ) {
    if (age === 'child') {
      return `You can ask me about Allah, the Prophets, prayers, or how to do good deeds! You can also tell me how you're feeling whenever you're happy, worried, or sad, and I will always listen. What would you like to ask${formatName(name)}?`;
    }
    return `I am here to support you in whatever you are experiencing${formatName(name)}! Here is how I can assist:\n\n• **Friendly Companionship:** We can chat, share stories, and talk through whatever is on your mind.\n• **Emotional Comfort & Guidance:** Share whenever you feel stressed or down, and receive gentle, age-tailored reflections and duas.\n• **Islamic Clarifications:** Ask about daily prayers, hadiths, Quranic concepts, and Islamic living.\n\nWhat would you like to begin with today?`;
  }

  // 6. Food, Drinks, Chai & Coffee
  if (
    /\b(tea\s+or\s+coffee|coffee\s+or\s+tea|do\s+you\s+like\s+chai|chai|coffee|tea|biryani|pizza|favorite\s+food|what\s+do\s+you\s+eat|what\s+should\s+i\s+eat)\b/i.test(normalized)
  ) {
    if (/\b(tea|chai|coffee)\b/i.test(normalized)) {
      return `Definitely chai for me! ☕ A warm cup of cardamom chai just hits differently and brings so much comfort. Are you more of a tea person or a coffee person?`;
    }
    if (/\b(biryani)\b/i.test(normalized)) {
      return `Biryani is legendary! Especially with raita on the side. You honestly can't beat it. Do you like it extra spicy or mild?`;
    }
    return `Good food is honestly one of Allah's sweetest everyday blessings! Don't forget to say Bismillah before you eat. What's your absolute favorite dish?`;
  }

  // 7. Cats & Pets
  if (
    /\b(cat|cats|kitten|kittens|do\s+you\s+like\s+cats|dog|dogs|pets?|animal|animals)\b/i.test(normalized)
  ) {
    return `Cats are the absolute best! 🐾 Did you know our beloved Prophet Muhammad (peace be upon him) had a huge soft spot for cats? One of his closest companions was nicknamed Abu Hurairah ('father of the kitten') because he always cared for a little cat in his sleeve. Do you have a pet?`;
  }

  // 8. Jokes & Humor
  if (
    /\b(tell\s+me\s+a\s+joke|make\s+me\s+laugh|say\s+something\s+funny|funny\s+joke|know\s+any\s+jokes)\b/i.test(normalized)
  ) {
    const jokes = [
      `Why did the computer go to the doctor? Because it caught a virus! 😄 What kind of humor makes you laugh?`,
      `Why couldn't the bicycle stand up by itself? Because it was two-tired! 🚲 Hope that brought a little smile to your day!`,
      `What did one ocean say to the other ocean? Nothing, they just waved! 🌊 Got any good jokes yourself?`
    ];
    return pick(jokes);
  }

  // 9. Stories & Inspiring Tales
  if (
    /\b(tell\s+me\s+a\s+story|tell\s+a\s+story|prophet\s+story|islamic\s+story|inspiring\s+story|tell\s+me\s+something\s+inspiring|bedtime\s+story)\b/i.test(normalized)
  ) {
    if (age === 'child') {
      return `Here is one of my favorite sweet stories about the Prophet Muhammad (peace be upon him)! 🐦\n\nThere was once a young boy named Abu Umayr who had a tiny pet bird that he loved so much. One day, the little bird sadly passed away, and Abu Umayr was crying. When the Prophet (PBUH) saw him, he didn't tell him to stop crying or that it was just a bird. Instead, he sat down right beside him, comforted him with a gentle smile, and gently asked: "O Abu Umayr, what happened to the little bird?"\n\nIsn't that beautiful? The Prophet of Allah cared so much about the feelings of a little child and his tiny pet bird. Allah made your feelings precious too! What do you think of that story?`;
    }
    return `Here is a story of profound gentleness from the life of our beloved Prophet (peace be upon him):\n\nOnce, a bedouin who was unfamiliar with the manners of the mosque walked into the Prophet's masjid in Madinah and began to relieve himself in a corner. The companions were outraged and rushed to stop him harshly. \n\nBut the Prophet (PBUH) stopped them immediately, saying: "Leave him alone and do not interrupt him." Once the man had finished, the Prophet (PBUH) called for a bucket of water to wash the spot clean. Then he called the man over gently, without any scolding or anger, and explained with utmost kindness: "These mosques are not built for this, but for the remembrance of Allah and prayer." \n\nThe bedouin was so moved by the Prophet's warmth that he raised his hands and made du'a: "O Allah, have mercy on me and on Muhammad, and on no one else!" The Prophet smiled and said: "You have narrowed something very vast (Allah's mercy)."\n\nIt reminds us that true strength and faith are always expressed through softness and patience. What are your thoughts on that?`;
  }

  // 10. Favorite Surah / Islamic Curiosity
  if (
    /\b(favorite\s+surah|favourite\s+surah|best\s+surah|which\s+surah\s+do\s+you\s+like)\b/i.test(normalized)
  ) {
    return `Every surah of the Qur'an holds its own unique light, but **Surah Ad-Duha (Chapter 93)** has a very special place in my heart! 🌅\n\nIt was revealed during a period when the Prophet (PBUH) felt lonely and worried that Allah might have forsaken him. Allah revealed it to comfort his heart with the words: *"Your Lord has neither forsaken you, nor is He displeased."* It is like a warm embrace for anyone who feels down or exhausted.\n\nDo you have a favorite surah or ayah that brings you peace?`;
  }

  // 11. Small Talk / "I'm bored"
  if (
    /^(i['’]?m\s+(so\s+)?bored|bored|nothing\s+to\s+do|what\s+should\s+i\s+do)$/i.test(normalized)
  ) {
    if (age === 'child') {
      return `Being bored can actually be the start of a fun adventure! 🎨 You could draw a picture of a beautiful garden in Jannah, help your mom or dad with a surprise chore, or we could play a little guessing game about Islamic history. What sounds fun to you?`;
    }
    return `Boredom is often your mind asking for a fresh spark! You could listen to a soothing recitation of Surah Ar-Rahman, step outside for a 10-minute walk in the fresh air, or read about the companions of the Prophet. Or if you prefer, we can just chat about whatever is on your mind! What are you in the mood for?`;
  }

  // 12. Weather & Rain
  if (
    /\b(rain|raining|weather|sunny|cold\s+outside|winter|summer)\b/i.test(normalized)
  ) {
    if (/\b(rain|raining)\b/i.test(normalized)) {
      return `Rain has the most peaceful atmosphere! 🌧️ In Islam, rainfall is considered rahmah (mercy from Allah), and it's actually one of the special times when prayers are answered. Is it raining where you are right now?`;
    }
    return `Nature is full of signs of Allah's beauty! Changing seasons always remind us that nothing stays the same, and ease always follows difficulty. How is the weather where you are?`;
  }

  // 13. Sleep, Night & Morning
  if (
    /\b(good\s*night|going\s+to\s+sleep|sleepy|bedtime|just\s+woke\s+up|good\s+morning)\b/i.test(normalized)
  ) {
    if (/\b(good\s*night|going\s+to\s+sleep|sleepy|bedtime)\b/i.test(normalized)) {
      return `Rest well${formatName(name)}! 🌙 Say Bismillah, dust your pillow, and recite Ayat al-Kursi before you drift off for peaceful sleep and protection. Sleep peacefully!`;
    }
    return `Good morning${formatName(name)}! ☀️ May your day be blessed with energy, barakah, and ease. What are you looking forward to today?`;
  }

  // 14. Compliments & Warmth
  if (
    /\b(you\s+are\s+(so\s+)?(nice|kind|sweet|cool|awesome|great|helpful|the\s+best)|i\s+like\s+you|i\s+love\s+you)\b/i.test(normalized)
  ) {
    return `That is so kind of you to say${formatName(name)}! Your words truly warm my heart. I'm grateful to be here as your companion, and I pray Allah brings continuous joy, peace, and barakah to your life. How has the rest of your day been?`;
  }

  // 15. Greetings ("Hi", "Hello", "Assalamu Alaikum", "Salam")
  if (
    /^(hi|hello|hey|heyy|heyyy|salam|salaam|as-salamu\s+alaykum|assalamu\s+alaikum|assalam\s+o\s+alaikum|asalam\s+alikum|peace\s+be\s+upon\s+you)$/i.test(normalized) ||
    /^(good\s+(morning|afternoon|evening|day))$/i.test(normalized) ||
    /^greetings$/i.test(normalized)
  ) {
    if (age === 'child') {
      return `Assalamu Alaikum little${formatNameDirect(name)}! 🌿 It's so nice to talk with you. How are you feeling today?`;
    }
    if (age === 'teen') {
      return `Wa Alaikum As-Salaam${formatName(name)}! 🌸 Hope you're having a good day. What's on your mind?`;
    }
    if (age === 'senior') {
      return `Wa Alaikum As-Salaam wa Rahmatullah, respected${formatNameDirect(name)}. May Allah grant you health and tranquility today. How can I assist you?`;
    }
    return `Wa Alaikum As-Salaam${formatName(name)}! It is so good to connect with you. How are you feeling today, and how can I help you?`;
  }

  // 16. Check-in ("How are you?", "How are you doing?", "What are you doing?")
  if (
    /^(how\s+are\s+you|how\s+are\s+you\s+doing|how['’]?s\s+it\s+going|how\s+do\s+you\s+feel|what['’]?s\s+up|how\s+have\s+you\s+been|what\s+are\s+you\s+doing)$/i.test(normalized)
  ) {
    if (/what\s+are\s+you\s+doing/i.test(normalized)) {
      return `Just right here and happy to chat with you! How is your day going so far${formatName(name)}?`;
    }
    return `Alhamdulillah, I am doing well and grateful to be here with you! Thank you so much for asking${formatName(name)}. How is your heart today, and what would you like to talk about?`;
  }

  // 17. Gratitude ("Thank you", "JazakAllah khair", "Shukran")
  if (
    /^(thank\s+you|thanks|thx|jazakallah|jazakallah\s+khair|jazakallahu\s+khayran|shukran|barakallahu\s+feek|thank\s+you\s+so\s+much|thanks\s+a\s+lot)$/i.test(normalized)
  ) {
    return `Wa iyyakum (and may Allah reward you as well)${formatName(name)}! It is truly my pleasure to be here for you. Whenever you want to reflect, ask a question, or talk, I'm always right here.`;
  }

  // 18. Goodbyes ("Bye", "Allah hafiz", "Fee amanillah")
  if (
    /^(bye|goodbye|cya|see\s+you|farewell|allah\s+hafiz|khuda\s+hafiz|fee\s+amanillah|take\s+care)$/i.test(normalized)
  ) {
    return `Fee Amanillah (May you be in Allah's safe keeping)${formatName(name)}! May He grant you peace, protection, and barakah until we speak again.`;
  }

  // 19. Short Acknowledgments ("Ok", "Alright", "Got it")
  if (
    /^(ok|okay|k|alright|cool|got\s+it|understood|noted|sure|yep|yes|sounds\s+good|that\s+makes\s+sense|i\s+see)$/i.test(normalized)
  ) {
    return `I'm glad to hear that${formatName(name)}. Take all the time you need, and feel free to ask or share whenever you're ready.`;
  }

  // 20. Testing / Presence ("Are you there?", "Are you real?", "Are you a bot?")
  if (
    /^(are\s+you\s+(there|alive|a\s+bot|a\s+real\s+person|human|ai)|test|testing)$/i.test(normalized)
  ) {
    return `I am right here with you! I'm Iman, an AI companion designed with warmth, care, and authentic Islamic principles to support your journey. How are you doing today${formatName(name)}?`;
  }

  return null;
}

/**
 * Natural, human-like companion response for everyday casual remarks,
 * sharing daily thoughts, and neutral non-stress conversation.
 * Takes context from previous assistant / user messages into account.
 */
export function getFriendlyCompanionResponse(
  message: string,
  context?: ConversationalContext,
  history?: ChatHistoryItem[]
): string {
  const age = resolveAge(context);
  const name = context?.name;

  // Check if we can pick up on recent conversation topics
  const lastAssistant = history && history.length > 0
    ? [...history].reverse().find((m) => m.role === 'assistant')?.content.toLowerCase() ?? ''
    : '';

  if (lastAssistant.includes('tea') || lastAssistant.includes('coffee') || lastAssistant.includes('drink')) {
    return `I love that! Honestly, sharing simple daily favorites like drinks and food is so comforting. What else is on your mind today${formatName(name)}?`;
  }

  if (lastAssistant.includes('pet') || lastAssistant.includes('cat') || lastAssistant.includes('dog')) {
    return `Animals bring such gentle joy into our lives! Did you do anything fun with them today${formatName(name)}?`;
  }

  if (lastAssistant.includes('hobby') || lastAssistant.includes('reading') || lastAssistant.includes('drawing')) {
    return `It sounds like you really enjoy that! It's so good to make time for things that refresh your spirit. What else have you been up to?`;
  }

  if (age === 'child') {
    const childReplies = [
      `That's so nice${formatName(name)}! 🌟 I love hearing about that. What else would you like to talk about today?`,
      `That sounds like so much fun${formatName(name)}! Tell me more about it!`,
      `I really enjoy chatting with you${formatName(name)}! You always bring a smile. What's your favorite thing we should talk about next?`
    ];
    return pick(childReplies);
  }

  if (age === 'teen') {
    const teenReplies = [
      `I hear you${formatName(name)}! Honestly, tell me more about that, how did it go?`,
      `That's pretty cool${formatName(name)}. What else have you been up to today?`,
      `That makes total sense. I'm always down to chat about this stuff — what else is on your mind?`
    ];
    return pick(teenReplies);
  }

  if (age === 'senior') {
    const seniorReplies = [
      `Thank you for sharing your thoughts with me, respected${formatNameDirect(name)}. It is truly a pleasure conversing with you. Please feel free to tell me more.`,
      `That is very interesting and pleasant to hear, respected${formatNameDirect(name)}. How has the rest of your day been?`
    ];
    return pick(seniorReplies);
  }

  const adultReplies = [
    `I hear you${formatName(name)}! That's really interesting. Tell me a bit more about how that went!`,
    `Honestly, that sounds really nice. How has the rest of your day been treating you?`,
    `I love that! It's so nice to just talk and connect about regular life. What else is on your mind today?`,
    `That makes a lot of sense${formatName(name)}. What made you think of that today?`
  ];
  return pick(adultReplies);
}

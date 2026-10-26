import type { CurriculumLevel, CurriculumQuestion } from '../types/curriculum';

export interface EvaluationResult {
  correct: boolean;
  matchedKeywords: string[];
  missingKeywords: string[];
  feedback: string;
}

const STOP_WORDS = new Set<string>([
  'the', 'a', 'an', 'and', 'or', 'is', 'are', 'of', 'to', 'in', 'on', 'for',
  'that', 'this', 'with', 'it', 'be', 'as', 'by', 'we', 'our', 'us', 'i',
  'you', 'your', 'my', 'me', 'do', 'does', 'what', 'why', 'how', 'when',
  'who', 'can', 'should', 'would', 'will', 'have', 'has', 'had', 'not', 'no',
  'yes', 'but', 'because', 'so', 'then', 'than', 'also', 'just', 'very',
  'more', 'most', 'some', 'any', 'all', 'one', 'two', 'three', 'about',
  'into', 'from', 'at', 'up', 'down', 'out', 'over', 'again', 'its', 'they',
  'them', 'their', 'there', 'here', 'was', 'were', 'been', 'being', 'make',
  'made', 'makes', 'making', 'did', 'done', 'get', 'got', 'getting', 'like',
  'liking', 'want', 'wants', 'wanted', 'know', 'knows', 'knew', 'known',
  'think', 'thinks', 'thought', 'feel', 'feels', 'felt', 'say', 'says',
  'said', 'saying', 'see', 'sees', 'saw', 'seen', 'go', 'goes', 'went',
  'gone', 'come', 'comes', 'came', 'coming', 'take', 'takes', 'took',
  'taken', 'give', 'gives', 'gave', 'given', 'find', 'finds', 'found',
  'use', 'uses', 'used', 'using', 'way', 'ways', 'thing', 'things',
  'people', 'person', 'good', 'well', 'better', 'best', 'much', 'many',
  'such', 'same', 'other', 'each', 'every', 'both', 'few', 'those',
  'these', 'which', 'whom', 'whose', 'where', 'while', 'during', 'before',
  'after', 'between', 'through', 'across', 'around', 'against', 'above',
  'below', 'upon', 'off', 'away', 'back', 'still', 'now', 'once', 'yet',
  'ever', 'never', 'always', 'often', 'sometimes', 'maybe', 'perhaps',
  'might', 'must', 'shall', 'may', 'could', 'since', 'although', 'though',
  'even', 'already', 'only', 'really', 'truly', 'indeed', 'certainly',
  'probably', 'possibly', 'likely', 'unlikely', 'toward', 'towards', 'onto',
  'within', 'without', 'along', 'beside', 'near', 'far', 'either', 'neither',
  'nor', 'if', 'unless', 'he', 'she', 'his', 'her', 'him', 'they', 'it',
  'was', 'were', 'been', 'being', 'am', 'isn', 'aren', 'don', 'doesn',
  'didn', 'won', 'wouldn', 'shouldn', 'couldn', 'hasn', 'haven', 'hadn',
]);

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\u2019\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

// Returns true if the keyword phrase is found in the user's answer. Supports
// multi-word keywords (e.g. "absolute", "does not beget") by checking the
// normalized token sequence as well as a substring match on the raw text so
// contractions and punctuation variants still match.
function keywordMatches(userRaw: string, userTokens: string[], keyword: string): boolean {
  const kw = keyword.toLowerCase().trim();
  if (!kw) return false;
  if (userRaw.toLowerCase().includes(kw)) return true;

  const kwTokens = normalize(kw);
  if (kwTokens.length === 0) return false;

  // All non-stop tokens of the keyword must appear among the user's tokens.
  const userSet = new Set(userTokens);
  const allPresent = kwTokens.every((t) => userSet.has(t));
  if (allPresent) return true;

  // Allow a single high-signal keyword to match on a stem (e.g. "beget" /
  // "begotten", "one" / "oneness"). Stem by trimming common suffixes.
  const stem = (w: string) => w.replace(/(ing|ed|es|s|en|ment|ness|tion)$/g, '');
  const kwStems = kwTokens.map(stem);
  const userStems = userTokens.map(stem);
  const stemSet = new Set(userStems);
  return kwStems.every((s) => stemSet.has(s));
}

/**
 * Strict semantic verification for a free-text answer.
 *
 * The answer is approved ONLY when it contains (or closely matches) a
 * sufficient proportion of the question's level-specific `requiredKeywords`.
 * Generic Islamic keywords ("allah", "quran", "prayer") are never sufficient
 * on their own — the answer must demonstrate the specific concept of the
 * level. This prevents a user from passing a level with a correct-sounding
 * answer that actually describes a different topic (e.g. giving Surah
 * Al-Fatiha's meaning for a Surah Al-Ikhlas question).
 *
 * If `siblingLevels` is provided and the answer fails the current level but
 * strongly matches another level's requiredKeywords, the feedback names that
 * level so the learner knows they confused two topics.
 */
export function evaluateAnswer(
  userAnswer: string,
  question: CurriculumQuestion,
  siblingLevels?: CurriculumLevel[]
): EvaluationResult {
  const raw = userAnswer.trim();
  const tokens = normalize(raw);

  const required = question.requiredKeywords ?? [];
  const matched: string[] = [];
  const missing: string[] = [];

  for (const kw of required) {
    if (keywordMatches(raw, tokens, kw)) {
      matched.push(kw);
    } else {
      missing.push(kw);
    }
  }

  if (required.length === 0) {
    return {
      correct: false,
      matchedKeywords: [],
      missingKeywords: [],
      feedback:
        'This question has no required key concepts defined, so it cannot be auto-verified. Please re-read the story and try the multiple-choice option instead.',
    };
  }

  // Require a strict majority of the required keywords, with a hard minimum
  // of one when there are several. A single required keyword must be present.
  const ratio = matched.length / required.length;
  const correct = tokens.length > 0 && matched.length > 0 && ratio >= 0.5;

  const titleHint = question.options[question.correctAnswerIndex] ?? question.explanation;

  // Detect a cross-topic answer: the user failed this level but their answer
  // strongly matches the requiredKeywords of a different level in the same
  // tier (e.g. they described Surah Al-Fatiha for a Surah Al-Ikhlas question).
  const confusedLevel = correct || !siblingLevels || siblingLevels.length === 0
    ? null
    : detectConfusedLevel(raw, tokens, required, siblingLevels);

  let feedback: string;
  if (correct) {
    feedback = `Well done — your answer included the key ideas: ${matched.join(', ')}.`;
  } else if (matched.length > 0) {
    feedback =
      `Your answer touched on ${matched.join(', ')}, but it's missing the key idea${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}. ` +
      `The right idea is about "${titleHint}". Re-read the story to find it.`;
  } else if (confusedLevel) {
    feedback =
      `That sounds like the meaning of ${confusedLevel.title}! Let's re-read the story about ${levelTopic(question, titleHint)} to find the right answer. 📖`;
  } else {
    feedback =
      `Hmm, your answer doesn't mention the key idea${required.length > 1 ? 's' : ''} for this lesson: ${required.join(', ')}. ` +
      `This lesson is about "${titleHint}". Re-read the story carefully and try again.`;
  }

  return {
    correct,
    matchedKeywords: matched,
    missingKeywords: missing,
    feedback,
  };
}

// Heuristic: returns the level whose requiredKeywords the answer matches best,
// provided that match is clearly stronger than the (failed) match on the
// current level. We require at least two distinct sibling keywords (or all of
// a short sibling list) to avoid false positives from generic terms.
function detectConfusedLevel(
  raw: string,
  tokens: string[],
  currentRequired: string[],
  siblingLevels: CurriculumLevel[]
): CurriculumLevel | null {
  let best: { level: CurriculumLevel; score: number } | null = null;
  for (const lvl of siblingLevels) {
    const kw = lvl.questions[0]?.requiredKeywords ?? [];
    if (kw.length === 0) continue;
    // Skip the current level itself (matched by caller already).
    if (kw.join('|') === currentRequired.join('|')) continue;
    const hits = kw.filter((k) => keywordMatches(raw, tokens, k)).length;
    if (hits === 0) continue;
    const score = hits / kw.length;
    if (!best || score > best.score) best = { level: lvl, score };
  }
  if (!best) return null;
  // Require a strong match (>= 0.5) and at least 2 distinct hits, so generic
  // overlaps ("allah") don't trigger a "you meant X" message.
  const hits = best.level.questions[0]?.requiredKeywords?.filter((k) =>
    keywordMatches(raw, tokens, k)
  ).length ?? 0;
  if (best.score < 0.5 || hits < 2) return null;
  return best.level;
}

function levelTopic(question: CurriculumQuestion, titleHint: string): string {
  // Prefer the lesson title from the question text when it references a surah
  // or named concept; fall back to the correct option's text.
  const surahMatch = question.question.match(/Surah\s+(Al-)?[\w'-]+/i);
  return surahMatch ? surahMatch[0] : titleHint;
}

/**
 * Verifies a multiple-choice selection. Returns a result with concept-level
 * feedback so the retry banner stays specific even for MCQ wrong answers.
 */
export function evaluateMCQ(selectedIndex: number | null, question: CurriculumQuestion): EvaluationResult {
  if (selectedIndex === null) {
    return {
      correct: false,
      matchedKeywords: [],
      missingKeywords: question.requiredKeywords,
      feedback: 'Pick an option first, then submit your answer.',
    };
  }
  const correct = selectedIndex === question.correctAnswerIndex;
  const correctText = question.options[question.correctAnswerIndex] ?? question.explanation;
  return {
    correct,
    matchedKeywords: correct ? question.requiredKeywords : [],
    missingKeywords: correct ? [] : question.requiredKeywords,
    feedback: correct
      ? `Correct! ${question.explanation}`
      : `That's not quite right. The right answer is about "${correctText}". Re-read the story to find the key idea${question.requiredKeywords.length > 1 ? 's' : ''}: ${question.requiredKeywords.join(', ')}.`,
  };
}

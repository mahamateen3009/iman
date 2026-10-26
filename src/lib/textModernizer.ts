/**
 * Modernize archaic hadith text into clean, readable modern English.
 *
 * Many hadith translations use archaic or formal phrasing. This utility
 * applies gentle, safe substitutions to improve readability without
 * changing the meaning.
 */

const REPLACEMENTS: Array<[RegExp, string]> = [
  [/ amongst /g, ' among '],
  [/ amongst\b/g, ' among'],
  [/\bwhosoever\b/gi, 'whoever'],
  [/wheresoever/gi, 'wherever'],
  [/whatsoever/gi, 'whatever'],
  [/hath\b/gi, 'has'],
  [/doth\b/gi, 'does'],
  [/saith\b/gi, 'says'],
  [/unto\b/gi, 'to'],
  [/ye\b/gi, 'you'],
  [/thee\b/gi, 'you'],
  [/thou\b/gi, 'you'],
  [/thy\b/gi, 'your'],
  [/thine\b/gi, 'your'],
  [/nay\b/gi, 'no'],
  [/verily,?/gi, 'truly,'],
  [/lo! ?/gi, ''],
  [/behold,? ?/gi, ''],
  [/wherefore/gi, 'therefore'],
  [/in so much that/gi, 'so much that'],
  [/forasmuch as/gi, 'since'],
  [/\bdo ye\b/gi, 'do you'],
  [/shall ye\b/gi, 'will you'],
  [/ye shall\b/gi, 'you will'],
  [/O ye who believe/gi, 'O you who believe'],
];

/**
 * Apply modern-English substitutions to a hadith text.
 * Preserves original meaning while making phrasing more readable.
 */
export function modernizeHadithText(text: string): string {
  let result = text;
  for (const [pattern, replacement] of REPLACEMENTS) {
    result = result.replace(pattern, replacement);
  }
  // Clean up double spaces from replacements.
  result = result.replace(/  +/g, ' ').trim();
  // Capitalize first letter.
  if (result.length > 0) {
    result = result.charAt(0).toUpperCase() + result.slice(1);
  }
  return result;
}

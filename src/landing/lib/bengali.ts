/**
 * Detects whether a string contains Bengali script characters.
 * Bengali Unicode block: U+0980 – U+09FF.
 */
export function containsBengali(text: string): boolean {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

/**
 * Returns true when the input has a meaningful amount of Bengali
 * content — at least 10% of non-whitespace characters are Bengali.
 * Avoids false positives on stray punctuation or accidental input-method
 * artifacts that happen to contain one Bengali character.
 */
export function isPrimarilyBengali(text: string): boolean {
  if (!text) return false;
  const stripped = text.replace(/\s+/g, "");
  if (!stripped) return false;
  let bengaliCount = 0;
  for (const ch of stripped) {
    const code = ch.charCodeAt(0);
    if (code >= 0x0980 && code <= 0x09ff) bengaliCount++;
  }
  return bengaliCount / stripped.length >= 0.1;
}

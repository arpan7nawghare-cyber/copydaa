// textUtils.js — small shared helpers for the plagiarism checker.
// Kept deliberately simple so students can explain each one in a viva.

// Split a block of text into sentences. We treat '.', '!' and '?'
// followed by a space (or end of string) as sentence boundaries.
// Returns an array of trimmed, non-empty sentences.
export function splitSentences(text) {
  if (!text) return [];
  // The regex keeps the ending punctuation with the sentence.
  const matches = text.match(/[^.!?]+[.!?]*(?:\s|$)/g);
  if (!matches) return [];
  return matches.map((s) => s.trim()).filter((s) => s.length > 0);
}

// Split a block of text into lowercase words (ignoring punctuation).
// "Hello, world!" -> ["hello", "world"]
export function splitWords(text) {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

// Count words in a string.
export function countWords(text) {
  return splitWords(text).length;
}

// Count characters (including spaces) in a string.
export function countChars(text) {
  return text ? text.length : 0;
}

// Build a single space-separated, lowercased version of text with
// punctuation removed. Useful for normalising both texts before LCS.
export function normalize(text) {
  if (!text) return "";
  return splitWords(text).join(" ");
}

// Percentage helper that avoids division by zero.
export function pct(part, whole) {
  if (!whole) return 0;
  return (part / whole) * 100;
}

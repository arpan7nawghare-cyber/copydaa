// rabinKarp.js — Rabin-Karp rolling-hash substring search.
//
// Idea (for viva): instead of comparing every character at every
// position like naive search, we compute a numeric "hash" for the
// pattern and for a sliding window of the same size over the text.
// We only compare the actual characters when the hashes match.
//
//   Rolling hash : hash = (hash * base + charCode) % prime
//   Rolling step : hash = ((hash - charCode_leaving * power) * base
//                            + charCode_entering) % prime
//
//   Average case: O(n + m)  — few spurious hash hits.
//   Worst case : O(n*m)     — every hash collides (spurious hits).
//
// A "spurious hit" is a position where the hash matches but the text
// does not — we count these because they explain the worst case.

import { splitSentences } from "./textUtils";

const BASE = 256; // size of the alphabet (extended ASCII)
const PRIME = 101; // a small prime for the modulus (keeps numbers small)

// Single-pattern Rabin-Karp that also records every step for the
// visualiser. Each step records the window index, the current window
// hash, the pattern hash, whether it is a spurious hit, and a match flag.
export function rabinKarp(text, pattern, { recordSteps = false } = {}) {
  const t0 = performance.now();
  const n = text.length;
  const m = pattern.length;
  const positions = [];
  let comparisons = 0;
  let spuriousHits = 0;
  const steps = [];

  if (m === 0 || m > n) {
    return { positions, comparisons, spuriousHits, timeMs: performance.now() - t0, steps };
  }

  // Pre-compute base^(m-1) mod prime — used to remove the leading digit.
  let power = 1;
  for (let i = 0; i < m - 1; i++) {
    power = (power * BASE) % PRIME;
  }

  // Hash of the pattern and of the first window of text.
  let patternHash = 0;
  let windowHash = 0;
  for (let i = 0; i < m; i++) {
    patternHash = (patternHash * BASE + pattern.charCodeAt(i)) % PRIME;
    windowHash = (windowHash * BASE + text.charCodeAt(i)) % PRIME;
  }

  // Slide the window one character at a time over the text.
  for (let i = 0; i <= n - m; i++) {
    let isSpurious = false;
    let isMatch = false;

    if (windowHash === patternHash) {
      // Hashes match — verify character by character to rule out collision.
      let j = 0;
      while (j < m) {
        comparisons++;
        if (text[i + j] !== pattern[j]) break;
        j++;
      }
      if (j === m) {
        positions.push(i);
        isMatch = true;
      } else {
        spuriousHits++; // hash matched, text did not -> spurious hit
        isSpurious = true;
      }
    }

    if (recordSteps) {
      steps.push({
        i,
        window: text.slice(i, i + m),
        windowHash,
        patternHash,
        hashMatch: windowHash === patternHash,
        spurious: isSpurious,
        match: isMatch,
      });
    }

    // Roll the hash forward (remove left char, add right char) unless
    // this is the last window.
    if (i < n - m) {
      windowHash =
        (BASE *
          (windowHash - text.charCodeAt(i) * power) +
          text.charCodeAt(i + m)) %
        PRIME;
      // JavaScript can give negative remainders, so normalise to positive.
      if (windowHash < 0) windowHash += PRIME;
    }
  }

  return {
    positions,
    comparisons,
    spuriousHits,
    timeMs: performance.now() - t0,
    steps,
  };
}

// Run Rabin-Karp for every sentence of the original text against the
// suspected text. Also computes the "Exact Copy %" = fraction of original
// sentences found verbatim in the suspected text.
export function rabinKarpSentences(original, suspected, { recordSteps = false } = {}) {
  const sentences = splitSentences(original);
  const results = sentences.map((s) => ({
    sentence: s,
    ...rabinKarp(suspected, s, { recordSteps }),
  }));
  const matched = results.filter((r) => r.positions.length > 0).length;
  const exactCopyPct = sentences.length === 0 ? 0 : (matched / sentences.length) * 100;
  const totalComparisons = results.reduce((s, r) => s + r.comparisons, 0);
  const totalTime = results.reduce((s, r) => s + r.timeMs, 0);
  return {
    results,
    matched,
    total: sentences.length,
    exactCopyPct,
    totalComparisons,
    totalTime,
  };
}

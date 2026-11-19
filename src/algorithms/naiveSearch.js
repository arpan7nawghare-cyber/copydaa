// naiveSearch.js — brute-force substring search.
//
// Idea (for viva): slide the pattern across the text one position at a
// time and, at every position, compare characters one by one until we
// either find a mismatch or reach the end of the pattern.
//
//   Best case : O(n)  — first character never matches, so we do n checks.
//   Worst case: O(n*m) — e.g. text = "AAAAA", pattern = "AAB".
//
// Returns an object with the list of match positions, the number of
// character comparisons performed (operation count) and elapsed time in ms.
export function naiveSearch(text, pattern) {
  const t0 = performance.now();
  const n = text.length;
  const m = pattern.length;
  const positions = [];
  let comparisons = 0;

  // If the pattern is empty or longer than the text there can be no match.
  if (m === 0 || m > n) {
    return { positions, comparisons, timeMs: performance.now() - t0 };
  }

  // Try every starting index i in the text.
  for (let i = 0; i <= n - m; i++) {
    let j = 0;
    // Compare pattern[j] against text[i+j] until a mismatch or full match.
    while (j < m) {
      comparisons++;
      if (text[i + j] !== pattern[j]) {
        break; // mismatch, slide the window by one
      }
      j++;
    }
    if (j === m) {
      positions.push(i); // full pattern matched starting at index i
    }
  }

  return { positions, comparisons, timeMs: performance.now() - t0 };
}

// Search many patterns (e.g. each sentence) inside one text.
// Returns one result entry per pattern plus an aggregate.
export function naiveSearchMulti(text, patterns) {
  const results = patterns.map((p) => ({
    pattern: p,
    ...naiveSearch(text, p),
  }));
  const totalComparisons = results.reduce((s, r) => s + r.comparisons, 0);
  const totalTime = results.reduce((s, r) => s + r.timeMs, 0);
  const matched = results.filter((r) => r.positions.length > 0).length;
  return { results, totalComparisons, totalTime, matched };
}

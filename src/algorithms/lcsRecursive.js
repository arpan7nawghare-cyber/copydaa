// lcsRecursive.js — Longest Common Subsequence via plain recursion.
//
// Idea (for viva): compare the last words of both sequences.
//   - If they are equal, they are part of the LCS -> 1 + recurse on the
//     rest of both sequences.
//   - If they differ, take the better of dropping the last word of A or
//     dropping the last word of B.
//
// Base case: either sequence empty -> LCS length is 0.
//
// Complexity: O(2^(m+n)) — every call branches into two sub-calls, so
// the recursion tree is exponential. We cap the input at 20 words in
// the UI before calling this, otherwise the browser would hang.
//
// We count function calls (operation count) to compare with DP.

export function lcsRecursive(a, b) {
  const t0 = performance.now();
  let calls = 0;

  // Inner recursive function over indices i and j.
  function rec(i, j) {
    calls++;
    if (i === 0 || j === 0) return 0; // one side empty -> nothing common
    if (a[i - 1] === b[j - 1]) {
      return 1 + rec(i - 1, j - 1); // last words match, take it
    }
    // Otherwise drop one word from either side and keep the best.
    return Math.max(rec(i - 1, j), rec(i, j - 1));
  }

  const length = rec(a.length, b.length);
  return { length, calls, timeMs: performance.now() - t0 };
}

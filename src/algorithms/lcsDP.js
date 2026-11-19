// lcsDP.js — Longest Common Subsequence via dynamic programming.
//
// Idea (for viva): build a 2D table dp where dp[i][j] = LCS length of
// the first i words of A and first j words of B.
//
//   if a[i-1] == b[j-1]:  dp[i][j] = 1 + dp[i-1][j-1]   (match -> diagonal)
//   else                 :  dp[i][j] = max(dp[i-1][j], dp[i][j-1])
//
// After filling the table we backtrack from the bottom-right corner to
// recover the actual LCS words.
//
// Complexity: O(m*n) time and O(m*n) space.
//
// `maxDim` caps the table size for the visualiser (default 15). When the
// input is larger we still compute the full LCS length, but we only
// record the cell-by-cell fill steps for the first maxDim x maxDim
// sub-table so the animation stays watchable.

export function lcsDP(a, b, { recordSteps = false, maxDim = 15 } = {}) {
  const t0 = performance.now();
  const m = a.length;
  const n = b.length;
  let comparisons = 0;

  // Full DP table of size (m+1) x (n+1), row 0 and col 0 stay zero.
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  // For the visualiser we record which cells are "filled" in order, but
  // only for the first maxDim x maxDim block so the animation is bounded.
  const vizM = Math.min(m, maxDim);
  const vizN = Math.min(n, maxDim);
  const steps = [];

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      comparisons++;
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1; // diagonal move
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
      // Record a step for the visualised sub-block only.
      if (recordSteps && i <= vizM && j <= vizN) {
        steps.push({ i, j, value: dp[i][j], match: a[i - 1] === b[j - 1] });
      }
    }
  }

  // Backtrack from dp[m][n] to recover the LCS words.
  const lcs = [];
  let i = m;
  let j = n;
  const backtrackPath = []; // list of [i,j] cells visited (for highlighting)
  while (i > 0 && j > 0) {
    backtrackPath.push([i, j]);
    if (a[i - 1] === b[j - 1]) {
      lcs.unshift(a[i - 1]); // this word is part of the LCS
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--; // came from above
    } else {
      j--; // came from the left
    }
  }
  if (i > 0 || j > 0) backtrackPath.push([Math.max(i, 0), Math.max(j, 0)]);

  const length = dp[m][n];

  // Trim the table to the visualised sub-block for display.
  const displayTable = dp.slice(0, vizM + 1).map((row) => row.slice(0, vizN + 1));
  const displayA = a.slice(0, vizM);
  const displayB = b.slice(0, vizN);
  // Backtrack path restricted to the displayed sub-block.
  const displayBacktrack = backtrackPath.filter(([r, c]) => r <= vizM && c <= vizN);

  return {
    length,
    lcs,
    dp: displayTable,
    displayA,
    displayB,
    backtrackPath: displayBacktrack,
    steps,
    comparisons,
    timeMs: performance.now() - t0,
    fullM: m,
    fullN: n,
  };
}

// Similarity % = LCS length / length of the shorter word list * 100.
export function lcsSimilarityPct(a, b) {
  const { length } = lcsDP(a, b);
  const shorter = Math.min(a.length, b.length);
  if (shorter === 0) return 0;
  return (length / shorter) * 100;
}

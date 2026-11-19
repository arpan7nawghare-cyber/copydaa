import { useState } from "react";
import { FlaskConical, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { rabinKarp } from "../algorithms/rabinKarp";
import { naiveSearch } from "../algorithms/naiveSearch";
import { lcsDP } from "../algorithms/lcsDP";
import { lcsRecursive } from "../algorithms/lcsRecursive";
import { splitWords } from "../algorithms/textUtils";

// "Run Test Cases" panel: four assertions with pass/fail badges.
export default function TestCases() {
  const [results, setResults] = useState(null);
  const [running, setRunning] = useState(false);

  const run = () => {
    setRunning(true);
    // Defer so the spinner can render before the (possibly heavy) work.
    setTimeout(() => {
      const t1 = testIdentical();
      const t2 = testDifferent();
      const t3 = testRkVsNaive();
      const t4 = testRecVsDp();
      setResults({ t1, t2, t3, t4 });
      setRunning(false);
    }, 50);
  };

  const all = results && [results.t1, results.t2, results.t3, results.t4].every((t) => t.pass);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
      <div className="flex items-center justify-between">
        <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <FlaskConical className="h-4 w-4 text-emerald-500" /> Test Cases
        </h4>
        <button
          onClick={run}
          disabled={running}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:opacity-60"
        >
          {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlaskConical className="h-4 w-4" />}
          Run Test Cases
        </button>
      </div>

      {results && (
        <div className="mt-4 space-y-2">
          {["t1", "t2", "t3", "t4"].map((k) => (
            <ResultRow key={k} r={results[k]} />
          ))}
          <div
            className={`mt-3 rounded-lg px-3 py-2 text-sm font-semibold ${
              all
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300"
            }`}
          >
            {all ? "All tests passed." : "Some tests failed — see above."}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultRow({ r }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-100 p-3 dark:border-slate-700">
      {r.pass ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
      ) : (
        <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
      )}
      <div>
        <div className="text-sm font-medium text-slate-700 dark:text-slate-200">{r.name}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{r.detail}</div>
      </div>
    </div>
  );
}

// --- Test cases ---

function testIdentical() {
  const text =
    "Dynamic programming breaks problems into overlapping subproblems and stores their results in a table to avoid redundant work.";
  const lcs = lcsDP(splitWords(text), splitWords(text));
  const shorter = Math.min(splitWords(text).length, splitWords(text).length);
  const pct = (lcs.length / shorter) * 100;
  const pass = pct === 100;
  return {
    name: "Identical texts → 100% similarity",
    detail: `LCS similarity = ${pct.toFixed(1)}% (expected 100%)`,
    pass,
  };
}

function testDifferent() {
  const a = "Dijkstra finds the shortest path in a weighted graph using a priority queue.";
  const b = "Quicksort partitions an array around a pivot and recursively sorts each half.";
  const lcs = lcsDP(splitWords(a), splitWords(b));
  const shorter = Math.min(splitWords(a).length, splitWords(b).length);
  const pct = (lcs.length / shorter) * 100;
  const pass = pct < 15;
  return {
    name: "Different texts → ~0% similarity",
    detail: `LCS similarity = ${pct.toFixed(1)}% (expected < 15%)`,
    pass,
  };
}

function testRkVsNaive() {
  const text = "the quick brown fox jumps over the lazy dog and the quick fox runs";
  const pat = "the quick fox";
  const rk = rabinKarp(text, pat);
  const nv = naiveSearch(text, pat);
  const same =
    rk.positions.length === nv.positions.length &&
    rk.positions.every((p, i) => p === nv.positions[i]);
  return {
    name: "Rabin-Karp results == Naive search results",
    detail: `RK found ${rk.positions.length} at [${rk.positions}], Naive found ${nv.positions.length} at [${nv.positions}]`,
    pass: same,
  };
}

function testRecVsDp() {
  const a = splitWords("the quick brown fox jumps over the lazy dog");
  const b = splitWords("the quick fox runs over the lazy river bank");
  const rec = lcsRecursive(a, b);
  const dp = lcsDP(a, b);
  const pass = rec.length === dp.length;
  return {
    name: "Recursive LCS length == DP LCS length",
    detail: `Recursive = ${rec.length}, DP = ${dp.length}`,
    pass,
  };
}

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { Gauge, BookOpen, BarChart3, Table2, GitCompareArrows } from "lucide-react";
import { rabinKarp } from "../algorithms/rabinKarp";
import { naiveSearch } from "../algorithms/naiveSearch";
import { lcsDP } from "../algorithms/lcsDP";
import { lcsRecursive } from "../algorithms/lcsRecursive";
import { splitSentences, splitWords } from "../algorithms/textUtils";

// Step 4 — Results: animated gauge, verdict, side-by-side highlighted
// texts, comparison table, stress-test chart and theory cards.
export default function ResultsStep({ original, suspected }) {
  const aw = useMemo(() => splitWords(original), [original]);
  const bw = useMemo(() => splitWords(suspected), [suspected]);

  // LCS DP result for similarity + highlighted side-by-side.
  const lcsRes = useMemo(() => lcsDP(aw, bw, { maxDim: 15 }), [aw, bw]);
  const shorter = Math.min(aw.length, bw.length);
  const simPct = shorter === 0 ? 0 : (lcsRes.length / shorter) * 100;

  // Rabin-Karp for exact-copy % and highlight.
  const rkSentences = useMemo(() => {
    const sentences = splitSentences(original);
    return sentences.map((s) => ({ sentence: s, ...rabinKarp(suspected, s) }));
  }, [original, suspected]);
  const rkMatched = rkSentences.filter((r) => r.positions.length > 0).length;
  const exactCopyPct =
    rkSentences.length === 0 ? 0 : (rkMatched / rkSentences.length) * 100;

  // Blended plagiarism score: 60% LCS similarity + 40% exact copy.
  const score = simPct * 0.6 + exactCopyPct * 0.4;
  const verdict = getVerdict(score);

  // Comparison table data (Naive vs RK, Recursive LCS vs DP LCS).
  const comparisons = useMemo(
    () => buildComparisons(original, suspected, aw, bw),
    [original, suspected, aw, bw]
  );

  // Stress-test chart data.
  const [worstCase, setWorstCase] = useState(false);
  const chartData = useMemo(() => stressTestData(worstCase), [worstCase]);

  return (
    <div className="space-y-6">
      {/* Gauge + verdict */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <GaugeChart value={score} />
          <div
            className={`mt-2 rounded-full px-4 py-1.5 text-sm font-semibold ${verdict.cls}`}
          >
            {verdict.label}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <Gauge className="h-4 w-4" /> Score Breakdown
          </h4>
          <div className="space-y-3 text-sm">
            <Row label="LCS Similarity" value={`${simPct.toFixed(1)}%`} />
            <Row label="Exact Copy (Rabin-Karp)" value={`${exactCopyPct.toFixed(1)}%`} />
            <Row label="Weighted Plagiarism Score" value={`${score.toFixed(1)}%`} bold />
            <div className="border-t border-slate-100 pt-3 text-xs text-slate-400 dark:border-slate-700">
              Score = 60% × LCS similarity + 40% × exact copy.
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-side highlighted texts */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <GitCompareArrows className="h-4 w-4" /> Side-by-side Comparison
        </h4>
        <div className="grid gap-4 md:grid-cols-2">
          <SideText title="Original" text={original} rk={rkSentences} mode="original" />
          <SideText title="Suspected" text={suspected} rk={rkSentences} lcsWords={lcsRes.lcs} mode="suspected" />
        </div>
        <Legend3 />
      </div>

      {/* Comparison table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Table2 className="h-4 w-4" /> Algorithm Comparison
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-400">
                <th className="pb-2 pr-4 font-medium">Algorithm</th>
                <th className="pb-2 pr-4 font-medium">Result</th>
                <th className="pb-2 pr-4 font-medium">Time (ms)</th>
                <th className="pb-2 pr-4 font-medium">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {comparisons.map((c) => (
                <tr key={c.name}>
                  <td className="py-2 pr-4 font-medium text-slate-700 dark:text-slate-200">
                    {c.name}
                  </td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{c.result}</td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">
                    {c.timeMs.toFixed(4)}
                  </td>
                  <td className="py-2 pr-4 text-slate-600 dark:text-slate-300">{c.ops}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stress-test chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-3 flex items-center justify-between">
          <h4 className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            <BarChart3 className="h-4 w-4" /> Stress Test: Runtime vs Input Size
          </h4>
          <label className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              checked={worstCase}
              onChange={(e) => setWorstCase(e.target.checked)}
              className="accent-rose-500"
            />
            Rabin-Karp worst case (all "A")
          </label>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
              <XAxis dataKey="size" tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  fontSize: 12,
                  borderRadius: 8,
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="naive"
                name="Naive"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="rabinKarp"
                name="Rabin-Karp"
                stroke="#10b981"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Theory cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <TheoryCard
          title="Naive Search"
          best="O(n)"
          worst="O(n·m)"
          pseudo={`for i = 0 to n-m:
  j = 0
  while j < m and text[i+j] == pat[j]:
    j++
  if j == m: found at i`}
        />
        <TheoryCard
          title="Rabin-Karp"
          best="O(n+m) avg"
          worst="O(n·m)"
          pseudo={`h = hash(pat)
for i = 0 to n-m:
  if windowHash == h:
    verify text[i..i+m-1] == pat
  rollHash(i)`}
        />
        <TheoryCard
          title="LCS — Recursive"
          best="—"
          worst="O(2^(m+n))"
          pseudo={`LCS(i,j):
  if i==0 or j==0: return 0
  if a[i]==b[j]:
    return 1 + LCS(i-1,j-1)
  return max(LCS(i-1,j), LCS(i,j-1))`}
        />
        <TheoryCard
          title="LCS — Dynamic Programming"
          best="O(m·n)"
          worst="O(m·n) time & space"
          pseudo={`for i=1..m, j=1..n:
  if a[i]==b[j]:
    dp[i][j] = 1 + dp[i-1][j-1]
  else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
backtrack from dp[m][n]`}
        />
      </div>
    </div>
  );
}

function getVerdict(score) {
  if (score > 50) return { label: "Likely Plagiarised", cls: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300" };
  if (score >= 20) return { label: "Suspicious", cls: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300" };
  return { label: "Original", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300" };
}

function Row({ label, value, bold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500 dark:text-slate-400">{label}</span>
      <span className={bold ? "font-bold text-slate-800 dark:text-slate-100" : "text-slate-700 dark:text-slate-200"}>
        {value}
      </span>
    </div>
  );
}

// Animated circular gauge (SVG) that fills from 0 to `value`.
function GaugeChart({ value }) {
  const v = Math.max(0, Math.min(100, value));
  const r = 70;
  const circ = 2 * Math.PI * r;
  // Animate using CSS transition on stroke-dashoffset.
  const offset = circ - (v / 100) * circ;
  const color = v > 50 ? "#f43f5e" : v >= 20 ? "#f59e0b" : "#10b981";
  return (
    <div className="relative h-44 w-44">
      <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90">
        <circle cx="90" cy="90" r={r} fill="none" stroke="#e2e8f0" strokeWidth="14" className="dark:stroke-slate-700" />
        <circle
          cx="90"
          cy="90"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-slate-800 dark:text-slate-100">{v.toFixed(0)}%</span>
        <span className="text-xs text-slate-400">plagiarism</span>
      </div>
    </div>
  );
}

// Side-by-side text with copied sentences (red) and LCS words (green).
function SideText({ title, text, rk, lcsWords, mode }) {
  let content;
  if (mode === "original") {
    // Highlight sentences that were found in suspected, in red.
    const foundSentences = new Set(
      rk.filter((r) => r.positions.length > 0).map((r) => r.sentence)
    );
    const sentences = splitSentences(text);
    content = sentences.map((s, i) =>
      foundSentences.has(s) ? (
        <mark key={i} className="rounded bg-rose-200 px-0.5 text-rose-800 dark:bg-rose-500/40 dark:text-rose-100">
          {s}{" "}
        </mark>
      ) : (
        <span key={i}>{s}{" "}</span>
      )
    );
  } else {
    // Highlight LCS words in green within the suspected text.
    const lcsSet = new Set(lcsWords || []);
    const tokens = text.split(/(\s+)/);
    content = tokens.map((tok, i) => {
      const clean = tok.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean && lcsSet.has(clean)) {
        return (
          <mark key={i} className="rounded bg-emerald-200 px-0.5 text-emerald-800 dark:bg-emerald-500/40 dark:text-emerald-100">
            {tok}
          </mark>
        );
      }
      return <span key={i}>{tok}</span>;
    });
  }
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/40">
      <div className="mb-1 text-xs font-semibold uppercase text-slate-400">{title}</div>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{content}</p>
    </div>
  );
}

function Legend3() {
  return (
    <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400">
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded bg-rose-200 dark:bg-rose-500/50" /> Copied sentence
      </span>
      <span className="inline-flex items-center gap-1.5">
        <span className="h-3 w-3 rounded bg-emerald-200 dark:bg-emerald-500/50" /> LCS word
      </span>
    </div>
  );
}

// Build the 4-row algorithm comparison table.
function buildComparisons(original, suspected, aw, bw) {
  const sentences = splitSentences(original);
  // Use the first sentence for the single-pattern search comparison.
  const pattern = sentences[0] || original.slice(0, 20);

  const naive = naiveSearch(suspected, pattern);
  const rk = rabinKarp(suspected, pattern);

  // LCS: cap recursive at 20 words.
  const recA = aw.slice(0, 20);
  const recB = bw.slice(0, 20);
  const rec = lcsRecursive(recA, recB);
  const dp = lcsDP(aw, bw);

  return [
    { name: "Naive Search", result: `${naive.positions.length} matches`, timeMs: naive.timeMs, ops: naive.comparisons },
    { name: "Rabin-Karp", result: `${rk.positions.length} matches`, timeMs: rk.timeMs, ops: rk.comparisons },
    {
      name: "LCS Recursive (≤20 words)",
      result: `len = ${rec.length}`,
      timeMs: rec.timeMs,
      ops: rec.calls,
    },
    { name: "LCS DP", result: `len = ${dp.length}`, timeMs: dp.timeMs, ops: dp.comparisons },
  ];
}

// Generate stress-test timing data for Naive vs Rabin-Karp.
function stressTestData(worstCase) {
  const sizes = [100, 500, 1000, 2000, 4000, 8000];
  return sizes.map((n) => {
    let text, pattern;
    if (worstCase) {
      // All "A" — every window hash collides -> O(n*m) for RK.
      text = "A".repeat(n);
      pattern = "A".repeat(Math.min(20, n));
    } else {
      // Normal English-ish text.
      text = randomText(n);
      pattern = text.slice(0, Math.min(20, n));
    }
    const tN = naiveSearch(text, pattern).timeMs;
    const tR = rabinKarp(text, pattern).timeMs;
    return { size: n, naive: +tN.toFixed(4), rabinKarp: +tR.toFixed(4) };
  });
}

function randomText(n) {
  const words = "the quick brown fox jumps over the lazy dog and runs fast";
  let out = "";
  while (out.length < n) out += words + " ";
  return out.slice(0, n);
}

function TheoryCard({ title, best, worst, pseudo }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-emerald-500" />
        <h5 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h5>
      </div>
      <div className="mb-2 flex gap-3 text-xs">
        <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
          Best: {best}
        </span>
        <span className="rounded bg-rose-50 px-2 py-0.5 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
          Worst: {worst}
        </span>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs leading-relaxed text-slate-100">
{pseudo}
      </pre>
    </div>
  );
}

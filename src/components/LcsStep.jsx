import { useEffect, useMemo, useState } from "react";
import { Play, Pause, SkipForward, RotateCcw, Eye, Table2 } from "lucide-react";
import { lcsDP } from "../algorithms/lcsDP";

// Step 3 — LCS (DP) on words: similarity %, LCS words, DP table with
// backtrack path highlighted, and a cell-by-cell fill visualiser.
export default function LcsStep({ original, suspected }) {
  const [visualize, setVisualize] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [fillIdx, setFillIdx] = useState(0);

  const res = useMemo(
    () => lcsDP(words(original), words(suspected), { recordSteps: true, maxDim: 15 }),
    [original, suspected]
  );

  const steps = res.steps;
  const curStep = steps[fillIdx];

  useEffect(() => {
    if (!playing || !visualize) return;
    const id = setInterval(() => {
      setFillIdx((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 120);
    return () => clearInterval(id);
  }, [playing, visualize, steps.length]);

  const shorter = Math.min(res.fullM, res.fullN);
  const simPct = shorter === 0 ? 0 : (res.length / shorter) * 100;

  // When visualising, only fill cells up to fillIdx.
  const filledSet = useMemo(() => {
    const s = new Set();
    for (let i = 0; i <= fillIdx && i < steps.length; i++) {
      s.add(`${steps[i].i},${steps[i].j}`);
    }
    return s;
  }, [fillIdx, steps]);

  const backtrackSet = useMemo(
    () => new Set(res.backtrackPath.map(([r, c]) => `${r},${c}`)),
    [res.backtrackPath]
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat label="LCS Length" value={res.length} color="emerald" />
        <Stat label="Similarity %" value={`${simPct.toFixed(1)}%`} color="rose" />
        <Stat label="Shorter Text (words)" value={shorter} color="slate" />
      </div>

      {/* LCS words */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Longest Common Subsequence (words)
        </h4>
        {res.lcs.length === 0 ? (
          <p className="text-sm text-slate-400">No common subsequence.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {res.lcs.map((w, i) => (
              <span
                key={i}
                className="rounded-lg bg-emerald-100 px-2 py-1 text-sm font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
              >
                {w}
              </span>
            ))}
          </div>
        )}
        {res.fullM > 15 || res.fullN > 15 ? (
          <p className="mt-3 text-xs text-slate-400">
            Showing the first 15×15 block of the DP table for clarity; LCS length is
            computed on the full {res.fullM}×{res.fullN} table.
          </p>
        ) : null}
      </div>

      {/* Visualiser toggle */}
      <button
        onClick={() => {
          setVisualize((v) => !v);
          setFillIdx(0);
          setPlaying(false);
        }}
        className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
      >
        <Eye className="h-4 w-4" /> {visualize ? "Hide" : "Show"} Table Fill Visualiser
      </button>

      {/* DP table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <Table2 className="h-4 w-4" /> DP Table
          {visualize && curStep && (
            <span className="ml-2 text-xs font-normal text-slate-400">
              filling cell ({curStep.i}, {curStep.j}) = {curStep.value}
              {curStep.match ? " · match" : ""}
            </span>
          )}
        </h4>
        <DpTable
          dp={res.dp}
          a={res.displayA}
          b={res.displayB}
          filledSet={visualize ? filledSet : null}
          backtrackSet={backtrackSet}
        />
      </div>

      {visualize && (
        <div className="flex items-center gap-2">
          <IconBtn onClick={() => setPlaying((p) => !p)} active={playing}>
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </IconBtn>
          <IconBtn onClick={() => setFillIdx((i) => Math.min(i + 1, steps.length - 1))}>
            <SkipForward className="h-4 w-4" />
          </IconBtn>
          <IconBtn
            onClick={() => {
              setFillIdx(0);
              setPlaying(false);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </IconBtn>
          <span className="ml-2 text-xs text-slate-400">
            Cell {fillIdx + 1} / {steps.length}
          </span>
        </div>
      )}
    </div>
  );
}

function words(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function Stat({ label, value, color }) {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    slate: "text-slate-700 dark:text-slate-200",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${colors[color]}`}>{value}</div>
    </div>
  );
}

function DpTable({ dp, a, b, filledSet, backtrackSet }) {
  // dp has dimensions (rows+1) x (cols+1); row 0 / col 0 are the zeros.
  const rows = dp.length;
  const cols = dp[0]?.length || 0;
  return (
    <div className="overflow-x-auto">
      <table className="border-collapse text-center text-xs">
        <thead>
          <tr>
            <th className="h-8 w-10" />
            <th className="h-8 w-10 text-slate-400">∅</th>
            {b.map((w, j) => (
              <th
                key={j}
                className="max-w-[60px] truncate px-1 text-[10px] font-medium text-slate-500 dark:text-slate-400"
                title={w}
              >
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dp.map((row, i) => (
            <tr key={i}>
              <th
                className="max-w-[60px] truncate px-1 text-left text-[10px] font-medium text-slate-500 dark:text-slate-400"
                title={a[i - 1]}
              >
                {i === 0 ? "∅" : a[i - 1]}
              </th>
              {row.map((val, j) => {
                const key = `${i},${j}`;
                const isFilled = filledSet ? filledSet.has(key) : true;
                const isPath = backtrackSet.has(key);
                const cellStyle = isPath
                  ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-500/40 dark:text-emerald-100"
                  : isFilled
                  ? "bg-slate-50 text-slate-700 dark:bg-slate-900/40 dark:text-slate-200"
                  : "bg-white text-slate-300 dark:bg-slate-800 dark:text-slate-600";
                return (
                  <td
                    key={j}
                    className={`h-8 w-10 border border-slate-200 font-mono transition-colors duration-150 dark:border-slate-600 ${cellStyle}`}
                  >
                    {isFilled ? val : ""}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function IconBtn({ children, onClick, active }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg transition ${
        active
          ? "bg-emerald-500 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
      }`}
    >
      {children}
    </button>
  );
}

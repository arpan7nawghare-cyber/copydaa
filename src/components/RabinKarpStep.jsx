import { useEffect, useMemo, useState } from "react";
import { Play, Pause, SkipForward, RotateCcw, Eye, Zap } from "lucide-react";
import { rabinKarpSentences } from "../algorithms/rabinKarp";
import { splitSentences } from "../algorithms/textUtils";

// Step 2 — Rabin-Karp: per-sentence search, exact-copy %, highlight,
// optional visualiser showing the sliding window + rolling hash.
export default function RabinKarpStep({ original, suspected }) {
  const [visualize, setVisualize] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [selectedSentence, setSelectedSentence] = useState(0);

  // Run Rabin-Karp for every original sentence (record steps for viz).
  const rk = useMemo(
    () => rabinKarpSentences(original, suspected, { recordSteps: true }),
    [original, suspected]
  );

  // Steps for the currently selected sentence's visualiser.
  const steps = rk.results[selectedSentence]?.steps || [];
  const cur = steps[stepIdx];

  // Simple play/pause timer for the visualiser.
  useEffect(() => {
    if (!playing || !visualize) return;
    const id = setInterval(() => {
      setStepIdx((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 500);
    return () => clearInterval(id);
  }, [playing, visualize, steps.length]);

  const pickSentence = (idx) => {
    setSelectedSentence(idx);
    setStepIdx(0);
    setPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Exact copy summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Sentences Matched"
          value={`${rk.matched} / ${rk.total}`}
          color="emerald"
        />
        <Stat label="Exact Copy %" value={`${rk.exactCopyPct.toFixed(1)}%`} color="rose" />
        <Stat
          label="Spurious Hits"
          value={rk.results.reduce((s, r) => s + r.spuriousHits, 0)}
          color="amber"
        />
      </div>

      {/* Highlighted suspected text */}
      <HighlightedText suspected={suspected} rk={rk} />

      {/* Per-sentence results table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
        <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Per-sentence results
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs uppercase text-slate-400">
                <th className="pb-2 pr-4 font-medium">#</th>
                <th className="pb-2 pr-4 font-medium">Sentence</th>
                <th className="pb-2 pr-4 font-medium">Found</th>
                <th className="pb-2 pr-4 font-medium">Positions</th>
                <th className="pb-2 pr-4 font-medium">Spurious</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {rk.results.map((r, i) => (
                <tr
                  key={i}
                  className={`cursor-pointer transition hover:bg-slate-50 dark:hover:bg-slate-700/40 ${
                    selectedSentence === i ? "bg-emerald-50/60 dark:bg-emerald-500/10" : ""
                  }`}
                  onClick={() => pickSentence(i)}
                >
                  <td className="py-2 pr-4 text-slate-400">{i + 1}</td>
                  <td className="max-w-md truncate py-2 pr-4 text-slate-700 dark:text-slate-200">
                    {r.sentence}
                  </td>
                  <td className="py-2 pr-4">
                    {r.positions.length > 0 ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                        Yes
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500 dark:bg-slate-600 dark:text-slate-300">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-4 text-xs text-slate-500">
                    {r.positions.join(", ") || "—"}
                  </td>
                  <td className="py-2 pr-4 text-xs text-amber-600 dark:text-amber-400">
                    {r.spuriousHits}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visualiser toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setVisualize((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
        >
          <Eye className="h-4 w-4" /> {visualize ? "Hide" : "Show"} Visualiser
        </button>
      </div>

      {visualize && (
        <Visualiser
          steps={steps}
          cur={cur}
          stepIdx={stepIdx}
          playing={playing}
          onPlay={() => setPlaying((p) => !p)}
          onNext={() => setStepIdx((i) => Math.min(i + 1, steps.length - 1))}
          onReset={() => {
            setStepIdx(0);
            setPlaying(false);
          }}
        />
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  const colors = {
    emerald: "text-emerald-600 dark:text-emerald-400",
    rose: "text-rose-600 dark:text-rose-400",
    amber: "text-amber-600 dark:text-amber-400",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
      <div className={`mt-1 text-2xl font-bold ${colors[color]}`}>{value}</div>
    </div>
  );
}

// Renders the suspected text with every matched sentence highlighted red.
function HighlightedText({ suspected, rk }) {
  // Collect all [start, end) ranges that matched.
  const ranges = [];
  rk.results.forEach((r) => {
    r.positions.forEach((p) => ranges.push([p, p + r.sentence.length]));
  });
  if (ranges.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
        No sentences were found verbatim — the suspected text is not an exact copy.
      </div>
    );
  }
  ranges.sort((a, b) => a[0] - b[0]);
  const parts = [];
  let cursor = 0;
  ranges.forEach(([s, e], i) => {
    if (s > cursor) parts.push({ text: suspected.slice(cursor, s), match: false });
    parts.push({ text: suspected.slice(s, e), match: true });
    cursor = e;
  });
  if (cursor < suspected.length) parts.push({ text: suspected.slice(cursor), match: false });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800">
      <h4 className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
        Suspected text (matched sentences in red)
      </h4>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
        {parts.map((p, i) =>
          p.match ? (
            <mark
              key={i}
              className="rounded bg-rose-200 px-0.5 text-rose-800 dark:bg-rose-500/40 dark:text-rose-100"
            >
              {p.text}
            </mark>
          ) : (
            <span key={i}>{p.text}</span>
          )
        )}
      </p>
    </div>
  );
}

function Visualiser({ steps, cur, stepIdx, playing, onPlay, onNext, onReset }) {
  return (
    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 dark:border-emerald-500/30 dark:bg-emerald-500/5">
      <h4 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
        <Zap className="h-4 w-4" /> Rolling Hash Visualiser
      </h4>
      {!cur ? (
        <p className="text-sm text-slate-500">No steps for this sentence.</p>
      ) : (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3 text-sm">
            <HashPill label="Window Hash" value={cur.windowHash} />
            <HashPill label="Pattern Hash" value={cur.patternHash} />
            <HashPill
              label="Hash Match"
              value={cur.hashMatch ? "yes" : "no"}
              ok={cur.hashMatch}
            />
            {cur.spurious && (
              <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-500/30 dark:text-amber-200">
                Spurious hit!
              </span>
            )}
            {cur.match && (
              <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200">
                Verified match!
              </span>
            )}
          </div>
          <div className="overflow-x-auto rounded-xl bg-white p-3 font-mono text-sm dark:bg-slate-900">
            <WindowRow text={cur.window} index={cur.i} />
          </div>
        </div>
      )}
      <div className="mt-4 flex items-center gap-2">
        <IconBtn onClick={onPlay} active={playing}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </IconBtn>
        <IconBtn onClick={onNext}>
          <SkipForward className="h-4 w-4" />
        </IconBtn>
        <IconBtn onClick={onReset}>
          <RotateCcw className="h-4 w-4" />
        </IconBtn>
        <span className="ml-2 text-xs text-slate-400">
          Step {stepIdx + 1} / {steps.length}
        </span>
      </div>
    </div>
  );
}

function HashPill({ label, value, ok }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        ok === true
          ? "bg-emerald-200 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200"
          : ok === false
          ? "bg-slate-200 text-slate-600 dark:bg-slate-600 dark:text-slate-200"
          : "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200"
      }`}
    >
      {label}: {value}
    </span>
  );
}

function WindowRow({ text, index }) {
  return (
    <div className="whitespace-pre">
      <span className="text-slate-400">[{index}]</span> ▌{text}▐
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

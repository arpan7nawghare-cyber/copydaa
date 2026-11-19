import { useMemo } from "react";
import { FileText, AlertCircle, Sparkles, RotateCcw } from "lucide-react";
import { countWords, countChars } from "../algorithms/textUtils";
import { SAMPLES } from "../data/samples";

// Step 1 — Input: two textareas, live counts, validation and samples.
export default function InputStep({ original, suspected, onChange }) {
  const oWords = useMemo(() => countWords(original), [original]);
  const sWords = useMemo(() => countWords(suspected), [suspected]);

  // Basic validation: both texts must be non-empty with at least 3 words.
  const errors = [];
  if (oWords < 3) errors.push("Original text needs at least 3 words.");
  if (sWords < 3) errors.push("Suspected text needs at least 3 words.");

  const loadSample = (key) => {
    const s = SAMPLES[key];
    onChange({ original: s.original, suspected: s.suspected });
  };
  const clearAll = () => onChange({ original: "", suspected: "" });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Sparkles className="h-5 w-5 text-emerald-500" />
        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
          Load a sample pair:
        </span>
        {Object.entries(SAMPLES).map(([key, s]) => (
          <button
            key={key}
            onClick={() => loadSample(key)}
            className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:ring-emerald-500/30"
          >
            {s.label}
          </button>
        ))}
        <button
          onClick={clearAll}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <RotateCcw className="h-4 w-4" /> Clear
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Textarea
          label="Original Text"
          icon={<FileText className="h-4 w-4" />}
          value={original}
          onChange={(v) => onChange({ original: v, suspected })}
          words={oWords}
          chars={countChars(original)}
          accent="emerald"
        />
        <Textarea
          label="Suspected Text"
          icon={<FileText className="h-4 w-4" />}
          value={suspected}
          onChange={(v) => onChange({ original, suspected: v })}
          words={sWords}
          chars={countChars(suspected)}
          accent="rose"
        />
      </div>

      {errors.length > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-500/30 dark:bg-amber-500/10">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
          <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Textarea({ label, icon, value, onChange, words, chars, accent }) {
  const ring =
    accent === "emerald"
      ? "focus:ring-emerald-400/40 focus:border-emerald-400"
      : "focus:ring-rose-400/40 focus:border-rose-400";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          {icon} {label}
        </span>
        <span className="text-xs text-slate-400">
          {words} words · {chars} chars
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={9}
        className={`w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none transition focus:ring-2 dark:border-slate-600 dark:bg-slate-900/60 dark:text-slate-100 ${ring}`}
        placeholder={`Paste the ${label.toLowerCase()} here...`}
      />
    </div>
  );
}

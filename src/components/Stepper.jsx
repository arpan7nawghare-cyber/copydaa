import { Check } from "lucide-react";

// 4-step stepper shown above the active step content.
const STEPS = ["Input", "Rabin-Karp", "LCS (DP)", "Results"];

export default function Stepper({ step, onStep }) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex items-center gap-1 sm:gap-2">
        {STEPS.map((label, i) => {
          const active = i === step;
          const done = i < step;
          return (
            <div key={label} className="flex items-center">
              <button
                onClick={() => onStep(i)}
                className="flex items-center gap-2"
                aria-label={`Go to step ${label}`}
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                    active
                      ? "bg-emerald-500 text-white ring-4 ring-emerald-500/20"
                      : done
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
                      : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-400"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`hidden text-sm font-medium sm:inline ${
                    active
                      ? "text-slate-800 dark:text-slate-100"
                      : "text-slate-400 dark:text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <span
                  className={`mx-2 h-px w-6 sm:w-10 ${
                    done ? "bg-emerald-400" : "bg-slate-200 dark:bg-slate-700"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

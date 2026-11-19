import { ArrowDown, ShieldCheck, Zap, GitCompare, Eye } from "lucide-react";

// Full landing-page hero with badge, headline, feature pills, and CTA.
export default function Hero({ onTryDemo }) {
  const features = [
    { icon: Zap, label: "Rabin-Karp rolling hash" },
    { icon: GitCompare, label: "LCS — recursive & DP" },
    { icon: Eye, label: "Step-by-step visualizer" },
    { icon: ShieldCheck, label: "Verdict + score gauge" },
  ];

  return (
    <header id="top" className="relative overflow-hidden pt-8 pb-14">
      {/* Gradient backdrop */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-slate-50 to-sky-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(42rem_22rem_at_50%_-12em,rgba(16,185,129,0.14),transparent)]" />
      <div className="absolute right-0 top-20 -z-10 h-72 w-72 rounded-full bg-sky-200/30 blur-3xl dark:bg-sky-500/10" />
      <div className="absolute left-0 top-40 -z-10 h-72 w-72 rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-500/10" />

      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 backdrop-blur dark:bg-slate-800/70 dark:text-emerald-300 dark:ring-emerald-500/30">
          <ShieldCheck className="h-3.5 w-3.5" /> DAA Mini Project · Algorithm Visualizer
        </div>

        <h1 className="max-w-3xl text-balance text-4xl font-bold tracking-tight text-slate-800 dark:text-slate-50 sm:text-5xl lg:text-6xl">
          Detect plagiarism with{" "}
          <span className="bg-gradient-to-r from-emerald-500 to-sky-500 bg-clip-text text-transparent">
            classic algorithms
          </span>
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
          CopyCatch compares two texts using Rabin-Karp and Longest Common
          Subsequence — visualised step by step so every algorithm is easy to
          understand and explain.
        </p>

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">
          <button
            onClick={onTryDemo}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:bg-emerald-600 active:scale-[0.98]"
          >
            Start Checking <ArrowDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            How It Works
          </button>
        </div>

        {/* Feature pills */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {features.map((f) => (
            <div
              key={f.label}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-3.5 py-2 text-xs font-medium text-slate-600 backdrop-blur transition hover:border-emerald-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-emerald-500/50"
            >
              <f.icon className="h-4 w-4 text-emerald-500" />
              {f.label}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}

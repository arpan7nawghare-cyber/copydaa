import { Zap, GitCompare, Eye, BarChart3, FlaskConical, Code2 } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Rabin-Karp Search",
    desc: "Each original sentence becomes a pattern searched via rolling hash. Spurious hits are counted and matches are verified character-by-character.",
    color: "emerald",
  },
  {
    icon: GitCompare,
    title: "LCS — Recursive & DP",
    desc: "Longest Common Subsequence computed both with plain recursion (O(2^(m+n))) and dynamic programming (O(m·n)), side by side for comparison.",
    color: "sky",
  },
  {
    icon: Eye,
    title: "Step Visualizers",
    desc: "Watch the Rabin-Karp sliding window move with live hash values, or see the DP table fill cell by cell with the backtrack path highlighted.",
    color: "rose",
  },
  {
    icon: BarChart3,
    title: "Stress-Test Chart",
    desc: "A line chart compares runtime vs input size for Naive and Rabin-Karp, with a worst-case toggle that forces all-hash collisions.",
    color: "amber",
  },
  {
    icon: FlaskConical,
    title: "Built-In Test Suite",
    desc: "One click runs four assertions: identical texts give 100%, different texts give ~0%, RK equals Naive results, and recursive LCS equals DP LCS.",
    color: "emerald",
  },
  {
    icon: Code2,
    title: "Viva-Ready Code",
    desc: "Every algorithm is a pure, well-commented function in plain JavaScript — simple enough to explain line-by-line in a viva examination.",
    color: "sky",
  },
];

const COLOR_MAP = {
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-200 dark:ring-emerald-500/30" },
  sky: { bg: "bg-sky-50 dark:bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", ring: "ring-sky-200 dark:ring-sky-500/30" },
  rose: { bg: "bg-rose-50 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", ring: "ring-rose-200 dark:ring-rose-500/30" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", ring: "ring-amber-200 dark:ring-amber-500/30" },
};

export default function Features() {
  return (
    <section id="features" className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-50 sm:text-3xl">
          Everything in one tool
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 dark:text-slate-400">
          Four classic algorithms, full visualizations, test cases, and complexity
          cards — all running in your browser.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => {
          const c = COLOR_MAP[f.color];
          return (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              <div className={`mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl ${c.bg} ${c.text} ring-1 ${c.ring}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                {f.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

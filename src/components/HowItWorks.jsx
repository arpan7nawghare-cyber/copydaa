import { ClipboardList, Search, Table2, Gauge } from "lucide-react";

const STEPS_INFO = [
  {
    icon: ClipboardList,
    step: "01",
    title: "Paste Your Texts",
    desc: "Enter an original and a suspected text, or load one of three preset samples. Live word and character counts validate as you type.",
  },
  {
    icon: Search,
    step: "02",
    title: "Rabin-Karp Match",
    desc: "Each original sentence is searched in the suspected text using a rolling hash. See exact-copy %, positions, spurious hits, and highlighted matches.",
  },
  {
    icon: Table2,
    step: "03",
    title: "LCS Analysis",
    desc: "The DP table is built word by word, with the backtrack path highlighted green. Similarity % is the LCS length over the shorter text.",
  },
  {
    icon: Gauge,
    step: "04",
    title: "Verdict & Report",
    desc: "An animated gauge gives the verdict — Original, Suspicious, or Likely Plagiarised — with a comparison table, stress chart, and theory cards.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="border-y border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/30">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-50 sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-slate-500 dark:text-slate-400">
            Four simple steps from raw text to a plagiarism verdict.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS_INFO.map((s, i) => (
            <div key={s.step} className="relative">
              {i < STEPS_INFO.length - 1 && (
                <div className="absolute left-[calc(100%-1.25rem)] top-8 hidden h-px w-5 bg-gradient-to-r from-emerald-300 to-transparent lg:block" />
              )}
              <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
                <div className="mb-3 flex items-center justify-between">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/30">
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-slate-200 dark:text-slate-700">
                    {s.step}
                  </span>
                </div>
                <h3 className="mb-1.5 text-sm font-semibold text-slate-800 dark:text-slate-100">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Info, BookOpen, Cpu, Layers, Code2, GitBranch, GraduationCap, Zap } from "lucide-react";

const ALGOS = [
  { icon: BookOpen, name: "Naive Search", complexity: "O(n) best · O(n·m) worst" },
  { icon: Cpu, name: "Rabin-Karp", complexity: "O(n+m) avg · O(n·m) worst" },
  { icon: Layers, name: "LCS Recursive", complexity: "O(2^(m+n))" },
  { icon: BookOpen, name: "LCS Dynamic Programming", complexity: "O(m·n) time & space" },
];

const STACK = [
  { icon: Code2, label: "React + Vite" },
  { icon: GitBranch, label: "Tailwind CSS" },
  { icon: Zap, label: "Recharts" },
  { icon: Cpu, label: "Lucide Icons" },
];

export default function About() {
  return (
    <section id="about" className="border-t border-slate-200 bg-slate-50/50 dark:border-slate-700 dark:bg-slate-800/30">
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <Info className="h-5 w-5" />
            <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-50 sm:text-3xl">
              About this project
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            CopyCatch is a Design and Analysis of Algorithms (DAA) mini project that
            demonstrates four classic string-matching and sequence-alignment
            algorithms. Every algorithm runs entirely in your browser with full
            step-by-step visualization — no server, no data sent anywhere.
          </p>
        </div>

        {/* Algorithm summary cards */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ALGOS.map((a) => (
            <div
              key={a.name}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
            >
              <a.icon className="mb-2 h-5 w-5 text-emerald-500" />
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">{a.name}</h4>
              <p className="mt-1 text-xs text-slate-400">{a.complexity}</p>
            </div>
          ))}
        </div>

        {/* Project details + Tech stack */}
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-3 inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <GraduationCap className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-semibold">Project Details</h3>
            </div>
            <dl className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-400">Course</dt>
                <dd className="text-slate-700 dark:text-slate-200">Design & Analysis of Algorithms</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Type</dt>
                <dd className="text-slate-700 dark:text-slate-200">Mini Project</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Scope</dt>
                <dd className="text-slate-700 dark:text-slate-200">Frontend-only · Browser-based</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-400">Algorithms</dt>
                <dd className="text-slate-700 dark:text-slate-200">4 (Naive, RK, LCS-Rec, LCS-DP)</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-800">
            <div className="mb-3 inline-flex items-center gap-2 text-slate-700 dark:text-slate-200">
              <Code2 className="h-5 w-5 text-emerald-500" />
              <h3 className="text-sm font-semibold">Technology Stack</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {STACK.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-sm dark:bg-slate-900/40"
                >
                  <s.icon className="h-4 w-4 text-emerald-500" />
                  <span className="text-slate-700 dark:text-slate-200">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

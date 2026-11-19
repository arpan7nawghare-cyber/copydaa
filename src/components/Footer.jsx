import { Copy, Heart } from "lucide-react";

export default function Footer({ onNavigate }) {
  const sections = [
    {
      title: "Tool",
      links: [
        { label: "Input", target: "tool" },
        { label: "Rabin-Karp", target: "tool" },
        { label: "LCS Analysis", target: "tool" },
        { label: "Results", target: "tool" },
      ],
    },
    {
      title: "Learn",
      links: [
        { label: "Features", target: "features" },
        { label: "How It Works", target: "how" },
        { label: "About", target: "about" },
        { label: "Test Cases", target: "tests" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
                <Copy className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-slate-800 dark:text-slate-50">
                CopyCatch
              </span>
            </div>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              A plagiarism checker powered by Rabin-Karp and LCS algorithms.
              Built as a DAA mini project with full step-by-step visualizations.
            </p>
          </div>

          {/* Link sections */}
          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {s.title}
              </h4>
              <ul className="space-y-2">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <button
                      onClick={() => onNavigate(l.target)}
                      className="text-sm text-slate-500 transition hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400"
                    >
                      {l.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-slate-100 pt-6 dark:border-slate-700/60 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} CopyCatch · A DAA mini project
          </p>
          <p className="inline-flex items-center gap-1 text-xs text-slate-400">
            Built with React, Vite & Tailwind <Heart className="h-3 w-3 text-rose-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}

import { useRef, useState, useCallback } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useTheme } from "./hooks/useTheme";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Stepper from "./components/Stepper";
import InputStep from "./components/InputStep";
import RabinKarpStep from "./components/RabinKarpStep";
import LcsStep from "./components/LcsStep";
import ResultsStep from "./components/ResultsStep";
import TestCases from "./components/TestCases";
import About from "./components/About";
import Footer from "./components/Footer";
import { SAMPLES } from "./data/samples";

export default function App() {
  const { theme, toggle } = useTheme();
  const [step, setStep] = useState(0);
  const [original, setOriginal] = useState("");
  const [suspected, setSuspected] = useState("");
  const toolRef = useRef<HTMLDivElement>(null);

  const bothFilled = original.trim().length > 0 && suspected.trim().length > 0;

  const handleChange = ({ original: o, suspected: s }: { original: string; suspected: string }) => {
    setOriginal(o);
    setSuspected(s);
  };

  const scrollTo = useCallback((id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const tryDemo = () => {
    const s = SAMPLES.edited;
    setOriginal(s.original);
    setSuspected(s.suspected);
    setStep(0);
    toolRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 transition-colors dark:bg-slate-900 dark:text-slate-100">
      <Navbar theme={theme} onToggleTheme={toggle} onNavigate={scrollTo} />

      <Hero onTryDemo={tryDemo} />

      <Features />

      <HowItWorks />

      {/* Tool section */}
      <main id="tool" ref={toolRef} className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-50 sm:text-3xl">
            Plagiarism Checker
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-slate-500 dark:text-slate-400">
            Paste two texts, then step through Rabin-Karp and LCS analysis to get a verdict.
          </p>
        </div>

        <Stepper step={step} onStep={setStep} />

        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800 sm:p-7">
          {step === 0 && <InputStep original={original} suspected={suspected} onChange={handleChange} />}
          {step === 1 && <RabinKarpStep original={original} suspected={suspected} />}
          {step === 2 && <LcsStep original={original} suspected={suspected} />}
          {step === 3 && <ResultsStep original={original} suspected={suspected} />}

          {/* Nav buttons */}
          <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5 dark:border-slate-700">
            <button
              onClick={prev}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 transition enabled:hover:bg-slate-100 disabled:opacity-40 dark:text-slate-300 dark:enabled:hover:bg-slate-700"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            {step < 3 ? (
              <button
                onClick={next}
                disabled={step === 0 && !bothFilled}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition enabled:hover:bg-emerald-600 disabled:opacity-40"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => setStep(0)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300"
              >
                Start Over
              </button>
            )}
          </div>
        </div>

        {/* Test cases */}
        <div id="tests" className="mt-6 scroll-mt-20">
          <TestCases />
        </div>
      </main>

      <About />

      <Footer onNavigate={scrollTo} />
    </div>
  );
}

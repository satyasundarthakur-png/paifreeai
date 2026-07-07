import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { History, X } from "lucide-react";
import { AppLogo } from "../components/AppLogo";
import { CaseForm } from "../components/CaseForm";
import { PrescriptionPanel } from "../components/PrescriptionPanel";
import { HistoryPanel } from "../components/HistoryPanel";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { MedInput, MedPrescription, SavedCase } from "../types";
import { getSpecialty } from "../lib/specialties";
import { generatePrescription } from "../lib/prescription.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PainAI — AI Pain Medicine Prescription Assistant" },
      {
        name: "description",
        content:
          "Specialist-grade AI for nociceptive, neuropathic, cancer pain, musculoskeletal, headache, interventional and chronic pain management.",
      },
      { property: "og:title", content: "PainAI — AI Pain Medicine Prescription Assistant" },
      {
        property: "og:description",
        content: "Specialist-grade AI for nociceptive, neuropathic, cancer pain, musculoskeletal, headache, interventional and chronic pain management.",
      },
    ],
  }),
  component: PainAIPage,
}));

const STORAGE_KEY = "painai_cases";
const MAX_CASES = 50;

const initialInput: MedInput = {
  name: "",
  age: "",
  gender: "",
  occupation: "",
  chief_complaint: "",
  duration: "",
  clinical_findings: "",
  provisional_diagnosis: "",
  current_medications: "",
  allergies: "",
  notes: "",
  specialty_id: "",
  image: "",
};

function PainAIPage() {
  const [input, setInput] = useState<MedInput>(initialInput);
  const [rx, setRx] = useState<MedPrescription | null>(null);
  const [view, setView] = useState<"form" | "rx" | "history">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cases, setCases] = useState<SavedCase[]>([]);
  const generate = useServerFn(generatePrescription);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setCases(JSON.parse(saved));
      } catch (err) {
        console.warn("Could not read saved case history, resetting it.", err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const updateInput = (field: keyof MedInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  };

  const saveCase = (newRx: MedPrescription) => {
    const specialty = getSpecialty(input.specialty_id);
    const newCase: SavedCase = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      timestamp: new Date().toISOString(),
      input: { ...input },
      rx: newRx,
      specialty_label: specialty?.label || "Pain Medicine",
    };
    const updated = [newCase, ...cases].slice(0, MAX_CASES);
    setCases(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleSubmit = async () => {
    if (!input.chief_complaint.trim() || !input.specialty_id) {
      setError("Please select a pain subspecialty and enter a chief complaint.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await generate({ data: input });
      setRx(result);
      saveCase(result);
      setView("rx");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to generate prescription.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setInput(initialInput);
    setRx(null);
    setError(null);
    setView("form");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const loadCase = (c: SavedCase) => {
    setInput(c.input);
    setRx(c.rx);
    setView("rx");
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCase = (id: string) => {
    const updated = cases.filter((c) => c.id !== id);
    setCases(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#FFF8F8]">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1A0A0A] via-[#2C0F0F] to-[#1A0A0A] border-b border-[#C0392B]/30 shadow-[0_4px_24px_-8px_rgba(44,15,15,0.5)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="rounded-full bg-[#FEE2E2] p-0.5 shadow-[0_0_0_1px_rgba(192,57,43,0.4)]">
              <AppLogo size={38} />
            </div>
            <div className="min-w-0">
              <div className="font-display font-bold text-xl sm:text-3xl tracking-tight text-[#FEE2E2] truncate">
                PainAI
              </div>
              <div className="text-[9px] sm:text-[10px] text-[#C0392B] font-bold -mt-1 tracking-[2px] sm:tracking-[3px] truncate">
                AI PAIN MEDICINE PRESCRIPTION
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setView(view === "history" ? "form" : "history")}
              className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border border-[#C0392B]/40 text-[#FEE2E2] hover:bg-[#C0392B]/15 transition-all"
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
              {cases.length > 0 && (
                <span className="ml-0.5 px-1.5 sm:px-2 py-0.5 text-xs bg-[#C0392B] text-white rounded-full data-mono font-bold">
                  {cases.length}
                </span>
              )}
            </button>
            {view !== "form" && (
              <button
                onClick={handleReset}
                className="px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-bold border border-[#C0392B]/40 text-[#FEE2E2] hover:bg-[#C0392B]/15 transition-all"
              >
                <span className="hidden sm:inline">New Case</span>
                <span className="sm:hidden">New</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20 pt-6 sm:pt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl flex items-start gap-3">
            <div className="font-bold mt-0.5">⚠</div>
            <div className="flex-1 text-sm">{error}</div>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {loading && <LoadingSpinner message="Generating evidence-based pain management plan..." />}

        {!loading && view === "form" && (
          <>
            <div className="relative mb-8 sm:mb-10 text-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A0A0A] via-[#2C0F0F] to-[#3D1515] px-6 py-10 sm:py-14">
              {/* Neural wave SVG decoration */}
              <svg
                className="absolute inset-x-0 bottom-0 w-full h-24 sm:h-32 opacity-60"
                viewBox="0 0 800 140"
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 100 C 80 90, 120 40, 180 50 C 240 60, 260 110, 320 105 C 380 100, 410 30, 470 22 C 530 14, 560 80, 620 90 C 680 100, 730 50, 800 60"
                  stroke="#C0392B"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M0 120 C 60 118, 100 80, 160 75 C 220 70, 250 115, 310 118 C 370 121, 420 60, 480 48 C 540 36, 580 100, 640 110 C 700 120, 760 85, 800 90"
                  stroke="#C0392B"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.5"
                />
              </svg>

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#C0392B]/15 text-[#E8A0A0] text-[10px] sm:text-xs font-bold tracking-widest rounded-full mb-4 border border-[#C0392B]/30 data-mono">
                  POWERED BY GROQ AI
                </div>
                <h1 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight mb-4 px-2 text-[#FEE2E2]">
                  Precision pain management plans,
                  <br className="hidden sm:block" /> generated in seconds
                </h1>
                <p className="text-base sm:text-xl text-[#C0A0A0] max-w-lg mx-auto px-2">
                  Specialist-grade AI for nociceptive, neuropathic, cancer, musculoskeletal,
                  headache, interventional & chronic pain
                </p>
              </div>
            </div>

            <div className="card p-5 sm:p-8 md:p-10">
              <CaseForm
                input={input}
                onInputChange={updateInput}
                onSubmit={handleSubmit}
                loading={loading}
              />
            </div>
          </>
        )}

        {!loading && view === "rx" && rx && (
          <PrescriptionPanel input={input} rx={rx} onNewCase={handleReset} />
        )}

        {!loading && view === "history" && (
          <HistoryPanel
            cases={cases}
            onLoadCase={loadCase}
            onDeleteCase={deleteCase}
            onClose={() => setView("form")}
          />
        )}
      </main>

      <footer className="text-center py-6 sm:py-8 px-4 text-xs text-[#8B4040] border-t border-[#F5C6C6] data-mono">
        PainAI • Built for pain medicine clinicians • AI output requires physician verification • Not
        for direct patient use without review
      </footer>
    </div>
  );
}

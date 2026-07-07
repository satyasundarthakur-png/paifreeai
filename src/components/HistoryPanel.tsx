import React from "react";
import { SavedCase } from "../types";
import { Trash2, Clock, User } from "lucide-react";

interface HistoryPanelProps {
  cases: SavedCase[];
  onLoadCase: (savedCase: SavedCase) => void;
  onDeleteCase: (id: string) => void;
  onClose: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  cases,
  onLoadCase,
  onDeleteCase,
  onClose,
}) => {
  if (cases.length === 0) {
    return (
      <div className="card p-10 text-center">
        <div className="text-5xl mb-4">📋</div>
        <div className="font-bold text-xl mb-2">No saved cases yet</div>
        <p className="text-[#7B241C]">
          Your generated prescriptions will appear here (last 50 cases stored locally).
        </p>
        <button onClick={onClose} className="btn-ghost mt-6">
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="font-extrabold text-2xl">Case History</div>
          <div className="text-sm text-[#7B241C]">
            Last {cases.length} cases • Stored in your browser
          </div>
        </div>
        <button onClick={onClose} className="btn-ghost">
          Close
        </button>
      </div>

      <div className="space-y-3 max-h-[65vh] overflow-auto pr-2">
        {cases.map((saved) => {
          const date = new Date(saved.timestamp).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <div
              key={saved.id}
              className="history-card group border border-[#FECACA] hover:border-[#C0392B] rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
              onClick={() => onLoadCase(saved)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🩸</div>
                  <div className="min-w-0">
                    <div className="font-bold text-lg truncate">
                      {saved.input.name || "Unnamed Patient"}
                    </div>
                    <div className="text-sm text-[#7B241C] truncate">
                      {saved.rx.primary_diagnosis}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-[#7B241C]">
                  <Clock className="w-4 h-4" /> {date}
                </div>
                <div className="px-3 py-1 bg-[#FEE2E2] text-[#C0392B] text-xs font-bold rounded-full border border-[#C0392B]/20">
                  {saved.specialty_label}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteCase(saved.id);
                  }}
                  className="opacity-40 group-hover:opacity-100 p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all"
                  title="Delete case"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center text-xs text-[#7B241C] mt-4">
        Click any case to load it back into the prescription view. Data stays in your browser only.
      </div>
    </div>
  );
};

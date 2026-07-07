import React from "react";
import { SpecialtyMeta } from "../types";
import { specialties } from "../lib/specialties";

interface SpecialtySelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
}

export const SpecialtySelector: React.FC<SpecialtySelectorProps> = ({ selectedId, onSelect }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {specialties.map((spec) => {
        const isActive = selectedId === spec.id;
        return (
          <button
            key={spec.id}
            type="button"
            onClick={() => onSelect(spec.id)}
            className={`
              group p-4 rounded-2xl border-2 text-left transition-all duration-200
              flex flex-col items-start gap-1.5
              ${
                isActive
                  ? "border-[#C0392B] bg-[#FEE2E2] shadow-md scale-[1.01]"
                  : "border-[#FECACA] hover:border-[#D2C39C] hover:bg-[#FEE2E2]/40"
              }
            `}
          >
            <div className="flex items-center gap-3 w-full">
              <span className="text-3xl">{spec.icon}</span>
              <div className="flex-1 min-w-0">
                <div
                  className={`font-bold text-[15px] ${isActive ? "text-[#6E5010]" : "text-[#1A0505]"}`}
                >
                  {spec.label}
                </div>
                <div className="text-[12px] text-[#7B241C] line-clamp-1">{spec.subtitle}</div>
              </div>
            </div>
            {isActive && (
              <div className="ml-11 text-[10px] font-semibold text-[#C0392B] tracking-wider">
                SELECTED
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

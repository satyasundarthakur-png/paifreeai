import React from "react";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = "Contacting Groq AI...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-[#FEE2E2]"></div>
        <div className="absolute inset-0 rounded-full border-4 border-[#C0392B] border-t-transparent animate-spin"></div>
        <div className="absolute inset-[6px] rounded-full bg-[#FEE2E2] flex items-center justify-center">
          <div className="text-[#C0392B] text-3xl">🩸</div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <div className="font-extrabold text-xl text-[#1A0505]">{message}</div>
        <div className="text-sm text-[#7B241C] mt-2 max-w-xs">
          Generating evidence-based prescription using llama-3.3-70b
        </div>
      </div>
    </div>
  );
};

import React from "react";

interface AppLogoProps {
  size?: number;
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 42, className = "" }) => {
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="#FEE2E2" stroke="#C0392B" strokeWidth="3" />

        {/* Spine/vertebrae symbol */}
        <rect x="28" y="12" width="8" height="6" rx="2" fill="#C0392B" />
        <rect x="28" y="21" width="8" height="6" rx="2" fill="#C0392B" />
        <rect x="28" y="30" width="8" height="6" rx="2" fill="#C0392B" />
        <rect x="28" y="39" width="8" height="6" rx="2" fill="#C0392B" />

        {/* Neural arc left */}
        <path
          d="M28 15 Q16 23 20 32 Q16 41 28 47"
          stroke="#7B241C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* Neural arc right */}
        <path
          d="M36 15 Q48 23 44 32 Q48 41 36 47"
          stroke="#7B241C"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />

        {/* AI spark */}
        <circle cx="47" cy="18" r="3" fill="#C0392B" />
        <circle cx="51" cy="22" r="1.5" fill="#C0392B" />
      </svg>
    </div>
  );
};

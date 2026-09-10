import React from 'react';

interface BrandLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark' | 'auto';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  variant = 'dark',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  const subtitleSizes = {
    sm: 'text-[9px]',
    md: 'text-[11px]',
    lg: 'text-xs',
    xl: 'text-sm',
  };

  const isLightText = variant === 'light';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision recreation of the uploaded Shireesha 6/6 Vision Care Eye Spiral Logo */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 160 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm transition-transform hover:scale-105 duration-300"
        >
          <defs>
            {/* Outer Purple Gradient */}
            <linearGradient id="purpleGrad" x1="0%" y1="30%" x2="100%" y2="80%">
              <stop offset="0%" stopColor="#4A1E6D" />
              <stop offset="50%" stopColor="#351254" />
              <stop offset="100%" stopColor="#25093D" />
            </linearGradient>

            {/* Inner Teal / Cyan Spiral Gradient */}
            <linearGradient id="tealGrad" x1="10%" y1="10%" x2="90%" y2="90%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="40%" stopColor="#14B8A6" />
              <stop offset="80%" stopColor="#0F766E" />
              <stop offset="100%" stopColor="#0D9488" />
            </linearGradient>

            {/* Soft Shadow Filter for subtle 3D depth */}
            <filter id="eyeShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="1" dy="2" stdDeviation="2" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* Outer Eye Outline / Purple Wave */}
          <path
            d="M 12 50 C 35 18, 125 18, 148 50 C 125 82, 35 82, 12 50 Z"
            fill="none"
            stroke="url(#purpleGrad)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Teal Inner Spiral Vortex */}
          <path
            d="M 148 50 C 128 26, 68 22, 50 44 C 36 60, 52 80, 80 80 C 112 80, 126 56, 110 38 C 96 24, 62 32, 60 56 C 58 72, 74 76, 88 72 C 98 68, 102 58, 96 50"
            fill="none"
            stroke="url(#tealGrad)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#eyeShadow)"
          />

          {/* Secondary Purple Counter-Swirl */}
          <path
            d="M 32 54 C 40 76, 78 86, 108 76 C 126 70, 138 58, 144 50"
            fill="none"
            stroke="url(#purpleGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Pupil Base - Deep Royal Purple */}
          <circle cx="80" cy="50" r="14" fill="#2E0E4E" />

          {/* Pupil Inner Ring */}
          <circle cx="80" cy="50" r="8" fill="#1C0633" />

          {/* Pupil Light Catch / Reflection */}
          <circle cx="84" cy="46" r="3.5" fill="#FFFFFF" opacity="0.9" />

          {/* Four-Point Sparkle Star on the Teal Vortex */}
          <path
            d="M 104 36 Q 104 42 110 42 Q 104 42 104 48 Q 104 42 98 42 Q 104 42 104 36 Z"
            fill="#FFFFFF"
          />
          <circle cx="104" cy="42" r="1" fill="#2DD4BF" />
        </svg>
      </div>

      {/* Brand Text */}
      {!iconOnly && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 leading-tight">
            <span
              className={`font-extrabold tracking-tight font-sans ${textSizes[size]} ${
                isLightText ? 'text-white' : 'text-[#24103B]'
              }`}
            >
              SHIREESHA
            </span>
            <span className="bg-[#14B8A6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md tracking-wider">
              6/6
            </span>
          </div>
          <span
            className={`font-semibold tracking-wider uppercase ${subtitleSizes[size]} ${
              isLightText ? 'text-teal-300' : 'text-[#0D9488]'
            }`}
          >
            Vision Care & Eyewear
          </span>
        </div>
      )}
    </div>
  );
};

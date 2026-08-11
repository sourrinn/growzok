"use client";

import React from "react";

interface HorseLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
  className?: string;
  inline?: boolean;
}

export function HorseLoader({
  size = "md",
  label,
  className = "",
  inline = false,
}: HorseLoaderProps) {
  // Sizing mappings
  const sizeMap = {
    sm: { container: "h-5 w-7", svg: "h-5 w-7", stroke: 1.8 },
    md: { container: "h-12 w-16", svg: "h-12 w-16", stroke: 2 },
    lg: { container: "h-20 w-28", svg: "h-20 w-28", stroke: 2.2 },
    xl: { container: "h-28 w-36", svg: "h-28 w-36", stroke: 2.5 },
  };

  const { container, svg, stroke } = sizeMap[size];

  const horseGraphic = (
    <div className={`relative flex flex-col items-center justify-center ${container} ${className}`}>
      <svg
        viewBox="0 0 100 65"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${svg} animate-horse-body text-[#232f26] dark:text-[#f4f4f5] overflow-visible`}
        aria-label="Loading horse animation"
      >
        {/* Shadow Ground Ellipse */}
        <ellipse
          cx="50"
          cy="58"
          rx="32"
          ry="3"
          className="fill-[#406852]/20 dark:fill-[#a3b899]/20 animate-pulse-subtle"
        />

        {/* Dynamic Ground Stride Lines */}
        <g className="opacity-40">
          <line
            x1="10"
            y1="58"
            x2="35"
            y2="58"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="animate-ground-stride"
          />
          <line
            x1="45"
            y1="58"
            x2="75"
            y2="58"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="animate-ground-stride"
            style={{ animationDelay: "0.25s" }}
          />
          <line
            x1="70"
            y1="58"
            x2="95"
            y2="58"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            className="animate-ground-stride"
            style={{ animationDelay: "0.5s" }}
          />
        </g>

        {/* Back Legs Group (Rhythm-offset) */}
        <g className="animate-horse-leg-back opacity-80" style={{ transformOrigin: "35px 36px" }}>
          {/* Back Left Leg */}
          <path
            d="M34 36 L26 48 L18 56"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 56 L15 57"
            stroke="currentColor"
            strokeWidth={stroke + 0.5}
            strokeLinecap="round"
          />
        </g>

        <g className="animate-horse-leg-back" style={{ animationDelay: "0.32s", transformOrigin: "32px 36px" }}>
          {/* Back Right Leg */}
          <path
            d="M32 36 L40 46 L34 56"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M34 56 L31 57"
            stroke="currentColor"
            strokeWidth={stroke + 0.5}
            strokeLinecap="round"
          />
        </g>

        {/* Main Horse Torso, Neck, Head & Mane */}
        <g className="fill-current stroke-current" strokeWidth={stroke / 2}>
          {/* Main Body Silhouette */}
          <path
            d="M30 36 C24 36 20 32 18 26 C22 24 28 27 34 29 C44 30 54 28 62 26 C68 25 72 28 72 34 C64 38 52 40 42 39 C36 38 32 37 30 36 Z"
            className="fill-[#232f26] dark:fill-[#f4f4f5]"
          />

          {/* Flowing Tail */}
          <path
            d="M20 27 C14 24 8 26 4 34 C10 32 15 31 18 30 Z"
            className="fill-[#406852] dark:fill-[#a3b899]"
          />

          {/* Elegant Neck & Head */}
          <path
            d="M62 27 C66 22 70 14 74 8 C76 5 80 4 84 6 C87 8 86 12 82 15 C78 18 75 22 72 32 Z"
            className="fill-[#232f26] dark:fill-[#f4f4f5]"
          />

          {/* Muzzle / Head Detail */}
          <path
            d="M84 6 C87 7 90 9 88 12 C85 14 81 12 80 10 Z"
            className="fill-[#232f26] dark:fill-[#f4f4f5]"
          />

          {/* Galloping Mane */}
          <path
            d="M68 18 C64 14 62 8 66 4 C69 7 71 11 73 15 Z"
            className="fill-[#406852] dark:fill-[#a3b899]"
          />
          <path
            d="M72 13 C70 9 68 5 72 2 C75 5 76 9 78 12 Z"
            className="fill-[#406852] dark:fill-[#a3b899]"
          />
        </g>

        {/* Front Legs Group */}
        <g className="animate-horse-leg-front" style={{ transformOrigin: "66px 34px" }}>
          {/* Front Left Leg */}
          <path
            d="M66 34 L76 44 L86 54"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M86 54 L89 55"
            stroke="currentColor"
            strokeWidth={stroke + 0.5}
            strokeLinecap="round"
          />
        </g>

        <g className="animate-horse-leg-front opacity-80" style={{ animationDelay: "0.32s", transformOrigin: "64px 34px" }}>
          {/* Front Right Leg */}
          <path
            d="M64 34 L56 44 L66 55"
            stroke="currentColor"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M66 55 L69 56"
            stroke="currentColor"
            strokeWidth={stroke + 0.5}
            strokeLinecap="round"
          />
        </g>
      </svg>
    </div>
  );

  if (inline) {
    return horseGraphic;
  }

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-3 animate-fade-in text-center">
      {horseGraphic}
      {label && (
        <p className="text-xs font-bold tracking-wide text-[#737970] dark:text-[#a1a1aa] animate-pulse-subtle uppercase">
          {label}
        </p>
      )}
    </div>
  );
}

export default HorseLoader;

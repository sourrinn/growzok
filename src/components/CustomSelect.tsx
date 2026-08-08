"use client";

import { useEffect, useRef, useState } from "react";

export interface CustomSelectOption {
  value: string;
  label: string;
}

interface Props {
  options: (string | CustomSelectOption)[];
  value: string;
  onChange: (value: string) => void;
  prefixLabel?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  prefixLabel,
  placeholder = "Select...",
  className = "",
  disabled = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize options to { value, label }
  const normalizedOptions: CustomSelectOption[] = options.map((opt) =>
    typeof opt === "string" ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((opt) => opt.value === value);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen]);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
    >
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3 py-2 text-xs font-semibold text-[#232f26] shadow-sm transition-all hover:bg-white focus:border-[#232f26]/50 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
      >
        <span className="truncate">
          {prefixLabel && (
            <span className="font-normal text-[#737970]">{prefixLabel}</span>
          )}
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={`h-3.5 w-3.5 shrink-0 text-[#737970] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#232f26]" : ""
          }`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Popover Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 z-50 mt-1.5 max-h-60 w-max min-w-full overflow-y-auto rounded-xl border border-[#e5e1d7] bg-white p-1.5 shadow-xl transition-all">
          <ul className="space-y-0.5">
            {normalizedOptions.map((opt) => {
              const isSelected = opt.value === value;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-[#e3ede6] font-semibold text-[#2d4a3e]"
                        : "text-[#232f26] hover:bg-[#fbf9f5]"
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && (
                      <svg
                        viewBox="0 0 16 16"
                        fill="none"
                        className="h-3.5 w-3.5 shrink-0 text-[#406852]"
                      >
                        <path
                          d="M3 8.5L6.5 12L13 4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

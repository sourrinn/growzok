"use client";

import { useEffect, useState } from "react";

interface BreathPattern {
  key: string;
  name: string;
  inhale: number;
  holdIn: number;
  exhale: number;
  holdOut: number;
  description: string;
}

const PATTERNS: BreathPattern[] = [
  { key: "box", name: "Box Breathing (4-4-4-4)", inhale: 4, holdIn: 4, exhale: 4, holdOut: 4, description: "Tactical focus & autonomic nervous system balance used by Navy SEALs." },
  { key: "relax", name: "4-7-8 Parasympathetic Reset", inhale: 4, holdIn: 7, exhale: 8, holdOut: 0, description: "Rapid anxiety reduction and sleep initiation protocol." },
  { key: "sigh", name: "Physiological Sigh (Double Inhale)", inhale: 3, holdIn: 1, exhale: 6, holdOut: 0, description: "Real-time stress relief mechanism discovered by neuroscientists." },
];

interface Props {
  embedded?: boolean;
}

export default function BreathworkClient({ embedded = false }: Props) {
  const [selectedKey, setSelectedKey] = useState("box");
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
  const [secondsInPhase, setSecondsInPhase] = useState(0);

  const pattern = PATTERNS.find((p) => p.key === selectedKey) || PATTERNS[0];

  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSecondsInPhase((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    if (phase === "Inhale" && secondsInPhase >= pattern.inhale) {
      if (pattern.holdIn > 0) {
        setPhase("Hold");
      } else {
        setPhase("Exhale");
      }
      setSecondsInPhase(0);
    } else if (phase === "Hold" && secondsInPhase >= pattern.holdIn) {
      setPhase("Exhale");
      setSecondsInPhase(0);
    } else if (phase === "Exhale" && secondsInPhase >= pattern.exhale) {
      if (pattern.holdOut > 0) {
        setPhase("Pause");
      } else {
        setPhase("Inhale");
      }
      setSecondsInPhase(0);
    } else if (phase === "Pause" && secondsInPhase >= pattern.holdOut) {
      setPhase("Inhale");
      setSecondsInPhase(0);
    }
  }, [secondsInPhase, phase, pattern, isActive]);

  const togglePacer = () => {
    setIsActive((prev) => !prev);
    setPhase("Inhale");
    setSecondsInPhase(0);
  };

  const ringScale =
    phase === "Inhale"
      ? 1 + (secondsInPhase / pattern.inhale) * 0.4
      : phase === "Exhale"
      ? 1.4 - (secondsInPhase / pattern.exhale) * 0.4
      : phase === "Hold"
      ? 1.4
      : 1;

  return (
    <div className={`mx-auto max-w-4xl space-y-8 ${embedded ? "py-2" : "py-6"}`}>
      {!embedded && (
        <div>
          <span className="inline-flex mb-3 rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
            Respiratory Autonomic Workstation
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
            Breathwork Pacing Studio
          </h1>
          <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
            Paced breathing studio for CO2 tolerance, vagus nerve stimulation, and parasympathetic nervous system activation.
          </p>
        </div>
      )}

      {/* Pattern Selector Tabs */}
      <div className="grid gap-3 sm:grid-cols-3">
        {PATTERNS.map((p) => (
          <button
            key={p.key}
            onClick={() => {
              setSelectedKey(p.key);
              setIsActive(false);
              setPhase("Inhale");
              setSecondsInPhase(0);
            }}
            className={`p-4 rounded-2xl border text-left text-xs transition-all space-y-1 ${
              selectedKey === p.key
                ? "border-[#406852] bg-[#406852]/10 text-[#406852] dark:text-[#a3b899] font-bold shadow-sm"
                : "border-[#e5e1d7] bg-white text-[#737970] dark:border-[#27272a] dark:bg-[#18181b]"
            }`}
          >
            <div className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">{p.name}</div>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa]">{p.description}</p>
          </button>
        ))}
      </div>

      {/* Interactive Visual Ring Pacer */}
      <div className="rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-12 shadow-sm text-center space-y-8">
        <div className="relative flex items-center justify-center h-48 w-48 mx-auto">
          {/* Animated Expanding Ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-[#406852] dark:border-[#a3b899] bg-[#406852]/10 transition-transform duration-1000 ease-in-out"
            style={{ transform: `scale(${ringScale})` }}
          />

          <div className="relative z-10 space-y-1">
            <span className="font-display text-2xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
              {isActive ? phase : "Ready"}
            </span>
            {isActive && (
              <div className="font-mono text-3xl font-bold text-[#406852] dark:text-[#a3b899]">
                {secondsInPhase}s
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">
            Pattern Cadence: Inhale {pattern.inhale}s | Hold {pattern.holdIn}s | Exhale {pattern.exhale}s
          </p>
          <button
            onClick={togglePacer}
            className={`rounded-xl px-8 py-3 text-xs font-bold text-white transition-all ${
              isActive ? "bg-[#be5a38] hover:bg-[#a0482b]" : "bg-[#406852] hover:bg-[#232f26]"
            }`}
          >
            {isActive ? "Pause Pacer" : "Start Breathwork Session →"}
          </button>
        </div>
      </div>
    </div>
  );
}

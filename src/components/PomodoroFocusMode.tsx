"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { playFocusFinishChime } from "@/lib/soundChimes";

type Soundscape = "none" | "whitenoise" | "pinknoise" | "rain" | "forest";

interface SoundConfig {
  label: string;
  icon: string;
}

const SOUNDSCAPES: Record<Soundscape, SoundConfig> = {
  none: { label: "Silent", icon: "🔇" },
  whitenoise: { label: "White Noise", icon: "🌫️" },
  pinknoise: { label: "Pink Noise", icon: "🌸" },
  rain: { label: "Rain", icon: "🌧️" },
  forest: { label: "Forest", icon: "🌲" },
};

interface PomodoroFocusModeProps {
  onClose: () => void;
  habitName?: string;
  stepNames?: string[];
}

export default function PomodoroFocusMode({
  onClose,
  habitName = "Morning Routine",
  stepNames = [],
}: PomodoroFocusModeProps) {
  // Timer state
  const WORK_SECONDS = 25 * 60;
  const [timeLeft, setTimeLeft] = useState(WORK_SECONDS);
  const [running, setRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Audio state
  const [soundscape, setSoundscape] = useState<Soundscape>("none");
  const [volume, setVolume] = useState(0.35);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          playFocusFinishChime();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const progressPct = ((WORK_SECONDS - timeLeft) / WORK_SECONDS) * 100;

  // Web Audio noise generation
  const stopNoise = useCallback(() => {
    try {
      noiseNodeRef.current?.stop();
    } catch {}
    noiseNodeRef.current = null;
  }, []);

  const startNoise = useCallback(
    (type: Soundscape) => {
      if (typeof window === "undefined" || type === "none") {
        stopNoise();
        return;
      }

      const ctx = audioCtxRef.current ?? new AudioContext();
      audioCtxRef.current = ctx;

      const bufferSize = ctx.sampleRate * 2; // 2 sec looped
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      // White noise base
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      // Pink noise: apply -3dB/octave filter approximation via simple IIR
      if (type === "pinknoise") {
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const w = data[i];
          b0 = 0.99886 * b0 + w * 0.0555179;
          b1 = 0.99332 * b1 + w * 0.0750759;
          b2 = 0.96900 * b2 + w * 0.1538520;
          b3 = 0.86650 * b3 + w * 0.3104856;
          b4 = 0.55000 * b4 + w * 0.5329522;
          b5 = -0.7616 * b5 - w * 0.0168980;
          data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) / 7;
          b6 = w * 0.115926;
        }
      }

      // Rain: white noise + low-pass filter
      let filterNode: BiquadFilterNode | undefined;
      if (type === "rain" || type === "forest") {
        filterNode = ctx.createBiquadFilter();
        filterNode.type = "lowpass";
        filterNode.frequency.value = type === "rain" ? 800 : 1400;
      }

      stopNoise();

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;

      const gain = gainRef.current ?? ctx.createGain();
      gainRef.current = gain;
      gain.gain.setValueAtTime(volume, ctx.currentTime);

      if (filterNode) {
        source.connect(filterNode);
        filterNode.connect(gain);
      } else {
        source.connect(gain);
      }
      gain.connect(ctx.destination);
      source.start();
      noiseNodeRef.current = source;
    },
    [volume, stopNoise]
  );

  useEffect(() => {
    if (soundscape === "none") {
      stopNoise();
    } else {
      startNoise(soundscape);
    }
    return () => stopNoise();
  }, [soundscape, startNoise, stopNoise]);

  useEffect(() => {
    if (gainRef.current && audioCtxRef.current) {
      gainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopNoise();
      audioCtxRef.current?.close();
    };
  }, [stopNoise]);

  const steps = stepNames.length > 0 ? stepNames : ["Focus session active"];
  const pct = stepNames.length > 0 ? Math.round(((currentStep + 1) / steps.length) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121215] dark:bg-black text-white overflow-y-auto px-4">
      {/* Close */}
      <button
        onClick={() => {
          stopNoise();
          onClose();
        }}
        className="absolute top-5 right-5 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-medium text-white/60 hover:text-white hover:border-white/30 transition-all"
      >
        ✕ Exit Focus Mode
      </button>

      {/* Header */}
      <div className="mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40 mb-1.5">
          Focus Mode
        </p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
          {habitName}
        </h1>
      </div>

      {/* Circular Timer */}
      <div className="relative h-52 w-52 mb-8">
        <svg viewBox="0 0 100 100" className="rotate-[-90deg] h-full w-full">
          <circle cx="50" cy="50" r="44" fill="none" stroke="#ffffff10" strokeWidth="6" />
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#a3b899"
            strokeWidth="6"
            strokeDasharray={`${2 * Math.PI * 44}`}
            strokeDashoffset={`${2 * Math.PI * 44 * (1 - progressPct / 100)}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-4xl font-bold text-white tabular-nums">
            {formatTime(timeLeft)}
          </span>
          <span className="mt-1 text-[11px] text-white/40 font-medium uppercase tracking-wider">
            {running ? "Focusing" : timeLeft === 0 ? "Session Complete 🎉" : "Paused"}
          </span>
        </div>
      </div>

      {/* Timer Controls */}
      <div className="flex items-center gap-3 mb-10">
        <button
          onClick={() => setTimeLeft(WORK_SECONDS)}
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:border-white/30 transition-all"
        >
          ↺ Reset
        </button>
        <button
          onClick={() => setRunning((r) => !r)}
          className={`rounded-xl px-6 py-2.5 text-sm font-semibold transition-all ${
            running
              ? "bg-white/10 text-white hover:bg-white/20"
              : "bg-[#a3b899] text-[#121215] hover:bg-white"
          }`}
        >
          {running ? "⏸ Pause" : "▶ Start"}
        </button>
        <button
          onClick={() => setTimeLeft(50 * 60)}
          className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/60 hover:text-white hover:border-white/30 transition-all"
        >
          50 min
        </button>
      </div>

      {/* Step Progress (if steps passed in) */}
      {steps.length > 1 && (
        <div className="mb-8 w-full max-w-sm">
          <div className="flex items-center justify-between mb-2 text-xs text-white/40">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-[#a3b899] transition-all duration-500 rounded-full"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-3 text-sm font-medium text-white/80 text-center">
            {steps[currentStep]}
          </p>
          <div className="mt-4 flex justify-center gap-2">
            <button
              disabled={currentStep === 0}
              onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-white/60 hover:text-white disabled:opacity-30 transition-all"
            >
              ← Prev
            </button>
            <button
              disabled={currentStep >= steps.length - 1}
              onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
              className="rounded-xl bg-white/10 px-4 py-2 text-xs font-medium text-white hover:bg-white/20 disabled:opacity-30 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Ambient Soundscape Selector */}
      <div className="w-full max-w-sm">
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-widest text-white/30">
          Ambient Sound
        </p>
        <div className="grid grid-cols-5 gap-2">
          {(Object.entries(SOUNDSCAPES) as [Soundscape, SoundConfig][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setSoundscape(key)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-xs font-medium transition-all ${
                soundscape === key
                  ? "border-[#a3b899] bg-[#a3b899]/10 text-[#a3b899]"
                  : "border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
              }`}
            >
              <span className="text-base">{cfg.icon}</span>
              <span className="text-[9px]">{cfg.label}</span>
            </button>
          ))}
        </div>

        {/* Volume Slider */}
        {soundscape !== "none" && (
          <div className="mt-4 flex items-center gap-3">
            <span className="text-[11px] text-white/30">🔈</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="flex-1 accent-[#a3b899]"
            />
            <span className="text-[11px] text-white/30">🔊</span>
          </div>
        )}
      </div>
    </div>
  );
}

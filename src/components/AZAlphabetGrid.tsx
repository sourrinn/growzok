"use client";

import { useState } from "react";

interface AlphabetEntry {
  letter: string;
  title: string;
  subtitle: string;
  description: string;
}

const ALPHABET_DATA: AlphabetEntry[] = [
  { letter: "A", title: "Alignment", subtitle: "Biological Intent", description: "Harmonizing daily routines with individual circadian chronotypes and peak energy states." },
  { letter: "B", title: "Biological Rhythm", subtitle: "16-Domain Taxonomy", description: "Structuring execution across hydration, sleep, cardiovascular, and neural recovery domains." },
  { letter: "C", title: "Circadian Reset", subtitle: "Morning Photonic Cue", description: "Anchoring melatonin offset with immediate morning daylight and hydration routines." },
  { letter: "D", title: "Deep Work Engine", subtitle: "Zero Distraction", description: "Coupling habit execution with full-screen focus timers and ambient noise generators." },
  { letter: "E", title: "Effort Rating", subtitle: "Friction Diagnostic", description: "Logging subjective friction (1-5 Stars) to detect subtle fatigue before streak failure." },
  { letter: "F", title: "Frequency Streaks", subtitle: "Non-Linear Schedules", description: "Calculating true consistency on custom schedules without false streak reset penalties." },
  { letter: "G", title: "Grace Freeze", subtitle: "Monthly Protection", description: "Shielding routine momentum during travel or illness with automatic grace passes." },
  { letter: "H", title: "Heuristic AI Coach", subtitle: "On-Device Intelligence", description: "Analyzing 30-day completion velocity client-side to output zero-latency guidance." },
  { letter: "I", title: "In-Browser Focus", subtitle: "Web Audio Soundscapes", description: "Generating real-time white noise, pink noise, rain, and forest audio on GPU." },
  { letter: "J", title: "Journal Log", subtitle: "Micro-Reflections", description: "Recording 1-line execution notes to build a searchable subjective history timeline." },
  { letter: "K", title: "Keyboard Palette", subtitle: "Ctrl+K Navigation", description: "Accessing habits, protocols, and analytics instantly without mouse friction." },
  { letter: "L", title: "Leveling XP", subtitle: "System Mastery", description: "Earning system XP, character levels, and unlockable achievement trophies." },
  { letter: "M", title: "Momentum Analytics", subtitle: "Week-Over-Week", description: "Comparing 7-day velocity against prior baseline for empirical momentum tracking." },
  { letter: "N", title: "Neuro-Reset", subtitle: "Dopamine Recalibration", description: "Replacing cheap notifications with biological identity feedback loops." },
  { letter: "O", title: "OLED Pitch Black", subtitle: "Visual Ergonomics", description: "Conserving battery and reducing eye strain with true #000000 black mode." },
  { letter: "P", title: "Protocol Library", subtitle: "Peer-Reviewed Systems", description: "Deploying pre-configured science routines like Huberman Morning and Pomodoro 90." },
  { letter: "Q", title: "QR Sharing", subtitle: "Direct Protocol Link", description: "Encoding custom routine stacks into instant shareable URLs with zero server friction." },
  { letter: "R", title: "Relapse Shield", subtitle: "Re-Engagement Recovery", description: "Contextual momentum recovery cards when returning after multi-day absences." },
  { letter: "S", title: "Synergy Matrix", subtitle: "Habit Co-Occurrence", description: "Discovering high-correlation habit pairs that boost combined completion rates." },
  { letter: "T", title: "Taxonomy Grid", subtitle: "Domain Categorization", description: "Filtering habits across 16 biological domains and time-of-day execution windows." },
  { letter: "U", title: "User Sovereignty", subtitle: "Zero Lock-In", description: "Complete data ownership with open iCal calendar feeds and CSV dataset exports." },
  { letter: "V", title: "Velocity Sparklines", subtitle: "14-Day Micro-Trends", description: "Visualizing 14-day completion momentum directly on dashboard cards." },
  { letter: "W", title: "Weekly Histogram", subtitle: "Execution Heat", description: "Mapping completion frequency across Monday through Sunday to eliminate weak days." },
  { letter: "X", title: "XP Gamification", subtitle: "Tiered Progression", description: "Unlocking system milestones from Apprentice to Master Practitioner." },
  { letter: "Y", title: "Yield Analytics", subtitle: "Domain Performance", description: "Measuring completion percentages across physical, mental, and productivity domains." },
  { letter: "Z", title: "Zero Friction", subtitle: "Native Performance", description: "Lightweight client execution running entirely in-browser with zero bloat." },
];

export default function AZAlphabetGrid() {
  const [selectedLetter, setSelectedLetter] = useState<string>("A");
  const activeEntry = ALPHABET_DATA.find((item) => item.letter === selectedLetter) || ALPHABET_DATA[0];

  return (
    <div className="space-y-6">
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="inline-block rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#406852] mb-1">
          The A–Z of Human Mastery
        </span>
        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#232f26]">
          Every Letter Encodes a Biological & Behavioral System
        </h2>
        <p className="text-xs sm:text-sm text-[#737970] leading-relaxed">
          Growzok is built on 26 foundational principles designed to eliminate friction and build sustainable human consistency.
        </p>
      </div>

      {/* Alphabet Selector Strip */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {ALPHABET_DATA.map((item) => {
          const isActive = item.letter === selectedLetter;
          return (
            <button
              key={item.letter}
              onClick={() => setSelectedLetter(item.letter)}
              className={`h-8 w-8 rounded-xl font-mono text-xs font-bold transition-all ${
                isActive
                  ? "bg-[#232f26] text-white shadow-md scale-110"
                  : "bg-white border border-[#e5e1d7] text-[#737970] hover:border-[#232f26] hover:text-[#232f26]"
              }`}
            >
              {item.letter}
            </button>
          );
        })}
      </div>

      {/* Selected Letter Spotlight Card */}
      <div className="max-w-2xl mx-auto rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm space-y-3 transition-all animate-fade-in">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#232f26] font-mono text-2xl font-bold text-white shadow-xs">
            {activeEntry.letter}
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-[#232f26]">
              {activeEntry.title}
            </h3>
            <p className="text-xs font-medium text-[#406852]">
              {activeEntry.subtitle}
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#737970] leading-relaxed border-t border-[#e5e1d7] pt-3">
          {activeEntry.description}
        </p>
      </div>
    </div>
  );
}

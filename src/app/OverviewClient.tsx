"use client";

import { useState } from "react";
import Link from "next/link";
import { playFocusFinishChime } from "@/lib/soundChimes";

const DOMAIN_BADGES = [
  "Sleep Hygiene",
  "Hydration",
  "Nutrition",
  "Cardiovascular",
  "Strength",
  "Mobility",
  "Breathwork",
  "Grooming",
  "Preventive Health",
  "Recovery",
  "Deep Work",
  "Financial Hygiene",
  "Social Capital",
  "Accelerated Learning",
  "Digital Minimalism",
  "Gut Microbiome",
];

const FAQS = [
  {
    q: "How does Growzok's biological taxonomy differ from generic habit apps?",
    a: "Generic list apps treat all tasks identically. Growzok structures your habits across 16 fixed biological and behavioral domains—such as Circadian Sleep, Deep Work, and Recovery—allowing you to measure and optimize specific dimensions of human performance.",
  },
  {
    q: "What makes frequency-aware streak algorithms superior?",
    a: "Traditional habit trackers penalize rest days and weekend schedules, causing artificial streak resets that trigger guilt and routine abandonment. Growzok evaluates completion exclusively against your active schedule parameters.",
  },
  {
    q: "Can protocol templates be personalized prior to adoption?",
    a: "Every protocol bundle opens a pre-flight customization panel where you can refine target volumes, adjust schedule frequency, or select specific habits tailored to your immediate personal goals.",
  },
  {
    q: "How is personal data privacy and sovereignty maintained?",
    a: "Your data remains under your absolute control. Account authentication uses cryptographic scrypt hashing, and your complete history can be exported at any time into open formats without restrictions.",
  },
  {
    q: "How does data export and calendar integration function?",
    a: "Growzok provides standard iCal (.ics) subscription feeds for automatic synchronization with Google Calendar and Apple Calendar, alongside complete structured JSON and CSV dataset exports.",
  },
];

export default function OverviewClient() {
  const [demoDone, setDemoDone] = useState(false);
  const [demoCount, setDemoCount] = useState(4);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const toggleDemo = () => {
    setDemoDone((prev) => !prev);
    setDemoCount((prev) => (demoDone ? prev - 1 : prev + 1));
  };

  return (
    // Locked strictly to Light Mode palette for crisp marketing presentation
    <div className="min-h-screen bg-[#fbf9f5] text-[#232f26] selection:bg-[#406852]/20">
      {/* 1. Top Marketing Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#e5e1d7]/80 bg-[#fbf9f5]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#232f26] font-display text-lg font-bold text-[#fbf9f5]">
              G
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-[#232f26]">
              Growzok
            </span>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-semibold sm:flex">
            <a href="#philosophy" className="text-[#737970] transition-colors hover:text-[#232f26]">
              The Philosophy
            </a>
            <a href="#focus" className="text-[#737970] transition-colors hover:text-[#232f26]">
              Focus Architecture
            </a>
            <a href="#taxonomy" className="text-[#737970] transition-colors hover:text-[#232f26]">
              Biological Domains
            </a>
            <a href="#protocols" className="text-[#737970] transition-colors hover:text-[#232f26]">
              Protocols
            </a>
            <a href="#mastery" className="text-[#737970] transition-colors hover:text-[#232f26]">
              System Mastery
            </a>
            <a href="#faq" className="text-[#737970] transition-colors hover:text-[#232f26]">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-sm font-semibold text-[#737970] transition-colors hover:text-[#232f26]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#232f26] px-4.5 py-2 text-sm font-semibold text-[#fbf9f5] transition-all hover:bg-black active:scale-[0.98] shadow-xs"
            >
              Claim Your System →
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#406852]/10 blur-3xl" />
        <div className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-[#d4cca9]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Hero Left Content */}
            <div className="space-y-6 lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#406852]/20 bg-[#e3ede6] px-3.5 py-1 text-xs font-bold text-[#406852] mb-3">
                🔬 Built on Circadian & Behavioral Neuroscience
              </span>

              <h1 className="font-display text-4xl font-bold tracking-tight text-[#232f26] sm:text-5xl lg:text-6xl leading-[1.1]">
                Architect Your Daily Rhythm. Eliminate Relapse.
              </h1>

              <p className="max-w-xl text-base text-[#737970] sm:text-lg leading-relaxed">
                Growzok replaces fragile willpower with frequency-aware behavioral systems, scientific biological domains, and friction-free daily momentum.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="rounded-xl bg-[#232f26] px-6 py-3.5 text-sm font-semibold text-[#fbf9f5] shadow-md transition-all hover:bg-black active:scale-[0.98]"
                >
                  Claim Your System →
                </Link>
                <Link
                  href="/protocols"
                  className="rounded-xl border border-[#e5e1d7] bg-white px-6 py-3.5 text-sm font-semibold text-[#232f26] transition-all hover:border-[#232f26]/40 hover:bg-gray-50 shadow-xs"
                >
                  Explore Protocol Library ➔
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4 text-xs text-[#737970]">
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#be5a38] font-bold">•</span> Zero Cost Core Platform
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#be5a38] font-bold">•</span> Zero Credit Card Required
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <span className="text-[#be5a38] font-bold">•</span> Frequency-Aware Streaks
                </div>
              </div>
            </div>

            {/* Hero Right Widget Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970]">
                      System Execution Engine
                    </h3>
                    <p className="text-sm font-bold text-[#232f26]">Test Active Routine</p>
                  </div>
                  <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-xs font-bold text-[#406852]">
                    Optimal Rhythm
                  </span>
                </div>

                {/* Mock Card 1 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-4 transition-all">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleDemo}
                        aria-label="Toggle habit completion demo"
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                          demoDone
                            ? "border-transparent bg-[#406852] text-white scale-105"
                            : "border-[#406852] bg-white"
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${demoDone ? "bg-white" : "bg-[#406852]"}`} />
                      </button>
                      <div>
                        <h4 className="text-sm font-bold text-[#232f26]">
                          Sunlight Outdoor Exposure
                        </h4>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#737970]">
                          <span className="rounded bg-[#e2f0f4] px-1.5 py-0.5 text-[10px] font-bold text-[#1f5669]">
                            Circadian Sleep
                          </span>
                          <span>Health · Daily · 10 mins</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold tabular-nums text-[#232f26]">
                        {demoDone ? "15d" : "14d"} streak
                      </span>
                    </div>
                  </div>

                  {/* Target log demo */}
                  <div className="flex items-center justify-between rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-14 items-center justify-center rounded-lg bg-[#232f26] text-xs font-bold text-white">
                        {demoCount * 250}ml
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-[#232f26]">
                          Hydrate + Electrolytes
                        </h4>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#737970]">
                          <span className="rounded bg-[#e2f0f4] px-1.5 py-0.5 text-[10px] font-bold text-[#1f5669]">
                            Hydration
                          </span>
                          <span>Target: 1,000 ml</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#406852]">
                      {demoCount * 250 >= 1000 ? "✓ Target Met" : "In Progress"}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl bg-[#fbf9f5] border border-[#e5e1d7] p-3 text-center text-xs text-[#737970]">
                  💡 Frequency-aware intelligence shields your streak on non-scheduled days.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Executive Metrics Bar */}
      <section className="border-y border-[#e5e1d7] bg-white/80 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#232f26]">16 Domains</p>
              <p className="text-xs font-medium text-[#737970]">Structured Biological Taxonomy</p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#406852]">Zero Lock-In</p>
              <p className="text-xs font-medium text-[#737970]">Absolute Personal Data Ownership</p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#232f26]">In-Browser GPU</p>
              <p className="text-xs font-medium text-[#737970]">Synthesized Ambient Focus Audio</p>
            </div>
            <div className="space-y-1">
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#be5a38]">Streak Grace</p>
              <p className="text-xs font-medium text-[#737970]">Automated Monthly Shielding</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Relapse Cycle (And Why Ordinary List Apps Fail) */}
      <section id="philosophy" className="py-16 sm:py-24 bg-[#fbf9f5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center">
            <span className="inline-block rounded-full bg-[#be5a38]/10 px-3.5 py-1 text-xs font-bold text-[#be5a38] uppercase tracking-wider mb-4">
              The Relapse Reality Check
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#232f26] sm:text-4xl">
              Why Generic Habit Apps Fail High Performers.
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-[#737970] sm:text-base mt-2">
              Most habit trackers treat human behavior like cold machinery. When life strikes, rigid streaks shatter, guilt sets in, and routines collapse. Growzok is engineered around human biology.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#be5a38]/20 bg-white p-6 shadow-sm space-y-3">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-sm text-[#be5a38]">Mid-Week Fatigue Relapse</h3>
              <p className="text-xs text-[#737970] leading-relaxed">
                <strong className="text-[#232f26]">The Problem:</strong> "Starting with intense motivation on Monday, hitting friction by Thursday, and quitting out of guilt."
              </p>
              <div className="pt-2 border-t border-[#e5e1d7]">
                <p className="text-xs font-bold text-[#406852]">
                  ✓ Growzok Solution: Non-penalizing schedule logic & Heuristic AI Coach scaling targets before you break.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#be5a38]/20 bg-white p-6 shadow-sm space-y-3">
              <span className="text-2xl">📱</span>
              <h3 className="font-bold text-sm text-[#be5a38]">Digital Attention Drain</h3>
              <p className="text-xs text-[#737970] leading-relaxed">
                <strong className="text-[#232f26]">The Problem:</strong> "Unlocking your phone to log a habit exposes your brain to instant notification noise and digital fatigue."
              </p>
              <div className="pt-2 border-t border-[#e5e1d7]">
                <p className="text-xs font-bold text-[#406852]">
                  ✓ Growzok Solution: Full-Screen Distraction-Free Focus Environment with GPU ambient soundscapes.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#be5a38]/20 bg-white p-6 shadow-sm space-y-3">
              <span className="text-2xl">❓</span>
              <h3 className="font-bold text-sm text-[#be5a38]">Decision Paralysis</h3>
              <p className="text-xs text-[#737970] leading-relaxed">
                <strong className="text-[#232f26]">The Problem:</strong> "Wasting cognitive energy trying to design routines from scratch without knowing what moves the needle."
              </p>
              <div className="pt-2 border-t border-[#e5e1d7]">
                <p className="text-xs font-bold text-[#406852]">
                  ✓ Growzok Solution: 16 Biological Domains & Science-Backed Protocols pre-calibrated for high performers.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#be5a38]/20 bg-white p-6 shadow-sm space-y-3">
              <span className="text-2xl">💸</span>
              <h3 className="font-bold text-sm text-[#be5a38]">Subscription Exploitation</h3>
              <p className="text-xs text-[#737970] leading-relaxed">
                <strong className="text-[#232f26]">The Problem:</strong> "Renting your own behavioral history behind restrictive monthly paywalls and locked data silos."
              </p>
              <div className="pt-2 border-t border-[#e5e1d7]">
                <p className="text-xs font-bold text-[#406852]">
                  ✓ Growzok Solution: Complete personal data sovereignty with full export capability and zero hidden paywalls.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Focus Engine & Ambient Soundscape Sampler */}
      <section id="focus" className="border-t border-[#e5e1d7] py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-6">
              <span className="inline-block rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] uppercase tracking-wider mb-3">
                🎧 GPU-Synthesized Ambient Audio
              </span>
              <h2 className="font-display text-3xl font-bold text-[#232f26] sm:text-4xl">
                Enter Flow State Instantly. Command Your Environment.
              </h2>
              <p className="text-sm text-[#737970] leading-relaxed">
                Our in-browser Web Audio engine generates ambient soundscapes directly inside your GPU without streaming heavy MP3 files or relying on Spotify ads.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => playFocusFinishChime()}
                  className="rounded-xl bg-[#406852] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#232f26] transition-all shadow-xs"
                >
                  🔔 Test Web Audio Completion Chime
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-6 shadow-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#737970]">
                  Interactive Soundscape Sampler
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "rain", label: "🌧️ Rain Soundscape", desc: "Low-pass pink noise" },
                    { id: "forest", label: "🌲 Forest Ambient", desc: "Filtered organic noise" },
                    { id: "pinknoise", label: "🌸 Pink Noise", desc: "-3dB/octave spectrum" },
                    { id: "whitenoise", label: "🌫️ White Noise", desc: "Pure uniform focus" },
                  ].map((snd) => (
                    <button
                      key={snd.id}
                      onClick={() => setActiveSound(activeSound === snd.id ? null : snd.id)}
                      className={`flex flex-col text-left p-3.5 rounded-xl border text-xs transition-all ${
                        activeSound === snd.id
                          ? "border-[#406852] bg-[#406852]/10 text-[#406852]"
                          : "border-[#e5e1d7] bg-white text-[#232f26]"
                      }`}
                    >
                      <span className="font-bold">{snd.label}</span>
                      <span className="text-[10px] text-[#737970] mt-0.5">{snd.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#737970] text-center font-medium">
                  {activeSound ? `▶ Playing ${activeSound} sample in-browser...` : "Click any soundscape above to test live"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Biological Domains Showcase */}
      <section id="taxonomy" className="border-t border-[#e5e1d7] bg-[#fbf9f5] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5 space-y-4">
              <span className="inline-block rounded-full bg-[#e3ede6] px-3.5 py-1 text-xs font-bold text-[#406852] mb-3">
                🧬 16 Biological & Behavioral Domains
              </span>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#232f26] sm:text-4xl">
                Total Alignment Across Every Dimension of Performance.
              </h2>
              <p className="text-sm leading-relaxed text-[#737970]">
                From circadian sleep hygiene to deep cognitive output, categorize every habit within a scientifically structured framework.
              </p>
              <div className="pt-2">
                <Link
                  href="/protocols"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#232f26] underline underline-offset-4 hover:text-[#406852]"
                >
                  Explore Protocol Library ➔
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-2.5 rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-inner">
                {DOMAIN_BADGES.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-semibold text-[#232f26] shadow-xs hover:border-[#406852] transition-colors"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Preset Systems Spotlight */}
      <section id="protocols" className="border-t border-[#e5e1d7] py-16 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-[#232f26]">
                Elite Protocol Architecture
              </h2>
              <p className="mt-1 text-sm text-[#737970]">
                Proven behavioral frameworks calibrated for immediate execution.
              </p>
            </div>
            <Link
              href="/protocols"
              className="text-xs font-bold text-[#232f26] underline underline-offset-4 hover:text-[#406852]"
            >
              Browse Library ➔
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-6 shadow-sm">
              <div className="space-y-3">
                <span className="inline-block rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-xs font-bold text-[#406852] mb-2">
                  Circadian Reset
                </span>
                <h3 className="text-lg font-bold text-[#232f26]">
                  Neuro-Reset Morning Protocol
                </h3>
                <p className="text-xs text-[#737970] leading-relaxed">
                  Sunlight exposure, electrolyte hydration, thermal reset, delayed caffeine intake.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#e5e1d7] pt-4 text-xs text-[#737970]">
                <span className="font-medium">Rating 4.9 (1,420 users)</span>
                <Link
                  href="/protocols/huberman-morning"
                  className="font-bold text-[#232f26] hover:underline"
                >
                  View Architecture ➔
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-6 shadow-sm">
              <div className="space-y-3">
                <span className="inline-block rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-xs font-bold text-[#406852] mb-2">
                  Cognitive Output
                </span>
                <h3 className="text-lg font-bold text-[#232f26]">
                  Deep Work & Cognitive Flow Engine
                </h3>
                <p className="text-xs text-[#737970] leading-relaxed">
                  90-minute hyper-focus blocks, zero notification mornings, evening shutdown audits.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#e5e1d7] pt-4 text-xs text-[#737970]">
                <span className="font-medium">Rating 4.95 (890 users)</span>
                <Link
                  href="/protocols/deep-work-focus"
                  className="font-bold text-[#232f26] hover:underline"
                >
                  View Architecture ➔
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-6 shadow-sm">
              <div className="space-y-3">
                <span className="inline-block rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-xs font-bold text-[#406852] mb-2">
                  Recovery Architecture
                </span>
                <h3 className="text-lg font-bold text-[#232f26]">
                  Stoic Nightly Reflection & Wind-Down
                </h3>
                <p className="text-xs text-[#737970] leading-relaxed">
                  Mental debrief journal, environmental optimization, screen-free buffer window.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#e5e1d7] pt-4 text-xs text-[#737970]">
                <span className="font-medium">Rating 4.94 (1,120 users)</span>
                <Link
                  href="/protocols/stoic-evening"
                  className="font-bold text-[#232f26] hover:underline"
                >
                  View Architecture ➔
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. System Mastery & Gamification Preview */}
      <section id="mastery" className="border-t border-[#e5e1d7] py-16 sm:py-24 bg-[#fbf9f5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="inline-block rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] uppercase tracking-wider mb-2">
              🏆 Identity Transformation & System Mastery
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#232f26] sm:text-4xl">
              Transform Daily Consistency Into Unshakeable Proof.
            </h2>
            <p className="mx-auto max-w-xl text-sm text-[#737970]">
              Watch your personal character evolve as daily discipline translates into System XP, milestone trophies, and an unbroken 365-day consistency grid.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e1d7] pb-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#406852] px-3 py-1 text-xs font-bold text-white uppercase">
                  Level 14
                </span>
                <div>
                  <h3 className="font-bold text-base text-[#232f26]">Habit Architect</h3>
                  <p className="text-xs text-[#737970]">1,450 System XP • 5 Unlocked Trophies</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#406852]">72% to Level 15</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: "🌱", name: "First Step", desc: "Initial execution logged" },
                { icon: "⚡", name: "Apprentice Architect", desc: "25 habit completions" },
                { icon: "🔥", name: "Week Warrior", desc: "7-day unbroken streak" },
                { icon: "🧘", name: "Zen Master", desc: "20+ Breathwork logs" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-xl border border-[#406852]/30 bg-[#e3ede6]/40 p-3 text-xs">
                  <span className="text-xl">{b.icon}</span>
                  <div>
                    <p className="font-bold text-[#232f26]">{b.name}</p>
                    <p className="text-[10px] text-[#737970]">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FAQ Accordion Section */}
      <section id="faq" className="border-t border-[#e5e1d7] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center space-y-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#232f26]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#737970]">
              Everything you need to know about Growzok habit systems.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-[#232f26]"
                  >
                    <span>{faq.q}</span>
                    <span className="ml-3 shrink-0 text-[#737970]">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`h-4 w-4 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </button>
                  {isOpen && (
                    <div className="border-t border-[#e5e1d7] p-5 pt-3 text-xs leading-relaxed text-[#737970]">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 10. Bottom CTA Banner */}
      <section className="border-t border-[#e5e1d7] bg-[#232f26] py-16 text-center text-[#fbf9f5]">
        <div className="mx-auto max-w-3xl px-4 space-y-4">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Command Your Rhythm Today.
          </h2>
          <p className="text-sm text-slate-300">
            Join thousands of high performers building resilient, science-backed daily momentum.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-[#fbf9f5] px-6 py-3.5 text-sm font-bold text-[#232f26] shadow-sm transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Claim Your System →
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="border-t border-[#e5e1d7] bg-[#fbf9f5] py-8 text-xs text-[#737970]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#232f26] text-xs font-bold text-white">
              G
            </span>
            <span className="font-bold text-[#232f26]">Growzok Habits</span>
          </div>
          <p>© {new Date().getFullYear()} Growzok. All rights reserved.</p>
          <div className="flex gap-4 font-semibold">
            <Link href="/protocols" className="hover:text-[#232f26]">
              Protocol Library
            </Link>
            <Link href="/login" className="hover:text-[#232f26]">
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

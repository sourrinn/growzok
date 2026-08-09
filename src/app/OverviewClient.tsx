"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/components/ThemeProvider";
import { playFocusFinishChime } from "@/lib/soundChimes";

const DOMAIN_BADGES = [
  "Sleep",
  "Hydration",
  "Nutrition",
  "Cardio",
  "Strength",
  "Mobility",
  "Breathing",
  "Grooming",
  "Preventive",
  "Recovery",
  "Productivity",
  "Finance",
  "Social",
  "Learning",
  "Digital Minimalism",
  "Gut Health",
];

const FAQS = [
  {
    q: "What makes Growzok's 3-tier taxonomy different from ordinary habit apps?",
    a: "Unlike plain text list apps, Growzok separates your habits into 16 biological & behavioral domains (e.g. Sleep, Hydration, Recovery) while giving you full freedom to label and bundle them for your personal daily workflow.",
  },
  {
    q: "How do frequency-aware streaks work?",
    a: "If you set a habit for Weekdays only, Saturdays and Sundays will not penalise your success rate or break your streak. For N-times per week habits, progress is tracked against weekly targets rather than daily pressure.",
  },
  {
    q: "Can I customize presets before adopting them?",
    a: "Yes! Every template bundle opens a pre-flight customization drawer where you can adjust numeric goals, uncheck individual habits, or edit recommended times of day before adding them to your account.",
  },
  {
    q: "Is Growzok private and secure?",
    a: "Every account operates under strict user-level data isolation. Passwords are derived using Node's scrypt algorithm, and session data is handled with secure JWT tokens.",
  },
];

export default function OverviewClient() {
  const { theme, setTheme } = useTheme();
  const [demoDone, setDemoDone] = useState(false);
  const [demoCount, setDemoCount] = useState(4);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [activeSound, setActiveSound] = useState<string | null>(null);

  const toggleDemo = () => {
    setDemoDone((prev) => !prev);
    setDemoCount((prev) => (demoDone ? prev - 1 : prev + 1));
  };


  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#09090b] text-[#232f26] dark:text-[#f4f4f5] selection:bg-[#406852]/20 dark:selection:bg-white/20">
      {/* Top Marketing Navbar */}
      <header className="sticky top-0 z-50 border-b border-[#e5e1d7]/80 dark:border-[#27272a] bg-[#fbf9f5]/90 dark:bg-[#09090b]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#232f26] font-display text-lg font-bold text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46]">
              G
            </span>
            <span className="font-display text-xl font-semibold tracking-tight text-[#232f26] dark:text-[#f4f4f5]">
              Growzok
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
            <a href="#features" className="text-[#737970] dark:text-[#a1a1aa] transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5]">
              Features
            </a>
            <a href="#taxonomy" className="text-[#737970] dark:text-[#a1a1aa] transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5]">
              Taxonomy
            </a>
            <a href="#systems" className="text-[#737970] dark:text-[#a1a1aa] transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5]">
              Systems
            </a>
            <a href="#faq" className="text-[#737970] dark:text-[#a1a1aa] transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5]">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Header Theme Switcher Selector */}
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as any)}
              className="rounded-xl border border-[#e5e1d7] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#232f26] dark:border-[#27272a] dark:bg-[#18181b] dark:text-[#f4f4f5] focus:outline-none cursor-pointer"
              aria-label="Color Mode Preference"
            >
              <option value="light">☀️ Light</option>
              <option value="dark">🌙 Dark</option>
              <option value="amoled">🖤 OLED Pitch Black</option>
              <option value="auto">🌅 Auto (6am–8pm)</option>
              <option value="system">💻 System</option>
            </select>

            <Link
              href="/login"
              className="px-3 py-1.5 text-sm font-medium text-[#737970] dark:text-[#a1a1aa] transition-colors hover:text-[#232f26] dark:hover:text-[#f4f4f5]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#232f26] px-4 py-2 text-sm font-semibold text-[#fbf9f5] dark:bg-[#27272a] dark:text-[#f4f4f5] dark:border dark:border-[#3f3f46] transition-opacity hover:opacity-90 active:scale-[0.98]"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        {/* Soft background glow */}
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-[#406852]/10 blur-3xl" />
        <div className="absolute -right-20 top-40 h-96 w-96 rounded-full bg-[#d4cca9]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            {/* Hero Left Content */}
            <div className="space-y-6 lg:col-span-7">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#406852]/20 bg-[#e3ede6] px-3.5 py-1 text-xs font-semibold text-[#406852]">
                Human Biology & Behavioral Science
              </span>

              <h1 className="font-display text-4xl font-semibold tracking-tight text-[#232f26] sm:text-5xl lg:text-6xl">
                Master Your Daily Rhythm with Science-Backed Habit Systems.
              </h1>

              <p className="max-w-xl text-base text-[#737970] sm:text-lg">
                Growzok combines a 16-domain biological taxonomy, frequency-aware streak algorithms, and 1-tap preset protocols for high performers.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/register"
                  className="rounded-xl bg-[#232f26] px-6 py-3.5 text-sm font-semibold text-[#fbf9f5] shadow-sm transition-all hover:bg-black active:scale-[0.98]"
                >
                  Get Started Free →
                </Link>
                <Link
                  href="/protocols"
                  className="rounded-xl border border-[#e5e1d7] bg-white px-6 py-3.5 text-sm font-semibold text-[#232f26] transition-colors hover:border-[#232f26]/30"
                >
                  Browse Habit Systems
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs text-[#737970]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#be5a38] font-bold">•</span> 100% Free Core Tracking
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#be5a38] font-bold">•</span> No Credit Card Required
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#be5a38] font-bold">•</span> Frequency-Aware Streaks
                </div>
              </div>
            </div>

            {/* Hero Right Widget Preview */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-4">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#737970]">
                      Interactive Demo
                    </h3>
                    <p className="text-sm font-semibold text-[#232f26]">Try Toggling Below</p>
                  </div>
                  <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-xs font-medium text-[#406852]">
                    Live Rhythm
                  </span>
                </div>

                {/* Mock Card */}
                <div className="mt-5 space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-[#e5e1d7] p-4 transition-colors">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={toggleDemo}
                        aria-label="Toggle habit completion demo"
                        className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                          demoDone
                            ? "border-transparent bg-[#406852] text-white scale-105"
                            : "border-[#406852] bg-transparent"
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full ${demoDone ? "bg-white" : "bg-[#406852]"}`} />
                      </button>
                      <div>
                        <h4 className="text-base font-semibold text-[#232f26]">
                          Sunlight Outdoor Exposure
                        </h4>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#737970]">
                          <span className="rounded bg-[#e2f0f4] px-1.5 py-0.5 text-[10px] font-medium text-[#1f5669]">
                            Sleep
                          </span>
                          <span>Health · Daily · 10 mins</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold tabular-nums text-[#232f26]">
                        {demoDone ? "15d" : "14d"} streak
                      </span>
                    </div>
                  </div>

                  {/* Target log demo */}
                  <div className="flex items-center justify-between rounded-xl border border-[#e5e1d7] p-4">
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-14 items-center justify-center rounded-lg bg-[#232f26] text-xs font-semibold text-white">
                        {demoCount * 250}ml
                      </span>
                      <div>
                        <h4 className="text-base font-semibold text-[#232f26]">
                          Hydrate + Electrolytes
                        </h4>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-[#737970]">
                          <span className="rounded bg-[#e2f0f4] px-1.5 py-0.5 text-[10px] font-medium text-[#1f5669]">
                            Hydration
                          </span>
                          <span>Goal: 1,000 ml</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#406852]">
                      {demoCount * 250 >= 1000 ? "Goal Met" : "In Progress"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 rounded-xl bg-[#fbf9f5] p-3 text-center text-xs text-[#737970]">
                  14-day growth stems show your completion rhythm at a glance.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Traditional Habit Apps Fail You (Targeting Insecurities) */}
      <section className="border-t border-[#e5e1d7] dark:border-[#27272a] py-16 sm:py-24 bg-white/50 dark:bg-[#121215]/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="rounded-full bg-[#be5a38]/10 px-3.5 py-1 text-xs font-bold text-[#be5a38] uppercase tracking-wider">
              The Behavioral Reality Check
            </span>
            <h2 className="font-display text-3xl font-bold tracking-tight text-[#232f26] dark:text-[#f4f4f5] sm:text-4xl">
              Why Traditional To-Do & Habit Apps Keep Failing You.
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-[#737970] dark:text-[#a1a1aa] sm:text-base">
              Generic list apps treat humans like cold machinery. When life happens, rigid streaks reset to 0, guilt sets in, and you relapse. Growzok is built on behavioral biology.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#be5a38]/20 bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-xs space-y-3">
              <span className="text-2xl">⚡</span>
              <h3 className="font-bold text-sm text-[#be5a38]">The Thursday Burnout Relapse</h3>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
                <strong className="text-[#232f26] dark:text-[#f4f4f5]">Insecurity:</strong> "I start strong on Monday, get overwhelmed by Thursday, and give up."
              </p>
              <div className="pt-2 border-t border-[#e5e1d7] dark:border-[#27272a]">
                <p className="text-xs font-semibold text-[#406852] dark:text-[#a3b899]">
                  ✓ Growzok Fix: Non-penalizing weekday schedules & Heuristic AI Coach scaling targets before you crash.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#be5a38]/20 bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-xs space-y-3">
              <span className="text-2xl">📱</span>
              <h3 className="font-bold text-sm text-[#be5a38]">Phone Distraction Trap</h3>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
                <strong className="text-[#232f26] dark:text-[#f4f4f5]">Insecurity:</strong> "Opening my phone to check off a habit leads to 45 mins of doomscrolling."
              </p>
              <div className="pt-2 border-t border-[#e5e1d7] dark:border-[#27272a]">
                <p className="text-xs font-semibold text-[#406852] dark:text-[#a3b899]">
                  ✓ Growzok Fix: Full-Screen Distraction-Free Focus Mode with 0kB browser-native ambient soundscapes.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#be5a38]/20 bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-xs space-y-3">
              <span className="text-2xl">❓</span>
              <h3 className="font-bold text-sm text-[#be5a38]">Decision Paralysis</h3>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
                <strong className="text-[#232f26] dark:text-[#f4f4f5]">Insecurity:</strong> "I don't know what routines actually optimize my energy, sleep, and focus."
              </p>
              <div className="pt-2 border-t border-[#e5e1d7] dark:border-[#27272a]">
                <p className="text-xs font-semibold text-[#406852] dark:text-[#a3b899]">
                  ✓ Growzok Fix: 16 Biological Domains & 1-Click Science-Backed Protocols (Neuroscience, Circadian).
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#be5a38]/20 bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-xs space-y-3">
              <span className="text-2xl">💸</span>
              <h3 className="font-bold text-sm text-[#be5a38]">Subscription Paywalls</h3>
              <p className="text-xs text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
                <strong className="text-[#232f26] dark:text-[#f4f4f5]">Insecurity:</strong> "I'm tired of $10/mo habit apps that lock my history behind paywalls."
              </p>
              <div className="pt-2 border-t border-[#e5e1d7] dark:border-[#27272a]">
                <p className="text-xs font-semibold text-[#406852] dark:text-[#a3b899]">
                  ✓ Growzok Fix: 100% Free Core Platform with 0 Paid Lockouts & 1-Click iCal/JSON/CSV Data Ownership.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Soundscape Sampler Section */}
      <section className="border-t border-[#e5e1d7] dark:border-[#27272a] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-6">
              <span className="rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
                0kB Web Audio Synthesizer
              </span>
              <h2 className="font-display text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5] sm:text-4xl">
                Lock Into Deep Focus. Zero Distractions.
              </h2>
              <p className="text-sm text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
                Our in-browser Web Audio engine generates ambient soundscapes directly inside your GPU without streaming heavy MP3 files or relying on Spotify ads.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => playFocusFinishChime()}
                  className="rounded-xl bg-[#406852] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#232f26] transition-all shadow-xs"
                >
                  🔔 Test Web Audio Completion Chime
                </button>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 dark:border-[#27272a] dark:bg-[#18181b] shadow-xl space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
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
                          ? "border-[#406852] bg-[#406852]/10 text-[#406852] dark:border-[#a3b899] dark:text-[#a3b899]"
                          : "border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] text-[#232f26] dark:text-[#f4f4f5]"
                      }`}
                    >
                      <span className="font-bold">{snd.label}</span>
                      <span className="text-[10px] text-[#737970] dark:text-[#a1a1aa] mt-0.5">{snd.desc}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] text-center">
                  {activeSound ? `▶ Playing ${activeSound} sample in-browser...` : "Click any soundscape above to test live"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Biological Domains Showcase */}
      <section id="taxonomy" className="border-t border-[#e5e1d7] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <span className="rounded-full bg-[#e3ede6] px-3 py-1 text-xs font-semibold text-[#406852]">
                16 Fixed Biological Domains
              </span>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#232f26] sm:text-4xl">
                Scientific Alignment Across All Spheres of Life.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#737970]">
                Whether you're tuning circadian sleep rhythm, optimizing deep focus, or managing cash flow, Growzok categorizes habits accurately.
              </p>
              <div className="mt-6">
                <Link
                  href="/protocols"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#232f26] underline underline-offset-4 hover:text-[#406852]"
                >
                  Explore All Protocols in Marketplace →
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="flex flex-wrap gap-2 rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] p-6 shadow-inner">
                {DOMAIN_BADGES.map((domain) => (
                  <span
                    key={domain}
                    className="rounded-xl border border-[#e5e1d7] bg-white px-3.5 py-2 text-xs font-semibold text-[#232f26] shadow-sm"
                  >
                    {domain}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preset Systems Spotlight */}
      <section id="systems" className="border-t border-[#e5e1d7] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-[#232f26]">
                Featured Habit Systems
              </h2>
              <p className="mt-1 text-sm text-[#737970]">
                Pre-configured bundles designed by human performance experts.
              </p>
            </div>
            <Link
              href="/protocols"
              className="text-xs font-semibold text-[#232f26] underline underline-offset-4 hover:text-[#406852]"
            >
              Browse Marketplace →
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            <div className="flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
              <div>
                <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-xs font-medium text-[#406852]">
                  Morning Routine
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#232f26]">
                  Neuro-Reset Morning Protocol
                </h3>
                <p className="mt-1 text-xs text-[#737970]">
                  Sunlight exposure, electrolytes, cold reset, delayed caffeine.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#e5e1d7] pt-4 text-xs text-[#737970]">
                <span>Rating 4.9 (1,420 reviews)</span>
                <Link
                  href="/protocols/huberman-morning"
                  className="font-semibold text-[#232f26] hover:underline"
                >
                  View System →
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
              <div>
                <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-xs font-medium text-[#406852]">
                  Productivity & Focus
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#232f26]">
                  Deep Work & Hyper-Focus Engine
                </h3>
                <p className="mt-1 text-xs text-[#737970]">
                  90-minute focus blocks, zero phone first hour, evening shutdown audit.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#e5e1d7] pt-4 text-xs text-[#737970]">
                <span>Rating 4.95 (890 reviews)</span>
                <Link
                  href="/protocols/deep-work-focus"
                  className="font-semibold text-[#232f26] hover:underline"
                >
                  View System →
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
              <div>
                <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-xs font-medium text-[#406852]">
                  Evening Wind-Down
                </span>
                <h3 className="mt-3 text-lg font-semibold text-[#232f26]">
                  Stoic Nightly Wind-Down
                </h3>
                <p className="mt-1 text-xs text-[#737970]">
                  Nightly reflection journal, screen-free hour, environment reset.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#e5e1d7] pt-4 text-xs text-[#737970]">
                <span>Rating 4.94 (1,120 reviews)</span>
                <Link
                  href="/protocols/stoic-evening"
                  className="font-semibold text-[#232f26] hover:underline"
                >
                  View System →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section id="faq" className="border-t border-[#e5e1d7] bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[#232f26]">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm text-[#737970]">
              Everything you need to know about Growzok habit systems.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-[#232f26]"
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

      {/* Bottom CTA Banner */}
      <section className="border-t border-[#e5e1d7] bg-[#232f26] py-16 text-center text-[#fbf9f5]">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Start Building Your Daily Rhythm Today.
          </h2>
          <p className="mt-3 text-sm text-slate-300">
            Join thousands of high performers using scientific habit systems to build consistency.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Link
              href="/register"
              className="rounded-xl bg-[#fbf9f5] px-6 py-3.5 text-sm font-semibold text-[#232f26] shadow-sm transition-opacity hover:opacity-90"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e5e1d7] bg-[#fbf9f5] py-8 text-xs text-[#737970]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[#232f26] text-xs font-bold text-white">
              G
            </span>
            <span className="font-semibold text-[#232f26]">Growzok Habits</span>
          </div>
          <p>© {new Date().getFullYear()} Growzok. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/protocols" className="hover:text-[#232f26]">
              Templates Marketplace
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

"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [demoDone, setDemoDone] = useState(false);
  const [demoCount, setDemoCount] = useState(4);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleDemo = () => {
    setDemoDone((prev) => !prev);
    setDemoCount((prev) => (demoDone ? prev - 1 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#fbf9f5] text-[#232f26] selection:bg-[#406852]/20">
      {/* Top Marketing Navbar */}
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

          <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
            <a href="#features" className="text-[#737970] transition-colors hover:text-[#232f26]">
              Features
            </a>
            <a href="#taxonomy" className="text-[#737970] transition-colors hover:text-[#232f26]">
              Taxonomy
            </a>
            <a href="#systems" className="text-[#737970] transition-colors hover:text-[#232f26]">
              Systems
            </a>
            <a href="#faq" className="text-[#737970] transition-colors hover:text-[#232f26]">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-1.5 text-sm font-medium text-[#737970] transition-colors hover:text-[#232f26]"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="rounded-xl bg-[#232f26] px-4 py-2 text-sm font-semibold text-[#fbf9f5] transition-opacity hover:opacity-90 active:scale-[0.98]"
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
                  href="/templates"
                  className="rounded-xl border border-[#e5e1d7] bg-white px-6 py-3.5 text-sm font-semibold text-[#232f26] transition-colors hover:border-[#232f26]/30"
                >
                  Browse Habit Systems
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs text-[#737970]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#be5a38]">✓</span> 100% Free Core Tracking
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#be5a38]">✓</span> No Credit Card Required
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#be5a38]">✓</span> Frequency-Aware Streaks
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
                            : "border-[#406852] bg-transparent text-transparent"
                        }`}
                      >
                        ✓
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

      {/* Feature Pillars Section */}
      <section id="features" className="border-t border-[#e5e1d7] py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-[#232f26] sm:text-4xl">
              Built for Consistency, Not Pressure.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-[#737970] sm:text-base">
              Growzok removes guilt-inducing penalties and focuses on long-term behavioral momentum.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
              <h3 className="mt-2 text-base font-semibold text-[#232f26]">3-Tier Biological Taxonomy</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#737970]">
                Every habit is anchored to 16 biological & behavioral domains (Sleep, Hydration, Recovery) for scientific tracking.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
              <h3 className="mt-2 text-base font-semibold text-[#232f26]">Frequency-Aware Streaks</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#737970]">
                Weekday habits aren't penalized on weekends. Times-per-week goals measure target completion without daily stress.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
              <h3 className="mt-2 text-base font-semibold text-[#232f26]">Numeric Target Tracking</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#737970]">
                Track glasses, minutes, kilometers, or currency. Log values seamlessly while streaks update underneath.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
              <h3 className="mt-2 text-base font-semibold text-[#232f26]">1-Tap Preset Systems</h3>
              <p className="mt-2 text-xs leading-relaxed text-[#737970]">
                Adopt morning neuro-resets, deep work focus setups, and financial hygiene bundles in a single click.
              </p>
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
                  href="/templates"
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
              href="/templates"
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
                  href="/templates/huberman-morning"
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
                  href="/templates/deep-work-focus"
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
                  href="/templates/stoic-evening"
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
                    <span className="ml-3 shrink-0 text-base">{isOpen ? "−" : "+"}</span>
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
            <Link href="/templates" className="hover:text-[#232f26]">
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

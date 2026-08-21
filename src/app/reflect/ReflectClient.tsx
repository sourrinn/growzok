"use client";

import { useState, useMemo } from "react";
import { useReflection } from "@/hooks/useReflection";
import { InsightCard } from "@/components/InsightCard";
import { HorseLoader } from "@/components/HorseLoader";
import ReportsView from "@/components/ReportsView";
import { computeHabitSynergies } from "@/lib/synergy";
import { useHabits } from "@/hooks/useHabits";
import { generateBehavioralInsights } from "@/lib/heuristicCoach";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function ReflectClient() {
  const today = todayStr();
  const {
    reflection,
    insights,
    dailySummary,
    loading,
    saveReflection,
    generateInsights,
    applyInsight,
    dismissInsight,
  } = useReflection(today);

  const { habits } = useHabits();

  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "patterns" | "journal">("overview");

  // Journal form state
  const [whatWorked, setWhatWorked] = useState(reflection?.whatWorked ?? "");
  const [whatDidnt, setWhatDidnt] = useState(reflection?.whatDidnt ?? "");
  const [tomorrowChange, setTomorrowChange] = useState(reflection?.tomorrowChange ?? "");
  const [mood, setMood] = useState<number | undefined>(reflection?.moodRating);
  const [energy, setEnergy] = useState<number | undefined>(reflection?.energyRating);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [generating, setGenerating] = useState(false);

  const isWeekend = new Date().getDay() === 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveReflection({
        whatWorked,
        whatDidnt,
        tomorrowChange,
        moodRating: mood,
        energyRating: energy,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await generateInsights();
    } finally {
      setGenerating(false);
    }
  };

  const riskInsights = insights.filter((i) => i.type === "streak_risk");
  
  // Total active streak
  const activeStreakCount = habits.filter(h => h.history && h.history.includes(today)).length;

  const synergies = useMemo(() => computeHabitSynergies(habits), [habits]);
  const behavioralInsights = useMemo(() => generateBehavioralInsights(habits), [habits]);

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#737970] dark:text-[#a1a1aa]">
          L4–L5 · Intelligence
        </div>
        <h1 className="mb-1 text-3xl font-extrabold text-[#232f26] dark:text-[#f4f4f5]">
          Reflect & Analyze
        </h1>
        <p className="text-sm text-[#737970] dark:text-[#a1a1aa]">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 flex gap-4 border-b border-[#e5e1d7] dark:border-[#27272a]">
        {[
          { id: "overview", label: "Overview" },
          { id: "analytics", label: "Analytics" },
          { id: "patterns", label: "Patterns" },
          { id: "journal", label: "Journal" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === t.id
                ? "border-b-2 border-[#232f26] text-[#232f26] dark:border-[#f4f4f5] dark:text-[#f4f4f5]"
                : "text-[#737970] hover:text-[#232f26] dark:text-[#a1a1aa] dark:hover:text-[#f4f4f5]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <HorseLoader size="lg" label="Loading intelligence data..." />
      ) : (
        <div>
          {/* TAB: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {dailySummary ? (
                <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 dark:border-[#27272a] dark:bg-[#18181b]">
                  <h3 className="mb-4 text-lg font-bold text-[#232f26] dark:text-[#f4f4f5]">Today's Summary</h3>
                  <p className="mb-6 text-sm text-[#737970] dark:text-[#a1a1aa]">{dailySummary.headline}</p>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="rounded-xl bg-[#fbf9f5] p-4 text-center dark:bg-[#27272a]">
                      <div className="text-2xl font-black text-[#22c55e]">{dailySummary.completed}</div>
                      <div className="mt-1 text-[10px] font-semibold text-[#737970] dark:text-[#a1a1aa]">Completed</div>
                    </div>
                    <div className="rounded-xl bg-[#fbf9f5] p-4 text-center dark:bg-[#27272a]">
                      <div className="text-2xl font-black text-[#f59e0b]">{dailySummary.skipped}</div>
                      <div className="mt-1 text-[10px] font-semibold text-[#737970] dark:text-[#a1a1aa]">Skipped</div>
                    </div>
                    <div className="rounded-xl bg-[#fbf9f5] p-4 text-center dark:bg-[#27272a]">
                      <div className="text-2xl font-black text-[#ef4444]">{dailySummary.interrupted}</div>
                      <div className="mt-1 text-[10px] font-semibold text-[#737970] dark:text-[#a1a1aa]">Interrupted</div>
                    </div>
                    <div className="rounded-xl bg-[#fbf9f5] p-4 text-center dark:bg-[#27272a]">
                      <div className="text-2xl font-black text-[#3b82f6]">{dailySummary.totalActiveMinutes}</div>
                      <div className="mt-1 text-[10px] font-semibold text-[#737970] dark:text-[#a1a1aa]">Active Min</div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="mb-2 flex justify-between text-xs font-semibold">
                      <span className="text-[#737970] dark:text-[#a1a1aa]">Completion Rate</span>
                      <span className="text-[#22c55e]">
                        {dailySummary.totalHabits > 0 ? Math.round((dailySummary.completed / dailySummary.totalHabits) * 100) : 0}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-[#e5e1d7] dark:bg-[#27272a]">
                      <div
                        className="h-full rounded-full bg-[#22c55e]"
                        style={{ width: `${dailySummary.totalHabits > 0 ? (dailySummary.completed / dailySummary.totalHabits) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-[#e5e1d7] bg-white p-8 text-center dark:border-[#27272a] dark:bg-[#18181b]">
                  <p className="text-sm font-medium text-[#737970] dark:text-[#a1a1aa]">Welcome! No data yet for today.</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 dark:border-[#27272a] dark:bg-[#18181b]">
                  <h3 className="mb-4 text-sm font-bold text-[#232f26] dark:text-[#f4f4f5]">Active Streaks</h3>
                  <div className="text-3xl font-black text-[#3b82f6]">{activeStreakCount}</div>
                  <p className="mt-2 text-xs text-[#737970] dark:text-[#a1a1aa]">Habits completed today</p>
                </div>
                <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 dark:border-[#27272a] dark:bg-[#18181b]">
                  <h3 className="mb-4 text-sm font-bold text-[#232f26] dark:text-[#f4f4f5]">At Risk</h3>
                  {riskInsights.length > 0 ? (
                    <ul className="space-y-2">
                      {riskInsights.map(r => (
                        <li key={r.id} className="text-xs font-medium text-[#ef4444]">{r.message}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">All good! No habits currently at risk.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="rounded-xl bg-[#fbf9f5] p-3 text-center text-xs font-medium text-[#737970] dark:bg-[#27272a] dark:text-[#a1a1aa]">
                Powered by your execution history
              </div>
              <ReportsView />
            </div>
          )}

          {/* TAB: PATTERNS */}
          {activeTab === "patterns" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#232f26] dark:text-[#f4f4f5]">System Insights</h3>
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="rounded-lg bg-[#232f26] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-black disabled:opacity-50 dark:bg-[#f4f4f5] dark:text-[#18181b] dark:hover:bg-white"
                >
                  {generating ? "Generating..." : "Generate Insights"}
                </button>
              </div>

              {insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <InsightCard
                      key={insight.id}
                      insight={insight}
                      onApply={applyInsight}
                      onDismiss={dismissInsight}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#e5e1d7] p-8 text-center dark:border-[#27272a]">
                  <p className="text-sm text-[#737970] dark:text-[#a1a1aa]">No insights generated yet. Click generate above.</p>
                </div>
              )}

              <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 dark:border-[#27272a] dark:bg-[#18181b]">
                <h3 className="mb-2 text-sm font-bold text-[#232f26] dark:text-[#f4f4f5]">Energy Alignment</h3>
                <p className="text-sm text-[#737970] dark:text-[#a1a1aa]">
                  Your high-focus habits are mostly aligned with your peak energy blocks. Keep it up!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="mb-4 text-sm font-bold text-[#232f26] dark:text-[#f4f4f5]">Synergy Pairs</h3>
                  {synergies.length > 0 ? (
                    <ul className="space-y-3">
                      {synergies.map((s, i) => (
                        <li key={i} className="rounded-lg border border-[#e5e1d7] bg-[#fbf9f5] p-3 text-sm dark:border-[#27272a] dark:bg-[#27272a]">
                          <span className="font-semibold">{s.habitA.name}</span> &amp; <span className="font-semibold">{s.habitB.name}</span>
                          <span className="ml-2 rounded-full bg-[#e3ede6] px-2 py-0.5 text-[10px] font-bold text-[#406852] dark:bg-[#406852]/20 dark:text-[#a3b899]">
                            +{s.boostPct}% Match
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">No synergy pairs detected yet.</p>
                  )}
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-bold text-[#232f26] dark:text-[#f4f4f5]">Behavioral Trends</h3>
                  {behavioralInsights.length > 0 ? (
                    <ul className="space-y-3">
                      {behavioralInsights.map((b, i) => (
                        <li key={i} className="rounded-lg border border-[#e5e1d7] bg-[#fbf9f5] p-3 text-sm dark:border-[#27272a] dark:bg-[#27272a]">
                          {b.message}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-[#737970] dark:text-[#a1a1aa]">No behavioral trends detected yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: JOURNAL */}
          {activeTab === "journal" && (
            <div className="mx-auto max-w-2xl rounded-2xl border border-[#e5e1d7] bg-white p-8 shadow-sm dark:border-[#27272a] dark:bg-[#18181b]">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
                  Daily Reflection
                </h2>
                {isWeekend && (
                  <span className="rounded-full bg-[#e3ede6] px-3 py-1 text-xs font-bold text-[#406852] dark:bg-[#27272a] dark:text-[#a1a1aa]">
                    Weekly Synthesis
                  </span>
                )}
              </div>

              {[
                { label: "What worked well today?", value: whatWorked, setter: setWhatWorked },
                { label: "What got in your way?", value: whatDidnt, setter: setWhatDidnt },
                { label: "What will you change tomorrow?", value: tomorrowChange, setter: setTomorrowChange },
              ].map((q, idx) => (
                <div key={idx} className="mb-6">
                  <label className="mb-2 block text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">{q.label}</label>
                  <textarea
                    value={q.value}
                    onChange={(e) => q.setter(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] p-3 text-sm text-[#232f26] outline-none transition-colors focus:border-[#232f26] dark:border-[#27272a] dark:bg-[#27272a] dark:text-[#f4f4f5] dark:focus:border-[#f4f4f5]"
                  />
                </div>
              ))}

              <div className="mb-6">
                <label className="mb-2 block text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">Mood</label>
                <div className="flex gap-2">
                  {["😔", "😐", "🙂", "😊", "😄"].map((emoji, i) => {
                    const rating = i + 1;
                    return (
                      <button
                        key={rating}
                        onClick={() => setMood(rating)}
                        className={`flex h-12 flex-1 items-center justify-center rounded-xl border text-2xl transition-all ${
                          mood === rating
                            ? "border-[#232f26] bg-[#232f26]/5 dark:border-[#f4f4f5] dark:bg-[#f4f4f5]/10"
                            : "border-[#e5e1d7] opacity-60 hover:opacity-100 dark:border-[#27272a]"
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <label className="mb-2 block text-sm font-semibold text-[#232f26] dark:text-[#f4f4f5]">Energy</label>
                <div className="flex gap-2">
                  {["😴", "🥱", "💪", "⚡", "🔥"].map((emoji, i) => {
                    const rating = i + 1;
                    return (
                      <button
                        key={rating}
                        onClick={() => setEnergy(rating)}
                        className={`flex h-12 flex-1 items-center justify-center rounded-xl border text-2xl transition-all ${
                          energy === rating
                            ? "border-[#232f26] bg-[#232f26]/5 dark:border-[#f4f4f5] dark:bg-[#f4f4f5]/10"
                            : "border-[#e5e1d7] opacity-60 hover:opacity-100 dark:border-[#27272a]"
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full rounded-xl bg-[#22c55e] py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Reflection"}
              </button>
              
              {saved && (
                <p className="mt-4 text-center text-sm font-bold text-[#22c55e]">Reflection Saved!</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

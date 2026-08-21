"use client";

import { useState } from "react";
import { useReflection } from "@/hooks/useReflection";
import { InsightCard } from "@/components/InsightCard";
import { HorseLoader } from "@/components/HorseLoader";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ─── Mood / Energy Slider ─────────────────────────────────────────────────────

function RatingSlider({
  label,
  value,
  onChange,
  emoji,
}: {
  label: string;
  value?: number;
  onChange: (v: number) => void;
  emoji: string[];
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: "rgba(255,255,255,0.4)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "10px",
        }}
      >
        {label}
      </label>
      <div style={{ display: "flex", gap: "8px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              flex: 1,
              padding: "12px 4px",
              borderRadius: "12px",
              border:
                value === n
                  ? "1px solid rgba(255,255,255,0.3)"
                  : "1px solid rgba(255,255,255,0.06)",
              background:
                value === n
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(255,255,255,0.02)",
              fontSize: "20px",
              cursor: "pointer",
              transition: "all 0.15s",
              opacity: value !== undefined && value !== n ? 0.4 : 1,
            }}
          >
            {emoji[n - 1]}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Daily Summary Card ───────────────────────────────────────────────────────

function SummaryCard({
  summary,
}: {
  summary: {
    totalHabits: number;
    completed: number;
    skipped: number;
    interrupted: number;
    strongestBlock?: string;
    totalActiveMinutes: number;
    headline: string;
  };
}) {
  const pct =
    summary.totalHabits > 0
      ? Math.round((summary.completed / summary.totalHabits) * 100)
      : 0;

  return (
    <div
      style={{
        background: "rgba(34,197,94,0.06)",
        border: "1px solid rgba(34,197,94,0.2)",
        borderRadius: "20px",
        padding: "24px",
        marginBottom: "32px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <span style={{ fontSize: "22px" }}>📊</span>
        <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f4f4f5", margin: 0 }}>
          Today&apos;s Summary
        </h3>
      </div>

      {/* Headline */}
      <p style={{ fontSize: "14px", color: "#a1a1aa", margin: "0 0 20px 0", lineHeight: 1.6 }}>
        {summary.headline}
      </p>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {[
          { label: "Completed", value: summary.completed, color: "#22c55e" },
          { label: "Skipped", value: summary.skipped, color: "#f59e0b" },
          { label: "Interrupted", value: summary.interrupted, color: "#ef4444" },
          { label: "Active Min", value: summary.totalActiveMinutes, color: "#3b82f6" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: "rgba(0,0,0,0.2)",
              borderRadius: "12px",
              padding: "14px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "22px", fontWeight: 800, color: s.color }}>
              {s.value}
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", marginTop: "3px", fontWeight: 600 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div style={{ marginTop: "16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "5px",
          }}
        >
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>
            Completion rate
          </span>
          <span style={{ fontSize: "11px", fontWeight: 700, color: "#22c55e" }}>
            {pct}%
          </span>
        </div>
        <div
          style={{
            height: "5px",
            background: "rgba(255,255,255,0.06)",
            borderRadius: "3px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              background: "linear-gradient(90deg, #22c55e, #4ade80)",
              borderRadius: "3px",
              transition: "width 0.6s ease",
            }}
          />
        </div>
      </div>

      {summary.strongestBlock && (
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.35)",
            margin: "12px 0 0 0",
          }}
        >
          Strongest block: <strong style={{ color: "#22c55e" }}>{summary.strongestBlock}</strong>
        </p>
      )}
    </div>
  );
}

// ─── Reflection Form ──────────────────────────────────────────────────────────

function ReflectionForm({
  initial,
  onSave,
  saving,
}: {
  initial?: {
    whatWorked?: string;
    whatDidnt?: string;
    tomorrowChange?: string;
    moodRating?: number;
    energyRating?: number;
  };
  onSave: (data: {
    whatWorked: string;
    whatDidnt: string;
    tomorrowChange: string;
    moodRating?: number;
    energyRating?: number;
  }) => void;
  saving?: boolean;
}) {
  const [whatWorked, setWhatWorked] = useState(initial?.whatWorked ?? "");
  const [whatDidnt, setWhatDidnt] = useState(initial?.whatDidnt ?? "");
  const [tomorrowChange, setTomorrowChange] = useState(initial?.tomorrowChange ?? "");
  const [mood, setMood] = useState<number | undefined>(initial?.moodRating);
  const [energy, setEnergy] = useState<number | undefined>(initial?.energyRating);

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "28px",
        marginBottom: "32px",
      }}
    >
      <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#f4f4f5", margin: "0 0 24px 0" }}>
        Reflection
      </h3>

      {[
        {
          label: "What worked well today?",
          value: whatWorked,
          set: setWhatWorked,
          placeholder: "Habits completed, moments of flow, helpful decisions...",
        },
        {
          label: "What got in your way?",
          value: whatDidnt,
          set: setWhatDidnt,
          placeholder: "Distractions, skips, friction points, environment...",
        },
        {
          label: "What will you change tomorrow?",
          value: tomorrowChange,
          set: setTomorrowChange,
          placeholder: "One concrete adjustment for tomorrow...",
        },
      ].map((q) => (
        <div key={q.label} style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "12px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.5)",
              letterSpacing: "0.04em",
              marginBottom: "8px",
            }}
          >
            {q.label}
          </label>
          <textarea
            placeholder={q.placeholder}
            value={q.value}
            onChange={(e) => q.set(e.target.value)}
            rows={3}
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              padding: "12px 14px",
              color: "#f4f4f5",
              fontSize: "13px",
              resize: "none",
              outline: "none",
              fontFamily: "inherit",
              lineHeight: 1.6,
              boxSizing: "border-box",
            }}
          />
        </div>
      ))}

      <RatingSlider
        label="Mood"
        value={mood}
        onChange={setMood}
        emoji={["😔", "😐", "🙂", "😊", "😄"]}
      />
      <RatingSlider
        label="Energy"
        value={energy}
        onChange={setEnergy}
        emoji={["😴", "🥱", "💪", "⚡", "🔥"]}
      />

      <button
        onClick={() =>
          onSave({ whatWorked, whatDidnt, tomorrowChange, moodRating: mood, energyRating: energy })
        }
        disabled={saving}
        style={{
          width: "100%",
          background: saving ? "rgba(255,255,255,0.05)" : "#22c55e",
          border: "none",
          color: saving ? "rgba(255,255,255,0.3)" : "#000",
          fontSize: "14px",
          fontWeight: 800,
          padding: "14px",
          borderRadius: "14px",
          cursor: saving ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        {saving ? <><HorseLoader size="sm" inline /> Saving...</> : "Save Reflection"}
      </button>
    </div>
  );
}

// ─── Main ReflectClient ───────────────────────────────────────────────────────

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

  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (data: {
    whatWorked: string;
    whatDidnt: string;
    tomorrowChange: string;
    moodRating?: number;
    energyRating?: number;
  }) => {
    setSaving(true);
    try {
      await saveReflection(data);
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

  const isWeekend = new Date().getDay() === 0; // Sunday = weekly synthesis day

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "40px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div
          style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "rgba(255,255,255,0.3)",
            textTransform: "uppercase",
            marginBottom: "8px",
          }}
        >
          L5 · Reflective
        </div>
        <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#f4f4f5", margin: "0 0 6px 0" }}>
          {isWeekend ? "Weekly Synthesis" : "Daily Reflect"}
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {loading ? (
        <HorseLoader size="lg" label="Loading your reflection..." />
      ) : (
        <>
          {/* Daily Summary */}
          {dailySummary && <SummaryCard summary={dailySummary} />}

          {/* Reflection Form */}
          <ReflectionForm
            initial={reflection ?? undefined}
            onSave={handleSave}
            saving={saving}
          />

          {saved && (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: "10px",
                padding: "12px 16px",
                marginBottom: "24px",
                textAlign: "center",
                fontSize: "13px",
                color: "#22c55e",
                fontWeight: 600,
              }}
            >
              Reflection saved
            </div>
          )}

          {/* Insights Section */}
          <div style={{ marginBottom: "32px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
                flexWrap: "wrap",
                gap: "10px",
              }}
            >
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#f4f4f5", margin: 0 }}>
                System Insights
              </h2>
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{
                  background: "rgba(59,130,246,0.12)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  color: generating ? "rgba(255,255,255,0.3)" : "#3b82f6",
                  fontSize: "12px",
                  fontWeight: 700,
                  padding: "8px 14px",
                  borderRadius: "10px",
                  cursor: generating ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                {generating ? <><HorseLoader size="sm" inline /> Analyzing...</> : "Generate Insights"}
              </button>
            </div>

            {insights.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "48px 20px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(255,255,255,0.06)",
                  borderRadius: "16px",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "10px" }}>🔍</div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", margin: 0 }}>
                  No insights yet. Complete more sessions to generate patterns.
                </p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {insights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onApply={applyInsight}
                    onDismiss={dismissInsight}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTimeline } from "@/hooks/useTimeline";
import { BlockCard } from "@/components/BlockCard";
import { HorseLoader } from "@/components/HorseLoader";
import type { EnergyZone } from "@/types/timeline";

function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function minuteToLabel(m: number): string {
  const h24 = Math.floor(m / 60) % 24;
  const min = m % 60;
  const p = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(min).padStart(2, "0")} ${p}`;
}

const ZONE_OPTIONS: { value: EnergyZone; label: string; color: string }[] = [
  { value: "peak", label: "Peak Energy", color: "#eab308" },
  { value: "trough", label: "Trough", color: "#818cf8" },
  { value: "recovery", label: "Recovery", color: "#c084fc" },
];

// ─── Add Block Form ───────────────────────────────────────────────────────────

function AddBlockForm({
  onAdd,
  onCancel,
}: {
  onAdd: (data: {
    name: string;
    startMinute: number;
    durationMinutes: number;
    energyZone: EnergyZone;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [startHour, setStartHour] = useState(9);
  const [startMin, setStartMin] = useState(0);
  const [duration, setDuration] = useState(60);
  const [zone, setZone] = useState<EnergyZone>("peak");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      name: name.trim(),
      startMinute: startHour * 60 + startMin,
      durationMinutes: duration,
      energyZone: zone,
    });
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: "18px",
        padding: "24px",
        marginBottom: "16px",
      }}
    >
      <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#f4f4f5", margin: "0 0 18px 0" }}>
        New Block
      </h4>

      <input
        placeholder="Block name (e.g. Morning Deep Work)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "14px" }}>
        <div>
          <label style={labelStyle}>Start Hour</label>
          <select value={startHour} onChange={(e) => setStartHour(+e.target.value)} style={selectStyle}>
            {Array.from({ length: 18 }, (_, i) => i + 5).map((h) => (
              <option key={h} value={h}>{minuteToLabel(h * 60)}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Minute</label>
          <select value={startMin} onChange={(e) => setStartMin(+e.target.value)} style={selectStyle}>
            {[0, 15, 30, 45].map((m) => (
              <option key={m} value={m}>{String(m).padStart(2, "0")}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Duration (min)</label>
          <select value={duration} onChange={(e) => setDuration(+e.target.value)} style={selectStyle}>
            {[15, 25, 30, 45, 60, 90, 120].map((d) => (
              <option key={d} value={d}>{d} min</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "18px" }}>
        {ZONE_OPTIONS.map((z) => (
          <button
            key={z.value}
            onClick={() => setZone(z.value)}
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "10px",
              border: zone === z.value ? `1px solid ${z.color}` : "1px solid rgba(255,255,255,0.08)",
              background: zone === z.value ? `${z.color}22` : "rgba(255,255,255,0.03)",
              color: zone === z.value ? z.color : "rgba(255,255,255,0.4)",
              fontSize: "11px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {z.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <button
          onClick={handleSubmit}
          style={{
            flex: 1,
            background: "#22c55e",
            border: "none",
            color: "#000",
            fontSize: "13px",
            fontWeight: 800,
            padding: "12px",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          Add Block
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.4)",
            fontSize: "13px",
            fontWeight: 600,
            padding: "12px",
            borderRadius: "12px",
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Time Budget Meter ────────────────────────────────────────────────────────

function TimeBudgetMeter({ planned, available }: { planned: number; available: number }) {
  const pct = Math.min(100, Math.round((planned / available) * 100));
  const isWarning = pct >= 80;
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>
          Time Budget
        </span>
        <span style={{ fontSize: "12px", fontWeight: 700, color: isWarning ? "#f59e0b" : "rgba(255,255,255,0.5)" }}>
          {Math.round(planned / 60)}h {planned % 60}m / {Math.round(available / 60)}h available
        </span>
      </div>
      <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: isWarning ? "linear-gradient(90deg, #f59e0b, #ef4444)" : "linear-gradient(90deg, #22c55e, #16a34a)",
            borderRadius: "3px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
      {isWarning && (
        <p style={{ fontSize: "11px", color: "#f59e0b", margin: "6px 0 0 0" }}>
          Your day is over 80% planned. Consider removing a block.
        </p>
      )}
    </div>
  );
}

// ─── Main TimelineClient ──────────────────────────────────────────────────────

export function TimelineClient() {
  const today = todayStr();
  const { timeline, loading, addBlock, deleteBlock } = useTimeline(today);
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (data: {
    name: string;
    startMinute: number;
    durationMinutes: number;
    energyZone: EnergyZone;
  }) => {
    try {
      await addBlock({ ...data, habitIds: [], isRestBlock: false });
      setShowAddForm(false);
    } catch {
      setError("Failed to add block");
    }
  };

  const handleStartSession = (block: import("@/types/timeline").Block) => {
    // Navigate to session page with first habit of the block
    if (!block || !block.habitIds.length) return;
    const firstHabitId = block.habitIds[0];
    router.push(
      `/session?habitId=${firstHabitId}&blockId=${block.id}&name=${encodeURIComponent(block.name)}&mins=${block.durationMinutes}`
    );
  };

  const AVAILABLE_MINUTES = 16 * 60; // 16 hours
  const plannedMinutes = timeline?.totalPlannedMinutes ?? 0;

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "8px" }}>
          L2 · Temporal
        </div>
        <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#f4f4f5", margin: "0 0 6px 0" }}>
          Day Planner
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
        </p>
      </div>

      {loading ? (
        <HorseLoader size="lg" label="Loading your timeline..." />
      ) : (
        <>
          <TimeBudgetMeter planned={plannedMinutes} available={AVAILABLE_MINUTES} />

          {/* Error */}
          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "12px 16px", marginBottom: "16px" }}>
              <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Add block form */}
          {showAddForm && (
            <AddBlockForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
          )}

          {/* Blocks list */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "24px" }}>
            {(timeline?.blocks ?? [])
              .slice()
              .sort((a, b) => a.order - b.order || a.startMinute - b.startMinute)
              .map((block) => (
                <BlockCard
                  key={block.id}
                  block={block}
                  onStartSession={handleStartSession as (b: typeof block) => void}
                  onDelete={deleteBlock}
                />
              ))}

            {(timeline?.blocks ?? []).length === 0 && !showAddForm && (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 20px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px dashed rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                }}
              >
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🗓</div>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.3)", margin: "0 0 20px 0" }}>
                  No blocks yet. Build your day.
                </p>
              </div>
            )}
          </div>

          {/* Add block button */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                width: "100%",
                background: "rgba(34,197,94,0.08)",
                border: "1px dashed rgba(34,197,94,0.3)",
                borderRadius: "14px",
                padding: "16px",
                color: "#22c55e",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              + Add Block
            </button>
          )}
        </>
      )}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  maxWidth: "700px",
  margin: "0 auto",
  padding: "40px 24px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "#f4f4f5",
  fontSize: "13px",
  outline: "none",
  fontFamily: "inherit",
  marginBottom: "14px",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  fontWeight: 600,
  color: "rgba(255,255,255,0.35)",
  marginBottom: "5px",
  letterSpacing: "0.05em",
};

const selectStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "8px",
  padding: "8px 10px",
  color: "#f4f4f5",
  fontSize: "12px",
  fontFamily: "inherit",
  outline: "none",
};

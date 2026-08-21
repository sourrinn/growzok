"use client";

import type { Insight, InsightType } from "@/types/reflection";

const TYPE_META: Record<
  InsightType,
  { icon: string; color: string; glow: string; label: string }
> = {
  skip_pattern: {
    icon: "⚠",
    color: "#f59e0b",
    glow: "rgba(245,158,11,0.12)",
    label: "Skip Pattern",
  },
  timing_suggestion: {
    icon: "⏰",
    color: "#3b82f6",
    glow: "rgba(59,130,246,0.12)",
    label: "Timing",
  },
  streak_risk: {
    icon: "🔥",
    color: "#ef4444",
    glow: "rgba(239,68,68,0.12)",
    label: "Streak Risk",
  },
  energy_mismatch: {
    icon: "⚡",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.12)",
    label: "Energy",
  },
  overload_warning: {
    icon: "🛑",
    color: "#f97316",
    glow: "rgba(249,115,22,0.12)",
    label: "Overload",
  },
};

interface InsightCardProps {
  insight: Insight;
  onApply?: (id: string) => void;
  onDismiss?: (id: string) => void;
}

export function InsightCard({ insight, onApply, onDismiss }: InsightCardProps) {
  const meta = TYPE_META[insight.type];
  const isApplied = !!insight.appliedAt;

  return (
    <div
      style={{
        background: isApplied
          ? "rgba(255,255,255,0.02)"
          : meta.glow,
        border: `1px solid ${isApplied ? "rgba(255,255,255,0.06)" : `${meta.color}44`}`,
        borderRadius: "16px",
        padding: "18px",
        backdropFilter: "blur(12px)",
        opacity: isApplied ? 0.5 : 1,
        transition: "all 0.25s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Left accent bar */}
      {!isApplied && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "3px",
            background: meta.color,
            borderRadius: "16px 0 0 16px",
          }}
        />
      )}

      <div style={{ paddingLeft: isApplied ? 0 : "4px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "16px" }}>{meta.icon}</span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: isApplied ? "rgba(255,255,255,0.25)" : meta.color,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            {meta.label}
          </span>
          {isApplied && (
            <span
              style={{
                marginLeft: "auto",
                fontSize: "10px",
                color: "#22c55e",
                fontWeight: 700,
                letterSpacing: "0.06em",
              }}
            >
              Applied
            </span>
          )}
          <span
            style={{
              marginLeft: "auto",
              fontSize: "10px",
              color: "rgba(255,255,255,0.25)",
              fontWeight: 600,
              padding: "2px 7px",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "6px",
              letterSpacing: "0.04em",
            }}
          >
            Targets {insight.targetLayer}
          </span>
        </div>

        {/* Message */}
        <p
          style={{
            fontSize: "13px",
            fontWeight: 600,
            color: isApplied ? "rgba(255,255,255,0.3)" : "#e4e4e7",
            margin: "0 0 5px 0",
            lineHeight: 1.5,
          }}
        >
          {insight.message}
        </p>

        {/* Suggestion */}
        <p
          style={{
            fontSize: "12px",
            color: isApplied ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
            margin: "0 0 14px 0",
            lineHeight: 1.5,
          }}
        >
          {insight.suggestion}
        </p>

        {/* Actions */}
        {!isApplied && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              onClick={() => onApply?.(insight.id)}
              style={{
                background: meta.color,
                border: "none",
                color: "#000",
                fontSize: "11px",
                fontWeight: 800,
                padding: "6px 12px",
                borderRadius: "8px",
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              Apply
            </button>
            <button
              onClick={() => onDismiss?.(insight.id)}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.35)",
                fontSize: "11px",
                fontWeight: 600,
                padding: "6px 10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Snooze 7 days
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

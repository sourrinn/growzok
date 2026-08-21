"use client";

import type { Block, EnergyZone } from "@/types/timeline";

const ZONE_STYLES: Record<
  EnergyZone,
  { bg: string; border: string; text: string; label: string; glow: string }
> = {
  peak: {
    bg: "rgba(234,179,8,0.08)",
    border: "rgba(234,179,8,0.3)",
    text: "#eab308",
    label: "Peak Energy",
    glow: "rgba(234,179,8,0.15)",
  },
  trough: {
    bg: "rgba(99,102,241,0.08)",
    border: "rgba(99,102,241,0.3)",
    text: "#818cf8",
    label: "Trough",
    glow: "rgba(99,102,241,0.1)",
  },
  recovery: {
    bg: "rgba(168,85,247,0.08)",
    border: "rgba(168,85,247,0.3)",
    text: "#c084fc",
    label: "Recovery",
    glow: "rgba(168,85,247,0.1)",
  },
};

interface BlockCardProps {
  block: Block;
  /** Habit name map for rendering habit chips inside the block. */
  habitNames?: Record<string, string>;
  onStartSession?: (block: Block) => void;
  onEdit?: (block: Block) => void;
  onDelete?: (blockId: string) => void;
}

export function BlockCard({
  block,
  habitNames = {},
  onStartSession,
  onEdit,
  onDelete,
}: BlockCardProps) {
  const zone = ZONE_STYLES[block.energyZone];

  if (block.isRestBlock) {
    return (
      <div
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: "12px",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          opacity: 0.6,
        }}
      >
        <span style={{ fontSize: "16px" }}>☕</span>
        <div>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>
            Rest Block
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
            {block.startLabel} – {block.endLabel} · {block.durationMinutes} min
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: zone.bg,
        border: `1px solid ${zone.border}`,
        borderRadius: "16px",
        padding: "18px",
        backdropFilter: "blur(10px)",
        boxShadow: `0 4px 24px ${zone.glow}`,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      className="block-card"
    >
      {/* Time + Zone row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.06em",
          }}
        >
          {block.startLabel} – {block.endLabel}
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            color: zone.text,
            background: zone.bg,
            border: `1px solid ${zone.border}`,
            borderRadius: "999px",
            padding: "2px 8px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {zone.label}
        </span>
      </div>

      {/* Block name */}
      <h4
        style={{
          fontSize: "16px",
          fontWeight: 700,
          color: "#f4f4f5",
          margin: "0 0 10px 0",
        }}
      >
        {block.name}
      </h4>

      {/* Duration chip */}
      <div
        style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.35)",
          marginBottom: "12px",
        }}
      >
        {block.durationMinutes} min
      </div>

      {/* Habit chips */}
      {block.habitIds.length > 0 && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "6px",
            marginBottom: "14px",
          }}
        >
          {block.habitIds.map((hid) => (
            <span
              key={hid}
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "rgba(255,255,255,0.65)",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                padding: "3px 8px",
              }}
            >
              {habitNames[hid] ?? hid.slice(0, 10)}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: "flex", gap: "8px" }}>
        {block.habitIds.length > 0 && (
          <button
            onClick={() => onStartSession?.(block)}
            style={{
              background: zone.text,
              border: "none",
              color: "#000",
              fontSize: "12px",
              fontWeight: 700,
              padding: "7px 14px",
              borderRadius: "9px",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            Start Block
          </button>
        )}
        <button
          onClick={() => onEdit?.(block)}
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.45)",
            fontSize: "11px",
            fontWeight: 600,
            padding: "7px 12px",
            borderRadius: "9px",
            cursor: "pointer",
          }}
        >
          Edit
        </button>
        <button
          onClick={() => onDelete?.(block.id)}
          style={{
            background: "transparent",
            border: "none",
            color: "rgba(255,255,255,0.2)",
            fontSize: "11px",
            padding: "7px 8px",
            borderRadius: "9px",
            cursor: "pointer",
            marginLeft: "auto",
          }}
          title="Remove block"
        >
          ✕
        </button>
      </div>

      <style>{`
        .block-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px ${zone.glow};
        }
      `}</style>
    </div>
  );
}

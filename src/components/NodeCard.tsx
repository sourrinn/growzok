"use client";

import type { Node, NodeKind, NodeStatus } from "@/types/node";

const KIND_STYLES: Record<NodeKind, { bg: string; text: string; label: string }> = {
  Goal: { bg: "rgba(34,197,94,0.15)", text: "#22c55e", label: "Goal" },
  Theme: { bg: "rgba(168,85,247,0.15)", text: "#a855f7", label: "Theme" },
  Project: { bg: "rgba(59,130,246,0.15)", text: "#3b82f6", label: "Project" },
  Question: { bg: "rgba(245,158,11,0.15)", text: "#f59e0b", label: "Question" },
};

const STATUS_LABELS: Record<NodeStatus, string> = {
  draft: "Draft",
  active: "Active",
  scheduled: "Scheduled",
  archived: "Archived",
};

interface NodeCardProps {
  node: Node;
  onEdit?: (node: Node) => void;
  onArchive?: (id: string) => void;
  onSchedule?: (node: Node) => void;
  onStatusChange?: (id: string, status: NodeStatus) => void;
}

export function NodeCard({
  node,
  onEdit,
  onArchive,
  onSchedule,
  onStatusChange,
}: NodeCardProps) {
  const kind = KIND_STYLES[node.kind];
  const isOverdue = node.status === "active" && node.daysInPlanning >= 3;

  return (
    <div
      className={`node-card ${isOverdue ? "node-card--overdue" : ""}`}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: isOverdue
          ? "1px solid rgba(245,158,11,0.5)"
          : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "16px",
        padding: "20px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        backdropFilter: "blur(12px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Overdue glow */}
      {isOverdue && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #f59e0b, #ef4444)",
          }}
        />
      )}

      {/* Header row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "12px" }}>
        {/* Kind badge */}
        <span
          style={{
            background: kind.bg,
            color: kind.text,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            padding: "3px 8px",
            borderRadius: "999px",
            flexShrink: 0,
            marginTop: "2px",
            textTransform: "uppercase",
          }}
        >
          {kind.label}
        </span>

        {/* Priority dots */}
        <div style={{ display: "flex", gap: "3px", marginLeft: "auto", alignItems: "center", paddingTop: "4px" }}>
          {[1, 2, 3, 4, 5].map((p) => (
            <div
              key={p}
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: p <= node.priority ? "#22c55e" : "rgba(255,255,255,0.12)",
                transition: "background 0.2s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <h3
        style={{
          fontSize: "15px",
          fontWeight: 700,
          color: "#f4f4f5",
          margin: "0 0 6px 0",
          lineHeight: 1.4,
        }}
      >
        {node.title}
      </h3>

      {/* Description */}
      {node.description && (
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.45)",
            margin: "0 0 12px 0",
            lineHeight: 1.6,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {node.description}
        </p>
      )}

      {/* Decomposition steps count */}
      {node.decompositionSteps && node.decompositionSteps.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <circle cx="6" cy="6" r="5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
            <path d="M4 6h4M6 4v4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
            {node.decompositionSteps.length} steps
          </span>
        </div>
      )}

      {/* Linked habits */}
      {node.linkedHabitIds.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            marginBottom: "12px",
          }}
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
            <path d="M7.5 4.5 L9 3 A2.12 2.12 0 0 1 12 6 L10.5 7.5" stroke="rgba(100,200,120,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4.5 7.5 L3 9 A2.12 2.12 0 0 1 0 6 L1.5 4.5" stroke="rgba(100,200,120,0.6)" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4.5 7.5 L7.5 4.5" stroke="rgba(100,200,120,0.6)" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span style={{ fontSize: "11px", color: "rgba(100,200,120,0.6)" }}>
            {node.linkedHabitIds.length} habit{node.linkedHabitIds.length !== 1 ? "s" : ""} linked
          </span>
        </div>
      )}

      {/* Planning warning */}
      {isOverdue && (
        <div
          style={{
            background: "rgba(245,158,11,0.12)",
            border: "1px solid rgba(245,158,11,0.25)",
            borderRadius: "8px",
            padding: "8px 10px",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            gap: "7px",
          }}
        >
          <span style={{ fontSize: "13px" }}>⚠</span>
          <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: 600 }}>
            {node.daysInPlanning} days in planning — When will you start?
          </span>
        </div>
      )}

      {/* Action row */}
      <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
        {node.status !== "archived" && (
          <>
            {node.status === "draft" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusChange?.(node.id, "active");
                }}
                style={{
                  background: "rgba(34,197,94,0.15)",
                  border: "1px solid rgba(34,197,94,0.3)",
                  color: "#22c55e",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                Activate
              </button>
            )}
            {(node.status === "active" || node.status === "scheduled") && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSchedule?.(node);
                }}
                style={{
                  background: "rgba(59,130,246,0.15)",
                  border: "1px solid rgba(59,130,246,0.3)",
                  color: "#3b82f6",
                  fontSize: "11px",
                  fontWeight: 700,
                  padding: "5px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                Schedule This
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(node);
              }}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.5)",
                fontSize: "11px",
                fontWeight: 600,
                padding: "5px 10px",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onArchive?.(node.id);
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.2)",
                fontSize: "11px",
                padding: "5px 6px",
                borderRadius: "8px",
                cursor: "pointer",
                marginLeft: "auto",
              }}
              title="Archive node"
            >
              Archive
            </button>
          </>
        )}
      </div>
    </div>
  );
}

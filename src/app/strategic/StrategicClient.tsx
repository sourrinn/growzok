"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNodes } from "@/hooks/useNodes";
import { NodeCard } from "@/components/NodeCard";
import { HorseLoader } from "@/components/HorseLoader";
import type { NodeKind, NodeStatus, Node } from "@/types/node";

const MAX_ACTIVE = 5;
const KIND_OPTIONS: NodeKind[] = ["Goal", "Theme", "Project", "Question"];

// ─── Create Node Modal ────────────────────────────────────────────────────────

function CreateNodeModal({
  onSave,
  onCancel,
  activeCount,
}: {
  onSave: (data: {
    title: string;
    description: string;
    kind: NodeKind;
    priority: number;
    decompositionSteps: string[];
  }) => void;
  onCancel: () => void;
  activeCount: number;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<NodeKind>("Goal");
  const [priority, setPriority] = useState(3);
  const [steps, setSteps] = useState<string[]>([""]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim(),
      kind,
      priority,
      decompositionSteps: steps.filter((s) => s.trim()),
    });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(10px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          background: "rgba(18,18,20,0.98)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          padding: "32px",
          maxWidth: "520px",
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: "#f4f4f5", margin: "0 0 24px 0" }}>
          Create Node
        </h2>

        {activeCount >= MAX_ACTIVE && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "18px",
            }}
          >
            <p style={{ fontSize: "12px", color: "#ef4444", margin: 0, fontWeight: 600 }}>
              You have {MAX_ACTIVE} active nodes. Archive one before activating this.
            </p>
          </div>
        )}

        {/* Kind selector */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Type</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {KIND_OPTIONS.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "10px",
                  border: kind === k ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.08)",
                  background: kind === k ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
                  color: kind === k ? "#f4f4f5" : "rgba(255,255,255,0.35)",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Title</label>
          <input
            placeholder="What do you want to achieve?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={inputStyle}
            autoFocus
          />
        </div>

        {/* Description */}
        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Context (optional)</label>
          <textarea
            placeholder="Why does this matter? What does success look like?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>

        {/* Priority */}
        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>Priority</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[1, 2, 3, 4, 5].map((p) => (
              <button
                key={p}
                onClick={() => setPriority(p)}
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  border: priority === p ? "1px solid #22c55e" : "1px solid rgba(255,255,255,0.08)",
                  background: priority === p ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.03)",
                  color: priority === p ? "#22c55e" : "rgba(255,255,255,0.35)",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Decomposition steps */}
        <div style={{ marginBottom: "24px" }}>
          <label style={labelStyle}>Break it down (optional)</label>
          {steps.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
              <input
                placeholder={`Step ${i + 1}`}
                value={step}
                onChange={(e) => {
                  const next = [...steps];
                  next[i] = e.target.value;
                  setSteps(next);
                }}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
              />
              {i === steps.length - 1 ? (
                <button
                  onClick={() => setSteps([...steps, ""])}
                  style={ghostBtnStyle}
                >
                  +
                </button>
              ) : (
                <button
                  onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                  style={ghostBtnStyle}
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            style={{
              flex: 1,
              background: title.trim() ? "#22c55e" : "rgba(255,255,255,0.08)",
              border: "none",
              color: title.trim() ? "#000" : "rgba(255,255,255,0.2)",
              fontSize: "14px",
              fontWeight: 800,
              padding: "14px",
              borderRadius: "14px",
              cursor: title.trim() ? "pointer" : "not-allowed",
            }}
          >
            Create Node
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.4)",
              fontSize: "14px",
              fontWeight: 600,
              padding: "14px",
              borderRadius: "14px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main StrategicClient ─────────────────────────────────────────────────────

const STATUS_COLS: { status: NodeStatus; label: string; accent: string }[] = [
  { status: "draft", label: "Draft", accent: "rgba(255,255,255,0.25)" },
  { status: "active", label: "Active", accent: "#22c55e" },
  { status: "scheduled", label: "Scheduled", accent: "#3b82f6" },
  { status: "archived", label: "Archived", accent: "rgba(255,255,255,0.15)" },
];

export function StrategicClient() {
  const router = useRouter();
  const { nodes, loading, createNode, updateNode, archiveNode } = useNodes();
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeCount = nodes.filter((n) => n.status === "active").length;

  const handleCreate = async (data: {
    title: string;
    description: string;
    kind: NodeKind;
    priority: number;
    decompositionSteps: string[];
  }) => {
    try {
      await createNode({ ...data, status: "draft" } as Parameters<typeof createNode>[0]);
      setShowCreate(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create node");
    }
  };

  const handleStatusChange = async (id: string, status: NodeStatus) => {
    if (status === "active" && activeCount >= MAX_ACTIVE) {
      setError(`You can only have ${MAX_ACTIVE} active nodes. Archive one first.`);
      return;
    }
    try {
      await updateNode(id, { status });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update node");
    }
  };

  const handleSchedule = (node: Node) => {
    // Mark as scheduled and navigate to timeline
    updateNode(node.id, { status: "scheduled" }).then(() => {
      router.push("/timeline");
    });
  };

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: "8px" }}>
          L1 · Strategic
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: 800, color: "#f4f4f5", margin: "0 0 6px 0" }}>
              Node Board
            </h1>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", margin: 0 }}>
              {activeCount}/{MAX_ACTIVE} active nodes
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              border: "none",
              color: "#000",
              fontSize: "13px",
              fontWeight: 800,
              padding: "12px 20px",
              borderRadius: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(34,197,94,0.25)",
            }}
          >
            + Create Node
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
          <p style={{ fontSize: "12px", color: "#ef4444", margin: 0 }}>{error}</p>
          <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "11px", cursor: "pointer", marginTop: "4px" }}>Dismiss</button>
        </div>
      )}

      {loading ? (
        <HorseLoader size="lg" label="Loading your strategic nodes..." />
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "32px",
          }}
        >
          {STATUS_COLS.filter((col) => col.status !== "archived" || nodes.some((n) => n.status === "archived")).map((col) => {
            const colNodes = nodes.filter((n) => n.status === col.status);
            return (
              <div key={col.status}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: col.accent }} />
                  <span style={{ fontSize: "12px", fontWeight: 700, color: col.accent, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {col.label}
                  </span>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginLeft: "4px" }}>
                    {colNodes.length}
                  </span>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "80px" }}>
                  {colNodes.length === 0 ? (
                    <div style={{ border: "1px dashed rgba(255,255,255,0.06)", borderRadius: "14px", padding: "32px", textAlign: "center" }}>
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.15)", margin: 0 }}>Empty</p>
                    </div>
                  ) : (
                    colNodes.map((node) => (
                      <NodeCard
                        key={node.id}
                        node={node}
                        onStatusChange={handleStatusChange}
                        onArchive={archiveNode}
                        onSchedule={handleSchedule}
                        onEdit={(n) => {
                          // For now navigate to a basic edit flow; can be expanded
                          void n;
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create modal */}
      {showCreate && (
        <CreateNodeModal
          onSave={handleCreate}
          onCancel={() => setShowCreate(false)}
          activeCount={activeCount}
        />
      )}
    </div>
  );
}

const pageStyle: React.CSSProperties = {
  maxWidth: "1200px",
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
  marginBottom: "6px",
  letterSpacing: "0.05em",
  textTransform: "uppercase",
};

const ghostBtnStyle: React.CSSProperties = {
  width: "36px",
  flexShrink: 0,
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.4)",
  fontSize: "14px",
  borderRadius: "8px",
  cursor: "pointer",
};

import type { ObjectId } from "mongodb";

export type NodeKind = "Goal" | "Theme" | "Project" | "Question";
export type NodeStatus = "draft" | "active" | "scheduled" | "archived";

export const NODE_KINDS: NodeKind[] = ["Goal", "Theme", "Project", "Question"];

/** Shape stored in MongoDB. */
export interface NodeDoc {
  _id: ObjectId;
  userId: string;
  title: string;
  description?: string;
  kind: NodeKind;
  status: NodeStatus;
  /** IDs of habits linked to this node */
  linkedHabitIds: string[];
  /** 1 (lowest) – 5 (highest) */
  priority: number;
  /** Optional sub-steps for decomposition */
  decompositionSteps?: string[];
  /** When the node was moved to 'active' status */
  activatedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

/** JSON-safe client shape. */
export interface Node {
  id: string;
  title: string;
  description?: string;
  kind: NodeKind;
  status: NodeStatus;
  linkedHabitIds: string[];
  priority: number;
  decompositionSteps?: string[];
  createdAt: string;
  updatedAt: string;
  /** Computed: calendar days since status became 'active'. 0 if not active. */
  daysInPlanning: number;
}

export function serializeNode(doc: NodeDoc): Node {
  const activatedAt = doc.activatedAt ?? doc.createdAt;
  const daysInPlanning =
    doc.status === "active"
      ? Math.floor(
          (Date.now() - activatedAt.getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    kind: doc.kind,
    status: doc.status,
    linkedHabitIds: doc.linkedHabitIds ?? [],
    priority: doc.priority ?? 3,
    decompositionSteps: doc.decompositionSteps ?? [],
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
    daysInPlanning,
  };
}

import type { ObjectId } from "mongodb";

export type EnergyZone = "peak" | "trough" | "recovery";

export const ENERGY_ZONE_LABELS: Record<EnergyZone, string> = {
  peak: "Peak Energy",
  trough: "Trough",
  recovery: "Recovery",
};

/** A named time block within a day's timeline. */
export interface BlockDoc {
  _id: ObjectId;
  userId: string;
  timelineId: string;
  name: string;
  /** Minutes from midnight (e.g. 480 = 8:00 AM). */
  startMinute: number;
  durationMinutes: number;
  energyZone: EnergyZone;
  /** Ordered list of habit IDs assigned to this block. */
  habitIds: string[];
  /** System-inserted rest blocks are read-only. */
  isRestBlock: boolean;
  /** Display order within the timeline. */
  order: number;
}

/** JSON-safe client shape for a block. */
export interface Block {
  id: string;
  timelineId: string;
  name: string;
  startMinute: number;
  durationMinutes: number;
  energyZone: EnergyZone;
  habitIds: string[];
  isRestBlock: boolean;
  order: number;
  /** Derived: "8:00 AM" */
  startLabel: string;
  /** Derived: "9:30 AM" */
  endLabel: string;
}

export type TimelineStatus = "draft" | "active" | "completed";

/** A day's timeline — the L2 plan container. */
export interface TimelineDoc {
  _id: ObjectId;
  userId: string;
  /** 'YYYY-MM-DD' */
  date: string;
  status: TimelineStatus;
  /** Denormalized sum of block durations in minutes (excluding rest blocks). */
  totalPlannedMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

/** JSON-safe client shape for a timeline (includes populated blocks). */
export interface Timeline {
  id: string;
  date: string;
  status: TimelineStatus;
  totalPlannedMinutes: number;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
}

/** Format minutes-from-midnight to "8:00 AM" */
export function minuteToLabel(minute: number): string {
  const h24 = Math.floor(minute / 60) % 24;
  const m = minute % 60;
  const period = h24 < 12 ? "AM" : "PM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function serializeBlock(doc: BlockDoc): Block {
  return {
    id: doc._id.toString(),
    timelineId: doc.timelineId,
    name: doc.name,
    startMinute: doc.startMinute,
    durationMinutes: doc.durationMinutes,
    energyZone: doc.energyZone,
    habitIds: doc.habitIds ?? [],
    isRestBlock: doc.isRestBlock ?? false,
    order: doc.order,
    startLabel: minuteToLabel(doc.startMinute),
    endLabel: minuteToLabel(doc.startMinute + doc.durationMinutes),
  };
}

export function serializeTimeline(doc: TimelineDoc, blocks: Block[]): Timeline {
  return {
    id: doc._id.toString(),
    date: doc.date,
    status: doc.status,
    totalPlannedMinutes: doc.totalPlannedMinutes,
    blocks,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

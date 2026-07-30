import type { ObjectId } from "mongodb";

/** Shape stored in MongoDB. */
export interface HabitDoc {
  _id: ObjectId;
  /** Owner's user id. Every query is scoped by this. */
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
  /** Completed days as 'YYYY-MM-DD' strings. */
  history: string[];
}

/** Shape sent to the client (JSON-safe). Deliberately omits `userId`. */
export interface Habit {
  id: string;
  name: string;
  color: string;
  createdAt: string;
  history: string[];
}

export function serializeHabit(doc: HabitDoc): Habit {
  return {
    id: doc._id.toString(),
    name: doc.name,
    color: doc.color,
    createdAt: doc.createdAt.toISOString(),
    history: doc.history ?? [],
  };
}

import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import {
  DEFAULT_DOMAIN,
  DEFAULT_USER_LABEL,
  type Habit,
  type HabitCategory,
  type HabitDoc,
  type HabitDomain,
  type HabitFrequency,
  type HabitTarget,
  serializeHabit,
} from "@/types/habit";

const COLLECTION = "habits";

async function collection() {
  const db = await getDb();
  return db.collection<HabitDoc>(COLLECTION);
}

export async function listHabits(userId: string): Promise<Habit[]> {
  const col = await collection();
  const docs = await col.find({ userId }).sort({ createdAt: 1 }).toArray();
  return docs.map(serializeHabit);
}

export async function createHabit(
  userId: string,
  name: string,
  color: string,
  category: HabitCategory,
  frequency: HabitFrequency,
  target: HabitTarget | null = null,
  missAllowance = 0,
  domain: HabitDomain = DEFAULT_DOMAIN,
  userLabel: string = DEFAULT_USER_LABEL
): Promise<Habit> {
  const col = await collection();
  const doc: HabitDoc = {
    _id: new ObjectId(),
    userId,
    name,
    color,
    category,
    userLabel,
    domain,
    frequency,
    missAllowance,
    target,
    progress: {},
    createdAt: new Date(),
    history: [],
    completions: [],
  };
  await col.insertOne(doc);
  return serializeHabit(doc);
}

export async function deleteHabit(userId: string, id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const col = await collection();
  // Scope by userId so a user can only delete their own habit.
  const result = await col.deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount === 1;
}

/**
 * Add the date if missing, remove it if present. Atomic via update pipeline.
 * `completions` (used for completion-time analytics) is kept in sync with
 * `history` in the same pipeline stage.
 */
export async function toggleHabit(
  userId: string,
  id: string,
  date: string
): Promise<Habit | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const wasPresent = { $in: [date, { $ifNull: ["$history", []] }] };
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    [
      {
        $set: {
          history: {
            $cond: [
              wasPresent,
              { $setDifference: [{ $ifNull: ["$history", []] }, [date]] },
              { $concatArrays: [{ $ifNull: ["$history", []] }, [date]] },
            ],
          },
          completions: {
            $cond: [
              wasPresent,
              {
                $filter: {
                  input: { $ifNull: ["$completions", []] },
                  as: "c",
                  cond: { $ne: ["$$c.date", date] },
                },
              },
              {
                $concatArrays: [
                  { $ifNull: ["$completions", []] },
                  [{ date, completedAt: "$$NOW" }],
                ],
              },
            ],
          },
        },
      },
    ],
    { returnDocument: "after" }
  );
  return updated ? serializeHabit(updated) : null;
}

/**
 * Log a numeric value for a target-based habit on a given date. `history`
 * membership is derived from whether the value meets the habit's goal, so
 * every existing streak/success-rate/heatmap consumer keeps working unchanged.
 * Kept as its own atomic operation, separate from the plain toggle above, so
 * binary habits are untouched by this logic.
 */
export async function logProgress(
  userId: string,
  id: string,
  date: string,
  value: number
): Promise<Habit | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const meetsGoal = { $gte: [value, { $ifNull: ["$target.goal", 0] }] };
  const wasPresent = { $in: [date, { $ifNull: ["$history", []] }] };
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    [
      {
        $set: {
          progress: {
            $mergeObjects: [{ $ifNull: ["$progress", {}] }, { [date]: value }],
          },
          history: {
            $cond: [
              meetsGoal,
              {
                $cond: [
                  wasPresent,
                  "$history",
                  { $concatArrays: [{ $ifNull: ["$history", []] }, [date]] },
                ],
              },
              { $setDifference: [{ $ifNull: ["$history", []] }, [date]] },
            ],
          },
          completions: {
            $cond: [
              { $and: [meetsGoal, { $not: [wasPresent] }] },
              {
                $concatArrays: [
                  { $ifNull: ["$completions", []] },
                  [{ date, completedAt: "$$NOW" }],
                ],
              },
              {
                $cond: [
                  meetsGoal,
                  { $ifNull: ["$completions", []] },
                  {
                    $filter: {
                      input: { $ifNull: ["$completions", []] },
                      as: "c",
                      cond: { $ne: ["$$c.date", date] },
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    ],
    { returnDocument: "after" }
  );
  return updated ? serializeHabit(updated) : null;
}

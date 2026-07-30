import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { type Habit, type HabitDoc, serializeHabit } from "@/types/habit";

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
  color: string
): Promise<Habit> {
  const col = await collection();
  const doc: HabitDoc = {
    _id: new ObjectId(),
    userId,
    name,
    color,
    createdAt: new Date(),
    history: [],
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

/** Add the date if missing, remove it if present. Atomic via update pipeline. */
export async function toggleHabit(
  userId: string,
  id: string,
  date: string
): Promise<Habit | null> {
  if (!ObjectId.isValid(id)) return null;
  const col = await collection();
  const updated = await col.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    [
      {
        $set: {
          history: {
            $cond: [
              { $in: [date, { $ifNull: ["$history", []] }] },
              { $setDifference: [{ $ifNull: ["$history", []] }, [date]] },
              { $concatArrays: [{ $ifNull: ["$history", []] }, [date]] },
            ],
          },
        },
      },
    ],
    { returnDocument: "after" }
  );
  return updated ? serializeHabit(updated) : null;
}

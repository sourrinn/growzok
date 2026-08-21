import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { type ExecutionLog, type ExecutionLogDoc, type DerivedMetrics, type LogStatus, serializeExecutionLog } from "@/types/execution_log";
import { type SessionDoc } from "@/types/session";
import { type DailySummary } from "@/types/reflection";

const COLLECTION = "execution_logs";
const HABITS_COLLECTION = "habits";

async function collection() {
  const db = await getDb();
  return db.collection<ExecutionLogDoc>(COLLECTION);
}

export async function createLogFromSession(session: SessionDoc): Promise<ExecutionLog> {
  const col = await collection();
  const dateStr = (session.completedAt || new Date()).toISOString().split('T')[0];
  
  const doc: ExecutionLogDoc = {
    _id: new ObjectId(),
    userId: session.userId,
    habitId: session.habitId,
    sessionId: session._id.toString(),
    date: dateStr,
    status: session.status as LogStatus,
    durationSeconds: session.actualDurationSeconds ?? 0,
    effortRating: session.effortRating,
    note: session.note,
    createdAt: new Date(),
  };

  await col.insertOne(doc);

  if (session.status === "completed") {
    const db = await getDb();
    const hCol = db.collection(HABITS_COLLECTION);
    const date = dateStr;
    const wasPresent = { $in: [date, { $ifNull: ["$history", []] }] };
    await hCol.updateOne(
      { _id: new ObjectId(session.habitId) },
      [
        {
          $set: {
            history: {
              $cond: [
                wasPresent,
                "$history",
                { $concatArrays: [{ $ifNull: ["$history", []] }, [date]] },
              ],
            },
            completions: {
              $cond: [
                wasPresent,
                "$completions",
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
      ]
    );
  }

  return serializeExecutionLog(doc);
}

export async function getLogsForDate(userId: string, date: string): Promise<ExecutionLog[]> {
  const col = await collection();
  const docs = await col.find({ userId, date }).toArray();
  return docs.map(serializeExecutionLog);
}

export async function getLogsForHabit(userId: string, habitId: string): Promise<ExecutionLog[]> {
  const col = await collection();
  const docs = await col.find({ userId, habitId }).sort({ createdAt: -1 }).toArray();
  return docs.map(serializeExecutionLog);
}

export async function computeDerivedMetrics(userId: string): Promise<DerivedMetrics> {
  // Real implementation would aggregate logs. For now we return empty defaults.
  return {
    mostConsistentDay: "Monday",
    mostSkippedHabitId: null,
    avgCompletionHour: 10,
    energyAlignmentScore: 80,
  };
}

export async function getDailySummary(userId: string, date: string): Promise<DailySummary> {
  const logs = await getLogsForDate(userId, date);
  return {
    date,
    totalHabits: logs.length,
    completed: logs.filter(l => l.status === "completed").length,
    skipped: logs.filter(l => l.status === "skipped").length,
    interrupted: logs.filter(l => l.status === "interrupted").length,
    totalActiveMinutes: Math.floor(logs.reduce((acc, l) => acc + l.durationSeconds, 0) / 60),
    headline: "Daily Summary",
  };
}

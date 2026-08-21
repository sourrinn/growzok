import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { generateInsights } from "@/lib/reflections";
import { listHabits } from "@/lib/habits";
import { getLogsForDate } from "@/lib/executionLogs"; // Just an example data pull for the heuristic

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const habits = await listHabits(session.user.id);
  // Real implementation would pull relevant logs. Stubbing logs as empty array here.
  const insights = await generateInsights(session.user.id, habits, []);
  
  return NextResponse.json({ insights }, { status: 201 });
}

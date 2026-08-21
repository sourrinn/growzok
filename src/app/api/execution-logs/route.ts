import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getLogsForDate, getDailySummary } from "@/lib/executionLogs";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  if (!date) return NextResponse.json({ error: "Missing date" }, { status: 400 });

  const logs = await getLogsForDate(session.user.id, date);
  const summary = await getDailySummary(session.user.id, date);
  return NextResponse.json({ logs, summary });
}

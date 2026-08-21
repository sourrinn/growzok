import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrCreateTimeline, updateTimelineStatus } from "@/lib/timelines";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ date: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await params;
  const timeline = await getOrCreateTimeline(session.user.id, date);
  return NextResponse.json({ timeline });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ date: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await params;
  const body = await request.json();
  const timeline = await updateTimelineStatus(session.user.id, date, body.status);
  if (!timeline) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ timeline });
}

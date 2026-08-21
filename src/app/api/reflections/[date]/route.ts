import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOrCreateReflection, saveReflection } from "@/lib/reflections";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ date: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await params;
  const { searchParams } = new URL(request.url);
  const period = (searchParams.get("period") as "daily" | "weekly") || "daily";
  
  const reflection = await getOrCreateReflection(session.user.id, date, period);
  return NextResponse.json({ reflection });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ date: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await params;
  const body = await request.json();
  const reflection = await saveReflection(session.user.id, date, body);
  return NextResponse.json({ reflection });
}

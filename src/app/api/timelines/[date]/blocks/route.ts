import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addBlock } from "@/lib/timelines";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ date: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date } = await params;
  const body = await request.json();
  const block = await addBlock(session.user.id, date, body);
  return NextResponse.json({ block }, { status: 201 });
}

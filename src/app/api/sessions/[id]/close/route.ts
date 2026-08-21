import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { closeSession } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const s = await closeSession(session.user.id, id, body.status, {
    skipReason: body.skipReason,
    interruptReason: body.interruptReason,
    effortRating: body.effortRating,
    note: body.note,
    actualDurationSeconds: body.actualDurationSeconds,
  });
  if (!s) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ session: s });
}

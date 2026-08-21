import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getActiveSession, startSession } from "@/lib/sessions";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const activeSession = await getActiveSession(session.user.id);
  return NextResponse.json({ session: activeSession });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  try {
    const activeSession = await startSession(
      session.user.id,
      body.habitId,
      body.blockId,
      body.timerMode,
      body.plannedDurationSeconds
    );
    return NextResponse.json({ session: activeSession }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}

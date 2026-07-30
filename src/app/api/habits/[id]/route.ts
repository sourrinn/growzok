import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteHabit } from "@/lib/habits";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const ok = await deleteHabit(session.user.id, id);
    if (!ok) {
      return NextResponse.json({ error: "Habit not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/habits/[id]", error);
    return NextResponse.json({ error: "Could not delete habit." }, { status: 500 });
  }
}

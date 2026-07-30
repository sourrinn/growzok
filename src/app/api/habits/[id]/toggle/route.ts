import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { toggleHabit } from "@/lib/habits";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const date = typeof body.date === "string" ? body.date : "";

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: "A valid date (YYYY-MM-DD) is required." },
        { status: 400 }
      );
    }

    const habit = await toggleHabit(session.user.id, id, date);
    if (!habit) {
      return NextResponse.json({ error: "Habit not found." }, { status: 404 });
    }
    return NextResponse.json({ habit });
  } catch (error) {
    console.error("POST /api/habits/[id]/toggle", error);
    return NextResponse.json({ error: "Could not update habit." }, { status: 500 });
  }
}

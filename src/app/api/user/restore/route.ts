import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const habits = body.habits;

    if (!Array.isArray(habits)) {
      return NextResponse.json({ error: "Invalid backup file format" }, { status: 400 });
    }

    const db = await getDb();
    const now = new Date();

    const habitDocs = habits.map((h: any) => ({
      userId: session.user.id,
      name: String(h.name || "Restored Habit"),
      color: String(h.color || "#406852"),
      category: h.category || "General",
      userLabel: h.userLabel || "Personal",
      domain: h.domain || "Productivity",
      isPersonal: true,
      frequency: h.frequency || { type: "daily" },
      history: Array.isArray(h.history) ? h.history : [],
      status: h.status || "active",
      missAllowance: typeof h.missAllowance === "number" ? h.missAllowance : 0,
      createdAt: now,
      updatedAt: now,
    }));

    if (habitDocs.length > 0) {
      await db.collection("habits").insertMany(habitDocs);
    }

    return NextResponse.json({ success: true, count: habitDocs.length });
  } catch (error) {
    return NextResponse.json({ error: "Restore failed" }, { status: 500 });
  }
}

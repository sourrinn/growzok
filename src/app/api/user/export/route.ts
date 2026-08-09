import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listHabits } from "@/lib/habits";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habits = await listHabits(session.user.id);
    const exportData = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      habitsCount: habits.length,
      habits,
    };

    const jsonString = JSON.stringify(exportData, null, 2);
    const filename = `growzok-backup-${session.user.id.slice(-6)}-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    return new NextResponse(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("GET /api/user/export", error);
    return NextResponse.json({ error: "Could not export user data." }, { status: 500 });
  }
}

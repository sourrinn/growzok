import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listHabits } from "@/lib/habits";
import { generateICalFeed } from "@/lib/ical";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized calendar feed access.", { status: 401 });
    }

    const habits = await listHabits(session.user.id);
    const icalContent = generateICalFeed(habits, session.user.name || "Growzok User");

    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `inline; filename="growzok-habits-${session.user.id.slice(-6)}.ics"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    console.error("GET /api/calendar/feed.ics", error);
    return new NextResponse("Could not generate calendar feed", { status: 500 });
  }
}

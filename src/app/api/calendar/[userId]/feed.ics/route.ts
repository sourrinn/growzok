import { NextResponse } from "next/server";
import { listHabits } from "@/lib/habits";
import { getUserById } from "@/lib/users";
import { generateICalFeed } from "@/lib/ical";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    // Clean userId parameter (strip trailing .ics if passed)
    const cleanUserId = userId.replace(/\.ics$/, "");

    const user = await getUserById(cleanUserId);
    if (!user) {
      return new NextResponse("User calendar not found", { status: 404 });
    }

    const habits = await listHabits(cleanUserId);
    const icalContent = generateICalFeed(habits, user.name);

    return new NextResponse(icalContent, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `inline; filename="growzok-habits-${cleanUserId}.ics"`,
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("GET /api/calendar/[userId]/feed.ics", error);
    return new NextResponse("Could not generate calendar feed", { status: 500 });
  }
}

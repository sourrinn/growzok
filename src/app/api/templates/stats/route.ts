import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { HABIT_TEMPLATES } from "@/lib/templates";

export const dynamic = "force-dynamic";

export interface TemplateRealtimeStats {
  templateKey: string;
  activeUsersCount: number;
  completionRatePct: number;
}

export async function GET() {
  try {
    const db = await getDb();
    const habitsCol = db.collection("habits");

    // Aggregate distinct users and completion rates per templateKey
    const results = await habitsCol
      .aggregate<{
        _id: string;
        distinctUsers: string[];
        totalHistory: number;
        totalTrackable: number;
      }>([
        { $match: { templateKey: { $exists: true, $ne: null } } },
        {
          $group: {
            _id: "$templateKey",
            distinctUsers: { $addToSet: "$userId" },
            totalHistory: { $sum: { $size: { $ifNull: ["$history", []] } } },
            totalTrackable: { $sum: { $max: [{ $size: { $ifNull: ["$history", []] } }, 1] } },
          },
        },
      ])
      .toArray();

    const statsMap: Record<string, TemplateRealtimeStats> = {};

    for (const template of HABIT_TEMPLATES) {
      const dbStat = results.find((r) => r._id === template.key);
      const activeUsersCount = dbStat ? dbStat.distinctUsers.length : 0;
      const completionRatePct =
        dbStat && dbStat.totalTrackable > 0
          ? Math.round((dbStat.totalHistory / dbStat.totalTrackable) * 100)
          : 0;

      statsMap[template.key] = {
        templateKey: template.key,
        activeUsersCount,
        completionRatePct,
      };
    }

    return NextResponse.json({ stats: statsMap });
  } catch (error) {
    console.error("GET /api/templates/stats", error);
    return NextResponse.json({ stats: {} }, { status: 500 });
  }
}

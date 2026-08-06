import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "sourinbiswas002@gmail.com";

/**
 * GET /api/admin/catalog/usage
 * Returns a map of { [habitKey]: userCount } showing how many user accounts
 * currently have each catalog habit active in their dashboard.
 * Used by the Admin Portal to render live adoption metrics per habit.
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const db = await getDb();
    const col = db.collection("habits");

    // Aggregate: group by habitKey, count distinct userIds per key
    const pipeline = [
      { $match: { habitKey: { $exists: true, $nin: [null, ""] } } },
      {
        $group: {
          _id: "$habitKey",
          userCount: { $sum: 1 },
        },
      },
    ];

    const results = await col.aggregate(pipeline).toArray();

    const usage: Record<string, number> = {};
    for (const r of results) {
      if (r._id) usage[r._id] = r.userCount;
    }

    return NextResponse.json({ usage });
  } catch (error) {
    console.error("GET /api/admin/catalog/usage", error);
    return NextResponse.json({ usage: {} }, { status: 500 });
  }
}

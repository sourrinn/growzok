import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createHabit } from "@/lib/habits";
import {
  parseCategory,
  parseDomain,
  parseFrequency,
  parseMissAllowance,
  parseTarget,
  parseUserLabel,
} from "@/lib/habitInput";

export const dynamic = "force-dynamic";

// Organic Nature Palette: Forest Pine, Terracotta Clay, Meadow Olive, Warm Ochre, Mineral Blue, Cedar Bark
const PALETTE = ["#2d4a3e", "#b86b53", "#6b8259", "#b38340", "#3a5a6b", "#855b4e"];
const MAX_BULK = 10;

/** Bulk-create habits (used by template adopt / custom template import flows). */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const items = Array.isArray(body.habits) ? body.habits : [];
    if (items.length === 0) {
      return NextResponse.json({ error: "No habits provided." }, { status: 400 });
    }
    if (items.length > MAX_BULK) {
      return NextResponse.json(
        { error: `At most ${MAX_BULK} habits per request.` },
        { status: 400 }
      );
    }

    const habits = await Promise.all(
      items.map((item: unknown) => {
        const v = (typeof item === "object" && item !== null ? item : {}) as Record<
          string,
          unknown
        >;
        const name =
          typeof v.name === "string" ? v.name.trim().slice(0, 60) : "";
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const category = parseCategory(v.category);
        const domain = parseDomain(v.domain);
        // suggestedLabel from template; fall back to category string
        const userLabel = parseUserLabel(v.suggestedLabel ?? v.userLabel ?? v.category);
        const frequency = parseFrequency(v.frequency);
        const target = parseTarget(v.target);
        const missAllowance = parseMissAllowance(v.missAllowance);

        return name
          ? createHabit(
              session.user.id,
              name,
              color,
              category,
              frequency,
              target,
              missAllowance,
              domain,
              userLabel
            )
          : null;
      })
    );

    return NextResponse.json(
      { habits: habits.filter((h) => h !== null) },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/habits/bulk", error);
    return NextResponse.json({ error: "Could not create habits." }, { status: 500 });
  }
}

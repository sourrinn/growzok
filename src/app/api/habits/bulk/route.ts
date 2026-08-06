import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createHabit, listHabits } from "@/lib/habits";
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

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

/** Bulk-create habits with server-side 2-tier duplicate prevention (habitKey + normalized name). */
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const items = Array.isArray(body.habits) ? body.habits : [];
    const templateKey = typeof body.templateKey === "string" ? body.templateKey : undefined;

    if (items.length === 0) {
      return NextResponse.json({ error: "No habits provided." }, { status: 400 });
    }
    if (items.length > MAX_BULK) {
      return NextResponse.json(
        { error: `At most ${MAX_BULK} habits per request.` },
        { status: 400 }
      );
    }

    // Fetch existing user habits for 2-tier duplicate detection
    const existingHabits = await listHabits(session.user.id);
    const existingKeysSet = new Set(
      existingHabits.map((h) => h.habitKey).filter((k): k is string => Boolean(k))
    );
    const existingNamesSet = new Set(existingHabits.map((h) => normalizeName(h.name)));

    const skippedDuplicates: string[] = [];

    const habitsToCreate = items.filter((item: unknown) => {
      const v = (typeof item === "object" && item !== null ? item : {}) as Record<
        string,
        unknown
      >;
      const rawName = typeof v.name === "string" ? v.name.trim().slice(0, 60) : "";
      const habitKey = typeof v.habitKey === "string" ? v.habitKey : undefined;

      if (!rawName) return false;

      const normalized = normalizeName(rawName);

      // Tier 1 Check: habitKey match
      if (habitKey && existingKeysSet.has(habitKey)) {
        skippedDuplicates.push(rawName);
        return false;
      }

      // Tier 2 Check: Normalized name match
      if (existingNamesSet.has(normalized)) {
        skippedDuplicates.push(rawName);
        return false;
      }

      // Add to sets to prevent duplicates within the same bulk payload
      if (habitKey) existingKeysSet.add(habitKey);
      existingNamesSet.add(normalized);
      return true;
    });

    const createdHabits = await Promise.all(
      habitsToCreate.map((item: unknown) => {
        const v = (typeof item === "object" && item !== null ? item : {}) as Record<
          string,
          unknown
        >;
        const name = typeof v.name === "string" ? v.name.trim().slice(0, 60) : "";
        const habitKey = typeof v.habitKey === "string" ? v.habitKey : undefined;
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const category = parseCategory(v.category);
        const domain = parseDomain(v.domain);
        const userLabel = parseUserLabel(v.suggestedLabel ?? v.userLabel ?? v.category);
        const frequency = parseFrequency(v.frequency);
        const target = parseTarget(v.target);
        const missAllowance = parseMissAllowance(v.missAllowance);

        return createHabit(
          session.user.id,
          name,
          color,
          category,
          frequency,
          target,
          missAllowance,
          domain,
          userLabel,
          templateKey,
          habitKey,
          false  // isPersonal — false for all template-adopted habits
        );
      })
    );

    return NextResponse.json(
      { habits: createdHabits, skippedDuplicates },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/habits/bulk", error);
    return NextResponse.json({ error: "Could not create habits." }, { status: 500 });
  }
}

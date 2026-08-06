import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { listHabits, createHabit } from "@/lib/habits";
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

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const habits = await listHabits(session.user.id);
    return NextResponse.json({ habits });
  } catch (error) {
    console.error("GET /api/habits", error);
    return NextResponse.json({ error: "Could not load habits." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (name.length > 60) {
      return NextResponse.json(
        { error: "Name must be 60 characters or fewer." },
        { status: 400 }
      );
    }

    const color =
      typeof body.color === "string" && /^#[0-9a-fA-F]{6}$/.test(body.color)
        ? body.color
        : PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const category = parseCategory(body.category);
    const domain = parseDomain(body.domain);
    const userLabel = parseUserLabel(body.userLabel ?? body.category);
    const frequency = parseFrequency(body.frequency);
    const target = parseTarget(body.target);
    const missAllowance = parseMissAllowance(body.missAllowance);

    const habit = await createHabit(
      session.user.id,
      name,
      color,
      category,
      frequency,
      target,
      missAllowance,
      domain,
      userLabel
    );
    return NextResponse.json({ habit }, { status: 201 });
  } catch (error) {
    console.error("POST /api/habits", error);
    return NextResponse.json({ error: "Could not create habit." }, { status: 500 });
  }
}

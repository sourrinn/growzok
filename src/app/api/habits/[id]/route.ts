import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteHabit, updateHabit } from "@/lib/habits";
import {
  parseDomain,
  parseFrequency,
  parseMissAllowance,
  parseTarget,
  parseUserLabel,
} from "@/lib/habitInput";

export const dynamic = "force-dynamic";

export async function PATCH(
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

    // Build a partial update from whichever fields the client sends
    const patch: Record<string, unknown> = {};

    if (typeof body.name === "string" && body.name.trim()) {
      patch.name = body.name.trim().slice(0, 60);
    }
    if (body.userLabel !== undefined) {
      patch.userLabel = parseUserLabel(body.userLabel);
    }
    if (body.domain !== undefined) {
      patch.domain = parseDomain(body.domain);
    }
    if (body.frequency !== undefined) {
      patch.frequency = parseFrequency(body.frequency);
    }
    if (body.target !== undefined) {
      patch.target = parseTarget(body.target);
    }
    if (body.missAllowance !== undefined) {
      patch.missAllowance = parseMissAllowance(body.missAllowance);
    }

    if (Object.keys(patch).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    const habit = await updateHabit(session.user.id, id, patch);
    if (!habit) {
      return NextResponse.json({ error: "Habit not found." }, { status: 404 });
    }
    return NextResponse.json({ habit });
  } catch (error) {
    console.error("PATCH /api/habits/[id]", error);
    return NextResponse.json({ error: "Could not update habit." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const ok = await deleteHabit(session.user.id, id);
    if (!ok) {
      return NextResponse.json({ error: "Habit not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/habits/[id]", error);
    return NextResponse.json({ error: "Could not delete habit." }, { status: 500 });
  }
}

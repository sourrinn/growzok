import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

/** PATCH /api/habits/[id]/archive — soft-archive (or restore) a habit */
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
    const newStatus = body.status === "archived" ? "archived" : "active";

    const db = await getDb();
    const habitsCollection = db.collection("habits");

    // Build query supporting both ObjectId and string _id formats
    const query = ObjectId.isValid(id)
      ? { _id: new ObjectId(id), userId: session.user.id }
      : { _id: id as unknown as ObjectId, userId: session.user.id };

    const result = await habitsCollection.updateOne(query, {
      $set: { status: newStatus, updatedAt: new Date() },
    });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Habit not found." }, { status: 404 });
    }

    return NextResponse.json({ ok: true, status: newStatus });
  } catch (error) {
    console.error("PATCH /api/habits/[id]/archive", error);
    return NextResponse.json({ error: "Could not update habit status." }, { status: 500 });
  }
}

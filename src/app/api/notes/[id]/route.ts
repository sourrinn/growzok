import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteRoughNote, updateRoughNote, updateRoughNoteStatus } from "@/lib/notes";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { content, status } = body;

    let updatedNote = null;

    if (content !== undefined) {
      updatedNote = await updateRoughNote(session.user.id, id, content);
    }

    if (status !== undefined) {
      updatedNote = await updateRoughNoteStatus(session.user.id, id, status);
    }

    if (!updatedNote) {
      return NextResponse.json({ error: "Note not found or not updated" }, { status: 404 });
    }

    return NextResponse.json({ note: updatedNote });
  } catch (error) {
    console.error("PATCH /api/notes/[id] error:", error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const success = await deleteRoughNote(session.user.id, id);

    if (!success) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/notes/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}

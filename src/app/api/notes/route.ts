import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createNote, listNotes } from "@/lib/notes";
import type { NoteStatus } from "@/types/note";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") as NoteStatus | null;
    const search = searchParams.get("search") || undefined;
    const tag = searchParams.get("tag") || undefined;

    const notes = await listNotes(session.user.id, {
      status: statusParam || "active",
      search,
      tag,
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("GET /api/notes error:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { content, title, tags } = body;

    if (!content || typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const note = await createNote(session.user.id, { content, title, tags });
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes error:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}

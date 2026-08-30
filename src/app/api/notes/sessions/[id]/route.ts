import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteSession, getSession, updateSession } from "@/lib/notes";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const sessionData = await getSession(session.user.id, id);

    if (!sessionData) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session: sessionData });
  } catch (error) {
    console.error("GET /api/notes/sessions/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }
}

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
    const { title, isPinned, status } = body;

    const updatedSession = await updateSession(session.user.id, id, {
      title,
      isPinned,
      status,
    });

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found or not updated" }, { status: 404 });
    }

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("PATCH /api/notes/sessions/[id] error:", error);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
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
    const success = await deleteSession(session.user.id, id);

    if (!success) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/notes/sessions/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete session" }, { status: 500 });
  }
}

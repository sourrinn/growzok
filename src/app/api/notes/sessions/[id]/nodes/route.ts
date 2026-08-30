import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addNodeToSession, deleteNodeFromSession, updateNodeInSession } from "@/lib/notes";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: sessionId } = await params;
    const body = await req.json();
    const { category, title, content, mediaUrl, position, metadata } = body;

    const updatedSession = await addNodeToSession(session.user.id, sessionId, {
      category: category || "optimistic",
      title: title || "",
      content: content || "",
      mediaUrl: mediaUrl || "",
      metadata: metadata || {},
      position: position || { x: 100, y: 100 },
    });

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session: updatedSession }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes/sessions/[id]/nodes error:", error);
    return NextResponse.json({ error: "Failed to add node" }, { status: 500 });
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

    const { id: sessionId } = await params;
    const body = await req.json();
    const { nodeId, ...patch } = body;

    if (!nodeId) {
      return NextResponse.json({ error: "nodeId is required" }, { status: 400 });
    }

    const updatedSession = await updateNodeInSession(session.user.id, sessionId, nodeId, patch);

    if (!updatedSession) {
      return NextResponse.json({ error: "Session or node not found" }, { status: 404 });
    }

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("PATCH /api/notes/sessions/[id]/nodes error:", error);
    return NextResponse.json({ error: "Failed to update node" }, { status: 500 });
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

    const { id: sessionId } = await params;
    const { searchParams } = new URL(req.url);
    const nodeId = searchParams.get("nodeId");

    if (!nodeId) {
      return NextResponse.json({ error: "nodeId param is required" }, { status: 400 });
    }

    const updatedSession = await deleteNodeFromSession(session.user.id, sessionId, nodeId);

    if (!updatedSession) {
      return NextResponse.json({ error: "Session or node not found" }, { status: 404 });
    }

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("DELETE /api/notes/sessions/[id]/nodes error:", error);
    return NextResponse.json({ error: "Failed to delete node" }, { status: 500 });
  }
}

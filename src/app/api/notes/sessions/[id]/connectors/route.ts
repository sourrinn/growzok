import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { addConnectorToSession, deleteConnectorFromSession } from "@/lib/notes";

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
    const { fromNodeId, toNodeId, label, color } = body;

    if (!fromNodeId || !toNodeId) {
      return NextResponse.json({ error: "fromNodeId and toNodeId are required" }, { status: 400 });
    }

    const updatedSession = await addConnectorToSession(session.user.id, sessionId, {
      fromNodeId,
      toNodeId,
      label: label || "",
      color: color || "#406852",
    });

    if (!updatedSession) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    return NextResponse.json({ session: updatedSession }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes/sessions/[id]/connectors error:", error);
    return NextResponse.json({ error: "Failed to add connector" }, { status: 500 });
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
    const connectorId = searchParams.get("connectorId");

    if (!connectorId) {
      return NextResponse.json({ error: "connectorId param is required" }, { status: 400 });
    }

    const updatedSession = await deleteConnectorFromSession(session.user.id, sessionId, connectorId);

    if (!updatedSession) {
      return NextResponse.json({ error: "Session or connector not found" }, { status: 404 });
    }

    return NextResponse.json({ session: updatedSession });
  } catch (error) {
    console.error("DELETE /api/notes/sessions/[id]/connectors error:", error);
    return NextResponse.json({ error: "Failed to delete connector" }, { status: 500 });
  }
}

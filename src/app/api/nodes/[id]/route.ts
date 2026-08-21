import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateNode, archiveNode } from "@/lib/nodes";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const node = await updateNode(session.user.id, id, body);
  if (!node) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ node });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const success = await archiveNode(session.user.id, id);
  if (!success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}

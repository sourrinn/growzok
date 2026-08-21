import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { updateBlock, deleteBlock } from "@/lib/timelines";

export const dynamic = "force-dynamic";

export async function PATCH(request: Request, { params }: { params: Promise<{ date: string, blockId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { blockId } = await params;
  const body = await request.json();
  const block = await updateBlock(session.user.id, blockId, body);
  if (!block) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ block });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ date: string, blockId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { blockId } = await params;
  const success = await deleteBlock(session.user.id, blockId);
  if (!success) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}

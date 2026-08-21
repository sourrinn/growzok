import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getNodes, createNode } from "@/lib/nodes";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as any;
  const nodes = await getNodes(session.user.id, status || undefined);
  return NextResponse.json({ nodes });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.title || !body.kind) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const node = await createNode(session.user.id, body);
  return NextResponse.json({ node }, { status: 201 });
}

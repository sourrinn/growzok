import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getInsights } from "@/lib/reflections";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const insights = await getInsights(session.user.id);
  return NextResponse.json({ insights });
}

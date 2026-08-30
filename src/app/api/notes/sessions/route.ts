import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createSession, listSessions } from "@/lib/notes";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get("status") as "active" | "archived" | null;
    const search = searchParams.get("search") || undefined;

    const sessionsList = await listSessions(session.user.id, {
      status: statusParam || "active",
      search,
    });

    return NextResponse.json({ sessions: sessionsList });
  } catch (error) {
    console.error("GET /api/notes/sessions error:", error);
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, initialContent } = body;

    const newSession = await createSession(session.user.id, title, initialContent);
    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes/sessions error:", error);
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 });
  }
}

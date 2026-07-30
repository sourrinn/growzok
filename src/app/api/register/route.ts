import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "@/lib/users";
import { hashPassword, MAX_PASSWORD_LENGTH } from "@/lib/password";
import { EmailTakenError } from "@/types/user";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.toLowerCase().trim() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (name.length > 60) {
      return NextResponse.json(
        { error: "Name must be 60 characters or fewer." },
        { status: 400 }
      );
    }
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 }
      );
    }
    if (password.length < MIN_PASSWORD) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD} characters.` },
        { status: 400 }
      );
    }
    if (password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be ${MAX_PASSWORD_LENGTH} characters or fewer.` },
        { status: 400 }
      );
    }

    // Fast path for the common case; createUser() is the race-safe backstop.
    if (await getUserByEmail(email)) {
      return NextResponse.json(
        { error: "That email is already registered." },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);
    try {
      await createUser({ email, name, passwordHash });
    } catch (err) {
      if (err instanceof EmailTakenError) {
        return NextResponse.json(
          { error: "That email is already registered." },
          { status: 409 }
        );
      }
      throw err;
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/register", error);
    return NextResponse.json(
      { error: "Could not create your account." },
      { status: 500 }
    );
  }
}

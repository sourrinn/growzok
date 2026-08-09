import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { HABIT_DOMAINS } from "@/types/habit";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const col = db.collection("domains");
    const customDocs = await col.find({}).toArray();

    // Map default static domains
    const defaultList = HABIT_DOMAINS.map((name) => ({
      key: name,
      name,
      isSystemDefault: true,
      description: "Platform core biological domain",
    }));

    // Merge custom domains from DB
    const customList = customDocs.map((doc) => ({
      key: doc.key || doc.name,
      name: doc.name,
      isSystemDefault: Boolean(doc.isSystemDefault),
      description: doc.description || "Custom biological domain",
    }));

    const existingNames = new Set(customList.map((d) => d.name));
    const merged = [
      ...customList,
      ...defaultList.filter((d) => !existingNames.has(d.name)),
    ];

    return NextResponse.json({ domains: merged });
  } catch (err) {
    console.error("GET /api/admin/domains failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch biological domains." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Domain name is required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection("domains");

    // Check if domain already exists
    const existing = await col.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing || HABIT_DOMAINS.includes(name as any)) {
      return NextResponse.json(
        { error: `Domain "${name}" already exists.` },
        { status: 409 }
      );
    }

    const newDoc = {
      key: name,
      name,
      description: description || "Custom biological domain",
      isSystemDefault: false,
      createdAt: new Date(),
    };

    await col.insertOne(newDoc);
    return NextResponse.json({ domain: newDoc }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/domains failed:", err);
    return NextResponse.json(
      { error: "Failed to create domain." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      { error: "Missing domain 'name' query parameter." },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();

    // Verify 0 dependencies before deletion
    const userHabitsCount = await db.collection("habits").countDocuments({ domain: name });
    const catalogCount = await db.collection("catalog").countDocuments({ domain: name });
    const templatesCount = await db.collection("custom_templates").countDocuments({
      "habits.domain": name,
    });

    const totalDependencies = userHabitsCount + catalogCount + templatesCount;

    if (totalDependencies > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete domain "${name}". It has ${totalDependencies} active dependency reference(s).`,
          totalDependencies,
        },
        { status: 409 }
      );
    }

    await db.collection("domains").deleteOne({ name });
    return NextResponse.json({ success: true, message: `Domain "${name}" deleted.` });
  } catch (err) {
    console.error("DELETE /api/admin/domains failed:", err);
    return NextResponse.json(
      { error: "Failed to delete domain." },
      { status: 500 }
    );
  }
}

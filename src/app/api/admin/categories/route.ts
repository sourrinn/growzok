import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";

const DEFAULT_CATEGORIES = [
  "Morning Routine",
  "Sleep & Rest",
  "Nutrition & Hydration",
  "Fitness & Movement",
  "Productivity & Focus",
  "Digital Detox",
  "Financial Hygiene",
  "Evening Wind-Down",
  "Developer & Career",
  "Mindset & Wellbeing",
];

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();
    const col = db.collection("categories");
    const customDocs = await col.find({}).toArray();

    // Map default static categories
    const defaultList = DEFAULT_CATEGORIES.map((name: string) => ({
      key: name,
      name,
      isSystemDefault: true,
      description: "Platform core protocol category",
    }));

    // Merge custom categories from DB
    const customList = customDocs.map((doc) => ({
      key: doc.key || doc.name,
      name: doc.name,
      isSystemDefault: Boolean(doc.isSystemDefault),
      description: doc.description || "Custom protocol category",
    }));

    const existingNames = new Set(customList.map((c) => c.name));
    const merged = [
      ...customList,
      ...defaultList.filter((c: any) => !existingNames.has(c.name)),
    ];

    return NextResponse.json({ categories: merged });
  } catch (err) {
    console.error("GET /api/admin/categories failed:", err);
    return NextResponse.json(
      { error: "Failed to fetch protocol categories." },
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
        { error: "Category name is required." },
        { status: 400 }
      );
    }

    const db = await getDb();
    const col = db.collection("categories");

    // Check if category already exists
    const existing = await col.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing || DEFAULT_CATEGORIES.includes(name)) {
      return NextResponse.json(
        { error: `Category "${name}" already exists.` },
        { status: 409 }
      );
    }

    const newDoc = {
      key: name,
      name,
      description: description || "Custom protocol category",
      isSystemDefault: false,
      createdAt: new Date(),
    };

    await col.insertOne(newDoc);
    return NextResponse.json({ category: newDoc }, { status: 201 });
  } catch (err) {
    console.error("POST /api/admin/categories failed:", err);
    return NextResponse.json(
      { error: "Failed to create category." },
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
      { error: "Missing category 'name' query parameter." },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();

    // Verify 0 dependencies before deletion
    const templatesCount = await db.collection("custom_templates").countDocuments({
      category: name,
    });

    if (templatesCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete category "${name}". It is assigned to ${templatesCount} protocol template(s).`,
          totalDependencies: templatesCount,
        },
        { status: 409 }
      );
    }

    await db.collection("categories").deleteOne({ name });
    return NextResponse.json({ success: true, message: `Category "${name}" deleted.` });
  } catch (err) {
    console.error("DELETE /api/admin/categories failed:", err);
    return NextResponse.json(
      { error: "Failed to delete category." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const col = db.collection("custom_templates");
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    const templates = docs.map((d) => ({
      id: d._id.toString(),
      key: d.key,
      slug: d.slug || d.key,
      name: d.name,
      tagline: d.tagline,
      description: d.description || "",
      overviewMarkdown: d.overviewMarkdown || "",
      category: d.category,
      difficulty: d.difficulty || "Intermediate",
      estimatedDailyMinutes: d.estimatedDailyMinutes || 30,
      author: d.author || { name: "Org Admin", role: "Custom Protocol", verified: true },
      tags: d.tags || [],
      habits: d.habits || [],
      createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
    }));
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("GET /api/admin/templates", error);
    return NextResponse.json({ templates: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, tagline, description, overviewMarkdown, category, difficulty, estimatedDailyMinutes, authorName, authorRole, tags, habits } = body;

    if (!name || !tagline || !category) {
      return NextResponse.json({ error: "Name, tagline, and category are required." }, { status: 400 });
    }

    const key = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);
    const db = await getDb();
    const col = db.collection("custom_templates");

    const doc = {
      _id: new ObjectId(),
      key,
      slug: key,
      name: name.trim(),
      tagline: tagline.trim(),
      description: (description || tagline).trim(),
      overviewMarkdown: (overviewMarkdown || "").trim(),
      category,
      difficulty: difficulty || "Intermediate",
      estimatedDailyMinutes: Number(estimatedDailyMinutes) || 20,
      rating: 0,
      reviewsCount: 0,
      activeUsersCount: 0,
      completionRatePct: 0,
      author: {
        name: (authorName || "Org Admin").trim(),
        role: (authorRole || "Organization Protocol").trim(),
        verified: true,
      },
      tags: Array.isArray(tags) ? tags : [],
      habits: Array.isArray(habits) ? habits : [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await col.insertOne(doc);

    return NextResponse.json({
      template: {
        ...doc,
        id: doc._id.toString(),
        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/templates", error);
    return NextResponse.json({ error: "Could not create template." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid template ID." }, { status: 400 });
    }

    const db = await getDb();
    const col = db.collection("custom_templates");
    await col.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/templates", error);
    return NextResponse.json({ error: "Could not delete template." }, { status: 500 });
  }
}

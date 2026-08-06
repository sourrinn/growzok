import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getDb();
    const col = db.collection("custom_catalog_habits");
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();
    const catalog = docs.map((d) => ({
      id: d._id.toString(),
      habitKey: d.habitKey,
      name: d.name,
      domain: d.domain,
      suggestedLabel: d.suggestedLabel || "Health",
      defaultFrequency: d.defaultFrequency || { type: "daily" },
      defaultTarget: d.defaultTarget || null,
      timeOfDay: d.timeOfDay || "Anytime",
      description: d.description || "",
      createdAt: d.createdAt ? d.createdAt.toISOString() : new Date().toISOString(),
    }));
    return NextResponse.json({ catalog });
  } catch (error) {
    console.error("GET /api/admin/catalog", error);
    return NextResponse.json({ catalog: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, domain, suggestedLabel, timeOfDay, description, targetGoal, targetUnit, targetType } = body;

    if (!name || !domain) {
      return NextResponse.json({ error: "Name and domain are required." }, { status: 400 });
    }

    const habitKey = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const db = await getDb();
    const col = db.collection("custom_catalog_habits");

    const target = targetGoal && Number(targetGoal) > 0 ? {
      type: targetType || "count",
      goal: Number(targetGoal),
      unit: targetUnit || "units",
    } : null;

    const doc = {
      _id: new ObjectId(),
      habitKey,
      name: name.trim(),
      domain,
      suggestedLabel: (suggestedLabel || "Health").trim(),
      defaultFrequency: { type: "daily" },
      defaultTarget: target,
      timeOfDay: timeOfDay || "Anytime",
      description: (description || "").trim(),
      createdAt: new Date(),
    };

    await col.insertOne(doc);

    return NextResponse.json({
      habit: {
        ...doc,
        id: doc._id.toString(),
        createdAt: doc.createdAt.toISOString(),
      },
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/catalog", error);
    return NextResponse.json({ error: "Could not create catalog habit." }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid catalog habit ID." }, { status: 400 });
    }

    const db = await getDb();
    const col = db.collection("custom_catalog_habits");
    await col.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/catalog", error);
    return NextResponse.json({ error: "Could not delete catalog habit." }, { status: 500 });
  }
}

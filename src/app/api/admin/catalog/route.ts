import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { HABIT_TEMPLATES } from "@/lib/templates";

export const dynamic = "force-dynamic";

const ADMIN_EMAIL = "sourinbiswas002@gmail.com";

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
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
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
    if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Forbidden: Admin access required." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid catalog habit ID." }, { status: 400 });
    }

    const db = await getDb();
    const catalogCol = db.collection("custom_catalog_habits");
    const habitDoc = await catalogCol.findOne({ _id: new ObjectId(id) });
    if (!habitDoc) {
      return NextResponse.json({ error: "Catalog habit not found." }, { status: 404 });
    }

    const habitKey = habitDoc.habitKey;
    const habitName = habitDoc.name.trim().toLowerCase();

    // Check 1: Static HABIT_TEMPLATES
    const matchingStaticTemplate = HABIT_TEMPLATES.find((t) =>
      t.habits.some((h) => h.habitKey === habitKey || h.name.trim().toLowerCase() === habitName)
    );

    if (matchingStaticTemplate) {
      return NextResponse.json(
        {
          error: `Cannot delete habit "${habitDoc.name}": It is included in active template "${matchingStaticTemplate.name}". Remove it from that template protocol first.`,
        },
        { status: 400 }
      );
    }

    // Check 2: MongoDB custom_templates
    const templatesCol = db.collection("custom_templates");
    const matchingCustomTemplate = await templatesCol.findOne({
      habits: {
        $elemMatch: {
          $or: [
            { habitKey },
            { name: { $regex: new RegExp(`^${habitName}$`, "i") } },
          ],
        },
      },
    });

    if (matchingCustomTemplate) {
      return NextResponse.json(
        {
          error: `Cannot delete habit "${habitDoc.name}": It is included in custom template "${matchingCustomTemplate.name}". Remove it from that template protocol first.`,
        },
        { status: 400 }
      );
    }

    // Check 3: Active user habits — block if any user has this habitKey in their habits collection
    const habitsCol = db.collection("habits");
    const activeUserCount = await habitsCol.countDocuments({ habitKey });

    if (activeUserCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete habit "${habitDoc.name}": ${activeUserCount} user${activeUserCount === 1 ? "" : "s"} currently ${activeUserCount === 1 ? "has" : "have"} this habit active in their dashboard. Users must remove it from their account first.`,
        },
        { status: 400 }
      );
    }

    await catalogCol.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/admin/catalog", error);
    return NextResponse.json({ error: "Could not delete catalog habit." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); // "domain" | "category" | "catalog" | "template"
  const key = searchParams.get("key");

  if (!type || !key) {
    return NextResponse.json(
      { error: "Missing required query parameters 'type' or 'key'." },
      { status: 400 }
    );
  }

  try {
    const db = await getDb();
    const habitsCol = db.collection("habits");
    const templatesCol = db.collection("custom_templates");
    const catalogCol = db.collection("catalog");

    let totalDependencies = 0;
    const breakdown: { label: string; count: number }[] = [];

    if (type === "domain") {
      // Check active user habits
      const userHabitsCount = await habitsCol.countDocuments({ domain: key });
      if (userHabitsCount > 0) {
        breakdown.push({ label: "Active User Habits", count: userHabitsCount });
        totalDependencies += userHabitsCount;
      }

      // Check Master Catalog habits
      const catalogCount = await catalogCol.countDocuments({ domain: key });
      if (catalogCount > 0) {
        breakdown.push({ label: "Master Catalog Habits", count: catalogCount });
        totalDependencies += catalogCount;
      }

      // Check Protocol Templates
      const templatesCount = await templatesCol.countDocuments({
        "habits.domain": key,
      });
      if (templatesCount > 0) {
        breakdown.push({ label: "Protocol Templates", count: templatesCount });
        totalDependencies += templatesCount;
      }
    } else if (type === "category") {
      // Check Protocol Templates
      const templatesCount = await templatesCol.countDocuments({ category: key });
      if (templatesCount > 0) {
        breakdown.push({ label: "Protocol Templates", count: templatesCount });
        totalDependencies += templatesCount;
      }
    } else if (type === "catalog") {
      // Check active user habits with matching habitKey or name
      const userHabitsCount = await habitsCol.countDocuments({
        $or: [
          { habitKey: key },
          { name: { $regex: new RegExp(`^${key}$`, "i") } },
        ],
      });
      if (userHabitsCount > 0) {
        breakdown.push({ label: "Active User Habits", count: userHabitsCount });
        totalDependencies += userHabitsCount;
      }

      // Check Protocol Templates referencing this habitKey
      const templatesCount = await templatesCol.countDocuments({
        "habits.habitKey": key,
      });
      if (templatesCount > 0) {
        breakdown.push({ label: "Protocol Templates", count: templatesCount });
        totalDependencies += templatesCount;
      }
    } else if (type === "template") {
      // Check active user habits adapted from this templateKey
      const userHabitsCount = await habitsCol.countDocuments({
        templateKey: key,
      });
      if (userHabitsCount > 0) {
        breakdown.push({ label: "Adapted User Habits", count: userHabitsCount });
        totalDependencies += userHabitsCount;
      }
    } else {
      return NextResponse.json(
        { error: "Invalid dependency check type." },
        { status: 400 }
      );
    }

    const canDelete = totalDependencies === 0;
    const message = canDelete
      ? `0 active dependencies found for "${key}". Safe to delete.`
      : `Cannot delete "${key}". It is currently referenced by ${totalDependencies} active item(s) in the system.`;

    return NextResponse.json({
      canDelete,
      totalDependencies,
      breakdown,
      message,
    });
  } catch (err) {
    console.error("Dependency check failed:", err);
    return NextResponse.json(
      { error: "Failed to perform dependency pre-flight check." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getDb } from "@/lib/mongodb";
import { HABIT_DOMAINS, type HabitDomain } from "@/types/habit";
import { MASTER_HABIT_CATALOG } from "@/lib/habitCatalog";
import { STANDARD_PROTOCOLS } from "@/lib/protocols";

export const dynamic = "force-dynamic";

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

// Helper to normalize domain strings to official HABIT_DOMAINS casing
function normalizeDomain(d: string): HabitDomain | null {
  if (!d) return null;
  const clean = d.trim().toLowerCase();
  for (const official of HABIT_DOMAINS) {
    if (official.toLowerCase() === clean) return official;
  }
  return null;
}

export async function POST() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = await getDb();

    // PHASE 1: PURGE OUTDATED & LEGACY DATA
    let outdatedRecordsPurged = 0;

    // 1. Drop or clear obsolete legacy "catalog" collection if exists
    try {
      const legacyCatalogCol = db.collection("catalog");
      const legacyCount = await legacyCatalogCol.countDocuments();
      if (legacyCount > 0) {
        await legacyCatalogCol.deleteMany({});
        outdatedRecordsPurged += legacyCount;
      }
    } catch {}

    // 2. Delete custom_catalog_habits with missing/invalid habitKey or empty name
    const catalogCol = db.collection("custom_catalog_habits");
    const badCatalogResult = await catalogCol.deleteMany({
      $or: [
        { habitKey: { $exists: false } },
        { habitKey: "" },
        { name: { $exists: false } },
        { name: "" },
      ],
    });
    outdatedRecordsPurged += badCatalogResult.deletedCount || 0;

    // 3. Delete custom_templates with invalid structure
    const templatesCol = db.collection("custom_templates");
    const badTemplatesResult = await templatesCol.deleteMany({
      $or: [
        { name: { $exists: false } },
        { name: "" },
        { category: { $exists: false } },
      ],
    });
    outdatedRecordsPurged += badTemplatesResult.deletedCount || 0;

    // PHASE 2: SEED / UPSERT BIOLOGICAL DOMAINS & CATEGORIES
    const domainsCol = db.collection("domains");
    let domainsSynced = 0;
    for (const domainName of HABIT_DOMAINS) {
      await domainsCol.updateOne(
        { name: domainName },
        {
          $set: {
            key: domainName,
            name: domainName,
            isSystemDefault: true,
            description: `Core biological domain for ${domainName.toLowerCase()} tracking`,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      domainsSynced++;
    }

    const categoriesCol = db.collection("categories");
    let categoriesSynced = 0;
    for (const catName of DEFAULT_CATEGORIES) {
      await categoriesCol.updateOne(
        { name: catName },
        {
          $set: {
            key: catName,
            name: catName,
            isSystemDefault: true,
            description: `Core protocol category for ${catName.toLowerCase()}`,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      categoriesSynced++;
    }

    // PHASE 3: SEED / UPSERT MASTER HABIT CATALOG
    let catalogHabitsUpserted = 0;
    for (const def of Object.values(MASTER_HABIT_CATALOG)) {
      await catalogCol.updateOne(
        { habitKey: def.habitKey },
        {
          $set: {
            habitKey: def.habitKey,
            name: def.name,
            domain: def.domain,
            suggestedLabel: def.suggestedLabel,
            defaultFrequency: def.defaultFrequency,
            defaultTarget: def.defaultTarget || null,
            timeOfDay: def.timeOfDay || "Anytime",
            description: def.description || "",
            isSystemDefault: true,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      catalogHabitsUpserted++;
    }

    // PHASE 4: SEED / UPSERT STANDARD PROTOCOLS
    let protocolsUpserted = 0;
    for (const p of STANDARD_PROTOCOLS) {
      await templatesCol.updateOne(
        { key: p.key },
        {
          $set: {
            key: p.key,
            slug: p.slug,
            name: p.name,
            tagline: p.tagline,
            description: p.description,
            overviewMarkdown: p.overviewMarkdown,
            category: p.category,
            difficulty: p.difficulty,
            estimatedDailyMinutes: p.estimatedDailyMinutes,
            durationDays: p.durationDays || 30,
            rating: p.rating || 0,
            reviewsCount: p.reviewsCount || 0,
            activeUsersCount: p.activeUsersCount || 0,
            completionRatePct: p.completionRatePct || 0,
            author: p.author,
            tags: p.tags,
            habits: p.habits,
            isSystemDefault: true,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true }
      );
      protocolsUpserted++;
    }

    // PHASE 5: MIGRATE & NORMALIZE USER DASHBOARD HABITS
    const habitsCol = db.collection("habits");
    const userHabits = await habitsCol.find({}).toArray();
    let userHabitsMigrated = 0;

    for (const habit of userHabits) {
      const normalizedDomain = normalizeDomain(habit.domain);
      let needsUpdate = false;
      const updatePayload: Record<string, any> = {};

      if (normalizedDomain && normalizedDomain !== habit.domain) {
        updatePayload.domain = normalizedDomain;
        needsUpdate = true;
      }

      if (!habit.userLabel && habit.category) {
        updatePayload.userLabel = habit.category;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await habitsCol.updateOne({ _id: habit._id }, { $set: updatePayload });
        userHabitsMigrated++;
      }
    }

    return NextResponse.json({
      success: true,
      message: "System data synchronized successfully with latest specification.",
      summary: {
        domainsSynced,
        categoriesSynced,
        catalogHabitsUpserted,
        protocolsUpserted,
        userHabitsMigrated,
        outdatedRecordsPurged,
      },
    });
  } catch (error) {
    console.error("POST /api/admin/system/sync failed:", error);
    return NextResponse.json(
      { error: "Failed to synchronize system data." },
      { status: 500 }
    );
  }
}

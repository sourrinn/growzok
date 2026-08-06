"use client";

import { useEffect, useState } from "react";
import { HABIT_DOMAINS, type HabitDomain } from "@/types/habit";
import type { TemplateCategory, TemplateDifficulty } from "@/types/template";
import { MASTER_HABIT_CATALOG } from "@/lib/habitCatalog";

const CATEGORIES: TemplateCategory[] = [
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

const DIFFICULTIES: TemplateDifficulty[] = ["Beginner", "Intermediate", "Advanced"];

export default function AdminPortalView() {
  const [activeTab, setActiveTab] = useState<"templates" | "catalog">("templates");

  // State for Custom Templates
  const [templates, setTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);

  // Template Form State
  const [tName, setTName] = useState("");
  const [tTagline, setTTagline] = useState("");
  const [tOverview, setTOverview] = useState("");
  const [tCategory, setTCategory] = useState<TemplateCategory>("Morning Routine");
  const [tDifficulty, setTDifficulty] = useState<TemplateDifficulty>("Intermediate");
  const [tMinutes, setTMinutes] = useState(20);
  const [tAuthorName, setTAuthorName] = useState("Org Performance Lab");
  const [tAuthorRole, setTAuthorRole] = useState("Lead Specialist");
  const [tTags, setTTags] = useState("Morning, Focus, Health");
  const [tSelectedHabits, setTSelectedHabits] = useState<string[]>([]);
  const [creatingTemplate, setCreatingTemplate] = useState(false);

  // State for Master Catalog
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [showCreateCatalogModal, setShowCreateCatalogModal] = useState(false);

  // Catalog Form State
  const [cName, setCName] = useState("");
  const [cDomain, CDomain] = useState<HabitDomain>("Sleep");
  const [cLabel, setCLabel] = useState("Health");
  const [cTimeOfDay, setCTimeOfDay] = useState("Morning");
  const [cDescription, setCDescription] = useState("");
  const [cGoal, setCGoal] = useState("");
  const [cUnit, setCUnit] = useState("mins");
  const [cType, setCType] = useState("time");
  const [creatingCatalog, setCreatingCatalog] = useState(false);

  const fetchTemplates = () => {
    setLoadingTemplates(true);
    fetch("/api/admin/templates")
      .then((res) => res.json())
      .then((data) => setTemplates(data.templates || []))
      .catch(() => {})
      .finally(() => setLoadingTemplates(false));
  };

  const fetchCatalog = () => {
    setLoadingCatalog(true);
    fetch("/api/admin/catalog")
      .then((res) => res.json())
      .then((data) => setCatalog(data.catalog || []))
      .catch(() => {})
      .finally(() => setLoadingCatalog(false));
  };

  useEffect(() => {
    fetchTemplates();
    fetchCatalog();
  }, []);

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tTagline) return;
    setCreatingTemplate(true);

    const habitsToInclude = tSelectedHabits.map((key) => {
      const def = MASTER_HABIT_CATALOG[key];
      if (def) {
        return {
          habitKey: def.habitKey,
          name: def.name,
          domain: def.domain,
          suggestedLabel: def.suggestedLabel,
          frequency: def.defaultFrequency,
          target: def.defaultTarget,
          timeOfDay: def.timeOfDay,
          description: def.description,
        };
      }
      return {
        habitKey: key,
        name: key,
        domain: "Productivity",
        suggestedLabel: "Health",
        frequency: { type: "daily" },
      };
    });

    try {
      const res = await fetch("/api/admin/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: tName,
          tagline: tTagline,
          overviewMarkdown: tOverview,
          category: tCategory,
          difficulty: tDifficulty,
          estimatedDailyMinutes: tMinutes,
          authorName: tAuthorName,
          authorRole: tAuthorRole,
          tags: tTags.split(",").map((s) => s.trim()).filter(Boolean),
          habits: habitsToInclude,
        }),
      });
      if (res.ok) {
        setShowCreateTemplateModal(false);
        setTName("");
        setTTagline("");
        setTOverview("");
        setTSelectedHabits([]);
        fetchTemplates();
      }
    } catch {} finally {
      setCreatingTemplate(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template system?")) return;
    try {
      const res = await fetch(`/api/admin/templates?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchTemplates();
    } catch {}
  };

  const handleCreateCatalog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName) return;
    setCreatingCatalog(true);

    try {
      const res = await fetch("/api/admin/catalog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: cName,
          domain: cDomain,
          suggestedLabel: cLabel,
          timeOfDay: cTimeOfDay,
          description: cDescription,
          targetGoal: cGoal,
          targetUnit: cUnit,
          targetType: cType,
        }),
      });
      if (res.ok) {
        setShowCreateCatalogModal(false);
        setCName("");
        setCDescription("");
        setCGoal("");
        fetchCatalog();
      }
    } catch {} finally {
      setCreatingCatalog(false);
    }
  };

  const handleDeleteCatalog = async (id: string) => {
    if (!confirm("Delete this catalog habit item?")) return;
    try {
      const res = await fetch(`/api/admin/catalog?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCatalog();
    } catch {}
  };

  const masterHabitsList = Object.values(MASTER_HABIT_CATALOG);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#232f26]">
            Organization Admin Portal
          </h1>
          <p className="mt-1 text-sm text-[#737970]">
            Manage organization habit systems, master protocols, and biological domain mappings.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-[#e5e1d7] bg-white p-1 shadow-sm">
          <button
            onClick={() => setActiveTab("templates")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "templates"
                ? "bg-[#232f26] text-white shadow-sm"
                : "text-[#737970] hover:text-[#232f26]"
            }`}
          >
            Habit Systems ({templates.length})
          </button>
          <button
            onClick={() => setActiveTab("catalog")}
            className={`rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "catalog"
                ? "bg-[#232f26] text-white shadow-sm"
                : "text-[#737970] hover:text-[#232f26]"
            }`}
          >
            Master Catalog ({masterHabitsList.length + catalog.length})
          </button>
        </div>
      </div>

      {/* TAB 1: HABIT SYSTEMS MANAGEMENT */}
      {activeTab === "templates" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-4">
            <div>
              <h2 className="text-base font-semibold text-[#232f26]">Organization Habit Protocols</h2>
              <p className="text-xs text-[#737970]">Custom published bundles deployed across your organization.</p>
            </div>
            <button
              onClick={() => setShowCreateTemplateModal(true)}
              className="rounded-xl bg-[#232f26] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Publish New Protocol →
            </button>
          </div>

          {loadingTemplates ? (
            <p className="py-12 text-center text-sm text-[#737970]">Loading organization templates…</p>
          ) : templates.length === 0 ? (
            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-12 text-center">
              <h3 className="text-lg font-semibold text-[#232f26]">No Custom Protocols Published Yet</h3>
              <p className="mt-1 text-xs text-[#737970]">Publish custom habit systems for your organization members.</p>
              <button
                onClick={() => setShowCreateTemplateModal(true)}
                className="mt-4 rounded-xl bg-[#232f26] px-4 py-2 text-xs font-semibold text-white"
              >
                Create First Protocol
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {templates.map((t) => (
                <div key={t.id} className="flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-[11px] font-semibold text-[#406852]">
                        {t.category}
                      </span>
                      <span className="text-xs text-[#737970]">{t.difficulty}</span>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-[#232f26]">{t.name}</h3>
                      <p className="mt-1 line-clamp-2 text-xs text-[#737970]">{t.tagline}</p>
                    </div>

                    <div className="rounded-xl bg-[#fbf9f5] p-3 text-xs">
                      <span className="font-semibold text-[#232f26]">{t.habits.length} Included Habits:</span>
                      <ul className="mt-1 space-y-1 text-[#737970]">
                        {t.habits.slice(0, 3).map((h: any, i: number) => (
                          <li key={i} className="truncate">• {h.name}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[#e5e1d7] pt-4 text-xs">
                    <span className="text-[#737970]">Author: {t.author?.name}</span>
                    <button
                      onClick={() => handleDeleteTemplate(t.id)}
                      className="font-semibold text-[#be5a38] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MASTER CATALOG MANAGEMENT */}
      {activeTab === "catalog" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-4">
            <div>
              <h2 className="text-base font-semibold text-[#232f26]">Biological Master Habit Catalog</h2>
              <p className="text-xs text-[#737970]">Standardized habit protocols with 16 biological domain taxonomy.</p>
            </div>
            <button
              onClick={() => setShowCreateCatalogModal(true)}
              className="rounded-xl bg-[#232f26] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              Add Master Habit →
            </button>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e5e1d7] text-[#737970]">
                  <th className="pb-3 font-semibold">Habit Key</th>
                  <th className="pb-3 font-semibold">Habit Name</th>
                  <th className="pb-3 font-semibold">Biological Domain</th>
                  <th className="pb-3 font-semibold">Label</th>
                  <th className="pb-3 font-semibold">Time of Day</th>
                  <th className="pb-3 font-semibold text-right">Target</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e5e1d7]/60">
                {masterHabitsList.map((h) => (
                  <tr key={h.habitKey} className="hover:bg-[#fbf9f5]">
                    <td className="py-3 font-mono text-[11px] text-[#737970]">{h.habitKey}</td>
                    <td className="py-3 font-semibold text-[#232f26]">{h.name}</td>
                    <td className="py-3">
                      <span className="rounded-md bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#406852]">
                        {h.domain}
                      </span>
                    </td>
                    <td className="py-3 text-[#737970]">{h.suggestedLabel}</td>
                    <td className="py-3 text-[#737970]">{h.timeOfDay || "Anytime"}</td>
                    <td className="py-3 text-right font-semibold text-[#232f26]">
                      {h.defaultTarget ? `${h.defaultTarget.goal} ${h.defaultTarget.unit}` : "Binary"}
                    </td>
                  </tr>
                ))}
                {catalog.map((h) => (
                  <tr key={h.id} className="bg-[#fbf9f5]/60 hover:bg-[#fbf9f5]">
                    <td className="py-3 font-mono text-[11px] text-[#737970]">{h.habitKey}</td>
                    <td className="py-3 font-semibold text-[#232f26]">{h.name} (Custom)</td>
                    <td className="py-3">
                      <span className="rounded-md bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#406852]">
                        {h.domain}
                      </span>
                    </td>
                    <td className="py-3 text-[#737970]">{h.suggestedLabel}</td>
                    <td className="py-3 text-[#737970]">{h.timeOfDay || "Anytime"}</td>
                    <td className="py-3 text-right flex items-center justify-end gap-3">
                      <span className="font-semibold text-[#232f26]">
                        {h.defaultTarget ? `${h.defaultTarget.goal} ${h.defaultTarget.unit}` : "Binary"}
                      </span>
                      <button
                        onClick={() => handleDeleteCatalog(h.id)}
                        className="text-[#be5a38] font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE TEMPLATE MODAL */}
      {showCreateTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-3">
              <h3 className="text-lg font-semibold text-[#232f26]">Publish Custom Habit Protocol</h3>
              <button onClick={() => setShowCreateTemplateModal(false)} className="text-[#737970]">✕</button>
            </div>

            <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-[#232f26]">Protocol Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Executive Performance Protocol"
                    value={tName}
                    onChange={(e) => setTName(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none focus:border-[#232f26]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#232f26]">Category *</label>
                  <select
                    value={tCategory}
                    onChange={(e) => setTCategory(e.target.value as TemplateCategory)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#232f26]">Tagline / Subtitle *</label>
                <input
                  type="text"
                  required
                  placeholder="One-line value proposition for marketplace preview"
                  value={tTagline}
                  onChange={(e) => setTTagline(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none focus:border-[#232f26]"
                />
              </div>

              <div>
                <label className="font-semibold text-[#232f26]">Overview / Scientific Methodology</label>
                <textarea
                  rows={3}
                  placeholder="Explain why this protocol works..."
                  value={tOverview}
                  onChange={(e) => setTOverview(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none focus:border-[#232f26]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-semibold text-[#232f26]">Difficulty</label>
                  <select
                    value={tDifficulty}
                    onChange={(e) => setTDifficulty(e.target.value as TemplateDifficulty)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  >
                    {DIFFICULTIES.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#232f26]">Est. Daily Minutes</label>
                  <input
                    type="number"
                    value={tMinutes}
                    onChange={(e) => setTMinutes(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#232f26]">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={tTags}
                    onChange={(e) => setTTags(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Select Included Habits */}
              <div className="space-y-2 border-t border-[#e5e1d7] pt-3">
                <label className="font-semibold text-[#232f26]">Select Included Catalog Habits</label>
                <div className="grid gap-2 max-h-40 overflow-y-auto sm:grid-cols-2 p-1">
                  {masterHabitsList.map((h) => (
                    <label key={h.habitKey} className="flex items-center gap-2 rounded-lg border border-[#e5e1d7] p-2 cursor-pointer hover:bg-[#fbf9f5]">
                      <input
                        type="checkbox"
                        checked={tSelectedHabits.includes(h.habitKey)}
                        onChange={(e) => {
                          if (e.target.checked) setTSelectedHabits([...tSelectedHabits, h.habitKey]);
                          else setTSelectedHabits(tSelectedHabits.filter((k) => k !== h.habitKey));
                        }}
                        className="accent-[#232f26]"
                      />
                      <span className="font-semibold text-[#232f26] truncate">{h.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#e5e1d7] pt-4">
                <button type="button" onClick={() => setShowCreateTemplateModal(false)} className="rounded-xl border border-[#e5e1d7] px-4 py-2 font-semibold">Cancel</button>
                <button type="submit" disabled={creatingTemplate} className="rounded-xl bg-[#232f26] px-5 py-2 font-semibold text-white">
                  {creatingTemplate ? "Publishing…" : "Publish Protocol →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE MASTER HABIT CATALOG MODAL */}
      {showCreateCatalogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-3">
              <h3 className="text-lg font-semibold text-[#232f26]">Add Master Catalog Habit</h3>
              <button onClick={() => setShowCreateCatalogModal(false)} className="text-[#737970]">✕</button>
            </div>

            <form onSubmit={handleCreateCatalog} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-[#232f26]">Habit Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Zone 2 Cardio Run"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none focus:border-[#232f26]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="font-semibold text-[#232f26]">Biological Domain *</label>
                  <select
                    value={cDomain}
                    onChange={(e) => CDomain(e.target.value as HabitDomain)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  >
                    {HABIT_DOMAINS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#232f26]">Suggested Label</label>
                  <input
                    type="text"
                    value={cLabel}
                    onChange={(e) => setCLabel(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div>
                  <label className="font-semibold text-[#232f26]">Target Goal</label>
                  <input
                    type="number"
                    placeholder="e.g. 30"
                    value={cGoal}
                    onChange={(e) => setCGoal(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#232f26]">Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. mins"
                    value={cUnit}
                    onChange={(e) => setCUnit(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#232f26]">Target Type</label>
                  <select
                    value={cType}
                    onChange={(e) => setCType(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                  >
                    <option value="time">time</option>
                    <option value="count">count</option>
                    <option value="distance">distance</option>
                    <option value="currency">currency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#232f26]">Description</label>
                <textarea
                  rows={2}
                  placeholder="Habit execution guidance..."
                  value={cDescription}
                  onChange={(e) => setCDescription(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e5e1d7] p-2.5 text-xs outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-[#e5e1d7] pt-4">
                <button type="button" onClick={() => setShowCreateCatalogModal(false)} className="rounded-xl border border-[#e5e1d7] px-4 py-2 font-semibold">Cancel</button>
                <button type="submit" disabled={creatingCatalog} className="rounded-xl bg-[#232f26] px-5 py-2 font-semibold text-white">
                  {creatingCatalog ? "Adding…" : "Add Master Habit →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

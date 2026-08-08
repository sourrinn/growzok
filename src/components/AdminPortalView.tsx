"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import OrgSidebar from "@/components/OrgSidebar";
import CustomSelect from "@/components/CustomSelect";
import { HABIT_DOMAINS, type HabitDomain } from "@/types/habit";
import type { TemplateCategory, TemplateDifficulty } from "@/types/template";
import { MASTER_HABIT_CATALOG } from "@/lib/habitCatalog";
import { HABIT_TEMPLATES } from "@/lib/templates";

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

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

export default function AdminPortalView() {
  const [activeSection, setActiveSection] = useState<"habits" | "templates">("habits");

  // State for Custom Templates
  const [customTemplates, setCustomTemplates] = useState<any[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [showCreateTemplateModal, setShowCreateTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any | null>(null);

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
  const [submittingTemplate, setSubmittingTemplate] = useState(false);

  // State for Standalone Master Catalog Habits
  const [catalog, setCatalog] = useState<any[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [showCreateCatalogModal, setShowCreateCatalogModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  /** Map of habitKey → number of users who have that habit active in their dashboard */
  const [userUsageMap, setUserUsageMap] = useState<Record<string, number>>({});

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
      .then((data) => setCustomTemplates(data.templates || []))
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

  const fetchUsage = () => {
    fetch("/api/admin/catalog/usage")
      .then((res) => res.json())
      .then((data) => setUserUsageMap(data.usage || {}))
      .catch(() => {});
  };

  useEffect(() => {
    fetchTemplates();
    fetchCatalog();
    fetchUsage();
  }, []);

  // Merge static HABIT_TEMPLATES and custom MongoDB templates (custom overrides static if same key)
  const allTemplatesList = useMemo(() => {
    const customKeys = new Set(customTemplates.map((t) => t.key));
    const staticFiltered = HABIT_TEMPLATES.filter((t) => !customKeys.has(t.key)).map((t) => ({ ...t, isCustom: false }));
    const customList = customTemplates.map((t) => ({ ...t, isCustom: true }));
    return [...customList, ...staticFiltered];
  }, [customTemplates]);

  // Compute template usage mapping per habitKey / name
  const habitUsageMap = useMemo(() => {
    const map: Record<string, string[]> = {};
    allTemplatesList.forEach((t) => {
      t.habits.forEach((h: any) => {
        const key = h.habitKey || normalizeName(h.name);
        if (!map[key]) map[key] = [];
        if (!map[key].includes(t.name)) map[key].push(t.name);

        const nameKey = normalizeName(h.name);
        if (!map[nameKey]) map[nameKey] = [];
        if (!map[nameKey].includes(t.name)) map[nameKey].push(t.name);
      });
    });
    return map;
  }, [allTemplatesList]);

  const masterHabitsList = Object.values(MASTER_HABIT_CATALOG);
  const allHabitItems = [...masterHabitsList, ...catalog];

  const openCreateTemplateModal = () => {
    setEditingTemplate(null);
    setTName("");
    setTTagline("");
    setTOverview("");
    setTCategory("Morning Routine");
    setTDifficulty("Intermediate");
    setTMinutes(20);
    setTAuthorName("Org Performance Lab");
    setTAuthorRole("Lead Specialist");
    setTTags("Morning, Focus, Health");
    setTSelectedHabits([]);
    setShowCreateTemplateModal(true);
  };

  const openEditTemplateModal = (template: any) => {
    setEditingTemplate(template);
    setTName(template.name);
    setTTagline(template.tagline);
    setTOverview(template.overviewMarkdown || template.description || "");
    setTCategory(template.category);
    setTDifficulty(template.difficulty || "Intermediate");
    setTMinutes(template.estimatedDailyMinutes || 20);
    setTAuthorName(template.author?.name || "Org Performance Lab");
    setTAuthorRole(template.author?.role || "Lead Specialist");
    setTTags(Array.isArray(template.tags) ? template.tags.join(", ") : "");
    const habitKeys = template.habits.map((h: any) => h.habitKey || h.id || h.name);
    setTSelectedHabits(habitKeys);
    setShowCreateTemplateModal(true);
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tName || !tTagline) return;
    setSubmittingTemplate(true);

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
      const customItem = catalog.find((c) => c.habitKey === key || c.id === key);
      if (customItem) {
        return {
          habitKey: customItem.habitKey,
          name: customItem.name,
          domain: customItem.domain,
          suggestedLabel: customItem.suggestedLabel,
          frequency: customItem.defaultFrequency,
          target: customItem.defaultTarget,
          timeOfDay: customItem.timeOfDay,
          description: customItem.description,
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

    const isEdit = Boolean(editingTemplate);
    const method = isEdit ? "PUT" : "POST";
    const payload: any = {
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
    };

    if (isEdit) {
      if (editingTemplate.id) payload.id = editingTemplate.id;
      if (editingTemplate.key) payload.key = editingTemplate.key;
    }

    try {
      const res = await fetch("/api/admin/templates", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setShowCreateTemplateModal(false);
        setEditingTemplate(null);
        fetchTemplates();
      }
    } catch {} finally {
      setSubmittingTemplate(false);
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

  const handleDeleteCatalog = async (id: string, name: string, habitKey: string) => {
    const usages = habitUsageMap[habitKey] || habitUsageMap[normalizeName(name)] || [];
    if (usages.length > 0) {
      alert(`Cannot delete "${name}": It is currently included in template protocol "${usages[0]}". Please remove it from that template first.`);
      return;
    }

    if (!confirm(`Delete standalone catalog habit "${name}"?`)) return;

    try {
      setErrorMsg(null);
      const res = await fetch(`/api/admin/catalog?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Could not delete habit.");
      } else {
        fetchCatalog();
        fetchUsage();
      }
    } catch {
      setErrorMsg("Network error trying to delete habit.");
    }
  };

  return (
    <AppShell
      userLabel="Admin Portal"
      secondarySidebar={
        <OrgSidebar
          activeSection={activeSection}
          onSelectSection={setActiveSection}
          habitsCount={allHabitItems.length}
          templatesCount={allTemplatesList.length}
        />
      }
    >
      <div className="w-full space-y-6">
        {/* Error Alert */}
        {errorMsg && (
          <div className="flex items-center justify-between rounded-2xl border border-[#be5a38]/30 bg-[#be5a38]/10 p-4 text-xs font-semibold text-[#be5a38]">
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)} className="ml-2 font-bold">✕</button>
          </div>
        )}

        {/* SECTION 1: STANDALONE HABITS */}
        {activeSection === "habits" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e1d7] pb-4">
              <div>
                <h1 className="font-display text-3xl font-semibold text-[#232f26]">
                  Master Habit Catalog
                </h1>
                <p className="text-xs text-[#737970]">
                  Manage master catalog habits. Habits included in active protocols or tracked by users are protected from deletion.
                </p>
              </div>

              <button
                onClick={() => setShowCreateCatalogModal(true)}
                className="rounded-xl bg-[#232f26] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                + Add Catalog Habit
              </button>
            </div>

            <div className="rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e5e1d7] text-[#737970]">
                    <th className="pb-3 font-semibold">Habit Key</th>
                    <th className="pb-3 font-semibold">Habit Name</th>
                    <th className="pb-3 font-semibold">Biological Domain</th>
                    <th className="pb-3 font-semibold">Template Usage</th>
                    <th className="pb-3 font-semibold">User Adoption</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e1d7]/60">
                  {masterHabitsList.map((h) => {
                    const usages = habitUsageMap[h.habitKey] || [];
                    const activeUsers = userUsageMap[h.habitKey] || 0;
                    return (
                      <tr key={h.habitKey} className="hover:bg-[#fbf9f5]">
                        <td className="py-3 font-mono text-[11px] text-[#737970]">{h.habitKey}</td>
                        <td className="py-3 font-semibold text-[#232f26]">{h.name}</td>
                        <td className="py-3">
                          <span className="rounded-md bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#406852]">
                            {h.domain}
                          </span>
                        </td>
                        <td className="py-3">
                          {usages.length > 0 ? (
                            <span className="rounded-md bg-[#f4efe2] px-2 py-0.5 text-[10px] font-semibold text-[#6b4923]">
                              In Use by {usages.length} Template{usages.length === 1 ? "" : "s"}
                            </span>
                          ) : (
                            <span className="text-[#737970]">Unlinked</span>
                          )}
                        </td>
                        <td className="py-3">
                          {activeUsers > 0 ? (
                            <span className="rounded-md bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#2d4a3e]">
                              {activeUsers} User{activeUsers === 1 ? "" : "s"} Active
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#737970]">No users</span>
                          )}
                        </td>
                        <td className="py-3 text-right font-medium text-[#737970]">Standard Protocol</td>
                      </tr>
                    );
                  })}
                  {catalog.map((h) => {
                    const usages = habitUsageMap[h.habitKey] || habitUsageMap[normalizeName(h.name)] || [];
                    const isInUse = usages.length > 0;
                    const activeUsers = userUsageMap[h.habitKey] || 0;
                    const isProtected = isInUse || activeUsers > 0;

                    return (
                      <tr key={h.id} className="bg-[#fbf9f5]/60 hover:bg-[#fbf9f5]">
                        <td className="py-3 font-mono text-[11px] text-[#737970]">{h.habitKey}</td>
                        <td className="py-3 font-semibold text-[#232f26]">{h.name} (Org Custom)</td>
                        <td className="py-3">
                          <span className="rounded-md bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#406852]">
                            {h.domain}
                          </span>
                        </td>
                        <td className="py-3">
                          {isInUse ? (
                            <span className="rounded-md bg-[#f4efe2] px-2 py-0.5 text-[10px] font-semibold text-[#6b4923]">
                              In Use by {usages.length} Template{usages.length === 1 ? "" : "s"}
                            </span>
                          ) : (
                            <span className="text-[#737970]">Unlinked</span>
                          )}
                        </td>
                        <td className="py-3">
                          {activeUsers > 0 ? (
                            <span className="rounded-md bg-[#e3ede6] px-2 py-0.5 text-[10px] font-semibold text-[#2d4a3e]">
                              {activeUsers} User{activeUsers === 1 ? "" : "s"} Active
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#737970]">No users</span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteCatalog(h.id, h.name, h.habitKey)}
                            className={`font-semibold ${
                              isProtected ? "text-[#737970] cursor-not-allowed opacity-60" : "text-[#be5a38] hover:underline"
                            }`}
                          >
                            {isProtected ? "Protected" : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SECTION 2: PROTOCOL TEMPLATES MANAGEMENT */}
        {activeSection === "templates" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#e5e1d7] pb-4">
              <div>
                <h1 className="font-display text-3xl font-semibold text-[#232f26]">
                  Organization Protocols
                </h1>
                <p className="text-xs text-[#737970]">
                  Full CRUD: Create, Edit metadata, Update habits, and Delete habit protocols in real-time.
                </p>
              </div>

              <button
                onClick={openCreateTemplateModal}
                className="rounded-xl bg-[#232f26] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                + Create Protocol
              </button>
            </div>

            {loadingTemplates ? (
              <p className="py-12 text-center text-sm text-[#737970]">Loading protocols…</p>
            ) : allTemplatesList.length === 0 ? (
              <div className="rounded-2xl border border-[#e5e1d7] bg-white p-12 text-center">
                <h3 className="text-lg font-semibold text-[#232f26]">No Protocols Available</h3>
                <button
                  onClick={openCreateTemplateModal}
                  className="mt-4 rounded-xl bg-[#232f26] px-4 py-2 text-xs font-semibold text-white"
                >
                  Create Protocol
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {allTemplatesList.map((t: any) => (
                  <div key={t.key || t.id} className="flex flex-col justify-between rounded-2xl border border-[#e5e1d7] bg-white p-6 shadow-sm space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#e3ede6] px-2.5 py-0.5 text-[11px] font-semibold text-[#406852]">
                          {t.category}
                        </span>
                        <span className="text-xs text-[#737970]">{t.difficulty}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-[#232f26]">{t.name}</h3>
                          {!t.isCustom && (
                            <span className="rounded-md bg-[#e5e1d7] px-2 py-0.5 text-[10px] font-semibold text-[#232f26]">
                              Standard Protocol
                            </span>
                          )}
                        </div>
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

                    <div className="flex items-center justify-between border-t border-[#e5e1d7] pt-4 text-xs">
                      <span className="text-[#737970]">
                        Author: {t.author?.name || "Growzok Lab"}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => openEditTemplateModal(t)}
                          className="font-semibold text-[#232f26] hover:underline"
                        >
                          Edit Protocol
                        </button>
                        {t.isCustom && (
                          <button
                            onClick={() => handleDeleteTemplate(t.id)}
                            className="font-semibold text-[#be5a38] hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE / EDIT TEMPLATE MODAL */}
      {showCreateTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#e5e1d7] pb-3">
              <h3 className="text-lg font-semibold text-[#232f26]">
                {editingTemplate ? `Edit Protocol — ${editingTemplate.name}` : "Publish Custom Habit Protocol"}
              </h3>
              <button onClick={() => setShowCreateTemplateModal(false)} className="text-[#737970]">✕</button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4 text-xs">
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
                  <label className="font-semibold text-[#232f26] block mb-1">Category *</label>
                  <CustomSelect
                    options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                    value={tCategory}
                    onChange={(val) => setTCategory(val as TemplateCategory)}
                    className="w-full"
                  />
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
                  <label className="font-semibold text-[#232f26] block mb-1">Difficulty</label>
                  <CustomSelect
                    options={DIFFICULTIES.map((d) => ({ value: d, label: d }))}
                    value={tDifficulty}
                    onChange={(val) => setTDifficulty(val as TemplateDifficulty)}
                    className="w-full"
                  />
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
                  {allHabitItems.map((h) => {
                    const key = h.habitKey || h.id || h.name;
                    return (
                      <label key={key} className="flex items-center gap-2 rounded-lg border border-[#e5e1d7] p-2 cursor-pointer hover:bg-[#fbf9f5]">
                        <input
                          type="checkbox"
                          checked={tSelectedHabits.includes(key)}
                          onChange={(e) => {
                            if (e.target.checked) setTSelectedHabits([...tSelectedHabits, key]);
                            else setTSelectedHabits(tSelectedHabits.filter((k) => k !== key));
                          }}
                          className="accent-[#232f26]"
                        />
                        <span className="font-semibold text-[#232f26] truncate">{h.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 border-t border-[#e5e1d7] pt-4">
                <button type="button" onClick={() => setShowCreateTemplateModal(false)} className="rounded-xl border border-[#e5e1d7] px-4 py-2 font-semibold">Cancel</button>
                <button type="submit" disabled={submittingTemplate} className="rounded-xl bg-[#232f26] px-5 py-2 font-semibold text-white">
                  {submittingTemplate ? "Saving…" : editingTemplate ? "Save Changes →" : "Publish Protocol →"}
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
              <h3 className="text-lg font-semibold text-[#232f26]">Add Standalone Master Habit</h3>
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
                  <label className="font-semibold text-[#232f26] block mb-1">Biological Domain *</label>
                  <CustomSelect
                    options={HABIT_DOMAINS.map((d) => ({ value: d, label: d }))}
                    value={cDomain}
                    onChange={(val) => CDomain(val as HabitDomain)}
                    className="w-full"
                  />
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
                  <label className="font-semibold text-[#232f26] block mb-1">Target Type</label>
                  <CustomSelect
                    options={[
                      { value: "time", label: "Time" },
                      { value: "count", label: "Count" },
                      { value: "distance", label: "Distance" },
                      { value: "currency", label: "Currency" },
                    ]}
                    value={cType}
                    onChange={(val) => setCType(val)}
                    className="w-full"
                  />
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
                  {creatingCatalog ? "Adding…" : "Add Standalone Habit →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppShell>
  );
}

"use client";

import { useState } from "react";

interface RecoveryEntry {
  date: string;
  type: "Cold Exposure" | "Thermal Sauna";
  durationMins: number;
  tempCelsius: number;
}

interface Props {
  embedded?: boolean;
}

export default function RecoveryClient({ embedded = false }: Props) {
  const [type, setType] = useState<"Cold Exposure" | "Thermal Sauna">("Cold Exposure");
  const [mins, setMins] = useState("3");
  const [temp, setTemp] = useState("10");
  const [logs, setLogs] = useState<RecoveryEntry[]>([
    { date: "2026-08-09", type: "Cold Exposure", durationMins: 3, tempCelsius: 10 },
    { date: "2026-08-08", type: "Thermal Sauna", durationMins: 20, tempCelsius: 85 },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: RecoveryEntry = {
      date: new Date().toISOString().slice(0, 10),
      type,
      durationMins: Number(mins) || 0,
      tempCelsius: Number(temp) || 0,
    };
    setLogs([entry, ...logs]);
    alert("Recovery session logged!");
  };

  return (
    <div className={`mx-auto max-w-4xl space-y-8 ${embedded ? "py-2" : "py-6"}`}>
      {!embedded && (
        <div>
          <span className="inline-flex mb-3 rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
            Hormetic Stress Adaptation
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
            Cold Thermogenesis & Sauna Recovery Log
          </h1>
          <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
            Log deliberate cold exposure and thermal sauna sessions to measure dopamine elevation and cardiovascular adaptation.
          </p>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSave} className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Log Recovery Session
        </h2>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] mb-1">
              Therapeutic Modality
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-bold text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            >
              <option value="Cold Exposure">🧊 Deliberate Cold Exposure</option>
              <option value="Thermal Sauna">🔥 Thermal Sauna</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] mb-1">
              Duration (Minutes)
            </label>
            <input
              type="number"
              value={mins}
              onChange={(e) => setMins(e.target.value)}
              className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-bold text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] mb-1">
              Temperature (°C)
            </label>
            <input
              type="number"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-bold text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-[#232f26] px-5 py-2.5 text-xs font-bold text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5] hover:bg-black transition-all"
        >
          Save Recovery Session →
        </button>
      </form>

      {/* Log History */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Recovery Log History
        </h2>

        <div className="space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] p-3 text-xs">
              <div className="flex items-center gap-2">
                <span>{log.type === "Cold Exposure" ? "🧊" : "🔥"}</span>
                <span className="font-bold text-[#232f26] dark:text-[#f4f4f5]">{log.type}</span>
              </div>
              <div className="flex gap-4 text-[#737970] dark:text-[#a1a1aa]">
                <span>⏱️ {log.durationMins} Mins</span>
                <span>🌡️ {log.tempCelsius}°C</span>
                <span>📅 {log.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

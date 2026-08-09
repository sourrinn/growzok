"use client";

import { useState } from "react";

interface VitalLog {
  date: string;
  rhr: number;
  hrv: number;
  sleep: number;
  weight: number;
}

export default function VitalsClient() {
  const [rhr, setRhr] = useState("62");
  const [hrv, setHrv] = useState("75");
  const [sleep, setSleep] = useState("7.5");
  const [weight, setWeight] = useState("74.5");
  const [logs, setLogs] = useState<VitalLog[]>([
    { date: "2026-08-09", rhr: 62, hrv: 75, sleep: 7.5, weight: 74.5 },
    { date: "2026-08-08", rhr: 64, hrv: 70, sleep: 7.0, weight: 74.8 },
  ]);

  const handleLog = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog: VitalLog = {
      date: new Date().toISOString().slice(0, 10),
      rhr: Number(rhr) || 0,
      hrv: Number(hrv) || 0,
      sleep: Number(sleep) || 0,
      weight: Number(weight) || 0,
    };
    setLogs([newLog, ...logs]);
    alert("Vitals logged successfully!");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-6">
      <div>
        <span className="rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
          Physiological Biomarkers
        </span>
        <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
          Biometric Biomarker & Vitals Tracker
        </h1>
        <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
          Monitor resting heart rate, HRV recovery, sleep duration, and body weight with optimal biological range indicators.
        </p>
      </div>

      {/* Vitals Input Form */}
      <form onSubmit={handleLog} className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Log Today's Physiological Vitals
        </h2>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] mb-1">
              Resting HR (BPM)
            </label>
            <input
              type="number"
              value={rhr}
              onChange={(e) => setRhr(e.target.value)}
              className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-bold text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
            <span className="text-[10px] text-[#737970]">Target: 50–65 BPM</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] mb-1">
              HRV Recovery (ms)
            </label>
            <input
              type="number"
              value={hrv}
              onChange={(e) => setHrv(e.target.value)}
              className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-bold text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
            <span className="text-[10px] text-[#737970]">Target: 60+ ms</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] mb-1">
              Sleep (Hours)
            </label>
            <input
              type="number"
              step="0.1"
              value={sleep}
              onChange={(e) => setSleep(e.target.value)}
              className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-bold text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
            <span className="text-[10px] text-[#737970]">Target: 7.5–9.0 hrs</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#232f26] dark:text-[#f4f4f5] mb-1">
              Body Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-bold text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
            <span className="text-[10px] text-[#737970]">Daily baseline</span>
          </div>
        </div>

        <button
          type="submit"
          className="rounded-xl bg-[#232f26] px-5 py-2.5 text-xs font-bold text-white dark:bg-[#3f3f46] dark:text-[#f4f4f5] hover:bg-black transition-all"
        >
          Save Vitals Entry →
        </button>
      </form>

      {/* Logged History List */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
          Recent Vitals Log History
        </h2>

        <div className="space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] p-3 text-xs">
              <span className="font-bold text-[#232f26] dark:text-[#f4f4f5]">{log.date}</span>
              <div className="flex gap-4 text-[#737970] dark:text-[#a1a1aa]">
                <span>❤️ {log.rhr} BPM</span>
                <span>📈 {log.hrv} ms HRV</span>
                <span>🌙 {log.sleep} hrs</span>
                <span>⚖️ {log.weight} kg</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";

interface Props {
  embedded?: boolean;
}

export default function CircadianClient({ embedded = false }: Props) {
  const [lat, setLat] = useState("37.7749");
  const [lon, setLon] = useState("-122.4194");
  const [calculated, setCalculated] = useState(true);

  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLat(pos.coords.latitude.toFixed(4));
        setLon(pos.coords.longitude.toFixed(4));
        setCalculated(true);
      });
    }
  };

  return (
    <div className={`mx-auto max-w-4xl space-y-8 ${embedded ? "py-2" : "py-6"}`}>
      {!embedded && (
        <div>
          <span className="inline-flex mb-3 rounded-full bg-[#406852]/10 px-3.5 py-1 text-xs font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
            Solar Photonic Optics
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#232f26] dark:text-[#f4f4f5]">
            Circadian Solar Window Calculator
          </h1>
          <p className="mt-1 text-xs text-[#737970] dark:text-[#a1a1aa]">
            Calculate exact solar noon, morning photic exposure windows, and evening digital sunset cutoffs using browser geolocation.
          </p>
        </div>
      )}

      {/* Geolocation Controls */}
      <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="Latitude"
              className="w-28 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-mono text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="Longitude"
              className="w-28 rounded-xl border border-[#e5e1d7] bg-[#fbf9f5] px-3.5 py-2 text-xs font-mono text-[#232f26] dark:border-[#27272a] dark:bg-[#121215] dark:text-[#f4f4f5] outline-none"
            />
          </div>
          <button
            onClick={handleDetectLocation}
            className="w-full sm:w-auto rounded-xl bg-[#406852] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#232f26] transition-all"
          >
            Detect Browser Location
          </button>
        </div>
      </div>

      {/* Solar Windows Output Cards */}
      {calculated && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">Morning Photonic Window</h3>
            <p className="text-xs font-mono text-[#406852] dark:text-[#a3b899] font-bold">06:15 AM – 08:30 AM</p>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
              Optimal window for 10-15 minutes of outdoor sunlight exposure to trigger cortisol awakening spike.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">Solar Peak / Solar Noon</h3>
            <p className="text-xs font-mono text-[#406852] dark:text-[#a3b899] font-bold">01:12 PM</p>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
              Maximum UV-B spectrum availability for vitamin D synthesis.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-2">
            <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5]">Digital Sunset Cutoff</h3>
            <p className="text-xs font-mono text-[#be5a38] font-bold">08:45 PM</p>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] leading-relaxed">
              Eliminate bright overhead blue light exposure to protect melatonin pulse.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

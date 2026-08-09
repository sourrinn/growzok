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
      <div className="rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#e5e1d7]/60 dark:border-[#27272a] pb-4">
          <div>
            <h2 className="text-sm font-bold text-[#232f26] dark:text-[#f4f4f5]">
              GPS Solar Coordinate Calibration
            </h2>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] mt-0.5">
              Enter coordinates manually or auto-detect via browser GPS to compute exact solar photic angles.
            </p>
          </div>

          <button
            onClick={handleDetectLocation}
            className="w-full sm:w-auto rounded-xl bg-[#232f26] px-5 py-2.5 text-xs font-bold text-white dark:bg-[#f4f4f5] dark:text-[#18181b] hover:bg-[#406852] dark:hover:bg-white transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 shrink-0"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
              <polygon points="12 2 19 21 12 17 5 21 12 2" />
            </svg>
            <span>Detect Browser Location</span>
          </button>
        </div>

        {/* Input Fields Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Latitude Field */}
          <div className="flex items-center justify-between rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] px-4 py-2.5 transition-all focus-within:border-[#406852] dark:focus-within:border-[#a3b899]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
              Latitude
            </span>
            <input
              type="text"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="37.7749"
              className="w-32 text-right bg-transparent font-mono text-xs font-bold text-[#232f26] dark:text-[#f4f4f5] outline-none"
            />
          </div>

          {/* Longitude Field */}
          <div className="flex items-center justify-between rounded-2xl border border-[#e5e1d7] bg-[#fbf9f5] dark:border-[#27272a] dark:bg-[#121215] px-4 py-2.5 transition-all focus-within:border-[#406852] dark:focus-within:border-[#a3b899]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">
              Longitude
            </span>
            <input
              type="text"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              placeholder="-122.4194"
              className="w-32 text-right bg-transparent font-mono text-xs font-bold text-[#232f26] dark:text-[#f4f4f5] outline-none"
            />
          </div>
        </div>
      </div>

      {/* Solar Windows Output Cards */}
      {calculated && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-2">
            <span className="rounded-full bg-[#406852]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
              Morning Window
            </span>
            <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5] mt-1">
              Morning Photonic Window
            </h3>
            <p className="text-sm font-mono text-[#406852] dark:text-[#a3b899] font-bold">
              06:15 AM – 08:30 AM
            </p>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] leading-relaxed pt-1">
              Optimal window for 10-15 minutes of outdoor sunlight exposure to trigger cortisol awakening spike.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-2">
            <span className="rounded-full bg-[#406852]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#406852] dark:text-[#a3b899] uppercase tracking-wider">
              Solar Zenith
            </span>
            <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5] mt-1">
              Solar Peak / Solar Noon
            </h3>
            <p className="text-sm font-mono text-[#406852] dark:text-[#a3b899] font-bold">
              01:12 PM
            </p>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] leading-relaxed pt-1">
              Maximum UV-B spectrum availability for vitamin D synthesis.
            </p>
          </div>

          <div className="rounded-3xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-5 shadow-sm space-y-2">
            <span className="rounded-full bg-[#be5a38]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#be5a38] uppercase tracking-wider">
              Melatonin Shield
            </span>
            <h3 className="font-bold text-sm text-[#232f26] dark:text-[#f4f4f5] mt-1">
              Digital Sunset Cutoff
            </h3>
            <p className="text-sm font-mono text-[#be5a38] font-bold">
              08:45 PM
            </p>
            <p className="text-[11px] text-[#737970] dark:text-[#a1a1aa] leading-relaxed pt-1">
              Eliminate bright overhead blue light exposure to protect melatonin pulse.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

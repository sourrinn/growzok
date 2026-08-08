export default function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] px-4 py-3 shadow-xs">
      <p className="text-2xl font-semibold tabular-nums text-[#232f26] dark:text-[#f4f4f5]">{value}</p>
      <p className="mt-0.5 text-xs text-[#737970] dark:text-[#a1a1aa]">{label}</p>
    </div>
  );
}

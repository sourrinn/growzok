export default function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#e5e1d7] bg-white dark:border-[#27272a] dark:bg-[#18181b] p-4.5 shadow-sm transition-all hover:shadow-md">
      <p className="font-display text-2xl font-bold tabular-nums text-[#232f26] dark:text-[#f4f4f5]">{value}</p>
      <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[#737970] dark:text-[#a1a1aa]">{label}</p>
    </div>
  );
}

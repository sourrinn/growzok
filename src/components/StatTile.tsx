export default function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm border border-mist px-4 py-3">
      <p className="text-2xl font-medium tabular-nums text-charcoal">{value}</p>
      <p className="mt-0.5 text-xs text-muted">{label}</p>
    </div>
  );
}

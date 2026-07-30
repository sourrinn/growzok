"use client";

import { useState } from "react";

export default function AddHabit({
  onAdd,
}: {
  onAdd: (name: string) => void | Promise<void>;
}) {
  const [value, setValue] = useState("");

  const submit = async () => {
    const name = value.trim();
    if (!name) return;
    setValue("");
    await onAdd(name);
  };

  return (
    <div className="mb-9 flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
        maxLength={60}
        placeholder="Add a habit — e.g. Read 10 pages"
        className="flex-1 border-b border-mist bg-transparent px-0.5 py-2.5 text-base text-charcoal outline-none transition-colors placeholder:text-muted focus:border-sage"
      />
      <button
        onClick={submit}
        className="rounded-sm bg-charcoal px-5 text-sm font-medium text-ink transition-opacity hover:opacity-80 active:opacity-60"
      >
        Add
      </button>
    </div>
  );
}

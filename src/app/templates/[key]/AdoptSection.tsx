"use client";

import { useState } from "react";
import type { HabitTemplate } from "@/types/template";
import TemplateCustomizerModal from "@/components/TemplateCustomizerModal";

interface Props {
  template: HabitTemplate;
}

export default function AdoptSection({ template }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-2 w-full rounded-lg bg-charcoal py-3 text-sm font-semibold text-ink transition-opacity hover:opacity-80 active:opacity-60"
      >
        Adopt Habit System
      </button>

      {open && (
        <TemplateCustomizerModal template={template} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

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
        className="w-full rounded-xl bg-[#232f26] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black active:scale-[0.98]"
      >
        Adopt Habit System →
      </button>

      {open && (
        <TemplateCustomizerModal template={template} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

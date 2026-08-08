"use client";

import { useState } from "react";
import type { Protocol } from "@/types/protocol";
import ProtocolAdoptModal from "@/components/ProtocolAdoptModal";

interface Props {
  protocol: Protocol;
}

export default function AdoptSection({ protocol }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-[#232f26] py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-black active:scale-[0.98]"
      >
        Adopt Protocol →
      </button>

      {open && (
        <ProtocolAdoptModal protocol={protocol} onClose={() => setOpen(false)} />
      )}
    </>
  );
}

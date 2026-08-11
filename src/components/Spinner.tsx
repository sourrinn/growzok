"use client";

import React from "react";
import { HorseLoader } from "./HorseLoader";

export function Spinner({
  className = "h-4 w-4",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return <HorseLoader size="sm" inline className={className} />;
}

export default Spinner;

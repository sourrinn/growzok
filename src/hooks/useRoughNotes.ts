"use client";

import { useNotesSessions } from "./useNotesSessions";

export function useRoughNotes() {
  return useNotesSessions();
}

export { useNotesSessions };

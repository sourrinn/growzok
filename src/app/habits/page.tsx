import HabitsClient from "./HabitsClient";

export const metadata = {
  title: "Habits & Routines Workspace | Growzok Life OS",
  description: "Track habits, manage habit stacks, and view 14-day completion velocity sparklines.",
};

export default function HabitsPage() {
  return <HabitsClient />;
}

import { redirect } from "next/navigation";

export default function CircadianPage() {
  redirect("/bio?tab=circadian");
}

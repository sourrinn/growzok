import { redirect } from "next/navigation";

export default function FastingPage() {
  redirect("/bio?tab=fasting");
}

import { redirect } from "next/navigation";

export default function RecoveryPage() {
  redirect("/bio?tab=recovery");
}

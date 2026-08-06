import { redirect } from "next/navigation";
import { auth } from "@/auth";
import OverviewClient from "./OverviewClient";

export default async function HomePage() {
  const session = await auth();

  // If user is already logged in, send them straight to their habits dashboard
  if (session?.user?.id) {
    redirect("/dashboard");
  }

  // Otherwise, render the marketing landing page on root /
  return <OverviewClient />;
}

import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { ReadingDashboard } from "@/components/reading/ReadingDashboard";
export default async function ReadingLogs() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return <ReadingDashboard />;
}

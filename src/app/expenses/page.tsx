import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
export default async function Expenses() {
  const user = await currentUser();
  if (!user) redirect("/login");
  return (
    <main className="shell workspace" data-testid="expenses-page">
      <p className="eyebrow">YOUR PERSONAL SPACE</p>
      <h1>You’re right where you belong.</h1>
      <p className="intro">Signed in as {user.email}</p>
      <Card className="workspace-card">
        <CardContent>
          <ShieldCheck size={30} />
          <h2>Your account is ready</h2>
          <p>
            Registration and sign-in are available. Expense tracking will be
            added in the next stage.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

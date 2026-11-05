import type { Metadata } from "next";
import "./globals.css";
import { currentUser } from "@/lib/auth";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";
export const metadata: Metadata = {
  title: "ExpenseTrail — A little clarity, every day",
  description: "A calmer place to keep track of your personal spending.",
};
export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await currentUser().catch(() => null);
  return (
    <html lang="en">
      <body>
        <AuthProvider initialUser={user}>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Header />
          {children}
          <footer className="shell footer">
            <span>ExpenseTrail.</span>
            <span>A little clarity, every day.</span>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

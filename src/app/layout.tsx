import type { Metadata } from "next";
import "./globals.css";
import { currentUser } from "@/lib/auth";
import { AuthProvider } from "@/context/AuthContext";
import { ReadingProvider } from "@/context/ReadingContext";
import { Header } from "@/components/Header";
export const metadata: Metadata = {
  title: "ReadLog — A little clarity, every day",
  description:
    "A personal journal for your reading sessions, favorites and reading habits.",
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
          <ReadingProvider>{children}</ReadingProvider>
          <footer className="shell footer">
            <span>ReadLog.</span>
            <span>One chapter at a time.</span>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}

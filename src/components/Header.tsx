"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  LogOut,
  BookOpen,
  LoaderCircle,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
export function Header() {
  const { user, clear } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function logout() {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      clear();
      router.replace("/");
      router.refresh();
    } catch {
      setMessage("Could not sign out. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <header className="site-header">
      <nav className="shell nav" aria-label="Main navigation">
        <Link href="/" className="brand">
          <span className="brand-icon">
            <BookOpen size={20} />
          </span>
          ReadLog<span className="brand-dot">.</span>
        </Link>
        <div className="nav-actions">
          {user ? (
            <>
              <span data-testid="user-email" className="user-email">
                {user.email}
              </span>
              <Link
                data-testid="link-reading-logs"
                href="/reading-logs"
                className="nav-link"
                aria-current={pathname === "/reading-logs" ? "page" : undefined}
              >
                <LayoutDashboard size={15} aria-hidden="true" /> Reading journal
              </Link>
              <Button
                data-testid="btn-logout"
                variant="outline"
                disabled={busy}
                onClick={logout}
              >
                {busy ? (
                  <LoaderCircle size={15} className="spin" aria-hidden="true" />
                ) : (
                  <LogOut size={15} aria-hidden="true" />
                )}
                {busy ? "Signing out…" : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link
                className="nav-link"
                href="/login"
                data-testid="btn-login"
                aria-current={pathname === "/login" ? "page" : undefined}
              >
                Login
              </Link>
              <Link
                className="action-link small"
                href="/register"
                data-testid="btn-register"
                aria-current={pathname === "/register" ? "page" : undefined}
              >
                Register
                <ArrowUpRight size={15} />
              </Link>
            </>
          )}
        </div>
      </nav>
      {message && (
        <p role="alert" className="shell field-error">
          {message}
        </p>
      )}
    </header>
  );
}

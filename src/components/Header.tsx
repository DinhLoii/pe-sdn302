"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, LogOut, Wallet } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
export function Header() {
  const { user, clear } = useAuth();
  const router = useRouter();
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
            <Wallet size={20} />
          </span>
          ExpenseTrail<span className="brand-dot">.</span>
        </Link>
        <div className="nav-actions">
          {user ? (
            <>
              <span data-testid="user-email" className="user-email">
                {user.email}
              </span>
              <Link
                data-testid="link-expenses"
                href="/expenses"
                className="nav-link"
              >
                My expenses
              </Link>
              <Button
                data-testid="btn-logout"
                variant="outline"
                disabled={busy}
                onClick={logout}
              >
                <LogOut size={15} />
                {busy ? "Signing out…" : "Logout"}
              </Button>
            </>
          ) : (
            <>
              <Link className="nav-link" href="/login" data-testid="btn-login">
                Login
              </Link>
              <Link
                className="action-link small"
                href="/register"
                data-testid="btn-register"
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

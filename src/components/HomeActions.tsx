"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
export function HomeActions() {
  const { user } = useAuth();
  return (
    <div className="hero-actions">
      <Link className="action-link" href={user ? "/reading-logs" : "/register"}>
        {user ? "Open your reading journal" : "Start your reading journal"}
        <ArrowRight size={18} />
      </Link>
      <Link className="quiet-link" href={user ? "#how-it-works" : "/login"}>
        {user ? "See how it works" : "Already a reader? Login"}
      </Link>
    </div>
  );
}

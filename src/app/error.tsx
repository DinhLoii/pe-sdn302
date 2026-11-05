"use client";
import { RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" tabIndex={-1} className="shell system-page">
      <div className="system-icon">
        <TriangleAlert size={27} aria-hidden="true" />
      </div>
      <p className="eyebrow">LET’S TRY THAT AGAIN</p>
      <h1>We couldn’t load this page.</h1>
      <p>Your connection or our service may be temporarily unavailable.</p>
      <div className="system-actions">
        <Button onClick={reset}>
          <RotateCcw size={16} />
          Try again
        </Button>
        <Link href="/" className="quiet-link">
          Back to home
        </Link>
      </div>
    </main>
  );
}

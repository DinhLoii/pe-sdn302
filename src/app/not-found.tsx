import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1} className="shell system-page">
      <div className="system-icon">
        <Compass size={28} aria-hidden="true" />
      </div>
      <p className="eyebrow">404 · A SMALL DETOUR</p>
      <h1>This page isn’t on the trail.</h1>
      <p>It may have moved, or the address might be a little off.</p>
      <Link href="/" className="action-link">
        <ArrowLeft size={17} />
        Back to home
      </Link>
    </main>
  );
}

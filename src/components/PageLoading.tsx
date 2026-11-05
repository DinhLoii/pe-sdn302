import { LoaderCircle } from "lucide-react";
export default function Loading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="shell system-page"
      aria-busy="true"
    >
      <div className="system-icon">
        <LoaderCircle size={26} className="spin" aria-hidden="true" />
      </div>
      <p role="status">Getting things ready…</p>
      <span className="field-hint">Just a moment.</span>
    </main>
  );
}

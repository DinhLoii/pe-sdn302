import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  ChartNoAxesCombined,
  Layers3,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="shell home">
      <section className="hero">
        <div>
          <p className="eyebrow">YOUR MONEY. A CLEARER PICTURE.</p>
          <h1 data-testid="home-title">ExpenseTrail</h1>
          <p className="hero-title">
            Small expenses.
            <br />
            <em>More perspective.</em>
          </p>
          <p className="intro">
            From your morning coffee to the monthly bills, give every expense a
            place. Less guessing, more knowing where your money goes.
          </p>
          <div className="hero-actions">
            <Link className="action-link" href="/register">
              Create your account <ArrowRight size={18} />
            </Link>
            <Link href="/login" className="quiet-link">
              Already have an account?
            </Link>
          </div>
          <p className="fine-print">Your own space. Your own spending story.</p>
        </div>
        <aside className="preview" aria-label="Illustrative spending overview">
          <div className="preview-top">
            <span>THE BIG PICTURE</span>
            <span className="preview-badge">Illustration</span>
          </div>
          <p className="preview-label">A little more clarity.</p>
          <p className="preview-number">Every day.</p>
          <div className="bars" aria-hidden="true">
            {[35, 58, 42, 75, 55, 90, 68].map((h, i) => (
              <span key={i} style={{ height: h + "%" }} />
            ))}
          </div>
          <div className="preview-bottom">
            <span>Track the little things.</span>
            <span>See the whole picture ↗</span>
          </div>
        </aside>
      </section>
      <section className="features" aria-label="Features">
        {[
          {
            icon: Bookmark,
            title: "Track spending",
            text: "Keep the details together, so nothing gets lost along the way.",
          },
          {
            icon: Layers3,
            title: "Sort into categories",
            text: "A natural home for groceries, journeys and everything in between.",
          },
          {
            icon: ChartNoAxesCombined,
            title: "See where it goes",
            text: "Turn everyday entries into a clearer view of your habits.",
          },
        ].map(({ icon: Icon, title, text }, i) => (
          <Card className="feature" key={title}>
            <CardContent>
              <span className="feature-number">0{i + 1}</span>
              <Icon size={23} />
              <h2>{title}</h2>
              <p>{text}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

import Link from "next/link";
import {
  BookOpen,
  ArrowRight,
  Clock3,
  Layers3,
  Star,
  Leaf,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
export default function Home() {
  return (
    <main id="main-content" tabIndex={-1} className="shell home">
      <section className="hero">
        <div>
          <p className="eyebrow">
            <Leaf size={14} /> MAKE ROOM FOR A GOOD BOOK
          </p>
          <h1 data-testid="home-title">ReadLog</h1>
          <p className="hero-title">
            A few pages.
            <br />
            <em>A world of possibility.</em>
          </p>
          <p className="intro">
            A quiet place for your reading life. Log every session, save the
            ones you love, and watch the minutes become a habit.
          </p>
          <div className="hero-actions">
            <Link className="action-link" href="/register">
              Start your reading journal
              <ArrowRight size={18} />
            </Link>
            <Link className="quiet-link" href="/login">
              Already a reader? Login
            </Link>
          </div>
          <p className="fine-print">
            Your books. Your pace. Your personal space.
          </p>
        </div>
        <aside
          className="reading-illustration"
          aria-label="Illustration of a personal reading journal"
        >
          <div className="illustration-top">
            <BookOpen size={19} />
            <span>THE READING LIFE</span>
            <span className="illustration-label">Illustration</span>
          </div>
          <div className="book-art" aria-hidden="true">
            <div className="book-cover">
              <span>
                ONE
                <br />
                MORE
                <br />
                <em>CHAPTER.</em>
              </span>
              <small>A LITTLE TIME WELL SPENT</small>
            </div>
            <span className="bookmark-ribbon" />
          </div>
          <div className="illustration-foot">
            <span>
              <Clock3 size={15} />A little time for yourself
            </span>
            <Star size={17} />
          </div>
        </aside>
      </section>
      <section className="features" aria-label="Features">
        {[
          {
            Icon: BookOpen,
            title: "Log every session",
            text: "Keep a record of the books, minutes and thoughts that make up your reading life.",
          },
          {
            Icon: Layers3,
            title: "Sort by genre",
            text: "From imagined worlds to true stories, give every reading session its own place.",
          },
          {
            Icon: Clock3,
            title: "See minutes read",
            text: "See your time add up, discover your reading mix and celebrate small steps.",
          },
        ].map(({ Icon, title, text }, i) => (
          <Card className="feature" key={title}>
            <CardContent>
              <span className="feature-number">0{i + 1}</span>
              <Icon size={24} />
              <h2>{title}</h2>
              <p>{text}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}

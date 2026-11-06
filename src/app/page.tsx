import {
  BookOpen,
  Clock3,
  Layers3,
  Star,
  Leaf,
  BookmarkCheck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BookCover } from "@/components/reading/BookCover";
import { HomeActions } from "@/components/HomeActions";
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
          <HomeActions />
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
      <section className="shelf-section" aria-labelledby="shelf-heading">
        <div className="shelf-copy">
          <p className="eyebrow">
            <Sparkles size={14} /> ROOM FOR EVERY KIND OF STORY
          </p>
          <h2 id="shelf-heading">
            A reading life,
            <br />
            <em>beautifully collected.</em>
          </h2>
          <p>
            One book or a whole stack. Keep your sessions, favorite moments and
            quiet discoveries together.
          </p>
          <span className="shelf-note">
            <ShieldCheck size={15} />
            Your journal stays with your account.
          </span>
        </div>
        <div className="showcase-shelf" aria-label="Illustrative book shelf">
          {[
            { title: "Atomic Habits", genre: "Non-Fiction" },
            { title: "The Midnight Library", genre: "Fiction" },
            { title: "Dune", genre: "Sci-Fi" },
            { title: "Becoming", genre: "Biography" },
          ].map((book) => (
            <div className="shelf-book" key={book.title}>
              <BookCover title={book.title} genre={book.genre} />
              <span>{book.genre}</span>
            </div>
          ))}
          <div className="shelf-plank" aria-hidden="true" />
          <p className="shelf-caption">Illustrated covers · a sample shelf</p>
        </div>
      </section>
      <section
        id="how-it-works"
        className="how-section"
        aria-labelledby="how-heading"
      >
        <div className="how-heading">
          <p className="eyebrow">KEEP IT SIMPLE. KEEP READING.</p>
          <h2 id="how-heading">A habit in three little steps.</h2>
          <p>Less time organizing. More time between the pages.</p>
        </div>
        <div className="steps-grid">
          {[
            {
              number: "01",
              Icon: BookOpen,
              title: "Pick up a book",
              text: "A new world, a familiar favorite, or the next chapter on your list.",
            },
            {
              number: "02",
              Icon: Clock3,
              title: "Make a little time",
              text: "Ten minutes or an entire afternoon. Every session has its place.",
            },
            {
              number: "03",
              Icon: BookmarkCheck,
              title: "Keep the moment",
              text: "Log your minutes, leave a note and favorite the sessions that stay with you.",
            },
          ].map(({ number, Icon, title, text }) => (
            <article key={number}>
              <div className="step-top">
                <span>{number}</span>
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="closing-banner">
        <div>
          <span className="closing-icon">
            <BookOpen size={27} />
          </span>
          <p className="eyebrow">ONE CHAPTER AT A TIME</p>
          <h2>Your next chapter starts here.</h2>
          <p>Build a reading journal that feels like your own.</p>
        </div>
        <HomeActions />
      </section>
    </main>
  );
}

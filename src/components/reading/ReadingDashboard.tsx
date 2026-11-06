"use client";
import { useState } from "react";
import { BookCover } from "@/components/reading/BookCover";
import {
  BookOpen,
  Clock3,
  Star,
  Plus,
  Search,
  Trash2,
  Library,
  RotateCcw,
  LoaderCircle,
  Pencil,
  X,
  Check,
  Download,
  ArrowUpRight,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useReading, type ReadingSession } from "@/context/ReadingContext";
import {
  genres,
  today,
  validateReading,
  type ReadingFields,
} from "@/lib/reading-validation";
const blank: ReadingFields = {
  bookTitle: "",
  minutesRead: "",
  genre: "",
  note: "",
  readOn: "",
};
function ReadingForm() {
  const { mutate } = useReading();
  const [values, setValues] = useState<ReadingFields>(blank);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const errors = submitted ? validateReading(values) : {};
  function change(field: keyof ReadingFields, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    setError("");
    setSuccess("");
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setSuccess("");
    setError("");
    if (Object.keys(validateReading(values)).length) return;
    setBusy(true);
    try {
      await mutate(null, "POST", {
        ...values,
        minutesRead: Number(values.minutesRead),
      });
      setValues(blank);
      setSubmitted(false);
      setSuccess("Reading session added");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to add reading session",
      );
    } finally {
      setBusy(false);
    }
  }
  const fields = [
    {
      name: "bookTitle",
      label: "Book title",
      test: "book-title",
      placeholder: "What are you reading?",
    },
    {
      name: "minutesRead",
      label: "Minutes read",
      test: "minutes",
      placeholder: "e.g. 30",
    },
    { name: "genre", label: "Genre", test: "genre", placeholder: "" },
    {
      name: "note",
      label: "Note",
      test: "note",
      placeholder: "A chapter, a thought, a little takeaway…",
    },
    { name: "readOn", label: "Date", test: "date", placeholder: "" },
  ] as const;
  return (
    <Card className="log-form-card">
      <CardContent>
        <div className="section-title">
          <span className="icon-tile">
            <Plus size={20} />
          </span>
          <div>
            <h2>Log a reading session</h2>
            <p>A few minutes. A little more perspective.</p>
          </div>
        </div>
        <form
          data-testid="reading-log-form"
          noValidate
          onSubmit={submit}
          aria-busy={busy}
        >
          {fields.map((f) => (
            <div className="field" key={f.name}>
              <Label htmlFor={"input-" + f.test}>
                {f.label}
                {f.name === "note" && (
                  <span className="optional">Optional</span>
                )}
              </Label>
              {f.name === "genre" ? (
                <select
                  id="input-genre"
                  data-testid="input-genre"
                  value={values.genre}
                  onChange={(e) => change("genre", e.target.value)}
                  disabled={busy}
                  aria-invalid={!!errors.genre}
                  aria-describedby={errors.genre ? "genre-error" : undefined}
                >
                  <option value="">Choose genre</option>
                  {genres.map((g) => (
                    <option key={g}>{g}</option>
                  ))}
                </select>
              ) : f.name === "note" ? (
                <textarea
                  id="input-note"
                  data-testid="input-note"
                  value={values.note}
                  placeholder={f.placeholder}
                  onChange={(e) => change("note", e.target.value)}
                  disabled={busy}
                  rows={3}
                />
              ) : f.name === "readOn" ? (
                <input
                  id="input-date"
                  data-testid="input-date"
                  type="date"
                  max={today()}
                  value={values.readOn}
                  onChange={(e) => change("readOn", e.target.value)}
                  onInput={(e) => change("readOn", e.currentTarget.value)}
                  disabled={busy}
                  aria-invalid={!!errors.readOn}
                  aria-describedby={errors.readOn ? "date-error" : undefined}
                />
              ) : (
                <Input
                  id={"input-" + f.test}
                  data-testid={"input-" + f.test}
                  type={f.name === "minutesRead" ? "number" : "text"}
                  min={f.name === "minutesRead" ? 1 : undefined}
                  step={f.name === "minutesRead" ? 1 : undefined}
                  value={values[f.name]}
                  placeholder={f.placeholder}
                  onChange={(e) => change(f.name, e.target.value)}
                  disabled={busy}
                  aria-invalid={!!errors[f.name]}
                  aria-describedby={
                    errors[f.name] ? f.test + "-error" : undefined
                  }
                />
              )}{" "}
              {errors[f.name] && (
                <p
                  id={f.test + "-error"}
                  className="field-error"
                  data-testid={"error-" + f.test}
                  role="alert"
                >
                  {errors[f.name]}
                </p>
              )}
            </div>
          ))}
          {error && (
            <p
              className="form-error"
              data-testid="error-reading-log"
              role="alert"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="success-box"
              data-testid="reading-log-success"
              role="status"
            >
              {success}
            </p>
          )}
          <Button
            className="submit-button"
            type="submit"
            data-testid="btn-add-reading-log"
            disabled={busy}
          >
            {busy ? (
              <LoaderCircle size={17} className="spin" />
            ) : (
              <Plus size={17} />
            )}{" "}
            {busy ? "Saving session…" : "Add reading session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
function Summary() {
  const { summary } = useReading();
  return (
    <div className="stat-grid">
      {[
        {
          label: "Reading sessions",
          test: "reading-log-count",
          value: summary.count,
          Icon: BookOpen,
        },
        {
          label: "Minutes read",
          test: "total-minutes",
          value: summary.totalMinutes,
          Icon: Clock3,
        },
        {
          label: "Favorites",
          test: "favorite-count",
          value: summary.favoriteCount,
          Icon: Star,
        },
      ].map(({ label, test, value, Icon }) => (
        <Card className="stat-card" key={test}>
          <CardContent>
            <div>
              <span>{label}</span>
              <strong data-testid={test}>{value}</strong>
            </div>
            <span className="stat-icon">
              <Icon size={22} />
            </span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
function Breakdown() {
  const { summary } = useReading();
  return (
    <Card className="breakdown-card">
      <CardContent>
        <div className="section-title">
          <Library size={20} />
          <h2>Your reading mix</h2>
        </div>
        <div data-testid="genre-breakdown">
          {summary.breakdown.map((g) => (
            <div
              data-testid="breakdown-row"
              className="breakdown"
              key={g.genre}
            >
              <div>
                <span data-testid="breakdown-name">{g.genre}</span>
                <span>
                  <b data-testid="breakdown-total">{g.total}</b> min ·{" "}
                  <b data-testid="breakdown-count">{g.count}</b> sessions
                </span>
              </div>
              <div className="meter" aria-hidden="true">
                <span
                  style={{
                    width:
                      (summary.totalMinutes
                        ? (g.total / summary.totalMinutes) * 100
                        : 0) + "%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        {!summary.breakdown.length && (
          <p className="muted small-text">
            Your genre breakdown will appear here.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
function Filters() {
  const {
    genre,
    favorite,
    query,
    setGenre,
    setFavorite,
    setQuery,
    clearFilters,
  } = useReading();
  return (
    <div className="filters">
      <div className="search-field">
        <Search size={17} aria-hidden="true" />
        <Input
          aria-label="Search book title or note"
          placeholder="Search a book or note…"
          data-testid="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="filter-controls">
        <select
          data-testid="filter-genre"
          aria-label="Filter by genre"
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
        >
          <option value="">All</option>
          {genres.map((g) => (
            <option key={g}>{g}</option>
          ))}
        </select>
        <label className="favorite-filter">
          <input
            type="checkbox"
            data-testid="filter-favorite"
            checked={favorite}
            onChange={(e) => setFavorite(e.target.checked)}
          />
          <Star size={15} /> Favorites only
        </label>
        <Button
          variant="ghost"
          data-testid="btn-clear-filters"
          onClick={clearFilters}
        >
          <RotateCcw size={14} />
          Clear
        </Button>
      </div>
    </div>
  );
}
function SessionItem({ session }: { session: ReadingSession }) {
  const { mutate } = useReading();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(session.bookTitle);
  const [minutes, setMinutes] = useState(String(session.minutesRead));
  async function action(method: "PATCH" | "DELETE", body?: unknown) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await mutate(session.id, method, body);
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to update session");
    } finally {
      setBusy(false);
    }
  }
  return (
    <article className="session-item" data-testid="reading-log-item">
      <BookCover title={session.bookTitle} genre={session.genre} />
      <div className="session-details">
        <div className="session-heading">
          <h3 data-testid="reading-log-title">{session.bookTitle}</h3>
          <span className="genre-badge" data-testid="reading-log-genre">
            {session.genre}
          </span>
        </div>
        <div className="session-meta">
          <span>
            <Clock3 size={13} />
            <span data-testid="reading-log-minutes">
              {session.minutesRead}
            </span>{" "}
            min
          </span>
          <time data-testid="reading-log-date" dateTime={session.readOn}>
            {session.readOn}
          </time>
        </div>
        {session.note && <p className="session-note">{session.note}</p>}
        {editing && (
          <form
            className="inline-edit"
            onSubmit={(e) => {
              e.preventDefault();
              void action("PATCH", {
                bookTitle: title,
                minutesRead: Number(minutes),
              });
            }}
          >
            <Input
              aria-label="Edit book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              aria-label="Edit minutes"
              type="number"
              step="1"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
            />
            <Button
              type="submit"
              disabled={busy}
              size="icon"
              aria-label="Save edits"
            >
              <Check size={16} />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Cancel editing"
              onClick={() => setEditing(false)}
            >
              <X size={16} />
            </Button>
          </form>
        )}
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
      </div>
      <div className="session-actions">
        <Button
          variant="ghost"
          size="icon"
          data-testid="btn-toggle-favorite"
          aria-pressed={session.favorite}
          aria-label={session.favorite ? "Remove favorite" : "Mark as favorite"}
          disabled={busy}
          onClick={() => void action("PATCH", { favorite: !session.favorite })}
        >
          <Star size={18} fill={session.favorite ? "currentColor" : "none"} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Edit session"
          disabled={busy}
          onClick={() => setEditing((v) => !v)}
        >
          <Pencil size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          data-testid="btn-delete-reading-log"
          aria-label="Delete reading session"
          disabled={busy}
          onClick={() => void action("DELETE")}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </article>
  );
}
function SessionList() {
  const { sessions, loading, error, refresh } = useReading();
  return (
    <>
      {error ? (
        <div className="form-error" role="alert">
          {error}
          <Button variant="ghost" onClick={refresh}>
            Try again
          </Button>
        </div>
      ) : null}
      {loading && (
        <p className="list-loading" role="status">
          <LoaderCircle size={15} className="spin" />
          Updating your reading journal…
        </p>
      )}
      <div
        data-testid="reading-log-list"
        className="session-list"
        aria-busy={loading}
      >
        {sessions.map((session) => (
          <SessionItem session={session} key={session.id} />
        ))}
      </div>
      {!loading && !error && !sessions.length && (
        <div className="empty-state">
          <span className="empty-icon">
            <BookOpen size={32} />
          </span>
          <h3 data-testid="reading-logs-empty">No reading sessions found</h3>
          <p>
            Add your first session, or try adjusting the filters.
            <br />
            Every reading habit starts with a single page.
          </p>
        </div>
      )}
    </>
  );
}
function ExportButton() {
  const { sessions } = useReading();
  function download() {
    const columns = [
      "bookTitle",
      "minutesRead",
      "genre",
      "note",
      "favorite",
      "readOn",
    ] as const;
    const quote = (v: unknown) => '"' + String(v).replaceAll('"', '""') + '"';
    const csv = [
      columns.join(","),
      ...sessions.map((s) => columns.map((k) => quote(s[k])).join(",")),
    ].join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "readlog-sessions.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <Button variant="outline" onClick={download} disabled={!sessions.length}>
      <Download size={15} />
      Export CSV
    </Button>
  );
}
function ShelfPreview() {
  const { sessions } = useReading();
  const books = sessions
    .filter(
      (session, index, all) =>
        all.findIndex((item) => item.bookTitle === session.bookTitle) === index,
    )
    .slice(0, 3);
  if (!books.length) return null;
  return (
    <div className="journal-shelf">
      <div className="shelf-strip-label">
        <BookOpen size={16} />
        <span>ON YOUR SHELF</span>
        <small>From the current view</small>
      </div>
      <div className="journal-shelf-books">
        {books.map((book) => (
          <div className="journal-shelf-book" key={book.id}>
            <BookCover title={book.bookTitle} genre={book.genre} />
            <div>
              <span className="genre-badge">{book.genre}</span>
              <strong>{book.bookTitle}</strong>
              <span className="shelf-book-time">
                <Clock3 size={12} />
                {book.minutesRead} min reading
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
function ViewCount() {
  const { summary, genre, favorite, query } = useReading();
  return (
    <span className="view-count">
      {summary.count} sessions
      {genre || favorite || query.trim() ? " · filtered" : " · all genres"}
    </span>
  );
}
export function ReadingDashboard() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="shell reading-page"
      data-testid="reading-logs-page"
    >
      <div className="journal-breadcrumb">
        <BookOpen size={13} />
        <span>My library</span>
        <span>/</span>
        <strong>Reading journal</strong>
        <span className="private-label">
          <Leaf size={12} />
          Your personal space
        </span>
      </div>
      <div className="journal-heading">
        <div>
          <p className="eyebrow">A FEW PAGES, EVERY DAY</p>
          <h1>
            Your reading journal<span>.</span>
          </h1>
          <p className="muted">
            Make time for a good book. Keep a little record of it here.
          </p>
        </div>
        <ExportButton />
      </div>
      <Summary />
      <div className="journal-note">
        <span className="note-symbol">
          <BookOpen size={18} />
        </span>
        <div>
          <strong>Make a little room for reading.</strong>
          <span>Every session is a small step. Keep the story going.</span>
        </div>
        <a href="#input-book-title" className="journal-add-link">
          Log a session
          <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="journal-grid">
        <aside className="journal-sidebar">
          <ReadingForm />
          <Breakdown />
        </aside>
        <section className="journal-main" aria-label="Reading sessions">
          <div className="list-heading">
            <div>
              <p className="collection-eyebrow">YOUR PERSONAL COLLECTION</p>
              <h2>Reading sessions</h2>
            </div>
            <ViewCount />
          </div>
          <ShelfPreview />
          <Filters />
          <SessionList />
        </section>
      </div>
    </main>
  );
}

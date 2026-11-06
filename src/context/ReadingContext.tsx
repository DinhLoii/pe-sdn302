"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
export type ReadingSession = {
  id: string;
  bookTitle: string;
  minutesRead: number;
  genre: string;
  note: string;
  favorite: boolean;
  readOn: string;
  createdAt: string;
};
type Summary = {
  count: number;
  favoriteCount: number;
  totalMinutes: number;
  breakdown: { genre: string; count: number; total: number }[];
};
const empty: Summary = {
  count: 0,
  favoriteCount: 0,
  totalMinutes: 0,
  breakdown: [],
};
type ReadingState = {
  sessions: ReadingSession[];
  summary: Summary;
  loading: boolean;
  error: string;
  genre: string;
  favorite: boolean;
  query: string;
  setGenre: (v: string) => void;
  setFavorite: (v: boolean) => void;
  setQuery: (v: string) => void;
  clearFilters: () => void;
  refresh: () => void;
  mutate: (
    id: string | null,
    method: "POST" | "PATCH" | "DELETE",
    body?: unknown,
  ) => Promise<void>;
};
const ReadingContext = createContext<ReadingState | null>(null);
function SessionState({ children }: { children: ReactNode }) {
  const { user, clear } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sessions, setSessions] = useState<ReadingSession[]>([]);
  const [summary, setSummary] = useState(empty);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [genre, setGenre] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [query, setQuery] = useState("");
  const [revision, setRevision] = useState(0);
  const version = useRef(0);
  const refresh = useCallback(() => setRevision((v) => v + 1), []);
  useEffect(() => {
    if (!user || pathname !== "/reading-logs") return;
    const controller = new AbortController();
    const current = ++version.current;
    const params = new URLSearchParams();
    if (genre) params.set("genre", genre);
    if (favorite) params.set("favorite", "true");
    if (query.trim()) params.set("q", query.trim());
    const suffix = params.size ? "?" + params : "";
    async function load() {
      await Promise.resolve();
      if (controller.signal.aborted) return;
      setLoading(true);
      setError("");
      try {
        const responses = await Promise.all([
          fetch("/api/reading-logs" + suffix, {
            signal: controller.signal,
            cache: "no-store",
          }),
          fetch("/api/reading-logs/summary" + suffix, {
            signal: controller.signal,
            cache: "no-store",
          }),
        ]);
        if (responses.some((r) => r.status === 401)) {
          clear();
          router.replace("/login");
          router.refresh();
          return;
        }
        const [logs, totals] = await Promise.all(
          responses.map((r) => r.json()),
        );
        if (responses.some((r) => !r.ok))
          throw new Error(
            logs.error || totals.error || "Unable to load reading sessions",
          );
        if (current === version.current) {
          setSessions(logs);
          setSummary(totals);
        }
      } catch (e) {
        if (!controller.signal.aborted && current === version.current)
          setError(e instanceof Error ? e.message : "Unable to load sessions");
      } finally {
        if (!controller.signal.aborted && current === version.current)
          setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
    // Identity changes remount this provider; avoid reloading on unrelated context updates.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, pathname, genre, favorite, query, revision]);
  async function mutate(
    id: string | null,
    method: "POST" | "PATCH" | "DELETE",
    body?: unknown,
  ) {
    const response = await fetch("/api/reading-logs" + (id ? "/" + id : ""), {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await response.json();
    if (response.status === 401) {
      clear();
      router.replace("/login");
      router.refresh();
      throw new Error("Unauthorized");
    }
    if (!response.ok) throw new Error(data.error || "Unable to save session");
    refresh();
  }
  return (
    <ReadingContext.Provider
      value={{
        sessions,
        summary,
        loading,
        error,
        genre,
        favorite,
        query,
        setGenre,
        setFavorite,
        setQuery,
        clearFilters: () => {
          setGenre("");
          setFavorite(false);
          setQuery("");
        },
        refresh,
        mutate,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
}
export function ReadingProvider({ children }: { children: ReactNode }) {
  const { user, clearVersion } = useAuth();
  return (
    <SessionState key={(user?.id ?? "guest") + ":" + clearVersion}>
      {children}
    </SessionState>
  );
}
export function useReading() {
  const context = useContext(ReadingContext);
  if (!context) throw new Error("ReadingProvider missing");
  return context;
}

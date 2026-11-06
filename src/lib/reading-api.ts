import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { error, safeOrigin } from "@/lib/auth-api";
import { getPrisma } from "@/lib/prisma";
import { genres, validateReading } from "@/lib/reading-validation";
import type { Prisma, ReadingLog } from "@/generated/prisma/client";
export const duplicateMessage =
  "Duplicate reading session: a reading session with the same book title, minutes and date already exists";
export function serialize(row: ReadingLog) {
  return {
    id: row.id,
    bookTitle: row.bookTitle,
    minutesRead: row.minutesRead,
    genre: row.genre,
    note: row.note,
    favorite: row.favorite,
    readOn: row.readOn,
    createdAt: row.createdAt.toISOString(),
  };
}
const json = (value: unknown, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
function where(
  request: NextRequest,
  userId: string,
): Prisma.ReadingLogWhereInput {
  const params = request.nextUrl.searchParams;
  const q = params.get("q")?.trim();
  const genre = params.get("genre");
  return {
    userId,
    ...(genre ? { genre } : {}),
    ...(params.get("favorite") === "true" ? { favorite: true } : {}),
    ...(q
      ? {
          OR: [
            { bookTitle: { contains: q, mode: "insensitive" as const } },
            { note: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}
export async function handleReading(
  request: NextRequest,
  operation: "list" | "summary" | "create" | "patch" | "delete",
  id?: string,
) {
  try {
    const user = await currentUser();
    if (!user) return error("Unauthorized", 401);
    if (!["list", "summary"].includes(operation) && !safeOrigin(request))
      return error("Forbidden", 403);
    const db = getPrisma();
    if (operation === "list" || operation === "summary") {
      const rows = await db.readingLog.findMany({
        where: where(request, user.id),
      });
      if (operation === "list")
        return json(
          rows
            .sort(
              (a, b) =>
                b.readOn.localeCompare(a.readOn) ||
                a.bookTitle
                  .toLowerCase()
                  .localeCompare(b.bookTitle.toLowerCase(), "en") ||
                a.id.localeCompare(b.id),
            )
            .map(serialize),
        );
      const breakdown = genres
        .map((genre) => {
          const group = rows.filter((r) => r.genre === genre);
          return {
            genre,
            count: group.length,
            total: group.reduce((sum, r) => sum + r.minutesRead, 0),
          };
        })
        .filter((g) => g.count)
        .sort(
          (a, b) =>
            b.total - a.total ||
            genres.indexOf(a.genre) - genres.indexOf(b.genre),
        );
      return json({
        count: rows.length,
        favoriteCount: rows.filter((r) => r.favorite).length,
        totalMinutes: rows.reduce((sum, r) => sum + r.minutesRead, 0),
        breakdown,
      });
    }
    if (operation === "delete") {
      const result = await db.readingLog.deleteMany({
        where: { id, userId: user.id },
      });
      return result.count
        ? json({ success: true })
        : error("Reading log not found", 404);
    }
    if (
      operation === "patch" &&
      !(await db.readingLog.findFirst({
        where: { id, userId: user.id },
        select: { id: true },
      }))
    )
      return error("Reading log not found", 404);
    let body: Record<string, unknown>;
    try {
      const value = await request.json();
      if (!value || typeof value !== "object" || Array.isArray(value))
        return error("Invalid request body", 400);
      body = value;
    } catch {
      return error("Invalid request body", 400);
    }
    const validation = Object.values(
      validateReading(body, operation === "patch"),
    )[0];
    if (validation) return error(validation, 400);
    if ("note" in body && typeof body.note !== "string")
      return error("Note must be text", 400);
    if (
      operation === "patch" &&
      "favorite" in body &&
      typeof body.favorite !== "boolean"
    )
      return error("Favorite must be a boolean", 400);
    const data = {
      ...(typeof body.bookTitle === "string"
        ? { bookTitle: body.bookTitle.trim() }
        : {}),
      ...("minutesRead" in body
        ? { minutesRead: Number(body.minutesRead) }
        : {}),
      ...(typeof body.genre === "string" ? { genre: body.genre } : {}),
      ...(typeof body.note === "string" ? { note: body.note } : {}),
      ...(typeof body.readOn === "string" ? { readOn: body.readOn } : {}),
      ...(operation === "patch" && typeof body.favorite === "boolean"
        ? { favorite: body.favorite }
        : {}),
    };
    if (operation === "create") {
      const row = await db.readingLog.create({
        data: {
          userId: user.id,
          bookTitle: data.bookTitle!,
          minutesRead: data.minutesRead!,
          genre: data.genre!,
          note: data.note ?? "",
          readOn: data.readOn!,
        },
      });
      return json(serialize(row), 201);
    }
    const row = await db.readingLog.update({
      where: { id, userId: user.id },
      data,
    });
    return json(serialize(row));
  } catch (cause) {
    if (cause && typeof cause === "object" && "code" in cause) {
      if (cause.code === "P2002") return error(duplicateMessage, 409);
      if (cause.code === "P2025") return error("Reading log not found", 404);
    }
    return error("Unable to process reading sessions. Please try again.", 503);
  }
}

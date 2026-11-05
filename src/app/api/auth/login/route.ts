import { NextRequest, NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { getPrisma } from "@/lib/prisma";
import { cookieOptions, createSession, sessionCookie } from "@/lib/auth";
import { error, readFields, safeOrigin } from "@/lib/auth-api";
import { validateAuth } from "@/lib/validations/auth";
const dummy = hash("timing-only-placeholder", 12);
export async function POST(request: NextRequest) {
  if (!safeOrigin(request)) return error("Forbidden", 403);
  const fields = await readFields(request);
  if (!fields) return error("Invalid request body", 400);
  const invalid = Object.values(validateAuth(fields, false))[0];
  if (invalid) return error(invalid, 400);
  try {
    const user = await getPrisma().user.findUnique({
      where: { email: fields.email.trim().toLowerCase() },
    });
    const valid = await compare(
      fields.password,
      user?.passwordHash ?? (await dummy),
    );
    if (!user || !valid) return error("Invalid email or password", 401);
    const response = NextResponse.json(
      { id: user.id, email: user.email },
      { headers: { "Cache-Control": "no-store" } },
    );
    response.cookies.set(sessionCookie, await createSession(user.id), {
      ...cookieOptions,
      maxAge: 604800,
    });
    return response;
  } catch {
    return error("Unable to sign in. Please try again.", 503);
  }
}

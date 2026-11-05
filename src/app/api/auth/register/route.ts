import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getPrisma } from "@/lib/prisma";
import { validateAuth } from "@/lib/validations/auth";
import { error, readFields, safeOrigin } from "@/lib/auth-api";
export async function POST(request: NextRequest) {
  if (!safeOrigin(request)) return error("Forbidden", 403);
  const fields = await readFields(request);
  if (!fields) return error("Invalid request body", 400);
  const invalid = Object.values(validateAuth(fields, true))[0];
  if (invalid) return error(invalid, 400);
  if (new TextEncoder().encode(fields.password).length > 72)
    return error("Password must be at most 72 bytes", 400);
  try {
    const user = await getPrisma().user.create({
      data: {
        email: fields.email.trim().toLowerCase(),
        passwordHash: await hash(fields.password, 12),
      },
      select: { id: true, email: true },
    });
    return NextResponse.json(user, { status: 201 });
  } catch (cause) {
    if (
      cause &&
      typeof cause === "object" &&
      "code" in cause &&
      cause.code === "P2002"
    )
      return error("Email already registered", 409);
    return error("Unable to register. Please try again.", 503);
  }
}

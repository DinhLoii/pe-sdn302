import { NextRequest, NextResponse } from "next/server";
import { cookieOptions, sessionCookie } from "@/lib/auth";
import { safeOrigin, error } from "@/lib/auth-api";
export async function POST(request: NextRequest) {
  if (!safeOrigin(request)) return error("Forbidden", 403);
  const response = NextResponse.json({ success: true });
  response.cookies.set(sessionCookie, "", { ...cookieOptions, maxAge: 0 });
  return response;
}

import { NextResponse } from "next/server";
import { currentUser } from "@/lib/auth";
import { error } from "@/lib/auth-api";
export async function GET() {
  try {
    const user = await currentUser();
    return user
      ? NextResponse.json(user, { headers: { "Cache-Control": "no-store" } })
      : error("Unauthorized", 401);
  } catch {
    return error("Service unavailable", 503);
  }
}

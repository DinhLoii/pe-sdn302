import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { getPrisma } from "@/lib/prisma";
export const sessionCookie = "session_token";
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
function key() {
  if (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)
    throw new Error("AUTH_SECRET must contain at least 32 characters");
  return new TextEncoder().encode(process.env.AUTH_SECRET);
}
export function createSession(id: string) {
  return new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(id)
    .setIssuer("expensetrail")
    .setAudience("expensetrail")
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key());
}
export async function currentUser() {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token) return null;
  let id: string;
  try {
    const { payload } = await jwtVerify(token, key(), {
      algorithms: ["HS256"],
      issuer: "expensetrail",
      audience: "expensetrail",
    });
    if (!payload.sub) return null;
    id = payload.sub;
  } catch {
    return null;
  }
  return getPrisma().user.findUnique({
    where: { id },
    select: { id: true, email: true },
  });
}

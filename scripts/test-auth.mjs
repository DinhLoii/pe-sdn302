import assert from "node:assert/strict";
import { SignJWT } from "jose";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
async function request(path, body, cookie) {
  const r = await fetch(base + path, {
    method: body ? "POST" : "GET",
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    redirect: "manual",
  });
  return {
    status: r.status,
    data: (r.headers.get("content-type") || "").includes("json")
      ? await r.json()
      : null,
    cookie: r.headers.get("set-cookie"),
    location: r.headers.get("location"),
  };
}
assert.equal((await request("/api/auth/me")).status, 401);
assert.equal((await request("/expenses")).location, "/login");
for (const [body, message] of [
  [{}, "Email is required"],
  [{ email: "wrong" }, "Please enter a valid email address"],
  [{ email: "a@b.com" }, "Password is required"],
  [
    { email: "a@b.com", password: "123" },
    "Password must be at least 6 characters",
  ],
  [{ email: "a@b.com", password: "123456" }, "Confirm password is required"],
  [
    { email: "a@b.com", password: "123456", confirmPassword: "x" },
    "Passwords do not match",
  ],
]) {
  const r = await request("/api/auth/register", body);
  assert.equal(r.status, 400);
  assert.equal(r.data.error, message);
}
const credentials = {
  email: "grader.qe190167@example.com",
  password: "Test1234!",
};
const register = await request("/api/auth/register", {
  ...credentials,
  confirmPassword: credentials.password,
});
assert.ok([201, 409].includes(register.status));
assert.equal(register.cookie, null);
assert.equal(
  (
    await request("/api/auth/register", {
      ...credentials,
      confirmPassword: credentials.password,
    })
  ).status,
  409,
);
const wrong = await request("/api/auth/login", {
  ...credentials,
  password: "wrong-password",
});
assert.equal(wrong.status, 401);
assert.deepEqual(wrong.data, { error: "Invalid email or password" });
assert.equal(wrong.cookie, null);
const login = await request("/api/auth/login", credentials);
assert.equal(login.status, 200);
assert.deepEqual(Object.keys(login.data).sort(), ["email", "id"]);
assert.match(login.cookie, /HttpOnly/i);
assert.match(login.cookie, /SameSite=Lax/i);
const cookie = login.cookie.split(";")[0];
assert.equal(
  (await request("/api/auth/me", undefined, cookie)).data.email,
  credentials.email,
);
assert.equal((await request("/expenses", undefined, cookie)).status, 200);
assert.equal(
  (await request("/api/auth/me", undefined, "session_token=invalid")).status,
  401,
);
const expired = await new SignJWT({})
  .setProtectedHeader({ alg: "HS256" })
  .setSubject(login.data.id)
  .setIssuer("expensetrail")
  .setAudience("expensetrail")
  .setExpirationTime(1)
  .sign(new TextEncoder().encode(process.env.AUTH_SECRET));
assert.equal(
  (await request("/api/auth/me", undefined, "session_token=" + expired)).status,
  401,
);
const logout = await request("/api/auth/logout", {}, cookie);
assert.equal(logout.status, 200);
assert.match(logout.cookie, /Max-Age=0/i);
assert.equal(
  (await request("/api/auth/me", undefined, logout.cookie.split(";")[0]))
    .status,
  401,
);
console.log(
  "PASS: validation, register, duplicate, login, cookie, protected page, invalid/expired session, logout. Demo account ready through Register API.",
);

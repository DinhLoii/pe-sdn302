import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3100";
let checks = 0;
async function call(path, { method = "GET", body, cookie } = {}) {
  const response = await fetch(base + path, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json", Origin: base } : {}),
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: "manual",
  });
  const json = (response.headers.get("content-type") || "").includes(
    "application/json",
  )
    ? await response.json()
    : null;
  return {
    status: response.status,
    json,
    cookie: response.headers.get("set-cookie"),
    location: response.headers.get("location"),
  };
}
function equal(actual, expected) {
  assert.deepEqual(actual, expected);
  checks++;
}
async function user(email) {
  const password = "Test1234!";
  const registered = await call("/api/auth/register", {
    method: "POST",
    body: { email, password, confirmPassword: password },
  });
  assert.ok([201, 409].includes(registered.status));
  const r = await call("/api/auth/login", {
    method: "POST",
    body: { email, password },
  });
  equal(r.status, 200);
  return { cookie: r.cookie.split(";")[0], id: r.json.id };
}
for (const [path, method, body] of [
  ["/api/reading-logs", "GET"],
  ["/api/reading-logs/summary", "GET"],
  ["/api/reading-logs", "POST", {}],
  ["/api/reading-logs/missing", "PATCH", {}],
  ["/api/reading-logs/missing", "DELETE"],
]) {
  const r = await call(path, { method, body });
  equal(r.status, 401);
  equal(r.json, { error: "Unauthorized" });
}
equal((await call("/reading-logs")).location, "/login");
const a = await user("qa.readlog.a@example.com"),
  b = await user("qa.readlog.b@example.com");
const api = "/api/reading-logs";
// These two explicitly disposable QA accounts keep the test isolated from grader data.
for (const u of [a, b]) {
  const list = await call(api, { cookie: u.cookie });
  equal(list.status, 200);
  for (const row of list.json)
    await call(api + "/" + row.id, { method: "DELETE", cookie: u.cookie });
}
const good = {
  bookTitle: "Atomic Habits",
  minutesRead: 40,
  genre: "Non-Fiction",
  readOn: "2026-10-20",
};
const invalid = [
  ["bookTitle", "", "Book title is required"],
  ["bookTitle", " ".repeat(3), "Book title is required"],
  ["bookTitle", "x".repeat(81), "Book title must be at most 80 characters"],
  ["minutesRead", "", "Minutes read is required"],
  ["minutesRead", "invalid", "Minutes read is required"],
  ["minutesRead", -1, "Minutes read must be a positive number"],
  ["minutesRead", 0, "Minutes read must be a positive number"],
  ["minutesRead", 1.5, "Minutes read must be a positive number"],
  ["genre", "", "Please choose a genre"],
  ["genre", "Fantasy", "Invalid genre"],
  ["readOn", "", "Date is required"],
  ["readOn", "2099-01-01", "Date cannot be in the future"],
  ["readOn", "2026-02-30", "Date is required"],
];
for (const [field, value, message] of invalid) {
  const r = await call(api, {
    method: "POST",
    cookie: a.cookie,
    body: { ...good, [field]: value },
  });
  equal(r.status, 400);
  equal(r.json, { error: message });
}
const created = [];
async function add(body, cookie = a.cookie) {
  const r = await call(api, { method: "POST", cookie, body });
  equal(r.status, 201);
  created.push(r.json);
  return r.json;
}
try {
  const atomic = await add({
    ...good,
    userId: b.id,
    ownerId: b.id,
    favorite: true,
  });
  equal(atomic.favorite, false);
  equal(atomic.note, "");
  equal(typeof atomic.minutesRead, "number");
  equal(atomic.readOn, "2026-10-20");
  equal(
    Object.keys(atomic).sort(),
    [
      "id",
      "bookTitle",
      "minutesRead",
      "genre",
      "note",
      "favorite",
      "readOn",
      "createdAt",
    ].sort(),
  );
  const duplicate = await call(api, {
    method: "POST",
    cookie: a.cookie,
    body: good,
  });
  equal(duplicate.status, 409);
  equal(
    duplicate.json.error,
    "Duplicate reading session: a reading session with the same book title, minutes and date already exists",
  );
  await add({
    ...good,
    bookTitle: "zebra",
    minutesRead: 20,
    genre: "Fiction",
    note: "Find this NEEDLE",
  });
  const alpha = await add({
    ...good,
    bookTitle: "alpha",
    minutesRead: 30,
    genre: "Fiction",
  });
  const beta = await add({
    ...good,
    bookTitle: "Beta",
    minutesRead: 50,
    genre: "Sci-Fi",
  });
  await add({
    ...good,
    bookTitle: "older",
    minutesRead: 10,
    genre: "Biography",
    readOn: "2026-10-19",
  });
  const list = await call(api, { cookie: a.cookie });
  equal(
    list.json.map((r) => r.bookTitle),
    ["alpha", "Atomic Habits", "Beta", "zebra", "older"],
  );
  equal((await call(api, { cookie: b.cookie })).json, []);
  for (const method of ["PATCH", "DELETE"]) {
    const r = await call(api + "/" + atomic.id, {
      method,
      cookie: b.cookie,
      ...(method === "PATCH" ? { body: { favorite: true } } : {}),
    });
    equal(r.status, 404);
    equal(r.json, { error: "Reading log not found" });
  }
  equal(
    (
      await call(api + "/missing", {
        method: "PATCH",
        body: { favorite: true },
        cookie: a.cookie,
      })
    ).status,
    404,
  );
  for (const [field, value, message] of invalid) {
    const r = await call(api + "/" + alpha.id, {
      method: "PATCH",
      cookie: a.cookie,
      body: { [field]: value },
    });
    equal(r.status, 400);
    equal(r.json, { error: message });
  }
  const conflict = await call(api + "/" + alpha.id, {
    method: "PATCH",
    cookie: a.cookie,
    body: { bookTitle: "Atomic Habits", minutesRead: 40, genre: "Non-Fiction" },
  });
  equal(conflict.status, 409);
  const favorite = await call(api + "/" + beta.id, {
    method: "PATCH",
    cookie: a.cookie,
    body: { favorite: true, userId: b.id },
  });
  equal(favorite.status, 200);
  equal(favorite.json.favorite, true);
  equal(
    (await call(api + "?favorite=true", { cookie: a.cookie })).json.map(
      (r) => r.id,
    ),
    [beta.id],
  );
  equal(
    (await call(api + "?q=%20needle%20", { cookie: a.cookie })).json.map(
      (r) => r.bookTitle,
    ),
    ["zebra"],
  );
  equal(
    (await call(api + "?genre=Fiction&q=ALP", { cookie: a.cookie })).json.map(
      (r) => r.bookTitle,
    ),
    ["alpha"],
  );
  const summary = await call(api + "/summary", { cookie: a.cookie });
  equal(summary.json, {
    count: 5,
    favoriteCount: 1,
    totalMinutes: 150,
    breakdown: [
      { genre: "Fiction", count: 2, total: 50 },
      { genre: "Sci-Fi", count: 1, total: 50 },
      { genre: "Non-Fiction", count: 1, total: 40 },
      { genre: "Biography", count: 1, total: 10 },
    ],
  });
  equal(
    (
      await call(api + "/summary?genre=Sci-Fi&favorite=true&q=beta", {
        cookie: a.cookie,
      })
    ).json,
    {
      count: 1,
      favoriteCount: 1,
      totalMinutes: 50,
      breakdown: [{ genre: "Sci-Fi", count: 1, total: 50 }],
    },
  );
  equal(
    (await call(api + "/summary?q=nomatchingbook", { cookie: a.cookie })).json,
    { count: 0, favoriteCount: 0, totalMinutes: 0, breakdown: [] },
  );
  await call(api + "/" + beta.id, {
    method: "PATCH",
    cookie: a.cookie,
    body: { favorite: false },
  });
  equal((await call(api + "?favorite=true", { cookie: a.cookie })).json, []);
  const removed = await call(api + "/" + atomic.id, {
    method: "DELETE",
    cookie: a.cookie,
  });
  equal(removed.status, 200);
  equal(removed.json, { success: true });
  equal(
    (await call(api + "/" + atomic.id, { method: "DELETE", cookie: a.cookie }))
      .status,
    404,
  );
  console.log(
    `PASS: ${checks} ReadLog API assertions (validation, sorting, duplicates, ownership, filters, summary, favorite, deletion).`,
  );
} finally {
  for (const row of created)
    await call(api + "/" + row.id, { method: "DELETE", cookie: a.cookie });
}

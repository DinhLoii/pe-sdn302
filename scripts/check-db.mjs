import pg from "pg";
for (const name of ["DATABASE_URL", "DIRECT_URL"]) {
  if (!process.env[name]) { console.error(`${name}: missing`); process.exitCode = 1; continue; }
  const client = new pg.Client({ connectionString: process.env[name], connectionTimeoutMillis: 15000 });
  try { await client.connect(); await client.query("SELECT 1"); console.log(`${name}: connected (read-only check)`); }
  catch (error) { console.error(`${name}: connection failed (${error.code ?? "unknown"}); check network/project/password.`); process.exitCode = 1; }
  finally { await client.end().catch(() => {}); }
}

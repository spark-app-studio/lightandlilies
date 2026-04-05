import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";
import bcrypt from "bcryptjs";

console.log("Starting admin password reset...");

// Load .env.local
try {
  const envPath = resolve(process.cwd(), ".env.local");
  const envFile = readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex);
    const value = trimmed.slice(eqIndex + 1);
    if (!process.env[key]) process.env[key] = value;
  }
  console.log("Loaded .env.local");
} catch (e) {
  console.log(".env.local not found, using environment variables");
}

const dbUrl = process.env.DATABASE_URL;
console.log("DATABASE_URL:", dbUrl ? `${dbUrl.slice(0, 20)}...` : "NOT SET");

if (!dbUrl) {
  console.error("ERROR: DATABASE_URL is not set");
  process.exit(1);
}

const password = process.argv[2] || process.env.ADMIN_PASSWORD;
console.log("ADMIN_PASSWORD:", password ? `${password.slice(0, 3)}***` : "NOT SET");

if (!password) {
  console.error("ERROR: No password. Pass as argument or set ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

const { Pool } = pg;

async function run() {
  const pool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.DATABASE_SSL === "true"
      ? { rejectUnauthorized: false }
      : undefined,
  });

  try {
    console.log("Connecting to database...");
    const hash = await bcrypt.hash(password, 12);
    console.log("Password hashed, updating database...");

    const { rowCount } = await pool.query(
      "UPDATE admins SET password_hash = $1 WHERE email = $2",
      [hash, "curator@lightandlilies.com"]
    );

    if (rowCount > 0) {
      console.log("SUCCESS: Admin password updated for curator@lightandlilies.com");
    } else {
      console.log("WARNING: Admin not found — run npm run dbmigrate first");
    }
  } catch (err) {
    console.error("ERROR:", err.message);
  } finally {
    await pool.end();
    console.log("Done.");
  }
}

run();

import { readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";
import bcrypt from "bcryptjs";

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
} catch {
  // .env.local not found, rely on environment variables
}

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === "true"
    ? { rejectUnauthorized: false }
    : undefined,
});

async function migrate() {
  console.log("Running migrations...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS artworks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      collection_id VARCHAR(100) NOT NULL,
      title VARCHAR(200) NOT NULL,
      medium VARCHAR(200) DEFAULT '',
      description TEXT DEFAULT '',
      image_path VARCHAR(2000) NOT NULL,
      buy_url VARCHAR(2000) DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS admins (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      recovery_email VARCHAR(255),
      password_hash VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS customers (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      agree_to_emails BOOLEAN NOT NULL DEFAULT FALSE,
      agreed_to_emails_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS customer_collections (
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      collection_id VARCHAR(100) NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      PRIMARY KEY (customer_id, collection_id)
    );

    CREATE TABLE IF NOT EXISTS purchases (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
      status VARCHAR(50) DEFAULT 'clicked',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS view_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
      artwork_id UUID NOT NULL REFERENCES artworks(id) ON DELETE CASCADE,
      collection_id VARCHAR(100) NOT NULL,
      viewed_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS news (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title VARCHAR(500) NOT NULL,
      body TEXT,
      active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS artists (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      full_name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(50),
      website VARCHAR(2000),
      medium VARCHAR(200) NOT NULL,
      description TEXT NOT NULL,
      agreed_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
      agreed_to_terms_at TIMESTAMPTZ,
      agreed_to_consignment BOOLEAN NOT NULL DEFAULT FALSE,
      agreed_to_consignment_at TIMESTAMPTZ,
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);

  console.log("Tables created.");

  // Seed master admin
  const { rows } = await pool.query("SELECT id FROM admins WHERE email = $1", [
    "curator@lightandlilies.com",
  ]);

  if (rows.length === 0) {
    const password = process.env.ADMIN_PASSWORD || "changeme";
    const hash = await bcrypt.hash(password, 12);
    await pool.query(
      `INSERT INTO admins (email, recovery_email, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      ["curator@lightandlilies.com", "staceymar@gmail.com", hash, "master"]
    );
    console.log("Seeded master admin: curator@lightandlilies.com");
  } else {
    console.log("Master admin already exists, skipping seed.");
  }

  await pool.end();
  console.log("Migration complete.");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});

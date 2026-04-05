import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  ssl: process.env.DATABASE_SSL === "true"
    ? { rejectUnauthorized: false }
    : undefined,
});

export default pool;

export async function initDb() {
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
}

import bcrypt from "bcryptjs";
import pool, { initDb } from "./db";

export interface Admin {
  id: string;
  email: string;
  recoveryEmail: string | null;
  role: string;
  createdAt: string;
}

let initialized = false;

async function ensureDb() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

export async function findAdminByEmail(email: string): Promise<Admin | null> {
  await ensureDb();
  const { rows } = await pool.query(
    "SELECT id, email, recovery_email, role, created_at FROM admins WHERE email = $1",
    [email.toLowerCase()]
  );
  if (rows.length === 0) return null;
  return {
    id: rows[0].id,
    email: rows[0].email,
    recoveryEmail: rows[0].recovery_email,
    role: rows[0].role,
    createdAt: rows[0].created_at,
  };
}

export async function verifyAdminPassword(email: string, password: string): Promise<Admin | null> {
  await ensureDb();
  const { rows } = await pool.query(
    "SELECT id, email, recovery_email, role, password_hash, created_at FROM admins WHERE email = $1",
    [email.toLowerCase()]
  );
  if (rows.length === 0) return null;

  const valid = await bcrypt.compare(password, rows[0].password_hash);
  if (!valid) return null;

  return {
    id: rows[0].id,
    email: rows[0].email,
    recoveryEmail: rows[0].recovery_email,
    role: rows[0].role,
    createdAt: rows[0].created_at,
  };
}

export async function findAdminByRecoveryEmail(recoveryEmail: string): Promise<Admin | null> {
  await ensureDb();
  const { rows } = await pool.query(
    "SELECT id, email, recovery_email, role, created_at FROM admins WHERE recovery_email = $1",
    [recoveryEmail.toLowerCase()]
  );
  if (rows.length === 0) return null;
  return {
    id: rows[0].id,
    email: rows[0].email,
    recoveryEmail: rows[0].recovery_email,
    role: rows[0].role,
    createdAt: rows[0].created_at,
  };
}

export async function updateAdminPassword(id: string, newPassword: string): Promise<void> {
  await ensureDb();
  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query("UPDATE admins SET password_hash = $1 WHERE id = $2", [hash, id]);
}

export async function seedMasterAdmin() {
  await ensureDb();
  const { rows } = await pool.query("SELECT id FROM admins WHERE email = $1", [
    "curator@lightandlilies.com",
  ]);

  if (rows.length === 0) {
    const defaultPassword = process.env.ADMIN_PASSWORD || "changeme";
    const hash = await bcrypt.hash(defaultPassword, 12);
    await pool.query(
      `INSERT INTO admins (email, recovery_email, password_hash, role)
       VALUES ($1, $2, $3, $4)`,
      ["curator@lightandlilies.com", "staceymar@gmail.com", hash, "master"]
    );
    console.log("Seeded master admin: curator@lightandlilies.com");
  }
}

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { admins } from "../db/collections.js";
import { generateId } from "../utils/ids.js";
import { unauthorized } from "../utils/errors.js";
import type { AdminUser } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET ?? "dev-only-insecure-secret-change-me";
const TOKEN_TTL = "12h";

export async function ensureSeedAdmin() {
  const all = await admins.all();
  if (all.length > 0) return;
  const username = process.env.ADMIN_USERNAME ?? "admin";
  const password = process.env.ADMIN_PASSWORD ?? "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);
  const admin: AdminUser = {
    id: generateId("adm"),
    username,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  await admins.insert(admin);
  // eslint-disable-next-line no-console
  console.log(`[seed] Created default admin user "${username}". Change this password after first login.`);
}

export async function login(username: string, password: string) {
  const all = await admins.all();
  const admin = all.find((a) => a.username.toLowerCase() === username.toLowerCase());
  if (!admin) throw unauthorized("Invalid username or password");
  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) throw unauthorized("Invalid username or password");
  const token = jwt.sign({ sub: admin.id, username: admin.username }, JWT_SECRET, {
    expiresIn: TOKEN_TTL,
  });
  return { token, admin: { id: admin.id, username: admin.username } };
}

export function verifyToken(token: string): { sub: string; username: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { sub: string; username: string };
  } catch {
    throw unauthorized("Invalid or expired session, please log in again");
  }
}

export async function changePassword(adminId: string, newPassword: string) {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  await admins.update(adminId, { passwordHash });
}

import { customAlphabet } from "nanoid";

// URL-safe, unambiguous alphabet (no 0/O/1/l confusion).
const alphabet = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
const nano = customAlphabet(alphabet, 14);

export function generateId(prefix?: string): string {
  return prefix ? `${prefix}_${nano()}` : nano();
}

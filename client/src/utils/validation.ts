import { z } from "zod";

export const nicknameSchema = z
  .string()
  .trim()
  .min(3, "Nickname must be at least 3 characters")
  .max(20, "Nickname must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed");

export function validateNickname(value: string): string | null {
  const result = nicknameSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? "Invalid nickname";
}

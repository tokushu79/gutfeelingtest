import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/authService.js";

export interface AuthedRequest extends Request {
  admin?: { id: string; username: string };
}

export function requireAdmin(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing authorization header" });
    return;
  }
  const token = header.slice("Bearer ".length);
  try {
    const payload = verifyToken(token);
    req.admin = { id: payload.sub, username: payload.username };
    next();
  } catch (err: any) {
    res.status(401).json({ error: err.message ?? "Unauthorized" });
  }
}

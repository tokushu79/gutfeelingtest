import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { requireAdmin, type AuthedRequest } from "../../middleware/adminAuth.js";
import { adminLoginSchema } from "../../validation/schemas.js";
import { login, changePassword } from "../../services/authService.js";
import { z } from "zod";

export const adminAuthRouter = Router();

adminAuthRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = adminLoginSchema.parse(req.body);
    const result = await login(input.username, input.password);
    res.json(result);
  })
);

adminAuthRouter.get("/me", requireAdmin, (req: AuthedRequest, res) => {
  res.json({ admin: req.admin });
});

const changePasswordSchema = z.object({ newPassword: z.string().min(8).max(100) });

adminAuthRouter.post(
  "/change-password",
  requireAdmin,
  asyncHandler(async (req: AuthedRequest, res) => {
    const input = changePasswordSchema.parse(req.body);
    await changePassword(req.admin!.id, input.newPassword);
    res.json({ ok: true });
  })
);

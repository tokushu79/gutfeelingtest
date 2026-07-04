import { Router } from "express";
import { z } from "zod";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { resetLeaderboard } from "../../services/leaderboardService.js";

export const adminLeaderboardsRouter = Router();
adminLeaderboardsRouter.use(requireAdmin);

const resetSchema = z.object({
  scope: z.enum(["overall", "subject", "quiz", "daily"]),
  id: z.string().optional(),
});

adminLeaderboardsRouter.post(
  "/reset",
  asyncHandler(async (req, res) => {
    const input = resetSchema.parse(req.body);
    await resetLeaderboard(input.scope, input.id);
    res.json({ ok: true });
  })
);

import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { getDashboardStats } from "../../services/statsService.js";

export const adminStatsRouter = Router();
adminStatsRouter.use(requireAdmin);

adminStatsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await getDashboardStats());
  })
);

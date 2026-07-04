import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { dailyCreateSchema } from "../../validation/schemas.js";
import { listDailyQuestions, scheduleDailyQuestion, deleteDailyQuestion } from "../../services/dailyService.js";

export const adminDailyRouter = Router();
adminDailyRouter.use(requireAdmin);

adminDailyRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await listDailyQuestions());
  })
);

adminDailyRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = dailyCreateSchema.parse(req.body);
    res.status(201).json(await scheduleDailyQuestion(input));
  })
);

adminDailyRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await deleteDailyQuestion(req.params.id);
    res.status(204).end();
  })
);

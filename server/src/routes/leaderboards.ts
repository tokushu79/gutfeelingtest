import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import {
  overallLeaderboard,
  subjectLeaderboard,
  quizLeaderboard,
  dailyLeaderboard,
} from "../services/leaderboardService.js";

export const leaderboardsRouter = Router();

leaderboardsRouter.get(
  "/overall",
  asyncHandler(async (_req, res) => {
    res.json(await overallLeaderboard());
  })
);

leaderboardsRouter.get(
  "/subject/:subjectId",
  asyncHandler(async (req, res) => {
    res.json(await subjectLeaderboard(req.params.subjectId));
  })
);

leaderboardsRouter.get(
  "/quiz/:quizId",
  asyncHandler(async (req, res) => {
    res.json(await quizLeaderboard(req.params.quizId));
  })
);

leaderboardsRouter.get(
  "/daily",
  asyncHandler(async (req, res) => {
    const date = typeof req.query.date === "string" ? req.query.date : undefined;
    res.json(await dailyLeaderboard(date));
  })
);

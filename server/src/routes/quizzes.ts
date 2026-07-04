import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { getQuizForPlay } from "../services/quizService.js";

export const quizzesRouter = Router();

quizzesRouter.get(
  "/:id/play",
  asyncHandler(async (req, res) => {
    res.json(await getQuizForPlay(req.params.id));
  })
);

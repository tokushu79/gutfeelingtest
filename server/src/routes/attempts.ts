import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { attemptCheckSchema, attemptSubmitSchema } from "../validation/schemas.js";
import { checkAnswer, submitAttempt } from "../services/attemptService.js";

export const attemptsRouter = Router();

attemptsRouter.post(
  "/check",
  asyncHandler(async (req, res) => {
    const input = attemptCheckSchema.parse(req.body);
    res.json(await checkAnswer(input.questionId, input.choiceId));
  })
);

attemptsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = attemptSubmitSchema.parse(req.body);
    const attempt = await submitAttempt(input);
    const percentage = Math.round((attempt.score / attempt.totalQuestions) * 100);
    res.json({ ...attempt, percentage });
  })
);

import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { dailySubmitSchema } from "../validation/schemas.js";
import {
  getOrCreateDailyQuestion,
  toPublicDaily,
  hasSubmittedToday,
  submitDailyAnswer,
} from "../services/dailyService.js";
import { todayKey } from "../utils/date.js";

export const dailyRouter = Router();

dailyRouter.get(
  "/today",
  asyncHandler(async (req, res) => {
    const question = await getOrCreateDailyQuestion();
    const nickname = typeof req.query.nickname === "string" ? req.query.nickname : undefined;
    const alreadySubmitted = nickname ? await hasSubmittedToday(nickname) : false;
    res.json({ ...toPublicDaily(question), date: todayKey(), alreadySubmitted });
  })
);

dailyRouter.post(
  "/submit",
  asyncHandler(async (req, res) => {
    const input = dailySubmitSchema.parse(req.body);
    const result = await submitDailyAnswer(input);
    res.json(result);
  })
);

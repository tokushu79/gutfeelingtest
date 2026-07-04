import { Router } from "express";
import { adminAuthRouter } from "./auth.js";
import { adminSubjectsRouter } from "./subjects.js";
import { adminQuizzesRouter } from "./quizzes.js";
import { adminQuestionsRouter } from "./questions.js";
import { adminDailyRouter } from "./daily.js";
import { adminLeaderboardsRouter } from "./leaderboards.js";
import { adminStatsRouter } from "./stats.js";

export const adminRouter = Router();

adminRouter.use("/auth", adminAuthRouter);
adminRouter.use("/subjects", adminSubjectsRouter);
adminRouter.use("/quizzes", adminQuizzesRouter);
adminRouter.use("/questions", adminQuestionsRouter);
adminRouter.use("/daily", adminDailyRouter);
adminRouter.use("/leaderboards", adminLeaderboardsRouter);
adminRouter.use("/stats", adminStatsRouter);

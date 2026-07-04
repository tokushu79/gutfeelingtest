import { Router } from "express";
import { asyncHandler } from "../middleware/errorHandler.js";
import { listSubjects, getSubjectBySlug } from "../services/subjectService.js";
import { listQuizzesForSubject } from "../services/quizService.js";

export const subjectsRouter = Router();

subjectsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await listSubjects());
  })
);

subjectsRouter.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    res.json(await getSubjectBySlug(req.params.slug));
  })
);

subjectsRouter.get(
  "/:slug/quizzes",
  asyncHandler(async (req, res) => {
    const subject = await getSubjectBySlug(req.params.slug);
    res.json(await listQuizzesForSubject(subject.id));
  })
);

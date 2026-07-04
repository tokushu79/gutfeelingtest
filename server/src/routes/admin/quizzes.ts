import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { quizInputSchema } from "../../validation/schemas.js";
import {
  listQuizzesForSubject,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  duplicateQuiz,
} from "../../services/quizService.js";
import { listQuestionsForQuiz } from "../../services/questionService.js";
import { quizzes as quizzesCollection } from "../../db/collections.js";

export const adminQuizzesRouter = Router();
adminQuizzesRouter.use(requireAdmin);

adminQuizzesRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const subjectId = typeof req.query.subjectId === "string" ? req.query.subjectId : undefined;
    if (subjectId) {
      res.json(await listQuizzesForSubject(subjectId));
      return;
    }
    res.json(await quizzesCollection.all());
  })
);

adminQuizzesRouter.get(
  "/:id/questions",
  asyncHandler(async (req, res) => {
    res.json(await listQuestionsForQuiz(req.params.id));
  })
);

adminQuizzesRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = quizInputSchema.parse(req.body);
    res.status(201).json(await createQuiz(input));
  })
);

adminQuizzesRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const input = quizInputSchema.partial().parse(req.body);
    res.json(await updateQuiz(req.params.id, input));
  })
);

adminQuizzesRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await deleteQuiz(req.params.id);
    res.status(204).end();
  })
);

adminQuizzesRouter.post(
  "/:id/duplicate",
  asyncHandler(async (req, res) => {
    res.status(201).json(await duplicateQuiz(req.params.id));
  })
);

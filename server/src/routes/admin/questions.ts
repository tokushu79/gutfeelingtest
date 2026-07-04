import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { questionInputSchema, questionImportSchema } from "../../validation/schemas.js";
import {
  listQuestionsForQuiz,
  searchQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  importQuestions,
  exportQuestionsForQuiz,
} from "../../services/questionService.js";

export const adminQuestionsRouter = Router();
adminQuestionsRouter.use(requireAdmin);

adminQuestionsRouter.get(
  "/",
  asyncHandler(async (req, res) => {
    const quizId = typeof req.query.quizId === "string" ? req.query.quizId : undefined;
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    if (search) {
      res.json(await searchQuestions(search));
      return;
    }
    if (quizId) {
      res.json(await listQuestionsForQuiz(quizId));
      return;
    }
    res.json(await searchQuestions(""));
  })
);

adminQuestionsRouter.get(
  "/export",
  asyncHandler(async (req, res) => {
    const quizId = typeof req.query.quizId === "string" ? req.query.quizId : undefined;
    if (!quizId) {
      res.status(400).json({ error: "quizId query param is required" });
      return;
    }
    const data = await exportQuestionsForQuiz(quizId);
    res.setHeader("Content-Disposition", `attachment; filename="quiz-${quizId}-questions.json"`);
    res.json(data);
  })
);

adminQuestionsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const { quizId, ...rest } = req.body;
    if (!quizId) {
      res.status(400).json({ error: "quizId is required" });
      return;
    }
    const input = questionInputSchema.parse(rest);
    res.status(201).json(await createQuestion(quizId, input));
  })
);

adminQuestionsRouter.post(
  "/import",
  asyncHandler(async (req, res) => {
    const input = questionImportSchema.parse(req.body);
    const created = await importQuestions(input.quizId, input.questions);
    res.status(201).json({ imported: created.length, questions: created });
  })
);

adminQuestionsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const input = questionInputSchema.partial().parse(req.body);
    res.json(await updateQuestion(req.params.id, input));
  })
);

adminQuestionsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await deleteQuestion(req.params.id);
    res.status(204).end();
  })
);

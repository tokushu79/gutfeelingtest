import { Router } from "express";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { requireAdmin } from "../../middleware/adminAuth.js";
import { subjectInputSchema } from "../../validation/schemas.js";
import { listSubjects, createSubject, updateSubject, deleteSubject } from "../../services/subjectService.js";

export const adminSubjectsRouter = Router();
adminSubjectsRouter.use(requireAdmin);

adminSubjectsRouter.get(
  "/",
  asyncHandler(async (_req, res) => {
    res.json(await listSubjects());
  })
);

adminSubjectsRouter.post(
  "/",
  asyncHandler(async (req, res) => {
    const input = subjectInputSchema.parse(req.body);
    res.status(201).json(await createSubject(input));
  })
);

adminSubjectsRouter.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const input = subjectInputSchema.partial().parse(req.body);
    res.json(await updateSubject(req.params.id, input));
  })
);

adminSubjectsRouter.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await deleteSubject(req.params.id);
    res.status(204).end();
  })
);

import { z } from "zod";

export const nicknameSchema = z
  .string()
  .trim()
  .min(3, "Nickname must be at least 3 characters")
  .max(20, "Nickname must be at most 20 characters")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed");

export const choiceInputSchema = z.object({
  id: z.string().optional(),
  text: z.string().trim().min(1).max(200),
});

export const questionInputSchema = z.object({
  text: z.string().trim().min(5).max(500),
  choices: z.array(choiceInputSchema).length(4, "Exactly 4 answer choices are required"),
  correctChoiceIndex: z.number().int().min(0).max(3),
  order: z.number().int().optional(),
});

export const subjectInputSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(1).max(400),
  icon: z.string().trim().min(1).max(60),
  color: z.string().trim().min(1).max(60),
  order: z.number().int().optional(),
});

export const quizInputSchema = z.object({
  subjectId: z.string().min(1),
  title: z.string().trim().min(2).max(120),
  description: z.string().trim().min(1).max(400),
  order: z.number().int().optional(),
});

export const playerInputSchema = z.object({
  nickname: nicknameSchema,
});

export const attemptCheckSchema = z.object({
  questionId: z.string().min(1),
  choiceId: z.string().min(1),
});

export const attemptSubmitSchema = z.object({
  nickname: nicknameSchema,
  quizId: z.string().min(1),
  timeMs: z.number().int().min(0),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        choiceId: z.string().min(1),
      })
    )
    .min(1),
});

export const dailySubmitSchema = z.object({
  nickname: nicknameSchema,
  choiceId: z.string().min(1),
  timeMs: z.number().int().min(0),
});

export const dailyCreateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  text: z.string().trim().min(5).max(500),
  choices: z.array(choiceInputSchema).length(4),
  correctChoiceIndex: z.number().int().min(0).max(3),
});

export const adminLoginSchema = z.object({
  username: z.string().trim().min(1),
  password: z.string().min(1),
});

export const questionImportSchema = z.object({
  quizId: z.string().min(1),
  questions: z.array(questionInputSchema).min(1),
});

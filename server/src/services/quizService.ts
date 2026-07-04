import { quizzes, questions, subjects } from "../db/collections.js";
import { generateId } from "../utils/ids.js";
import { slugify } from "../utils/slugify.js";
import { shuffle } from "../utils/shuffle.js";
import { notFound } from "../utils/errors.js";
import type { Quiz, Question, PublicQuestion } from "../types/index.js";

export async function listQuizzesForSubject(subjectId: string) {
  const all = await quizzes.all();
  const allQuestions = await questions.all();
  return all
    .filter((q) => q.subjectId === subjectId)
    .sort((a, b) => a.order - b.order)
    .map((q) => ({
      ...q,
      questionCount: allQuestions.filter((qu) => qu.quizId === q.id).length,
    }));
}

export async function getQuizById(id: string) {
  const quiz = await quizzes.findById(id);
  if (!quiz) throw notFound("Quiz not found");
  return quiz;
}

export function toPublicQuestion(q: Question): PublicQuestion {
  return {
    id: q.id,
    quizId: q.quizId,
    text: q.text,
    choices: shuffle(q.choices),
  };
}

/** Returns quiz metadata plus its 10 questions in randomized order, choices randomized. */
export async function getQuizForPlay(quizId: string) {
  const quiz = await getQuizById(quizId);
  const subject = await subjects.findById(quiz.subjectId);
  const allQuestions = (await questions.all()).filter((q) => q.quizId === quizId);
  const randomized = shuffle(allQuestions).map(toPublicQuestion);
  return { quiz, subject, questions: randomized };
}

export async function createQuiz(input: {
  subjectId: string;
  title: string;
  description: string;
  order?: number;
}): Promise<Quiz> {
  const subject = await subjects.findById(input.subjectId);
  if (!subject) throw notFound("Subject not found");
  const existing = await quizzes.all();
  const now = new Date().toISOString();
  const quiz: Quiz = {
    id: generateId("quiz"),
    subjectId: input.subjectId,
    slug: slugify(input.title),
    title: input.title,
    description: input.description,
    order: input.order ?? existing.filter((q) => q.subjectId === input.subjectId).length,
    createdAt: now,
    updatedAt: now,
  };
  await quizzes.insert(quiz);
  return quiz;
}

export async function updateQuiz(id: string, patch: Partial<Quiz>) {
  const existing = await quizzes.findById(id);
  if (!existing) throw notFound("Quiz not found");
  const next = { ...patch, updatedAt: new Date().toISOString() };
  if (patch.title) next.slug = slugify(patch.title);
  return quizzes.update(id, next);
}

export async function deleteQuiz(id: string) {
  const remainingQuestions = (await questions.all()).filter((q) => q.quizId !== id);
  await questions.replaceAll(remainingQuestions);
  const ok = await quizzes.remove(id);
  if (!ok) throw notFound("Quiz not found");
}

export async function duplicateQuiz(id: string) {
  const original = await quizzes.findById(id);
  if (!original) throw notFound("Quiz not found");
  const originalQuestions = (await questions.all()).filter((q) => q.quizId === id);
  const now = new Date().toISOString();
  const newQuiz: Quiz = {
    ...original,
    id: generateId("quiz"),
    slug: `${original.slug}-copy-${Date.now().toString(36)}`,
    title: `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };
  await quizzes.insert(newQuiz);
  const allQuestions = await questions.all();
  const copies: Question[] = originalQuestions.map((q) => ({
    ...q,
    id: generateId("q"),
    quizId: newQuiz.id,
    createdAt: now,
    updatedAt: now,
  }));
  await questions.replaceAll([...allQuestions, ...copies]);
  return newQuiz;
}

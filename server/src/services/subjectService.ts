import { subjects, quizzes, questions } from "../db/collections.js";
import { generateId } from "../utils/ids.js";
import { slugify } from "../utils/slugify.js";
import { notFound, conflict } from "../utils/errors.js";
import type { Subject } from "../types/index.js";

export async function listSubjects() {
  const all = await subjects.all();
  const allQuizzes = await quizzes.all();
  const allQuestions = await questions.all();
  return all
    .sort((a, b) => a.order - b.order)
    .map((s) => {
      const subjectQuizzes = allQuizzes.filter((q) => q.subjectId === s.id);
      const quizIds = new Set(subjectQuizzes.map((q) => q.id));
      const questionCount = allQuestions.filter((q) => quizIds.has(q.quizId)).length;
      return { ...s, quizCount: subjectQuizzes.length, questionCount };
    });
}

export async function getSubjectBySlug(slug: string) {
  const all = await subjects.all();
  const subject = all.find((s) => s.slug === slug);
  if (!subject) throw notFound("Subject not found");
  return subject;
}

export async function createSubject(input: {
  name: string;
  description: string;
  icon: string;
  color: string;
  order?: number;
}): Promise<Subject> {
  const all = await subjects.all();
  const slug = slugify(input.name);
  if (all.some((s) => s.slug === slug)) {
    throw conflict("A subject with a similar name already exists");
  }
  const now = new Date().toISOString();
  const subject: Subject = {
    id: generateId("subj"),
    slug,
    name: input.name,
    description: input.description,
    icon: input.icon,
    color: input.color,
    order: input.order ?? all.length,
    createdAt: now,
    updatedAt: now,
  };
  await subjects.insert(subject);
  return subject;
}

export async function updateSubject(id: string, patch: Partial<Subject>) {
  const existing = await subjects.findById(id);
  if (!existing) throw notFound("Subject not found");
  const next = { ...patch, updatedAt: new Date().toISOString() };
  if (patch.name) next.slug = slugify(patch.name);
  const updated = await subjects.update(id, next);
  return updated;
}

export async function deleteSubject(id: string) {
  const subjectQuizzes = (await quizzes.all()).filter((q) => q.subjectId === id);
  const quizIds = new Set(subjectQuizzes.map((q) => q.id));
  const remainingQuizzes = (await quizzes.all()).filter((q) => q.subjectId !== id);
  const remainingQuestions = (await questions.all()).filter((q) => !quizIds.has(q.quizId));
  await quizzes.replaceAll(remainingQuizzes);
  await questions.replaceAll(remainingQuestions);
  const ok = await subjects.remove(id);
  if (!ok) throw notFound("Subject not found");
}

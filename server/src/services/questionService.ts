import { questions } from "../db/collections.js";
import { generateId } from "../utils/ids.js";
import { notFound, badRequest } from "../utils/errors.js";
import type { Question, Choice } from "../types/index.js";

interface QuestionInput {
  text: string;
  choices: { id?: string; text: string }[];
  correctChoiceIndex: number;
  order?: number;
}

function buildChoices(input: { id?: string; text: string }[]): Choice[] {
  return input.map((c) => ({ id: c.id ?? generateId("c"), text: c.text }));
}

export async function listQuestionsForQuiz(quizId: string) {
  const all = await questions.all();
  return all.filter((q) => q.quizId === quizId).sort((a, b) => a.order - b.order);
}

export async function searchQuestions(query: string) {
  const all = await questions.all();
  const needle = query.trim().toLowerCase();
  if (!needle) return all;
  return all.filter(
    (q) =>
      q.text.toLowerCase().includes(needle) ||
      q.choices.some((c) => c.text.toLowerCase().includes(needle))
  );
}

export async function createQuestion(quizId: string, input: QuestionInput): Promise<Question> {
  if (input.correctChoiceIndex < 0 || input.correctChoiceIndex >= input.choices.length) {
    throw badRequest("correctChoiceIndex out of range");
  }
  const choices = buildChoices(input.choices);
  const existing = await questions.all();
  const now = new Date().toISOString();
  const question: Question = {
    id: generateId("q"),
    quizId,
    text: input.text,
    choices,
    correctChoiceId: choices[input.correctChoiceIndex].id,
    order: input.order ?? existing.filter((q) => q.quizId === quizId).length,
    createdAt: now,
    updatedAt: now,
  };
  await questions.insert(question);
  return question;
}

export async function updateQuestion(id: string, input: Partial<QuestionInput>) {
  const existing = await questions.findById(id);
  if (!existing) throw notFound("Question not found");
  const choices = input.choices ? buildChoices(input.choices) : existing.choices;
  const correctChoiceId =
    input.correctChoiceIndex !== undefined
      ? choices[input.correctChoiceIndex]?.id
      : existing.correctChoiceId;
  if (!correctChoiceId) throw badRequest("correctChoiceIndex out of range");
  return questions.update(id, {
    text: input.text ?? existing.text,
    choices,
    correctChoiceId,
    order: input.order ?? existing.order,
    updatedAt: new Date().toISOString(),
  });
}

export async function deleteQuestion(id: string) {
  const ok = await questions.remove(id);
  if (!ok) throw notFound("Question not found");
}

export async function importQuestions(quizId: string, items: QuestionInput[]) {
  const created: Question[] = [];
  for (const item of items) {
    created.push(await createQuestion(quizId, item));
  }
  return created;
}

export async function exportQuestionsForQuiz(quizId: string) {
  const list = await listQuestionsForQuiz(quizId);
  return list.map((q) => ({
    text: q.text,
    choices: q.choices.map((c) => c.text),
    correctChoiceIndex: q.choices.findIndex((c) => c.id === q.correctChoiceId),
  }));
}

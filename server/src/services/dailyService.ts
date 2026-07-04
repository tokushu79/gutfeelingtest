import { dailyQuestions, dailySubmissions } from "../db/collections.js";
import { dailyPoolSeed } from "../db/dailyPoolSeed.js";
import { upsertPlayer } from "./playerService.js";
import { generateId } from "../utils/ids.js";
import { todayKey, daysSinceEpoch } from "../utils/date.js";
import { shuffle } from "../utils/shuffle.js";
import { notFound, conflict, badRequest } from "../utils/errors.js";
import type { DailyQuestion, Choice } from "../types/index.js";

async function autoGenerateForDate(date: string): Promise<DailyQuestion> {
  const idx = ((daysSinceEpoch(date) % dailyPoolSeed.length) + dailyPoolSeed.length) % dailyPoolSeed.length;
  const item = dailyPoolSeed[idx];
  const choices: Choice[] = item.choices.map((text) => ({ id: generateId("c"), text }));
  const question: DailyQuestion = {
    id: generateId("daily"),
    date,
    text: item.text,
    choices,
    correctChoiceId: choices[item.correctChoiceIndex].id,
    source: "auto",
    createdAt: new Date().toISOString(),
  };
  await dailyQuestions.insert(question);
  return question;
}

export async function getOrCreateDailyQuestion(date: string = todayKey()): Promise<DailyQuestion> {
  const all = await dailyQuestions.all();
  const existing = all.find((d) => d.date === date);
  if (existing) return existing;
  return autoGenerateForDate(date);
}

export function toPublicDaily(d: DailyQuestion) {
  return {
    id: d.id,
    date: d.date,
    text: d.text,
    choices: shuffle(d.choices),
  };
}

export async function hasSubmittedToday(nickname: string, date: string = todayKey()) {
  const all = await dailySubmissions.all();
  return all.some((s) => s.date === date && s.nickname.toLowerCase() === nickname.toLowerCase());
}

export async function submitDailyAnswer(input: {
  nickname: string;
  choiceId: string;
  timeMs: number;
  date?: string;
}) {
  const date = input.date ?? todayKey();
  const question = await getOrCreateDailyQuestion(date);
  const already = await hasSubmittedToday(input.nickname, date);
  if (already) throw conflict("You have already submitted an answer for today's question");

  const player = await upsertPlayer(input.nickname);
  const correct = question.correctChoiceId === input.choiceId;
  const submission = {
    id: generateId("dsub"),
    date,
    playerId: player.id,
    nickname: player.nickname,
    correct,
    timeMs: input.timeMs,
    submittedAt: new Date().toISOString(),
  };
  await dailySubmissions.insert(submission);
  return { submission, correct, correctChoiceId: question.correctChoiceId };
}

/** Admin: schedule (or overwrite) a specific question for a future/current date. */
export async function scheduleDailyQuestion(input: {
  date: string;
  text: string;
  choices: { text: string }[];
  correctChoiceIndex: number;
}) {
  const all = await dailyQuestions.all();
  const choices: Choice[] = input.choices.map((c) => ({ id: generateId("c"), text: c.text }));
  const question: DailyQuestion = {
    id: generateId("daily"),
    date: input.date,
    text: input.text,
    choices,
    correctChoiceId: choices[input.correctChoiceIndex].id,
    source: "scheduled",
    createdAt: new Date().toISOString(),
  };
  const withoutExisting = all.filter((d) => d.date !== input.date);
  await dailyQuestions.replaceAll([...withoutExisting, question]);
  return question;
}

export async function deleteDailyQuestion(id: string) {
  const ok = await dailyQuestions.remove(id);
  if (!ok) throw notFound("Daily question not found");
}

export async function listDailyQuestions() {
  const all = await dailyQuestions.all();
  return all.sort((a, b) => (a.date < b.date ? 1 : -1));
}

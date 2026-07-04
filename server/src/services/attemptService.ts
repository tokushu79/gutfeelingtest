import { attempts, questions, quizzes } from "../db/collections.js";
import { upsertPlayer } from "./playerService.js";
import { generateId } from "../utils/ids.js";
import { notFound, badRequest } from "../utils/errors.js";
import type { Attempt, AttemptAnswer } from "../types/index.js";

export async function checkAnswer(questionId: string, choiceId: string) {
  const question = await questions.findById(questionId);
  if (!question) throw notFound("Question not found");
  const correct = question.correctChoiceId === choiceId;
  return { correct, correctChoiceId: question.correctChoiceId };
}

export async function submitAttempt(input: {
  nickname: string;
  quizId: string;
  timeMs: number;
  answers: { questionId: string; choiceId: string }[];
}) {
  const quiz = await quizzes.findById(input.quizId);
  if (!quiz) throw notFound("Quiz not found");

  const quizQuestions = (await questions.all()).filter((q) => q.quizId === input.quizId);
  const questionMap = new Map(quizQuestions.map((q) => [q.id, q]));

  const answers: AttemptAnswer[] = input.answers.map((a) => {
    const question = questionMap.get(a.questionId);
    if (!question) throw badRequest(`Unknown question ${a.questionId} for this quiz`);
    return {
      questionId: a.questionId,
      choiceId: a.choiceId,
      correct: question.correctChoiceId === a.choiceId,
    };
  });

  const score = answers.filter((a) => a.correct).length;
  const player = await upsertPlayer(input.nickname);

  const attempt: Attempt = {
    id: generateId("att"),
    playerId: player.id,
    nickname: player.nickname,
    quizId: input.quizId,
    subjectId: quiz.subjectId,
    score,
    totalQuestions: answers.length,
    timeMs: input.timeMs,
    answers,
    completedAt: new Date().toISOString(),
  };
  await attempts.insert(attempt);
  return attempt;
}

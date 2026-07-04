import { apiRequest } from "./apiClient";
import type { CheckAnswerResponse, SubmitAttemptResponse } from "../types";

export const attemptsApi = {
  check: (questionId: string, choiceId: string) =>
    apiRequest<CheckAnswerResponse>("/attempts/check", { method: "POST", body: { questionId, choiceId } }),
  submit: (input: {
    nickname: string;
    quizId: string;
    timeMs: number;
    answers: { questionId: string; choiceId: string }[];
  }) => apiRequest<SubmitAttemptResponse>("/attempts", { method: "POST", body: input }),
};

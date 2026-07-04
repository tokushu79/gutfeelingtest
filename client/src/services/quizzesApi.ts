import { apiRequest } from "./apiClient";
import type { QuizPlayResponse } from "../types";

export const quizzesApi = {
  getForPlay: (quizId: string) => apiRequest<QuizPlayResponse>(`/quizzes/${quizId}/play`),
};

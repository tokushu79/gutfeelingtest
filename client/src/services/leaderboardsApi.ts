import { apiRequest } from "./apiClient";
import type { LeaderboardEntry } from "../types";

export const leaderboardsApi = {
  overall: () => apiRequest<LeaderboardEntry[]>("/leaderboards/overall"),
  subject: (subjectId: string) => apiRequest<LeaderboardEntry[]>(`/leaderboards/subject/${subjectId}`),
  quiz: (quizId: string) => apiRequest<LeaderboardEntry[]>(`/leaderboards/quiz/${quizId}`),
  daily: (date?: string) =>
    apiRequest<LeaderboardEntry[]>(`/leaderboards/daily${date ? `?date=${date}` : ""}`),
};

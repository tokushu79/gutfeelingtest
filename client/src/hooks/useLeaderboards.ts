import { useQuery } from "@tanstack/react-query";
import { leaderboardsApi } from "../services/leaderboardsApi";

export function useOverallLeaderboard() {
  return useQuery({ queryKey: ["leaderboard", "overall"], queryFn: leaderboardsApi.overall });
}

export function useSubjectLeaderboard(subjectId: string | undefined) {
  return useQuery({
    queryKey: ["leaderboard", "subject", subjectId],
    queryFn: () => leaderboardsApi.subject(subjectId!),
    enabled: !!subjectId,
  });
}

export function useQuizLeaderboard(quizId: string | undefined) {
  return useQuery({
    queryKey: ["leaderboard", "quiz", quizId],
    queryFn: () => leaderboardsApi.quiz(quizId!),
    enabled: !!quizId,
  });
}

export function useDailyLeaderboard(date?: string) {
  return useQuery({
    queryKey: ["leaderboard", "daily", date ?? "today"],
    queryFn: () => leaderboardsApi.daily(date),
  });
}

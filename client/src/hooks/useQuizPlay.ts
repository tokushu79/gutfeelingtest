import { useQuery } from "@tanstack/react-query";
import { quizzesApi } from "../services/quizzesApi";

export function useQuizPlay(quizId: string | undefined) {
  return useQuery({
    queryKey: ["quiz-play", quizId],
    queryFn: () => quizzesApi.getForPlay(quizId!),
    enabled: !!quizId,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

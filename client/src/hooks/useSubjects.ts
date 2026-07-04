import { useQuery } from "@tanstack/react-query";
import { subjectsApi } from "../services/subjectsApi";

export function useSubjects() {
  return useQuery({ queryKey: ["subjects"], queryFn: subjectsApi.list });
}

export function useSubject(slug: string | undefined) {
  return useQuery({
    queryKey: ["subject", slug],
    queryFn: () => subjectsApi.getBySlug(slug!),
    enabled: !!slug,
  });
}

export function useSubjectQuizzes(slug: string | undefined) {
  return useQuery({
    queryKey: ["subject-quizzes", slug],
    queryFn: () => subjectsApi.quizzesForSubject(slug!),
    enabled: !!slug,
  });
}

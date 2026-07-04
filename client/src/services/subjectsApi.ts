import { apiRequest } from "./apiClient";
import type { Subject, Quiz } from "../types";

export const subjectsApi = {
  list: () => apiRequest<Subject[]>("/subjects"),
  getBySlug: (slug: string) => apiRequest<Subject>(`/subjects/${slug}`),
  quizzesForSubject: (slug: string) => apiRequest<Quiz[]>(`/subjects/${slug}/quizzes`),
};

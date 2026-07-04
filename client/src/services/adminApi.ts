import { apiRequest } from "./apiClient";
import type {
  Subject,
  Quiz,
  AdminQuestion,
  AdminDailyQuestion,
  DashboardStats,
} from "../types";

export interface QuestionInput {
  text: string;
  choices: { text: string }[];
  correctChoiceIndex: number;
}

export const adminApi = {
  login: (username: string, password: string) =>
    apiRequest<{ token: string; admin: { id: string; username: string } }>("/admin/auth/login", {
      method: "POST",
      body: { username, password },
    }),
  me: () => apiRequest<{ admin: { id: string; username: string } }>("/admin/auth/me", { auth: true }),
  changePassword: (newPassword: string) =>
    apiRequest<{ ok: boolean }>("/admin/auth/change-password", {
      method: "POST",
      auth: true,
      body: { newPassword },
    }),

  stats: () => apiRequest<DashboardStats>("/admin/stats", { auth: true }),

  subjects: {
    list: () => apiRequest<Subject[]>("/admin/subjects", { auth: true }),
    create: (input: { name: string; description: string; icon: string; color: string }) =>
      apiRequest<Subject>("/admin/subjects", { method: "POST", auth: true, body: input }),
    update: (id: string, input: Partial<{ name: string; description: string; icon: string; color: string }>) =>
      apiRequest<Subject>(`/admin/subjects/${id}`, { method: "PUT", auth: true, body: input }),
    remove: (id: string) => apiRequest<void>(`/admin/subjects/${id}`, { method: "DELETE", auth: true }),
  },

  quizzes: {
    list: (subjectId?: string) =>
      apiRequest<Quiz[]>(`/admin/quizzes${subjectId ? `?subjectId=${subjectId}` : ""}`, { auth: true }),
    create: (input: { subjectId: string; title: string; description: string }) =>
      apiRequest<Quiz>("/admin/quizzes", { method: "POST", auth: true, body: input }),
    update: (id: string, input: Partial<{ title: string; description: string }>) =>
      apiRequest<Quiz>(`/admin/quizzes/${id}`, { method: "PUT", auth: true, body: input }),
    remove: (id: string) => apiRequest<void>(`/admin/quizzes/${id}`, { method: "DELETE", auth: true }),
    duplicate: (id: string) => apiRequest<Quiz>(`/admin/quizzes/${id}/duplicate`, { method: "POST", auth: true }),
    questions: (id: string) => apiRequest<AdminQuestion[]>(`/admin/quizzes/${id}/questions`, { auth: true }),
  },

  questions: {
    search: (query: string) =>
      apiRequest<AdminQuestion[]>(`/admin/questions?search=${encodeURIComponent(query)}`, { auth: true }),
    forQuiz: (quizId: string) => apiRequest<AdminQuestion[]>(`/admin/questions?quizId=${quizId}`, { auth: true }),
    create: (quizId: string, input: QuestionInput) =>
      apiRequest<AdminQuestion>("/admin/questions", { method: "POST", auth: true, body: { quizId, ...input } }),
    update: (id: string, input: Partial<QuestionInput>) =>
      apiRequest<AdminQuestion>(`/admin/questions/${id}`, { method: "PUT", auth: true, body: input }),
    remove: (id: string) => apiRequest<void>(`/admin/questions/${id}`, { method: "DELETE", auth: true }),
    import: (quizId: string, questions: QuestionInput[]) =>
      apiRequest<{ imported: number }>("/admin/questions/import", {
        method: "POST",
        auth: true,
        body: { quizId, questions },
      }),
    exportUrl: (quizId: string) => `/api/admin/questions/export?quizId=${quizId}`,
  },

  daily: {
    list: () => apiRequest<AdminDailyQuestion[]>("/admin/daily", { auth: true }),
    schedule: (input: { date: string; text: string; choices: { text: string }[]; correctChoiceIndex: number }) =>
      apiRequest<AdminDailyQuestion>("/admin/daily", { method: "POST", auth: true, body: input }),
    remove: (id: string) => apiRequest<void>(`/admin/daily/${id}`, { method: "DELETE", auth: true }),
  },

  leaderboards: {
    reset: (scope: "overall" | "subject" | "quiz" | "daily", id?: string) =>
      apiRequest<{ ok: boolean }>("/admin/leaderboards/reset", { method: "POST", auth: true, body: { scope, id } }),
  },
};

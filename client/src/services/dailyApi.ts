import { apiRequest } from "./apiClient";
import type { DailyQuestionResponse, DailySubmitResponse } from "../types";

export const dailyApi = {
  today: (nickname?: string) =>
    apiRequest<DailyQuestionResponse>(`/daily/today${nickname ? `?nickname=${encodeURIComponent(nickname)}` : ""}`),
  submit: (input: { nickname: string; choiceId: string; timeMs: number }) =>
    apiRequest<DailySubmitResponse>("/daily/submit", { method: "POST", body: input }),
};

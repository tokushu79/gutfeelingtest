import { useQuery } from "@tanstack/react-query";
import { dailyApi } from "../services/dailyApi";

export function useDailyQuestion(nickname: string | null) {
  return useQuery({
    queryKey: ["daily-question", nickname],
    queryFn: () => dailyApi.today(nickname ?? undefined),
  });
}

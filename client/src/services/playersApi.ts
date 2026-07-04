import { apiRequest } from "./apiClient";
import type { Player } from "../types";

export const playersApi = {
  upsert: (nickname: string) => apiRequest<Player>("/players", { method: "POST", body: { nickname } }),
};

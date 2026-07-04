import { players } from "../db/collections.js";
import { generateId } from "../utils/ids.js";
import type { Player } from "../types/index.js";

/** Finds or creates a player record for a nickname (case-insensitive identity). */
export async function upsertPlayer(nickname: string): Promise<Player> {
  const all = await players.all();
  const lower = nickname.toLowerCase();
  const existing = all.find((p) => p.nicknameLower === lower);
  const now = new Date().toISOString();
  if (existing) {
    const updated = await players.update(existing.id, { lastSeenAt: now, nickname });
    return updated!;
  }
  const player: Player = {
    id: generateId("pl"),
    nickname,
    nicknameLower: lower,
    createdAt: now,
    lastSeenAt: now,
  };
  await players.insert(player);
  return player;
}

export async function findPlayerByNickname(nickname: string): Promise<Player | undefined> {
  const all = await players.all();
  return all.find((p) => p.nicknameLower === nickname.toLowerCase());
}

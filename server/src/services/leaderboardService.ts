import { attempts, dailySubmissions } from "../db/collections.js";
import { todayKey } from "../utils/date.js";
import type { LeaderboardEntry } from "../types/index.js";

function rankAndSlice(
  rows: { nickname: string; score: number; totalQuestions: number; timeMs: number; date: string }[],
  limit: number
): LeaderboardEntry[] {
  const sorted = [...rows].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeMs - b.timeMs;
  });
  return sorted.slice(0, limit).map((r, i) => ({
    rank: i + 1,
    nickname: r.nickname,
    score: r.score,
    totalQuestions: r.totalQuestions,
    timeMs: r.timeMs,
    date: r.date,
    percentage: r.totalQuestions > 0 ? Math.round((r.score / r.totalQuestions) * 100) : 0,
  }));
}

/** Best single attempt per nickname for one specific quiz. */
export async function quizLeaderboard(quizId: string, limit = 50) {
  const all = (await attempts.all()).filter((a) => a.quizId === quizId);
  const bestByNickname = new Map<string, (typeof all)[number]>();
  for (const a of all) {
    const key = a.nickname.toLowerCase();
    const current = bestByNickname.get(key);
    if (!current || a.score > current.score || (a.score === current.score && a.timeMs < current.timeMs)) {
      bestByNickname.set(key, a);
    }
  }
  return rankAndSlice(
    Array.from(bestByNickname.values()).map((a) => ({
      nickname: a.nickname,
      score: a.score,
      totalQuestions: a.totalQuestions,
      timeMs: a.timeMs,
      date: a.completedAt,
    })),
    limit
  );
}

/** Aggregated totals per nickname across every quiz within a subject. */
export async function subjectLeaderboard(subjectId: string, limit = 50) {
  const all = (await attempts.all()).filter((a) => a.subjectId === subjectId);
  const totals = new Map<
    string,
    { nickname: string; score: number; totalQuestions: number; timeMs: number; date: string }
  >();
  for (const a of all) {
    const key = a.nickname.toLowerCase();
    const t = totals.get(key) ?? {
      nickname: a.nickname,
      score: 0,
      totalQuestions: 0,
      timeMs: 0,
      date: a.completedAt,
    };
    t.score += a.score;
    t.totalQuestions += a.totalQuestions;
    t.timeMs += a.timeMs;
    if (a.completedAt > t.date) t.date = a.completedAt;
    totals.set(key, t);
  }
  return rankAndSlice(Array.from(totals.values()), limit);
}

/** Aggregated totals per nickname across all quizzes site-wide. */
export async function overallLeaderboard(limit = 100) {
  const all = await attempts.all();
  const totals = new Map<
    string,
    { nickname: string; score: number; totalQuestions: number; timeMs: number; date: string }
  >();
  for (const a of all) {
    const key = a.nickname.toLowerCase();
    const t = totals.get(key) ?? {
      nickname: a.nickname,
      score: 0,
      totalQuestions: 0,
      timeMs: 0,
      date: a.completedAt,
    };
    t.score += a.score;
    t.totalQuestions += a.totalQuestions;
    t.timeMs += a.timeMs;
    if (a.completedAt > t.date) t.date = a.completedAt;
    totals.set(key, t);
  }
  return rankAndSlice(Array.from(totals.values()), limit);
}

export async function dailyLeaderboard(date: string = todayKey(), limit = 100) {
  const all = (await dailySubmissions.all()).filter((s) => s.date === date);
  return rankAndSlice(
    all.map((s) => ({
      nickname: s.nickname,
      score: s.correct ? 1 : 0,
      totalQuestions: 1,
      timeMs: s.timeMs,
      date: s.submittedAt,
    })),
    limit
  );
}

export async function resetLeaderboard(scope: "overall" | "subject" | "quiz" | "daily", id?: string) {
  if (scope === "overall") {
    await attempts.replaceAll([]);
    await dailySubmissions.replaceAll([]);
    return;
  }
  if (scope === "subject" && id) {
    const remaining = (await attempts.all()).filter((a) => a.subjectId !== id);
    await attempts.replaceAll(remaining);
    return;
  }
  if (scope === "quiz" && id) {
    const remaining = (await attempts.all()).filter((a) => a.quizId !== id);
    await attempts.replaceAll(remaining);
    return;
  }
  if (scope === "daily") {
    if (id) {
      const remaining = (await dailySubmissions.all()).filter((s) => s.date !== id);
      await dailySubmissions.replaceAll(remaining);
    } else {
      await dailySubmissions.replaceAll([]);
    }
  }
}

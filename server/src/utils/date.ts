/** Returns today's date as YYYY-MM-DD in UTC, used as the daily-question key. */
export function todayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function daysSinceEpoch(dateKey: string): number {
  const ms = new Date(`${dateKey}T00:00:00.000Z`).getTime();
  return Math.floor(ms / 86_400_000);
}

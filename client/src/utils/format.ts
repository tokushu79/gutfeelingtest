export function formatTime(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes === 0) return `${seconds}s`;
  return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export function scoreMessage(score: number, total: number): string {
  const ratio = score / total;
  if (ratio <= 0.2) return "Even random guessing deserves a participation trophy.";
  if (ratio <= 0.5) return "You've accidentally stumbled into a few correct answers.";
  if (ratio <= 0.8) return "Either you're incredibly lucky or secretly obsessed with obscure trivia.";
  return "Statistically suspicious.";
}

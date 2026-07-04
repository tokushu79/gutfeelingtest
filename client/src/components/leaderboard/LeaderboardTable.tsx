import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import { formatTime, formatDate } from "../../utils/format";
import { staggerContainer, staggerItem } from "../../animations/variants";
import type { LeaderboardEntry } from "../../types";

export function LeaderboardTable({
  entries,
  isLoading,
  emptyMessage = "No attempts yet. Be the first to set a score.",
}: {
  entries: LeaderboardEntry[] | undefined;
  isLoading?: boolean;
  emptyMessage?: string;
}) {
  if (isLoading) {
    return (
      <div className="glass-panel divide-y divide-white/5 rounded-2xl">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton m-3 h-12 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center text-sm text-slate-400">{emptyMessage}</div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-2xl">
      <div className="grid grid-cols-[3rem_1fr_5rem_5rem] gap-2 border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:grid-cols-[3rem_1fr_6rem_6rem_7rem]">
        <span>Rank</span>
        <span>Nickname</span>
        <span className="text-right">Score</span>
        <span className="text-right">Time</span>
        <span className="hidden text-right sm:block">Date</span>
      </div>
      <motion.div variants={staggerContainer} initial="initial" animate="animate">
        {entries.map((entry) => (
          <motion.div
            variants={staggerItem}
            key={`${entry.rank}-${entry.nickname}`}
            className="grid grid-cols-[3rem_1fr_5rem_5rem] items-center gap-2 border-b border-white/5 px-4 py-3 text-sm last:border-0 sm:grid-cols-[3rem_1fr_6rem_6rem_7rem]"
          >
            <span className="flex items-center gap-1 font-semibold text-slate-300">
              {entry.rank <= 3 ? <Crown className={`h-4 w-4 ${entry.rank === 1 ? "text-amber-400" : entry.rank === 2 ? "text-slate-300" : "text-orange-400"}`} /> : null}
              {entry.rank}
            </span>
            <span className="truncate font-medium text-white">{entry.nickname}</span>
            <span className="text-right text-slate-300">
              {entry.score}/{entry.totalQuestions}
            </span>
            <span className="text-right text-slate-400">{formatTime(entry.timeMs)}</span>
            <span className="hidden text-right text-slate-500 sm:block">{formatDate(entry.date)}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

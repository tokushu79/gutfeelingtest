import { Link } from "react-router-dom";
import { Trophy, CalendarDays, Layers } from "lucide-react";
import { useOverallLeaderboard } from "../hooks/useLeaderboards";
import { useSubjects } from "../hooks/useSubjects";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";
import { ROUTES } from "../constants/routes";

export default function LeaderboardsHub() {
  const { data: overall, isLoading } = useOverallLeaderboard();
  const { data: subjects } = useSubjects();

  return (
    <PageTransition>
      <PageContainer>
        <div className="mb-8 flex items-center gap-3">
          <Trophy className="h-7 w-7 text-amber-400" />
          <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Leaderboards</h1>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <Link
            to={ROUTES.daily}
            className="glass-panel flex items-center gap-3 rounded-2xl p-5 transition-transform hover:-translate-y-0.5"
          >
            <CalendarDays className="h-6 w-6 text-sky-400" />
            <div>
              <p className="font-semibold text-white">Daily Impossible Question</p>
              <p className="text-sm text-slate-400">One shared question, once per day.</p>
            </div>
          </Link>
          <div className="glass-panel rounded-2xl p-5">
            <div className="mb-2 flex items-center gap-2">
              <Layers className="h-5 w-5 text-violet-400" />
              <p className="font-semibold text-white">Jump to a subject</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects?.map((s) => (
                <Link
                  key={s.id}
                  to={ROUTES.leaderboardSubject(s.id)}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/5"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <h2 className="mb-4 font-display text-lg font-semibold text-white">Overall leaderboard</h2>
        <LeaderboardTable entries={overall} isLoading={isLoading} />
      </PageContainer>
    </PageTransition>
  );
}

import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useDailyLeaderboard } from "../hooks/useLeaderboards";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";
import { ROUTES } from "../constants/routes";

export default function DailyLeaderboardPage() {
  const { data, isLoading } = useDailyLeaderboard();

  return (
    <PageTransition>
      <PageContainer narrow>
        <Link to={ROUTES.daily} className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Today's question
        </Link>
        <h1 className="mb-6 font-display text-2xl font-bold text-white">Daily Leaderboard</h1>
        <LeaderboardTable entries={data} isLoading={isLoading} emptyMessage="Nobody has answered today's question yet." />
      </PageContainer>
    </PageTransition>
  );
}

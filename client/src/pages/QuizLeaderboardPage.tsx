import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useQuizLeaderboard } from "../hooks/useLeaderboards";
import { LeaderboardTable } from "../components/leaderboard/LeaderboardTable";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";
import { ROUTES } from "../constants/routes";

export default function QuizLeaderboardPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { data, isLoading } = useQuizLeaderboard(quizId);

  return (
    <PageTransition>
      <PageContainer narrow>
        <Link to={ROUTES.leaderboards} className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> All leaderboards
        </Link>
        <h1 className="mb-6 font-display text-2xl font-bold text-white">Quiz Leaderboard</h1>
        <LeaderboardTable entries={data} isLoading={isLoading} />
      </PageContainer>
    </PageTransition>
  );
}

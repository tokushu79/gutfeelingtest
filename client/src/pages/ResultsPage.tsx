import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Trophy, RotateCcw, Home as HomeIcon, Clock, Target } from "lucide-react";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";
import { formatTime, scoreMessage } from "../utils/format";
import { ROUTES } from "../constants/routes";
import type { ResultsLocationState } from "../types/quizSession";

export default function ResultsPage() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsLocationState | undefined;

  if (!state || state.result.id !== attemptId) {
    return (
      <PageContainer narrow>
        <div className="glass-panel rounded-2xl p-8 text-center">
          <p className="text-slate-300">
            We don't have fresh results to show here. Play a quiz to see your score.
          </p>
          <Link to={ROUTES.home} className="btn-primary mt-6 inline-flex">
            Browse subjects
          </Link>
        </div>
      </PageContainer>
    );
  }

  const { result, quizTitle, subjectSlug, subjectId, quizId } = state;

  return (
    <PageTransition>
      <PageContainer narrow>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel rounded-2xl p-8 text-center sm:p-10"
        >
          <Trophy className="mx-auto mb-4 h-12 w-12 text-amber-400" />
          <p className="text-sm uppercase tracking-wide text-slate-500">{quizTitle}</p>
          <h1 className="mt-2 font-display text-4xl font-bold text-white sm:text-5xl">
            {result.score} / {result.totalQuestions}
          </h1>
          <p className="mt-1 text-lg text-slate-300">{result.percentage}%</p>

          <div className="mx-auto mt-6 grid max-w-xs grid-cols-2 gap-4 text-left">
            <div className="glass-panel rounded-xl p-4">
              <Target className="mb-1.5 h-4 w-4 text-violet-400" />
              <p className="text-xs text-slate-500">Score</p>
              <p className="font-semibold text-white">{result.score} correct</p>
            </div>
            <div className="glass-panel rounded-xl p-4">
              <Clock className="mb-1.5 h-4 w-4 text-sky-400" />
              <p className="text-xs text-slate-500">Time</p>
              <p className="font-semibold text-white">{formatTime(result.timeMs)}</p>
            </div>
          </div>

          <p className="mx-auto mt-8 max-w-sm text-balance font-display text-lg font-medium text-slate-200">
            "{scoreMessage(result.score, result.totalQuestions)}"
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <button onClick={() => navigate(ROUTES.quizPlay(quizId))} className="btn-secondary">
              <RotateCcw className="h-4 w-4" /> Retry quiz
            </button>
            <Link to={ROUTES.leaderboardQuiz(quizId)} className="btn-secondary">
              <Trophy className="h-4 w-4" /> Quiz leaderboard
            </Link>
            <Link to={ROUTES.subject(subjectSlug)} className="btn-primary">
              <HomeIcon className="h-4 w-4" /> More quizzes
            </Link>
          </div>
          <p className="mt-4 text-xs text-slate-600">Subject leaderboard: <Link className="underline hover:text-slate-400" to={ROUTES.leaderboardSubject(subjectId)}>view rankings</Link></p>
        </motion.div>
      </PageContainer>
    </PageTransition>
  );
}

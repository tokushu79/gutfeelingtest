import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Trophy, CheckCircle2 } from "lucide-react";
import { useDailyQuestion } from "../hooks/useDailyQuestion";
import { useNickname } from "../context/NicknameContext";
import { useToast } from "../context/ToastContext";
import { dailyApi } from "../services/dailyApi";
import { ChoiceButton } from "../components/quiz/ChoiceButton";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";
import { QuestionSkeleton } from "../components/ui/Skeleton";
import { ROUTES } from "../constants/routes";

export default function DailyQuestionPage() {
  const { nickname } = useNickname();
  const { data, isLoading, refetch } = useDailyQuestion(nickname);
  const { showToast } = useToast();
  const startRef = useRef(Date.now());

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [correctChoiceId, setCorrectChoiceId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const alreadyDone = data?.alreadySubmitted || revealed;

  const handleSelect = async (choiceId: string) => {
    if (!nickname) {
      showToast("Pick a nickname first from the menu.", "info");
      return;
    }
    if (alreadyDone || submitting) return;
    setSubmitting(true);
    setSelectedChoiceId(choiceId);
    try {
      const timeMs = Date.now() - startRef.current;
      const result = await dailyApi.submit({ nickname, choiceId, timeMs });
      setCorrectChoiceId(result.correctChoiceId);
      setRevealed(true);
      showToast(result.correct ? "Correct! Statistically suspicious." : "Incorrect — see you tomorrow.", result.correct ? "success" : "info");
    } catch (err: any) {
      showToast(err?.message ?? "Couldn't submit your answer.", "error");
      setSelectedChoiceId(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <PageContainer narrow>
        <div className="mb-6 flex items-center gap-3">
          <CalendarDays className="h-7 w-7 text-sky-400" />
          <div>
            <h1 className="font-display text-2xl font-bold text-white">Daily Impossible Question</h1>
            <p className="text-sm text-slate-400">One question. Everyone gets the same one. One try per day.</p>
          </div>
        </div>

        {isLoading || !data ? (
          <QuestionSkeleton />
        ) : (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-6 sm:p-8">
            <p className="mb-2 text-xs uppercase tracking-wide text-slate-500">{data.date}</p>
            <h2 className="mb-6 font-display text-lg font-semibold text-white sm:text-xl">{data.text}</h2>

            {data.alreadySubmitted && !revealed ? (
              <div className="flex items-center gap-2 rounded-xl bg-sky-500/10 px-4 py-3 text-sm text-sky-300">
                <CheckCircle2 className="h-4 w-4" /> You've already answered today's question. Come back tomorrow.
              </div>
            ) : (
              <div className="grid gap-3">
                {data.choices.map((choice, idx) => (
                  <ChoiceButton
                    key={choice.id}
                    choice={choice}
                    index={idx}
                    selectedChoiceId={selectedChoiceId}
                    correctChoiceId={correctChoiceId}
                    revealed={revealed}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}

            {revealed && (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to={ROUTES.dailyLeaderboard} className="btn-secondary flex-1">
                  <Trophy className="h-4 w-4" /> Today's leaderboard
                </Link>
                <button onClick={() => refetch()} className="btn-primary flex-1">
                  Refresh status
                </button>
              </div>
            )}
          </motion.div>
        )}
      </PageContainer>
    </PageTransition>
  );
}

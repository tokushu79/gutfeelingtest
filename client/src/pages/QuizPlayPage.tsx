import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQuizPlay } from "../hooks/useQuizPlay";
import { useNickname } from "../context/NicknameContext";
import { useToast } from "../context/ToastContext";
import { attemptsApi } from "../services/attemptsApi";
import { ChoiceButton } from "../components/quiz/ChoiceButton";
import { ProgressBar } from "../components/quiz/ProgressBar";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";
import { QuestionSkeleton } from "../components/ui/Skeleton";
import { popIn } from "../animations/variants";
import type { AttemptAnswerDraft } from "../types/quizSession";

export default function QuizPlayPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { nickname } = useNickname();
  const { showToast } = useToast();
  const { data, isLoading, isError } = useQuizPlay(quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);
  const [correctChoiceId, setCorrectChoiceId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const answersRef = useRef<AttemptAnswerDraft[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (data) startTimeRef.current = Date.now();
  }, [data?.quiz.id]);

  const questions = data?.questions ?? [];
  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  const handleSelect = useCallback(
    async (choiceId: string) => {
      if (revealed || checking || !currentQuestion) return;
      setChecking(true);
      setSelectedChoiceId(choiceId);
      try {
        const result = await attemptsApi.check(currentQuestion.id, choiceId);
        setCorrectChoiceId(result.correctChoiceId);
        setRevealed(true);
        answersRef.current.push({
          questionId: currentQuestion.id,
          choiceId,
          correct: result.correct,
        });
      } catch (err: any) {
        showToast(err?.message ?? "Couldn't check that answer, try again.", "error");
        setSelectedChoiceId(null);
      } finally {
        setChecking(false);
      }
    },
    [revealed, checking, currentQuestion, showToast]
  );

  const handleContinue = useCallback(async () => {
    if (!data || !nickname) return;
    if (!isLastQuestion) {
      setCurrentIndex((i) => i + 1);
      setSelectedChoiceId(null);
      setCorrectChoiceId(null);
      setRevealed(false);
      return;
    }
    setSubmitting(true);
    try {
      const timeMs = Date.now() - startTimeRef.current;
      const result = await attemptsApi.submit({
        nickname,
        quizId: data.quiz.id,
        timeMs,
        answers: answersRef.current.map(({ questionId, choiceId }) => ({ questionId, choiceId })),
      });
      navigate(`/results/${result.id}`, {
        state: {
          result,
          quizTitle: data.quiz.title,
          subjectSlug: data.subject.slug,
          subjectId: data.subject.id,
          quizId: data.quiz.id,
        },
      });
    } catch (err: any) {
      showToast(err?.message ?? "Couldn't submit your results, try again.", "error");
    } finally {
      setSubmitting(false);
    }
  }, [data, nickname, isLastQuestion, navigate, showToast]);

  // Keyboard support: 1-4 / A-D to answer, Enter/Space to continue.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!currentQuestion) return;
      if (!revealed) {
        const num = Number(e.key);
        const letterIdx = ["a", "b", "c", "d"].indexOf(e.key.toLowerCase());
        const idx = num >= 1 && num <= 4 ? num - 1 : letterIdx;
        if (idx >= 0 && currentQuestion.choices[idx]) {
          handleSelect(currentQuestion.choices[idx].id);
        }
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleContinue();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentQuestion, revealed, handleSelect, handleContinue]);

  const feedbackLabel = useMemo(() => {
    if (!revealed) return null;
    const wasCorrect = answersRef.current[answersRef.current.length - 1]?.correct;
    return wasCorrect ? "Correct" : "Incorrect";
  }, [revealed]);

  if (isError) {
    return (
      <PageContainer narrow>
        <div className="glass-panel rounded-2xl p-8 text-center">
          <p className="text-slate-300">This quiz couldn't be loaded. It may have been removed.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageTransition>
      <PageContainer narrow>
        {isLoading || !currentQuestion ? (
          <>
            <ProgressBar current={0} total={10} />
            <QuestionSkeleton />
          </>
        ) : (
          <>
            <ProgressBar current={currentIndex} total={questions.length} />
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion.id}
                variants={popIn}
                initial="initial"
                animate="animate"
                className="glass-panel rounded-2xl p-6 sm:p-8"
              >
                <h1 className="mb-6 font-display text-lg font-semibold leading-snug text-white sm:text-xl">
                  {currentQuestion.text}
                </h1>
                <div className="grid gap-3">
                  {currentQuestion.choices.map((choice, idx) => (
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

                <AnimatePresence>
                  {revealed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-6 overflow-hidden"
                    >
                      <div
                        className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
                          feedbackLabel === "Correct"
                            ? "bg-emerald-500/15 text-emerald-300"
                            : "bg-rose-500/15 text-rose-300"
                        }`}
                        role="status"
                      >
                        {feedbackLabel}
                      </div>
                      <button onClick={handleContinue} disabled={submitting} className="btn-primary w-full">
                        {submitting ? "Submitting..." : isLastQuestion ? "See results" : "Continue"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
            <p className="mt-4 text-center text-xs text-slate-600">
              Tip: press 1–4 to answer, Enter to continue.
            </p>
          </>
        )}
      </PageContainer>
    </PageTransition>
  );
}

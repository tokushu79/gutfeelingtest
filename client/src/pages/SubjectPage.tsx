import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, PlayCircle, Trophy } from "lucide-react";
import { useSubject, useSubjectQuizzes } from "../hooks/useSubjects";
import { getSubjectIcon } from "../constants/subjectIcons";
import { ROUTES } from "../constants/routes";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";
import { SubjectCardSkeleton } from "../components/ui/Skeleton";
import { staggerContainer, staggerItem } from "../animations/variants";
import NotFound from "./NotFound";

export default function SubjectPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: subject, isLoading: subjectLoading, isError } = useSubject(slug);
  const { data: quizzes, isLoading: quizzesLoading } = useSubjectQuizzes(slug);

  if (isError) return <NotFound message="That subject doesn't exist (yet)." />;

  const Icon = subject ? getSubjectIcon(subject.icon) : undefined;

  return (
    <PageTransition>
      <PageContainer narrow>
        <Link to={ROUTES.home} className="mb-6 inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> All subjects
        </Link>

        {subjectLoading ? (
          <SubjectCardSkeleton />
        ) : subject ? (
          <>
            <div className="mb-8 flex items-center gap-4">
              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${subject.color} text-white shadow-glow`}
              >
                {Icon && <Icon className="h-7 w-7" />}
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{subject.name}</h1>
                <p className="mt-1 text-sm text-slate-400">{subject.description}</p>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold text-white">Quizzes</h2>
              <Link
                to={ROUTES.leaderboardSubject(subject.id)}
                className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white"
              >
                <Trophy className="h-4 w-4" /> Subject leaderboard
              </Link>
            </div>

            <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid gap-4">
              {quizzesLoading &&
                Array.from({ length: 2 }).map((_, i) => <SubjectCardSkeleton key={i} />)}
              {quizzes?.map((quiz) => (
                <motion.div key={quiz.id} variants={staggerItem}>
                  <Link
                    to={ROUTES.quizPlay(quiz.id)}
                    className="glass-panel group flex items-center justify-between gap-4 rounded-2xl p-6 transition-transform hover:-translate-y-0.5 hover:shadow-glow"
                  >
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">{quiz.title}</h3>
                      <p className="mt-1 text-sm text-slate-400">{quiz.description}</p>
                      <p className="mt-2 text-xs text-slate-500">{quiz.questionCount ?? 10} questions</p>
                    </div>
                    <PlayCircle className="h-9 w-9 shrink-0 text-violet-400 transition-transform group-hover:scale-110" />
                  </Link>
                </motion.div>
              ))}
              {!quizzesLoading && quizzes?.length === 0 && (
                <div className="glass-panel rounded-2xl p-8 text-center text-sm text-slate-400">
                  No quizzes here yet. Check back soon.
                </div>
              )}
            </motion.div>
          </>
        ) : null}
      </PageContainer>
    </PageTransition>
  );
}

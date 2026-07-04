import { motion } from "framer-motion";
import { Ban, ShieldQuestion, Trophy } from "lucide-react";
import { useSubjects } from "../hooks/useSubjects";
import { SubjectCard } from "../components/quiz/SubjectCard";
import { SubjectCardSkeleton } from "../components/ui/Skeleton";
import { PageContainer } from "../components/layout/PageContainer";
import { PageTransition } from "../components/ui/PageTransition";
import { staggerContainer } from "../animations/variants";

export default function Home() {
  const { data: subjects, isLoading, isError } = useSubjects();

  return (
    <PageTransition>
      <PageContainer>
        <section className="mb-14 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl"
          >
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-sky-400 bg-clip-text text-transparent">
              GutFeelingTest
            </span>
          </motion.h1>
          <p className="mx-auto mt-4 max-w-xl text-slate-300 font-display text-lg">
            Let's see how good your gut feeling is!
          </p>
          <p className="mx-auto mt-2 max-w-xl text-slate-400">
            Every question is a real, verifiable fact. Every question is also something roughly
            0.1% of the planet could possibly know. You will guess. That's the whole point.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-3">
            <div className="glass-panel rounded-xl p-4 text-left">
              <ShieldQuestion className="mb-2 h-5 w-5 text-violet-400" />
              <p className="text-xs text-slate-400">100% real, verified facts — nothing invented.</p>
            </div>
            <div className="glass-panel rounded-xl p-4 text-left">
              <Ban className="mb-2 h-5 w-5 text-rose-400" />
              <p className="text-xs text-slate-400">Zero common trivia. If you knew it already, we failed.</p>
            </div>
            <div className="glass-panel rounded-xl p-4 text-left">
              <Trophy className="mb-2 h-5 w-5 text-amber-400" />
              <p className="text-xs text-slate-400">Leaderboards for the statistically suspicious.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-6 font-display text-xl font-semibold text-white">Choose a subject</h2>
          {isError && (
            <p className="text-sm text-rose-400">
              Couldn't load subjects right now. Refresh, or check that the API server is running.
            </p>
          )}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => <SubjectCardSkeleton key={i} />)}
            {subjects?.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </motion.div>
        </section>
      </PageContainer>
    </PageTransition>
  );
}

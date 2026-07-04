import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { getSubjectIcon } from "../../constants/subjectIcons";
import { ROUTES } from "../../constants/routes";
import { staggerItem } from "../../animations/variants";
import type { Subject } from "../../types";

export function SubjectCard({ subject }: { subject: Subject }) {
  const Icon = getSubjectIcon(subject.icon);
  return (
    <motion.div variants={staggerItem}>
      <Link
        to={ROUTES.subject(subject.slug)}
        className="glass-panel group relative block overflow-hidden rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-glow"
      >
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${subject.color} text-white shadow-lg`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <h3 className="font-display text-lg font-semibold text-white">{subject.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{subject.description}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            {subject.quizCount} {subject.quizCount === 1 ? "quiz" : "quizzes"} · {subject.questionCount} questions
          </span>
          <ChevronRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-white" />
        </div>
      </Link>
    </motion.div>
  );
}

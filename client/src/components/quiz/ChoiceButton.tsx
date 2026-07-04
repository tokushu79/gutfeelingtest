import clsx from "clsx";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import type { Choice } from "../../types";

interface Props {
  choice: Choice;
  index: number;
  selectedChoiceId: string | null;
  correctChoiceId: string | null;
  revealed: boolean;
  onSelect: (choiceId: string) => void;
}

const letters = ["A", "B", "C", "D"];

export function ChoiceButton({ choice, index, selectedChoiceId, correctChoiceId, revealed, onSelect }: Props) {
  const isSelected = selectedChoiceId === choice.id;
  const isCorrect = correctChoiceId === choice.id;

  let stateClasses = "border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]";
  if (revealed) {
    if (isCorrect) {
      stateClasses = "border-emerald-400/50 bg-emerald-500/10";
    } else if (isSelected && !isCorrect) {
      stateClasses = "border-rose-400/50 bg-rose-500/10";
    } else {
      stateClasses = "border-white/5 bg-white/[0.02] opacity-60";
    }
  } else if (isSelected) {
    stateClasses = "border-violet-400/60 bg-violet-500/10";
  }

  return (
    <motion.button
      type="button"
      whileTap={{ scale: revealed ? 1 : 0.98 }}
      disabled={revealed}
      onClick={() => onSelect(choice.id)}
      className={clsx(
        "flex w-full items-center gap-3 rounded-xl border px-4 py-3.5 text-left text-sm font-medium text-slate-100 transition-colors sm:text-base",
        stateClasses,
        revealed && "cursor-default"
      )}
      aria-pressed={isSelected}
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-slate-300">
        {letters[index]}
      </span>
      <span className="flex-1">{choice.text}</span>
      {revealed && isCorrect && <Check className="h-5 w-5 shrink-0 text-emerald-400" />}
      {revealed && isSelected && !isCorrect && <X className="h-5 w-5 shrink-0 text-rose-400" />}
    </motion.button>
  );
}

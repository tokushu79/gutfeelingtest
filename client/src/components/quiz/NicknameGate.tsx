import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useNickname } from "../../context/NicknameContext";
import { NicknameForm } from "./NicknameForm";

export function NicknameGate() {
  const { needsOnboarding, setNickname } = useNickname();

  return (
    <AnimatePresence>
      {needsOnboarding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-base-950/80 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="onboarding-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-panel w-full max-w-md rounded-2xl p-8"
          >
            <Sparkles className="mb-4 h-8 w-8 text-violet-400" />
            <h2 id="onboarding-title" className="text-2xl font-bold text-white">
              Pick a nickname
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              No account, no password. Just a name so the leaderboards know who to (mostly) blame.
            </p>
            <div className="mt-6">
              <NicknameForm submitLabel="Start guessing" onSubmit={setNickname} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

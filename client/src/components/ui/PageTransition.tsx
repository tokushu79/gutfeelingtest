import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { pageFade } from "../../animations/variants";

export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div variants={pageFade} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  );
}

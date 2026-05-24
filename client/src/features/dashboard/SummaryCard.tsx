import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

export function SummaryCard({ children }: PropsWithChildren) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
      className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-panel backdrop-blur"
    >
      {children}
    </motion.section>
  );
}

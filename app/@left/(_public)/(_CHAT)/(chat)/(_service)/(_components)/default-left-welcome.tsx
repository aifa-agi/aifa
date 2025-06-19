// @/app/@left/(_public)/(_CHAT-FRACTAL)/(chat)/(_service)/(_components)/greeting.tsx

import { motion } from "framer-motion";

export const DefaultLeftWellcome = () => {
  return (
    <div key="overview" className="mx-auto  flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.5 }}
        className="text-6xl font-semibold"
      >
        AIFA
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ delay: 0.6 }}
        className="text-2xl text-zinc-500"
      >
        Let&apos;s ask us?
      </motion.div>
    </div>
  );
};

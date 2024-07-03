"use client";
import { AnimatePresence, motion } from "framer-motion";
import loadingStore from "@/zustand/loading.store.js";

export default function Loading() {
  const { loading } = loadingStore((state) => state);
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="@apply z-[100] bg-[#00000073] w-full min-h-screen fixed place-items-center grid;"
        >
          <div className="border-[10px] border-transparent  animate-spin border-b-green-400 h-[6rem] aspect-square rounded-full " />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

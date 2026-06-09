import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { ease, quickTransition } from "@/lib/motion";

export function PageLoader() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setVisible(true);
    const hideTimer = window.setTimeout(() => setVisible(false), 900);
    return () => window.clearTimeout(hideTimer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-1 bg-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : quickTransition}
        >
          <motion.div
            className="h-full origin-left bg-vet-green"
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.85, ease }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

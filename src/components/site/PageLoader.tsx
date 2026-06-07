import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const;

export function PageLoader() {
  const [visible, setVisible] = useState(false);

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
          transition={{ duration: 0.2, ease }}
        >
          <motion.div
            className="h-full bg-vet-green"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.85, ease }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

import { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { quickTransition, softTransition } from "@/lib/motion";

const STORAGE_KEY = "healthy-pet-cases-sensitive-consent";

export function SensitiveContentWarning() {
  const [visible, setVisible] = useState(false);
  const stayButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const accepted = window.localStorage.getItem(STORAGE_KEY) === "accepted";
    setVisible(!accepted);
  }, []);

  useEffect(() => {
    if (visible) {
      stayButtonRef.current?.focus();
    }
  }, [visible]);

  function accept() {
    window.localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function leave() {
    window.location.href = "/";
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/86 px-5 backdrop-blur-md"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          transition={quickTransition}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sensitive-warning-title"
            aria-describedby="sensitive-warning-description"
            className="w-full max-w-lg rounded-[1.5rem] bg-white p-6 text-ink shadow-[0_24px_80px_-40px_rgba(0,0,0,0.8)] sm:p-8"
            initial={reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={softTransition}
          >
            <div className="grid h-12 w-12 place-items-center rounded-full bg-sage text-vet-green">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2
              id="sensitive-warning-title"
              className="mt-5 font-display text-3xl font-black leading-tight sm:text-4xl"
            >
              Sensitive veterinary images
            </h2>
            <p
              id="sensitive-warning-description"
              className="mt-4 text-base leading-relaxed text-ink/68"
            >
              This page may include surgical, wound-related, or clinical case images that some
              visitors may find uncomfortable. Images remain blurred until you choose to view them.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                ref={stayButtonRef}
                type="button"
                onClick={accept}
                className="focus-ring focus-ring-dark inline-flex min-h-11 items-center justify-center rounded-full bg-vet-green px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-vet-green-dark"
              >
                Stay and view cases
              </button>
              <button
                type="button"
                onClick={leave}
                className="focus-ring focus-ring-dark inline-flex min-h-11 items-center justify-center rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-vet-green"
              >
                Leave page
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

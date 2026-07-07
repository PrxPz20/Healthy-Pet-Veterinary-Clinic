import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { quickTransition, softTransition } from "@/lib/motion";

const STORAGE_KEY = "healthy-pet-cases-sensitive-consent";
const COOLDOWN_SECONDS = 5;
const COOLDOWN_MS = COOLDOWN_SECONDS * 1000;

export function SensitiveContentWarning() {
  const [visible, setVisible] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const stayButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();
  const remaining = Math.ceil(Math.max(0, COOLDOWN_MS - elapsedMs) / 1000);
  const isReady = elapsedMs >= COOLDOWN_MS;
  const progress = Math.min(100, (elapsedMs / COOLDOWN_MS) * 100);

  useEffect(() => {
    const accepted = window.localStorage.getItem(STORAGE_KEY) === "accepted";
    setVisible(!accepted);
  }, []);

  useEffect(() => {
    if (!visible) return;

    stayButtonRef.current?.focus();
    setElapsedMs(0);

    const startedAt = Date.now();
    const id = window.setInterval(() => {
      setElapsedMs(Math.min(COOLDOWN_MS, Date.now() - startedAt));
    }, 100);

    return () => window.clearInterval(id);
  }, [visible]);

  useEffect(() => {
    if (!visible) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [visible]);

  function accept() {
    if (!isReady) return;

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
          className="fixed inset-0 z-[80] grid place-items-center bg-ink/35 px-4 backdrop-blur-sm"
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
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-[1.5rem] bg-white p-5 text-ink shadow-[0_24px_80px_-40px_rgba(0,0,0,0.8)] sm:rounded-[2rem] sm:p-10 lg:p-14"
            initial={reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={softTransition}
          >
            <div className="grid grid-cols-[3.5rem_1fr] gap-4 sm:grid-cols-[5rem_1fr] sm:gap-8">
              <div className="relative grid h-14 w-14 place-items-center rounded-full bg-red-100 text-red-500 sm:h-20 sm:w-20">
                <span className="absolute inset-0 rounded-full bg-red-500/20 motion-safe:animate-ping" />
                <span className="absolute inset-0 rounded-full ring-2 ring-red-400/45 motion-safe:animate-ping [animation-delay:450ms]" />
                <AlertTriangle className="relative h-6 w-6 sm:h-9 sm:w-9" />
              </div>
              <div>
                <h2
                  id="sensitive-warning-title"
                  className="font-display text-2xl font-black leading-tight sm:text-5xl"
                >
                  Sensitive images
                </h2>
                <p
                  id="sensitive-warning-description"
                  className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/72 sm:mt-4 sm:text-xl"
                >
                  This page may include surgical, wound-related, or clinical case images. Some
                  visitors may find them uncomfortable. Do you want to continue?
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:items-center sm:justify-end">
              <button
                type="button"
                onClick={leave}
                className="focus-ring focus-ring-dark inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-ink/50 transition-colors duration-200 hover:text-ink sm:text-base"
              >
                Leave page
              </button>
              <button
                ref={stayButtonRef}
                type="button"
                onClick={accept}
                disabled={!isReady}
                className="focus-ring relative inline-flex min-h-14 w-full items-center justify-center overflow-hidden rounded-2xl border border-vet-green bg-white px-6 py-4 text-sm font-black text-white shadow-[0_14px_28px_-20px_rgba(24,26,28,0.65)] transition-transform duration-200 enabled:cursor-pointer enabled:hover:-translate-y-0.5 disabled:cursor-wait sm:w-auto sm:min-w-64 sm:text-base"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-vet-green transition-[width] duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
                <span
                  className={`relative z-10 inline-flex items-center gap-3 ${
                    !isReady ? "text-ink" : "text-white"
                  }`}
                >
                  {isReady ? <Check className="h-5 w-5" /> : null}
                  {!isReady ? `Continue in ${remaining}s` : "Stay and view cases"}
                </span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

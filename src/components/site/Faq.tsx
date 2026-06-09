import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { quickTransition } from "@/lib/motion";

export function Faq() {
  const { faqs } = getSiteContent();
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="relative bg-white py-20 text-ink md:py-28">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        <Reveal>
          <div className="eyebrow">FAQ</div>
          <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-black leading-[1.02]">
            Direct answers before you call.
          </h2>
        </Reveal>

        <div className="mt-10 divide-y divide-line border-y border-line md:mt-12">
          {faqs.map((it, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={it.question} delay={i * 0.04}>
                <div>
                  <button
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="focus-ring group flex w-full items-center justify-between gap-6 rounded-xl py-6 text-left"
                  >
                    <span
                      className={`font-display text-lg font-black transition-colors duration-200 md:text-xl ${isOpen ? "text-vet-green" : "text-ink group-hover:text-vet-green"}`}
                    >
                      {it.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={reduceMotion ? { duration: 0 } : quickTransition}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-vet-green transition-colors duration-200 group-hover:border-vet-green"
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
                        transition={reduceMotion ? { duration: 0 } : quickTransition}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-12 leading-relaxed text-ink/66 md:pr-16">
                          {it.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

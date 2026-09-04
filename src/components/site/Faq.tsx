import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Plus } from "lucide-react";
import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { useEditorialContent } from "./editorial-content-context";
import { quickTransition } from "@/lib/motion";
import { ContentEmptyState } from "./ContentEmptyState";

export function Faq() {
  const { homepage } = getSiteContent();
  const { faqs } = useEditorialContent();
  const [open, setOpen] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <section id="faq" className="site-section relative bg-white py-16 text-ink lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-16">
        <Reveal className="lg:order-2 lg:sticky lg:top-32">
          <h2 className="type-section-title max-w-xl">{homepage.faq.heading}</h2>
          <div className="mt-8 border-t border-line pt-6">
            <h3 className="type-card-title">Still have questions?</h3>
            <a
              href="#contact"
              className="focus-ring focus-ring-dark type-button mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Get in touch
            </a>
          </div>
        </Reveal>

        <div className="divide-y divide-line border-y border-line lg:order-1">
          {faqs.map((it, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={it.question} delay={i * 0.04}>
                <motion.div layout transition={reduceMotion ? { duration: 0 } : quickTransition}>
                  <button
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="focus-ring group flex w-full items-center justify-between gap-6 rounded-xl py-6 text-left"
                  >
                    <span
                      className={`type-card-title min-w-0 [overflow-wrap:anywhere] transition-colors duration-200 ${isOpen ? "text-vet-green" : "text-ink group-hover:text-vet-green"}`}
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
                        initial={reduceMotion ? false : { opacity: 0, height: 0, y: -4 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, y: -4 }}
                        transition={reduceMotion ? { duration: 0 } : quickTransition}
                        className="overflow-hidden"
                      >
                        <p className="type-body pb-6 pr-12 [overflow-wrap:anywhere] text-ink/66 md:pr-16">
                          {it.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
          {!faqs.length ? (
            <div className="py-4">
              <ContentEmptyState
                title="Questions are being updated"
                body="Please contact the clinic directly if you need help in the meantime."
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

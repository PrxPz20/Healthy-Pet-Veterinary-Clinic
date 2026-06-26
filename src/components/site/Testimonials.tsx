import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, MessageSquareQuote, Star } from "lucide-react";
import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { softTransition } from "@/lib/motion";

export function Testimonials() {
  const { homepage, testimonials } = getSiteContent();
  const hasTestimonials = testimonials.length > 0;
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const active = testimonials[activeIndex];

  const goTo = (index: number) => {
    if (!testimonials.length) return;
    setActiveIndex((index + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    if (!hasTestimonials || reduceMotion || paused) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5200);

    return () => window.clearInterval(interval);
  }, [hasTestimonials, paused, reduceMotion, testimonials.length]);

  return (
    <section className="bg-white py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="rounded-[1.5rem] border border-line bg-clinic p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <div className="eyebrow">REVIEWS</div>
              <h2 className="text-balance font-display text-[clamp(2rem,4vw,3.4rem)] font-black leading-[1.02]">
                {homepage.testimonials.heading}
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-ink/66">
                {homepage.testimonials.body}
              </p>
            </div>
            {hasTestimonials && active ? (
              <div
                className="min-w-0"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
              >
                <div className="relative min-h-[21rem] overflow-hidden rounded-3xl bg-white p-5 shadow-[0_18px_45px_-38px_rgba(24,26,28,0.34)] sm:p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-sage text-vet-green">
                    <MessageSquareQuote className="h-5 w-5" />
                  </span>

                  <AnimatePresence mode="wait" initial={false}>
                    <motion.article
                      key={active.name}
                      initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={
                        reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(4px)" }
                      }
                      transition={reduceMotion ? { duration: 0 } : softTransition}
                      className="mt-6 flex min-h-[14rem] flex-col"
                    >
                      <div
                        className="flex gap-1 text-vet-green"
                        aria-label={`${active.rating} out of 5 stars`}
                      >
                        {Array.from({ length: active.rating }).map((_, index) => (
                          <Star
                            key={`${active.name}-${index}`}
                            className="h-4 w-4 fill-current"
                            aria-hidden="true"
                          />
                        ))}
                      </div>
                      <blockquote className="mt-5 flex-1 text-base leading-relaxed text-ink/72">
                        “{active.text}”
                      </blockquote>
                      <div className="mt-6 border-t border-line pt-4 font-display text-xl font-black text-ink">
                        {active.name}
                      </div>
                    </motion.article>
                  </AnimatePresence>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => goTo(activeIndex - 1)}
                      className="focus-ring focus-ring-dark inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors duration-200 hover:border-vet-green hover:text-vet-green"
                      aria-label="Previous review"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => goTo(activeIndex + 1)}
                      className="focus-ring focus-ring-dark inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors duration-200 hover:border-vet-green hover:text-vet-green"
                      aria-label="Next review"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2" aria-label="Review carousel pagination">
                    {testimonials.map((testimonial, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={testimonial.name}
                          type="button"
                          onClick={() => goTo(index)}
                          className={`focus-ring focus-ring-dark h-2.5 rounded-full transition-all duration-200 ${
                            isActive ? "w-8 bg-vet-green" : "w-2.5 bg-ink/18 hover:bg-vet-green/55"
                          }`}
                          aria-label={`Show review from ${testimonial.name}`}
                          aria-current={isActive ? "true" : undefined}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-44 items-center gap-4 rounded-3xl bg-white p-5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sage text-vet-green">
                  <MessageSquareQuote className="h-5 w-5" />
                </span>
                <p className="text-sm leading-relaxed text-ink/68">
                  {homepage.testimonials.emptyState}
                </p>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

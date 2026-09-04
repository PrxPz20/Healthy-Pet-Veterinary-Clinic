import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, ExternalLink, MessageSquareQuote, Star } from "lucide-react";
import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { useEditorialContent } from "./editorial-content-context";
import { softTransition } from "@/lib/motion";
import { ContentEmptyState } from "./ContentEmptyState";

export function Testimonials() {
  const { homepage } = getSiteContent();
  const { testimonials } = useEditorialContent();
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
    <section id="reviews" className="site-section bg-white py-16 text-ink lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="rounded-[1.5rem] border border-line bg-clinic p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <h2 className="type-section-title">{homepage.testimonials.heading}</h2>
              <p className="type-section-copy mt-5 max-w-xl text-ink/66">
                {homepage.testimonials.body}
              </p>
              <a
                href={homepage.testimonials.reviewsUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring focus-ring-dark type-button mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
              >
                View all reviews
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            {hasTestimonials && active ? (
              <div
                className="min-w-0"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onFocus={() => setPaused(true)}
                onBlur={() => setPaused(false)}
              >
                <div className="relative h-[28rem] overflow-hidden rounded-3xl bg-white p-5 shadow-[0_18px_45px_-38px_rgba(24,26,28,0.34)] sm:h-[24rem] sm:p-6 lg:h-[20rem]">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.article
                      key={active.name}
                      initial={reduceMotion ? false : { opacity: 0, y: 12, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={
                        reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8, filter: "blur(4px)" }
                      }
                      transition={reduceMotion ? { duration: 0 } : softTransition}
                      className="flex h-full min-h-0 flex-col"
                    >
                      <div className="flex min-w-0 items-center gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-sage text-vet-green">
                          <MessageSquareQuote className="h-5 w-5" />
                        </span>
                        <div className="min-w-0">
                          <div className="type-card-title truncate text-ink">{active.name}</div>
                          <div
                            className="mt-2 flex gap-1 text-vet-green"
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
                        </div>
                      </div>
                      <blockquote className="type-body mt-6 min-h-0 flex-1 overflow-y-auto pr-2 text-ink/72">
                        “{active.text}”
                      </blockquote>
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
                  <div className="flex items-center" aria-label="Review carousel pagination">
                    {testimonials.map((testimonial, index) => {
                      const isActive = index === activeIndex;
                      return (
                        <button
                          key={testimonial.name}
                          type="button"
                          onClick={() => goTo(index)}
                          className="focus-ring focus-ring-dark group grid h-11 w-11 shrink-0 place-items-center rounded-full"
                          aria-label={`Show review from ${testimonial.name}`}
                          aria-current={isActive ? "true" : undefined}
                        >
                          <span
                            className={`h-2.5 rounded-full transition-all duration-200 ${
                              isActive
                                ? "w-8 bg-vet-green"
                                : "w-2.5 bg-ink/28 group-hover:bg-vet-green/55"
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              <ContentEmptyState
                title="Reviews are being prepared"
                body={homepage.testimonials.emptyState}
              />
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

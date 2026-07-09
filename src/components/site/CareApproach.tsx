import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";

export function CareApproach() {
  const { approach, homepage, media } = getSiteContent();
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="approach" ref={ref} className="relative bg-ink py-20 text-white md:py-28">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="eyebrow text-sage-light">{homepage.approach.label}</div>
          <h2 className="type-section-title mt-3 max-w-lg">{homepage.approach.heading}</h2>
          <p className="type-section-copy mt-5 max-w-md text-white/72">{homepage.approach.body}</p>
          <div className="mt-8 overflow-hidden rounded-3xl">
            <img
              src={media.care.src}
              alt={media.care.alt}
              loading="lazy"
              width={1200}
              height={900}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </Reveal>

        <div className="relative">
          <div className="absolute left-5 top-0 h-full w-px bg-white/12" />
          <motion.div
            className="absolute left-5 top-0 h-full w-px origin-top bg-vet-green"
            style={{ scaleY: reduceMotion ? 1 : progressScale }}
          />
          <div className="space-y-8">
            {approach.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.05}>
                <article className="relative pl-14">
                  <div className="type-label absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-ink text-vet-green">
                    {item.step}
                  </div>
                  <div className="border-b border-white/12 pb-10">
                    <h3 className="type-feature-title text-white">{item.title}</h3>
                    <p className="type-body mt-4 max-w-2xl text-white/70">{item.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

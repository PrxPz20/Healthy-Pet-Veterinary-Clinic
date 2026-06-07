import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";

export function CareApproach() {
  const { approach, media } = getSiteContent();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative bg-ink py-24 text-white md:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal className="lg:sticky lg:top-28 lg:self-start">
          <div className="eyebrow text-sage-light">Care approach</div>
          <h2 className="mt-3 max-w-lg text-balance font-display text-[clamp(2.1rem,4.5vw,3.7rem)] font-black leading-[1.02]">
            Built for prevention, not panic.
          </h2>
          <p className="mt-6 max-w-md leading-relaxed text-white/66">
            The clinic experience is designed around steady communication: what is
            happening, why it matters, and what owners should do next.
          </p>
          <div className="mt-9 overflow-hidden rounded-[2rem]">
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
            className="absolute left-5 top-0 w-px origin-top bg-vet-green"
            style={{ height: progressHeight }}
          />
          <div className="space-y-8">
            {approach.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.05}>
                <article className="relative pl-14">
                  <div className="absolute left-0 top-1 grid h-10 w-10 place-items-center rounded-full border border-white/14 bg-ink font-display text-sm font-black text-vet-green">
                    {item.step}
                  </div>
                  <div className="border-b border-white/12 pb-10">
                    <h3 className="font-display text-3xl font-black text-white">{item.title}</h3>
                    <p className="mt-4 max-w-2xl leading-relaxed text-white/64">{item.body}</p>
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

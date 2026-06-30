import { motion, useReducedMotion } from "framer-motion";
import { CountUp, Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { ease } from "@/lib/motion";

function HighlightDoctor({ text }: { text: string }) {
  const parts = text.split("Dr. Avgoustinos");

  return (
    <>
      {parts.map((part, index) => (
        <span key={index}>
          {part}
          {index < parts.length - 1 ? (
            <span className="font-bold text-vet-green">Dr. Avgoustinos</span>
          ) : null}
        </span>
      ))}
    </>
  );
}

export function About() {
  const { about, media } = getSiteContent();
  const confirmedMetrics = about.metrics.filter((metric) => typeof metric.value === "number");
  const reduceMotion = useReducedMotion();

  return (
    <section id="doctor" className="relative bg-white py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div className="eyebrow">{about.label}</div>
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,4.5vw,3.8rem)] font-black leading-[1.02]">
              {about.heading}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/68">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <HighlightDoctor text={paragraph} />
                </p>
              ))}
            </div>
            {confirmedMetrics.length > 0 && (
              <div className="mt-9 grid gap-8 sm:grid-cols-2">
                {confirmedMetrics.map((metric) => (
                  <div key={metric.label} className="min-w-0">
                    <div className="font-display text-5xl font-black leading-none text-vet-green">
                      <CountUp to={metric.value ?? 0} suffix={metric.suffix} />
                    </div>
                    <div className="mt-3 text-sm font-bold text-ink/62">{metric.label}</div>
                    <motion.div
                      className="mt-4 h-px origin-left bg-vet-green/55"
                      initial={reduceMotion ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                      transition={reduceMotion ? { duration: 0 } : { duration: 0.9, ease }}
                    />
                  </div>
                ))}
              </div>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sage">
              <img
                src={media.about.src}
                alt={media.about.alt}
                loading="lazy"
                width={1280}
                height={1280}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.025]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

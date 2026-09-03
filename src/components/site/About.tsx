import { motion, useReducedMotion } from "framer-motion";
import { CountUp, Reveal } from "@/components/anim";
import { useEditorialContent } from "./editorial-content-context";
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
  const { about, aboutImage } = useEditorialContent();
  const confirmedMetrics = about.metrics.filter((metric) => typeof metric.value === "number");
  const reduceMotion = useReducedMotion();

  return (
    <section id="doctor" className="relative bg-white py-16 text-ink md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <h2 className="type-section-title">{about.heading}</h2>
            <div className="type-body mt-6 space-y-4 text-ink/68">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>
                  <HighlightDoctor text={paragraph} />
                </p>
              ))}
            </div>
            {confirmedMetrics.length > 0 && (
              <div className="mt-9 grid grid-cols-2 gap-4 sm:gap-8">
                {confirmedMetrics.map((metric) => (
                  <div key={metric.label} className="min-w-0">
                    <div className="type-stat-number text-vet-green">
                      <CountUp to={metric.value ?? 0} suffix={metric.suffix} />
                    </div>
                    <div className="type-label mt-3 text-ink/62 sm:text-sm">{metric.label}</div>
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
                src={aboutImage.src}
                alt={aboutImage.alt}
                loading="lazy"
                width={1280}
                height={1280}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.025]"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

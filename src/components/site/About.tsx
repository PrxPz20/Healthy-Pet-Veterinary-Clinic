import { CountUp, Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";

export function About() {
  const { about, media } = getSiteContent();
  const confirmedMetrics = about.metrics.filter((metric) => typeof metric.value === "number");

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
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {confirmedMetrics.length > 0 && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {confirmedMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-3xl border border-line bg-clinic p-5">
                    <div className="font-display text-4xl font-black text-vet-green">
                      <CountUp to={metric.value ?? 0} suffix={metric.suffix} />
                    </div>
                    <div className="mt-2 text-sm font-bold text-ink/62">{metric.label}</div>
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

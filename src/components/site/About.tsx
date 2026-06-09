import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";

export function About() {
  const { about, media } = getSiteContent();

  return (
    <section id="about" className="relative bg-white py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div className="eyebrow">ABOUT THE CLINIC</div>
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,4.5vw,3.8rem)] font-black leading-[1.02]">
              {about.heading}
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink/68">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-sage">
              <img
                src={media.about.src}
                alt={media.about.alt}
                loading="lazy"
                width={1280}
                height={1280}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,rgba(24,26,28,0.68),rgba(24,26,28,0))]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-white/88 p-5 backdrop-blur-xl">
                <div className="text-sm font-bold text-vet-green">{about.badgeLocation}</div>
                <div className="mt-1 font-display text-xl font-black text-ink">
                  {about.badgeTitle}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

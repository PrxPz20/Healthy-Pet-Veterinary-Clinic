import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { iconFor } from "./Icons";

export function About() {
  const { clinic, media, trustPoints } = getSiteContent();

  return (
    <section id="about" className="relative bg-white py-24 text-ink md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-20">
          <Reveal>
            <div className="eyebrow">About the clinic</div>
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,4.5vw,3.8rem)] font-black leading-[1.02]">
              A quieter, clearer veterinary visit for pets and owners.
            </h2>
            <div className="mt-7 space-y-5 text-base leading-relaxed text-ink/68">
              <p>
                {clinic.name} is planned around practical care: careful examinations,
                direct communication, and treatment choices that owners can understand.
                The design is modern, but the experience stays personal.
              </p>
              <p>
                From first puppy and kitten visits to skin problems, dental checks,
                nutrition questions, and ongoing preventive care, the clinic keeps the
                focus on comfort, clarity, and follow-up.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-sage">
              <img
                src={media.about.src}
                alt={media.about.alt}
                loading="lazy"
                width={1280}
                height={1280}
                className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(0deg,rgba(24,26,28,0.68),rgba(24,26,28,0))]" />
              <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/18 bg-white/84 p-5 backdrop-blur-xl">
                <div className="text-sm font-bold text-vet-green">Limassol, Cyprus</div>
                <div className="mt-1 font-display text-xl font-black text-ink">
                  Calm care, clear decisions.
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <StaggerGroup className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map((item) => {
            const Icon = iconFor(item.icon);
            return (
              <StaggerItem key={item.title}>
                <div className="h-full bg-clinic p-6 transition-colors duration-300 hover:bg-white">
                  <Icon className="h-5 w-5 text-vet-green" />
                  <h3 className="mt-5 font-display text-xl font-black text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/62">{item.body}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
}

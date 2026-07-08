import { MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";

export function CtaStrip() {
  const { hero, homepage } = getSiteContent();

  return (
    <section className="bg-white px-5 py-6 text-ink sm:px-8">
      <Reveal className="mx-auto flex max-w-7xl flex-col gap-5 rounded-[1.5rem] bg-ink px-5 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-7">
        <div>
          <h2 className="font-display text-2xl font-black leading-tight">
            {homepage.ctaStrip.heading}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/68">
            {homepage.ctaStrip.body}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <a
            href={hero.primaryCta.href}
            className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90"
          >
            <Phone className="h-4 w-4" />
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            target="_blank"
            rel="noreferrer"
            className="focus-ring focus-ring-dark inline-flex min-h-11 items-center gap-2 rounded-full bg-vet-green px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark"
          >
            <MessageCircle className="h-4 w-4" />
            {hero.secondaryCta.label}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

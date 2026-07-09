import { MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/anim";
import { getSiteContent } from "@/content/provider";

export function FinalCta() {
  const { hero, homepage } = getSiteContent();

  return (
    <section className="bg-white px-5 py-16 text-ink sm:px-8 md:py-20">
      <Reveal className="mx-auto max-w-5xl text-center">
        <h2 className="type-section-title">{homepage.finalCta.heading}</h2>
        <p className="type-section-copy mx-auto mt-5 max-w-2xl text-ink/66">
          {homepage.finalCta.body}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            href={hero.primaryCta.href}
            className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            <Phone className="h-4 w-4" />
            {hero.primaryCta.label}
          </a>
          <a
            href={hero.secondaryCta.href}
            target="_blank"
            rel="noreferrer"
            className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center gap-2 rounded-full border border-vet-green bg-white px-6 py-3 text-ink transition-all duration-200 hover:-translate-y-0.5 hover:text-vet-green"
          >
            <MessageCircle className="h-4 w-4" />
            {hero.secondaryCta.label}
          </a>
        </div>
      </Reveal>
    </section>
  );
}

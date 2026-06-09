import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/anim";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { getSiteContent } from "@/content/provider";
import { buildBreadcrumbSchema, buildClinicSchema, JsonLd } from "@/lib/schema";
import { iconFor } from "@/components/site/Icons";

const content = getSiteContent();

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: content.seo.services.title },
      { name: "description", content: content.seo.services.description },
      { property: "og:title", content: content.seo.services.title },
      { property: "og:description", content: content.seo.services.description },
      { property: "og:image", content: content.seo.services.ogImage },
      { name: "twitter:image", content: content.seo.services.ogImage },
    ],
    links: [{ rel: "canonical", href: content.seo.services.canonical }],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { clinic, services, hero } = content;

  return (
    <main className="min-h-screen overflow-x-hidden bg-clinic text-ink">
      <JsonLd data={buildClinicSchema(content)} />
      <JsonLd data={buildBreadcrumbSchema(clinic.siteUrl)} />
      <Nav />

      <section className="bg-ink px-5 pb-18 pt-32 text-white sm:px-8 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="text-sm text-white/55">
            <a
              href="/"
              className="focus-ring focus-ring-dark rounded transition-colors hover:text-white"
            >
              Home
            </a>
            <span className="mx-2">/</span>
            <span>Services</span>
          </nav>
          <Reveal className="mt-10 max-w-4xl min-w-0">
            <div className="eyebrow text-sage-light">VETERINARY SERVICES</div>
            <h1 className="mt-4 text-balance break-words font-display text-[clamp(2.35rem,8.5vw,5.6rem)] font-black leading-[1] md:leading-[0.96]">
              Services
            </h1>
            <p className="mt-6 max-w-[20.5rem] break-words text-lg leading-relaxed text-white/72 sm:max-w-2xl">
              Explore diagnostics, laboratory testing, surgery, dermatology, imaging,
              rehabilitation, grooming, and pet shop support for dogs and cats.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={hero.primaryCta.href}
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-clinic"
              >
                <Phone className="h-4 w-4" />
                {hero.primaryCta.label}
              </a>
              <a
                href={hero.secondaryCta.href}
                target="_blank"
                rel="noreferrer"
                className="focus-ring focus-ring-dark inline-flex min-h-11 items-center gap-2 rounded-full bg-vet-green px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark"
              >
                <MessageCircle className="h-4 w-4" />
                {hero.secondaryCta.label}
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-5 md:gap-6">
            {services.map((service, index) => {
              const Icon = iconFor(service.icon);
              return (
                <article
                  key={service.slug}
                  id={service.slug}
                  className="min-w-0 scroll-mt-28 rounded-3xl border border-line bg-white p-5 sm:p-6 md:p-8"
                >
                  <div className="grid min-w-0 gap-7 lg:grid-cols-[0.72fr_1fr] lg:items-start">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="grid h-12 w-12 place-items-center rounded-full bg-sage text-vet-green">
                          <Icon className="h-5 w-5" />
                        </span>
                        <span className="font-display text-sm font-black text-vet-green">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h2 className="mt-6 max-w-[18rem] break-words font-display text-[clamp(1.72rem,7vw,3.25rem)] font-black leading-[1.05] sm:max-w-xl md:leading-[1.02]">
                        {service.title}
                      </h2>
                      <p className="mt-5 max-w-[19rem] break-words leading-relaxed text-ink/64 sm:max-w-xl">
                        {service.detail}
                      </p>
                    </div>

                    <div className="min-w-0 lg:pt-14">
                      <ul className="grid min-w-0 gap-3 sm:grid-cols-3">
                        {service.highlights.map((highlight) => (
                          <li
                            key={highlight}
                            className="min-w-0 rounded-2xl border border-line bg-clinic px-4 py-4 text-sm font-bold leading-snug text-ink/72"
                          >
                            {highlight}
                          </li>
                        ))}
                      </ul>
                      <a
                        href="/#contact"
                        className="focus-ring focus-ring-dark group mt-8 hidden min-h-11 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green sm:inline-flex"
                      >
                        Contact about {service.title}
                        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-ink sm:px-8 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="eyebrow">NEED GUIDANCE?</div>
            <h2 className="mt-2 font-display text-3xl font-black md:text-5xl">
              Call before you visit.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={hero.primaryCta.href}
              className="focus-ring focus-ring-dark inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
            >
              <Phone className="h-4 w-4" />
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noreferrer"
              className="focus-ring focus-ring-dark inline-flex min-h-11 items-center gap-2 rounded-full bg-vet-green px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark"
            >
              <MessageCircle className="h-4 w-4" />
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

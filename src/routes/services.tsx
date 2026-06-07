import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, Phone } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { MobileCta } from "@/components/site/MobileCta";
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
    links: [
      { rel: "canonical", href: content.seo.services.canonical },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { clinic, services, hero } = content;

  return (
    <main className="min-h-screen bg-clinic text-ink">
      <JsonLd data={buildClinicSchema(content)} />
      <JsonLd data={buildBreadcrumbSchema(clinic.siteUrl)} />
      <Nav />

      <section className="bg-ink px-5 pb-20 pt-36 text-white sm:px-8 md:pb-28">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="text-sm text-white/55">
            <a href="/" className="transition-colors hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span>Services</span>
          </nav>
          <Reveal className="mt-10 max-w-4xl">
            <div className="eyebrow text-sage-light">Veterinary services</div>
            <h1 className="mt-4 text-balance font-display text-[clamp(2.6rem,7vw,6rem)] font-black leading-[0.96]">
              Veterinary care in Limassol, explained clearly.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-white/66">
              Explore preventive care, diagnostics, dental support, dermatology,
              surgery guidance, and nutrition services for dogs and cats.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={hero.primaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-clinic"
              >
                <Phone className="h-4 w-4" />
                {hero.primaryCta.label}
              </a>
              <a
                href={hero.secondaryCta.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-vet-green px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-vet-green-dark"
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
          <StaggerGroup className="grid grid-cols-1 gap-6">
            {services.map((service, index) => {
              const Icon = iconFor(service.icon);
              return (
                <StaggerItem key={service.slug}>
                  <article
                    id={service.slug}
                    className="scroll-mt-28 rounded-[2rem] border border-line bg-white p-6 md:p-9"
                  >
                    <div className="grid gap-8 lg:grid-cols-[0.72fr_1fr] lg:items-start">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="grid h-12 w-12 place-items-center rounded-full bg-sage text-vet-green">
                            <Icon className="h-5 w-5" />
                          </span>
                          <span className="font-display text-sm font-black text-vet-green">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>
                        <h2 className="mt-6 font-display text-[clamp(2rem,4vw,3.4rem)] font-black leading-[1.02]">
                          {service.seoTitle}
                        </h2>
                        <p className="mt-5 max-w-xl leading-relaxed text-ink/64">{service.detail}</p>
                      </div>

                      <div className="lg:pt-16">
                        <ul className="grid gap-3 sm:grid-cols-3">
                          {service.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="rounded-2xl border border-line bg-clinic px-4 py-4 text-sm font-bold text-ink/72"
                            >
                              {highlight}
                            </li>
                          ))}
                        </ul>
                        <a
                          href="/#contact"
                          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-vet-green"
                        >
                          Contact about {service.title}
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        </div>
      </section>

      <section className="bg-white px-5 py-18 text-ink sm:px-8 md:py-24">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="eyebrow">Need guidance?</div>
            <h2 className="mt-2 font-display text-3xl font-black md:text-5xl">
              Call before you visit.
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={hero.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-vet-green"
            >
              <Phone className="h-4 w-4" />
              {hero.primaryCta.label}
            </a>
            <a
              href={hero.secondaryCta.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-vet-green px-6 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-vet-green-dark"
            >
              <MessageCircle className="h-4 w-4" />
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <MobileCta />
    </main>
  );
}

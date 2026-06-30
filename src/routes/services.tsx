import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { ServiceDetailCard } from "@/components/site/ServiceDetailCard";
import { getSiteContent } from "@/content/provider";
import { buildBreadcrumbSchema, buildClinicSchema, JsonLd } from "@/lib/schema";

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
  const { clinic, serviceCategories, services, hero } = content;
  const servicesBySlug = new Map(services.map((service) => [service.slug, service]));
  const groupedCategories = serviceCategories
    .map((category) => ({
      ...category,
      services: category.serviceSlugs
        .map((slug) => servicesBySlug.get(slug))
        .filter((service): service is (typeof services)[number] => Boolean(service)),
    }))
    .filter((category) => category.services.length > 0);

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden bg-clinic text-ink">
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
            <span aria-current="page" className="font-bold text-white">
              Services
            </span>
          </nav>
          <Reveal className="mt-10 max-w-4xl min-w-0">
            <h1 className="text-balance break-words font-display text-[clamp(2.35rem,8.5vw,5.6rem)] font-black leading-[1] md:leading-[0.96]">
              Services
            </h1>
            <p className="mt-6 max-w-[20.5rem] break-words text-lg leading-relaxed text-white/72 sm:max-w-2xl">
              Find the clinic's core care, from testing and imaging to surgery, skin care,
              rehabilitation, grooming, and pet shop support.
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

      <section className="bg-white py-9 text-ink md:py-11">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="grid gap-7 lg:grid-cols-[0.72fr_1fr] lg:items-center">
            <div className="min-w-0">
              <h2 className="font-display text-3xl font-black leading-tight text-ink md:text-5xl">
                Find the right care.
              </h2>
              <p className="mt-4 max-w-xl text-pretty leading-relaxed text-ink/68">
                Browse by care area, then call or message the clinic if you are unsure which service
                fits your pet's symptoms.
              </p>
            </div>

            <nav aria-label="Service categories" className="flex min-w-0 flex-wrap gap-2">
              {groupedCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="focus-ring focus-ring-dark inline-flex min-h-11 items-center rounded-full border border-line bg-clinic px-4 py-2 text-sm font-bold text-ink/74 transition-colors duration-200 hover:border-vet-green/35 hover:bg-sage hover:text-ink"
                >
                  {category.label}
                </a>
              ))}
            </nav>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="space-y-14 md:space-y-20">
            {groupedCategories.map((category) => (
              <section key={category.id} id={category.id} className="scroll-mt-28">
                <Reveal className="max-w-3xl">
                  <h2 className="font-display text-[clamp(2rem,4vw,3.7rem)] font-black leading-[1.04] text-ink">
                    {category.label}
                  </h2>
                  <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-ink/66">
                    {category.description}
                  </p>
                </Reveal>

                <StaggerGroup className="mt-8 grid grid-cols-1 gap-5 md:mt-10 md:gap-6">
                  {category.services.map((service) => (
                    <StaggerItem key={service.slug}>
                      <ServiceDetailCard service={service} categoryLabel={category.label} />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 text-ink sm:px-8 md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-display text-3xl font-black md:text-5xl">
              Not sure what your pet needs?
            </h2>
            <p className="mt-3 max-w-xl leading-relaxed text-ink/66">
              Call or send a WhatsApp message before visiting so the clinic can guide you on timing
              and next steps.
            </p>
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

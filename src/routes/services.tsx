import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, Mail, MessageCircle, Phone } from "lucide-react";
import servicesHeroBanner from "@/assets/services/services_hero_banner.webp";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";
import { useContactSettings } from "@/components/site/contact-settings-context";
import { ServiceDetailCard } from "@/components/site/ServiceDetailCard";
import { getSiteContent } from "@/content/provider";
import { primaryContactCta, whatsappCta } from "@/content/contact";
import type { Service } from "@/content/types";
import { buildBreadcrumbSchema, buildClinicSchema, JsonLd } from "@/lib/schema";
import {
  initialPublicItems,
  loadPublishedServices,
  mergeServiceItems,
} from "@/lib/supabase/public-gallery";
import { ContentEmptyState } from "@/components/site/ContentEmptyState";

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
  const { clinic, serviceCategories, services: staticServices } = content;
  const contact = useContactSettings();
  const primary = primaryContactCta(contact);
  const secondary = contact.phones.length ? whatsappCta(contact) : null;
  const PrimaryIcon = contact.phones.length ? Phone : contact.whatsapp ? MessageCircle : Mail;
  const [services, setServices] = useState<Service[]>(() => initialPublicItems(staticServices));
  const [hasLoaded, setHasLoaded] = useState(false);
  const categoryDetails = new Map(serviceCategories.map((category) => [category.id, category]));
  const visibleCategories = Array.from(new Set(services.map((service) => service.category))).map(
    (id) => ({
      id,
      label:
        categoryDetails.get(id)?.label ??
        id.replaceAll("-", " ").replace(/^./, (letter) => letter.toUpperCase()),
      target: services.find((service) => service.category === id)!.slug,
      services: services.filter((service) => service.category === id),
    }),
  );
  const serviceOrder = new Map(services.map((service, index) => [service.slug, index]));

  useEffect(() => {
    let mounted = true;

    loadPublishedServices().then((cmsItems) => {
      if (mounted) {
        setServices(mergeServiceItems(staticServices, cmsItems));
        setHasLoaded(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [staticServices]);

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden bg-white text-ink">
      <JsonLd data={buildClinicSchema(content, contact)} />
      <JsonLd data={buildBreadcrumbSchema(clinic.siteUrl, "Services", "/services")} />
      <Nav />

      <section className="relative overflow-hidden bg-ink pb-18 pt-32 text-white md:pb-24">
        <img
          src={servicesHeroBanner}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/78 to-ink/42" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-white/70">
            <a
              href="/"
              className="focus-ring focus-ring-dark inline-flex min-h-11 items-center gap-1.5 rounded transition-colors hover:text-white"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              Home
            </a>
            <span className="mx-2">/</span>
            <span aria-current="page" className="font-bold text-white">
              Services
            </span>
          </nav>
          <Reveal className="mt-10 max-w-4xl min-w-0">
            <h1 className="type-page-title break-words">Services</h1>
            <p className="type-section-copy mt-6 max-w-[20.5rem] break-words text-white/72 sm:max-w-2xl">
              Find the clinic's core care, from testing and imaging to surgery, skin care,
              rehabilitation, grooming, and pet shop support.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-9 text-ink md:py-11">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="grid gap-7 lg:grid-cols-[0.72fr_1fr] lg:items-center">
            <div className="min-w-0">
              <h2 className="type-section-title text-ink">Find the right care.</h2>
              <p className="type-section-copy mt-4 max-w-xl text-ink/68">
                Browse by care area, then call or message the clinic if you are unsure which service
                fits your pet's symptoms.
              </p>
            </div>

            <nav aria-label="Service categories" className="flex min-w-0 flex-wrap gap-2">
              {visibleCategories.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.target}`}
                  className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center rounded-full border border-line bg-white px-4 py-2 text-ink/74 transition-colors duration-200 hover:border-vet-green/35 hover:bg-sage hover:text-ink"
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
          <div className="space-y-16 md:space-y-20">
            {visibleCategories.map((category) => (
              <section key={category.id} id={category.target} className="scroll-mt-28">
                <Reveal className="mb-8 flex items-center gap-4 md:mb-10">
                  <h2 className="type-subsection-title min-w-0 break-words text-ink">
                    {category.label}
                  </h2>
                  <span className="h-px flex-1 bg-line" aria-hidden="true" />
                </Reveal>
                <StaggerGroup className="grid grid-cols-1 gap-5 md:gap-6">
                  {category.services.map((service) => (
                    <StaggerItem key={service.slug}>
                      <ServiceDetailCard
                        service={service}
                        reversed={(serviceOrder.get(service.slug) ?? 0) % 2 === 1}
                      />
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </section>
            ))}
          </div>
          {hasLoaded && !visibleCategories.length ? (
            <ContentEmptyState
              title="Services are being updated"
              body="Please contact the clinic for current care options and availability."
            />
          ) : null}
        </div>
      </section>

      <section className="bg-white py-16 text-ink md:py-20">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0">
            <h2 className="type-section-title">Not sure what your pet needs?</h2>
            <p className="type-section-copy mt-3 max-w-xl text-ink/66">
              Call or send a WhatsApp message before visiting so the clinic can guide you on timing
              and next steps.
            </p>
          </div>
          <div className="flex min-w-0 flex-wrap gap-3 md:justify-end">
            <a
              href={primary.href}
              className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-6 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
            >
              <PrimaryIcon className="h-4 w-4" />
              {primary.label}
            </a>
            {secondary ? (
              <a
                href={secondary.href}
                target="_blank"
                rel="noreferrer"
                className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center gap-2 rounded-full bg-vet-green px-6 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark"
              >
                <MessageCircle className="h-4 w-4" />
                {secondary.label}
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

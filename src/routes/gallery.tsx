import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Phone } from "lucide-react";
import { Reveal } from "@/components/anim";
import { Footer } from "@/components/site/Footer";
import { GalleryCard } from "@/components/site/GalleryCard";
import { Nav } from "@/components/site/Nav";
import { getSiteContent } from "@/content/provider";
import { buildBreadcrumbSchema, buildClinicSchema, JsonLd } from "@/lib/schema";

const content = getSiteContent();

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: content.seo.gallery.title },
      { name: "description", content: content.seo.gallery.description },
      { property: "og:title", content: content.seo.gallery.title },
      { property: "og:description", content: content.seo.gallery.description },
      { property: "og:image", content: content.seo.gallery.ogImage },
      { name: "twitter:image", content: content.seo.gallery.ogImage },
    ],
    links: [{ rel: "canonical", href: content.seo.gallery.canonical }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const { clinic, gallery, hero } = content;

  return (
    <main className="min-h-screen overflow-x-hidden bg-clinic text-ink">
      <JsonLd data={buildClinicSchema(content)} />
      <JsonLd data={buildBreadcrumbSchema(clinic.siteUrl, "Gallery", "/gallery")} />
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
            <span>Gallery</span>
          </nav>

          <Reveal className="mt-10 max-w-4xl min-w-0">
            <div className="eyebrow text-sage-light">CLINIC GALLERY</div>
            <h1 className="mt-4 text-balance break-words font-display text-[clamp(2.35rem,8.5vw,5.6rem)] font-black leading-[1] md:leading-[0.96]">
              Gallery
            </h1>
            <p className="mt-6 max-w-[22rem] break-words text-lg leading-relaxed text-white/72 sm:max-w-2xl">
              Real pets, real visits, and familiar moments from Healthy Pet Veterinary Clinic.
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
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item, index) => (
              <GalleryCard
                key={item.slug}
                item={item}
                priority={index < 4}
                className={item.orientation === "landscape" ? "lg:col-span-2" : ""}
              />
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

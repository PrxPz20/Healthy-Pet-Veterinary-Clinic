import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Home, X } from "lucide-react";
import { Reveal } from "@/components/anim";
import { Footer } from "@/components/site/Footer";
import { GalleryCard } from "@/components/site/GalleryCard";
import { Nav } from "@/components/site/Nav";
import { getSiteContent } from "@/content/provider";
import type { GalleryItem } from "@/content/types";
import { quickTransition, softTransition } from "@/lib/motion";
import { buildBreadcrumbSchema, buildClinicSchema, JsonLd } from "@/lib/schema";

const content = getSiteContent();
const GALLERY_PAGE_SIZE = 6;

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
  const { clinic, gallery } = content;
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE);
  const reduceMotion = useReducedMotion();
  const visibleGallery = gallery.slice(0, visibleCount);
  const hasMore = visibleCount < gallery.length;

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden bg-clinic text-ink">
      <JsonLd data={buildClinicSchema(content)} />
      <JsonLd data={buildBreadcrumbSchema(clinic.siteUrl, "Gallery", "/gallery")} />
      <Nav />

      <section className="bg-ink px-5 pb-18 pt-32 text-white sm:px-8 md:pb-24">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="text-sm text-white/55">
            <a
              href="/"
              className="focus-ring focus-ring-dark inline-flex items-center gap-1.5 rounded transition-colors hover:text-white"
            >
              <Home className="h-3.5 w-3.5" aria-hidden="true" />
              Home
            </a>
            <span className="mx-2">/</span>
            <span aria-current="page" className="font-bold text-white">
              Gallery
            </span>
          </nav>

          <Reveal className="mt-10 max-w-4xl min-w-0">
            <h1 className="text-balance break-words font-display text-[clamp(2.35rem,8.5vw,5.6rem)] font-black leading-[1] md:leading-[0.96]">
              Gallery
            </h1>
            <p className="mt-6 max-w-[22rem] break-words text-lg leading-relaxed text-white/72 sm:max-w-2xl">
              Real pets, real visits, and familiar moments from Healthy Pet Veterinary Clinic.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleGallery.map((item, index) => (
              <GalleryCard
                key={item.slug}
                item={item}
                priority={index < 4}
                onClick={() => setActiveItem(item)}
                className={item.orientation === "landscape" ? "lg:col-span-2" : ""}
              />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + GALLERY_PAGE_SIZE)}
                className="focus-ring focus-ring-dark inline-flex min-h-11 items-center rounded-full bg-ink px-6 py-3 text-sm font-bold text-white transition-colors duration-200 hover:bg-vet-green"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <AnimatePresence>
        {activeItem ? (
          <motion.div
            className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/78 px-4 py-6 backdrop-blur-sm"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduceMotion ? { duration: 0 } : quickTransition}
            role="dialog"
            aria-modal="true"
            aria-labelledby="gallery-modal-title"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl overflow-hidden rounded-[1.5rem] bg-white text-ink shadow-[0_24px_70px_-38px_rgba(0,0,0,0.72)]"
              initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={reduceMotion ? { duration: 0 } : softTransition}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="focus-ring absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/92 text-ink shadow-[0_10px_24px_-18px_rgba(24,26,28,0.6)] transition-colors hover:bg-clinic"
                aria-label="Close gallery image"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="max-h-[72vh] bg-clinic">
                <img
                  src={activeItem.image.src}
                  alt={activeItem.image.alt}
                  className="max-h-[72vh] w-full object-contain"
                />
              </div>

              <div className="p-5 sm:p-6">
                <h2 id="gallery-modal-title" className="font-display text-2xl font-black">
                  {activeItem.title}
                </h2>
                <p className="mt-2 leading-relaxed text-ink/66">{activeItem.description}</p>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

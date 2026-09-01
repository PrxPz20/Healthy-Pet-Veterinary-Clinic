import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home } from "lucide-react";
import { Reveal } from "@/components/anim";
import { Footer } from "@/components/site/Footer";
import { GalleryCard } from "@/components/site/GalleryCard";
import { MediaCarouselModal } from "@/components/site/MediaCarouselModal";
import { Nav } from "@/components/site/Nav";
import { useContactSettings } from "@/components/site/contact-settings-context";
import { itemMedia } from "@/content/media";
import { getSiteContent } from "@/content/provider";
import type { GalleryItem } from "@/content/types";
import { buildBreadcrumbSchema, buildClinicSchema, JsonLd } from "@/lib/schema";
import {
  initialPublicItems,
  loadPublishedGallery,
  mergeGalleryItems,
} from "@/lib/supabase/public-gallery";

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
  const contact = useContactSettings();
  const { clinic, gallery } = content;
  const [items, setItems] = useState<GalleryItem[]>(() => initialPublicItems(gallery));
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(GALLERY_PAGE_SIZE);
  const visibleGallery = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;
  const galleryGridClass =
    visibleGallery.length === 1
      ? "mx-auto max-w-md grid-cols-1"
      : visibleGallery.length === 2
        ? "mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  useEffect(() => {
    let mounted = true;

    loadPublishedGallery().then((cmsItems) => {
      if (mounted) {
        setItems(mergeGalleryItems(gallery, cmsItems));
      }
    });

    return () => {
      mounted = false;
    };
  }, [gallery]);

  return (
    <main id="main-content" className="min-h-screen overflow-x-hidden bg-white text-ink">
      <JsonLd data={buildClinicSchema(content, contact)} />
      <JsonLd data={buildBreadcrumbSchema(clinic.siteUrl, "Gallery", "/gallery")} />
      <Nav />

      <section className="bg-ink pb-18 pt-32 text-white md:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
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
              Gallery
            </span>
          </nav>

          <Reveal className="mt-10 max-w-4xl min-w-0">
            <h1 className="type-page-title break-words">Gallery</h1>
            <p className="type-section-copy mt-6 max-w-[22rem] break-words text-white/72 sm:max-w-2xl">
              Real pets, real visits, and familiar moments from Healthy Pet Veterinary Clinic.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className={`grid gap-5 ${galleryGridClass}`}>
            {visibleGallery.map((item, index) => (
              <GalleryCard
                key={item.slug}
                item={item}
                priority={index < 4}
                onClick={() => setActiveItem(item)}
                className={
                  visibleGallery.length > 2 && item.orientation === "landscape"
                    ? "lg:col-span-2"
                    : ""
                }
              />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + GALLERY_PAGE_SIZE)}
                className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center rounded-full bg-ink px-6 py-3 text-white transition-colors duration-200 hover:bg-vet-green"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <MediaCarouselModal
        open={Boolean(activeItem)}
        title={activeItem?.title ?? ""}
        description={activeItem?.description}
        media={activeItem ? itemMedia(activeItem) : []}
        onClose={() => setActiveItem(null)}
      />

      <Footer />
    </main>
  );
}

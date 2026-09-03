import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import type { GalleryItem } from "@/content/types";
import {
  initialPublicItems,
  loadPublishedGallery,
  mergeGalleryItems,
  publicContentStartsLoaded,
} from "@/lib/supabase/public-gallery";
import { GalleryCard } from "./GalleryCard";
import { ContentEmptyState } from "./ContentEmptyState";
import { ContentLoadingState, ContentResultsStatus } from "./PublicContentState";

export function Gallery() {
  const { gallery, homepage } = getSiteContent();
  const [items, setItems] = useState<GalleryItem[]>(() => initialPublicItems(gallery));
  const [hasLoaded, setHasLoaded] = useState(publicContentStartsLoaded);
  const previewItems = items.slice(0, 6);
  const previewGridClass =
    previewItems.length === 1
      ? "mx-auto max-w-md grid-cols-1"
      : previewItems.length === 2
        ? "mx-auto max-w-3xl grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  useEffect(() => {
    let mounted = true;

    loadPublishedGallery().then((cmsItems) => {
      if (mounted) {
        setItems(mergeGalleryItems(gallery, cmsItems));
        setHasLoaded(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [gallery]);

  return (
    <section id="gallery" className="relative bg-white py-16 text-ink md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="type-section-title max-w-3xl">{homepage.gallery.heading}</h2>
            <p className="type-section-copy mt-5 max-w-2xl text-ink/64">{homepage.gallery.body}</p>
          </div>
          <a
            href="/gallery"
            className="focus-ring focus-ring-dark type-button group inline-flex min-h-11 w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            {homepage.gallery.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <ContentResultsStatus
          label="gallery items"
          loading={!hasLoaded}
          visible={previewItems.length}
          total={items.length}
        />
        {!hasLoaded ? (
          <div className="mt-10 md:mt-12">
            <ContentLoadingState />
          </div>
        ) : previewItems.length ? (
          <StaggerGroup className={`mt-10 grid gap-5 md:mt-12 ${previewGridClass}`}>
            {previewItems.map((item, index) => (
              <StaggerItem
                key={item.slug}
                className={`h-full ${index > 2 ? "hidden sm:block" : ""}`}
              >
                <GalleryCard item={item} href="/gallery" className="h-full" />
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <div className="mt-10 md:mt-12">
            <ContentEmptyState
              title="Gallery updates are coming soon"
              body="New clinic moments will appear here once they are ready to share."
            />
          </div>
        )}
      </div>
    </section>
  );
}

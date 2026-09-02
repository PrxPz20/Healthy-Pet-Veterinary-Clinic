import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import type { CaseItem } from "@/content/types";
import {
  initialPublicItems,
  loadPublishedCases,
  mergeCaseItems,
} from "@/lib/supabase/public-gallery";
import { CaseCard } from "./CaseCard";
import { ContentEmptyState } from "./ContentEmptyState";

export function Cases() {
  const { cases, homepage } = getSiteContent();
  const [items, setItems] = useState<CaseItem[]>(() => initialPublicItems(cases));
  const [hasLoaded, setHasLoaded] = useState(false);
  const previewItems = items.filter((item) => item.homepagePreview).slice(0, 4);
  const previewGridClass =
    previewItems.length === 1
      ? "mx-auto max-w-sm grid-cols-1"
      : previewItems.length === 2
        ? "mx-auto max-w-2xl grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  useEffect(() => {
    let mounted = true;

    loadPublishedCases().then((cmsItems) => {
      if (mounted) {
        setItems(mergeCaseItems(cases, cmsItems));
        setHasLoaded(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [cases]);

  return (
    <section id="cases" className="relative bg-white py-16 text-ink md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="type-section-title max-w-3xl">{homepage.cases.heading}</h2>
            <p className="type-section-copy mt-5 max-w-2xl text-ink/64">{homepage.cases.body}</p>
          </div>
          <a
            href="/cases"
            className="focus-ring focus-ring-dark type-button group inline-flex min-h-11 w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            {homepage.cases.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <StaggerGroup className={`mt-10 grid gap-5 md:mt-12 ${previewGridClass}`}>
          {previewItems.map((item, index) => (
            <StaggerItem key={item.id} className={`h-full ${index > 1 ? "hidden sm:block" : ""}`}>
              <CaseCard item={item} href="/cases" allowReveal={false} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>
        {hasLoaded && !previewItems.length ? (
          <div className="mt-10 md:mt-12">
            <ContentEmptyState
              title="No published cases yet"
              body="Documented cases will appear here after clinic review and approval."
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

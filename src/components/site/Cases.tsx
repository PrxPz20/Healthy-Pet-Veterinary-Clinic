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

export function Cases() {
  const { cases, homepage } = getSiteContent();
  const [items, setItems] = useState<CaseItem[]>(() => initialPublicItems(cases));
  const previewItems = items.filter((item) => item.homepagePreview).slice(0, 4);

  useEffect(() => {
    let mounted = true;

    loadPublishedCases().then((cmsItems) => {
      if (mounted) {
        setItems(mergeCaseItems(cases, cmsItems));
      }
    });

    return () => {
      mounted = false;
    };
  }, [cases]);

  return (
    <section id="cases" className="relative bg-white py-20 text-ink md:py-28">
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

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {previewItems.map((item) => (
            <StaggerItem key={item.id} className="h-full">
              <CaseCard item={item} href="/cases" allowReveal={false} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>
        <a
          href="/cases"
          className="focus-ring focus-ring-dark type-button group relative mx-auto mt-8 flex min-h-11 w-fit items-center justify-center gap-2 rounded-sm px-2 py-2 text-center font-semibold text-ink/64 transition-colors duration-200 after:absolute after:bottom-1.5 after:left-2 after:h-[2px] after:w-[calc(100%-1rem)] after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-ink hover:after:scale-x-100"
        >
          Explore all documented cases
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </a>
      </div>
    </section>
  );
}

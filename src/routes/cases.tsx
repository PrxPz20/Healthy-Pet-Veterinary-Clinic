import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertTriangle, Home } from "lucide-react";
import casesHeroBanner from "@/assets/cases/cases_hero_banner.png";
import { Reveal } from "@/components/anim";
import { CaseCard } from "@/components/site/CaseCard";
import { Footer } from "@/components/site/Footer";
import { MediaCarouselModal } from "@/components/site/MediaCarouselModal";
import { Nav } from "@/components/site/Nav";
import { useContactSettings } from "@/components/site/contact-settings-context";
import { SensitiveContentWarning } from "@/components/site/SensitiveContentWarning";
import { itemMedia } from "@/content/media";
import { getSiteContent } from "@/content/provider";
import type { CaseItem } from "@/content/types";
import { buildBreadcrumbSchema, buildClinicSchema, JsonLd } from "@/lib/schema";
import {
  initialPublicItems,
  loadPublishedCases,
  mergeCaseItems,
} from "@/lib/supabase/public-gallery";

const content = getSiteContent();
const CASES_PAGE_SIZE = 6;

export const Route = createFileRoute("/cases")({
  head: () => ({
    meta: [
      { title: content.seo.cases.title },
      { name: "description", content: content.seo.cases.description },
      { property: "og:title", content: content.seo.cases.title },
      { property: "og:description", content: content.seo.cases.description },
      { property: "og:image", content: content.seo.cases.ogImage },
      { name: "twitter:image", content: content.seo.cases.ogImage },
    ],
    links: [{ rel: "canonical", href: content.seo.cases.canonical }],
  }),
  component: CasesPage,
});

function CasesPage() {
  const contact = useContactSettings();
  const { clinic, cases } = content;
  const [items, setItems] = useState<CaseItem[]>(() => initialPublicItems(cases));
  const [visibleCount, setVisibleCount] = useState(CASES_PAGE_SIZE);
  const [activeCase, setActiveCase] = useState<CaseItem | null>(null);
  const visibleCases = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

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
    <main id="main-content" className="min-h-screen overflow-x-hidden bg-white text-ink">
      <JsonLd data={buildClinicSchema(content, contact)} />
      <JsonLd data={buildBreadcrumbSchema(clinic.siteUrl, "Cases", "/cases")} />
      <Nav />
      <SensitiveContentWarning />

      <section className="relative overflow-hidden bg-ink pb-18 pt-32 text-white md:pb-24">
        <img
          src={casesHeroBanner}
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
              Cases
            </span>
          </nav>

          <Reveal className="mt-10 max-w-4xl min-w-0">
            <h1 className="type-page-title break-words">Cases</h1>
            <p className="type-section-copy mt-6 max-w-[23rem] break-words text-white/72 sm:max-w-2xl">
              Documented veterinary cases shared with care. Sensitive images are blurred until you
              choose to view each one.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="pb-20 pt-8 md:pb-28 md:pt-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto mb-10 flex max-w-full items-center justify-center gap-3 rounded-[1.5rem] border border-red-200 bg-red-50 px-4 py-3 shadow-[0_18px_45px_-36px_rgba(24,26,28,0.45)] sm:w-fit sm:px-5 sm:py-4">
            <span className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full bg-red-100 text-red-600">
              <span className="absolute inset-0 rounded-full bg-red-500/20 motion-safe:animate-ping" />
              <span className="absolute inset-0 rounded-full ring-2 ring-red-400/45 motion-safe:animate-ping [animation-delay:450ms]" />
              <AlertTriangle className="relative h-5 w-5" aria-hidden="true" />
            </span>
            <p className="type-body min-w-0 text-center font-medium text-ink/72 lg:whitespace-nowrap">
              These images are included for educational review and professional context. They are
              not a substitute for an examination or medical advice for a specific pet.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleCases.map((item, index) => (
              <CaseCard
                key={item.id}
                item={item}
                priority={index < 3}
                onClick={() => setActiveCase(item)}
                className={item.orientation === "landscape" ? "lg:col-span-2" : ""}
              />
            ))}
          </div>
          {hasMore ? (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + CASES_PAGE_SIZE)}
                className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center rounded-full bg-ink px-6 py-3 text-white transition-colors duration-200 hover:bg-vet-green"
              >
                Load more
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <MediaCarouselModal
        open={Boolean(activeCase)}
        title={activeCase?.title ?? ""}
        description={activeCase?.description}
        media={activeCase ? itemMedia(activeCase) : []}
        isSensitive={activeCase?.isSensitive}
        onClose={() => setActiveCase(null)}
      />

      <Footer />
    </main>
  );
}

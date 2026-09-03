import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import type { Service } from "@/content/types";
import {
  initialPublicItems,
  loadPublishedServices,
  mergeServiceItems,
  publicContentStartsLoaded,
} from "@/lib/supabase/public-gallery";
import { serviceImages } from "@/content/cms-media";
import { ContentEmptyState } from "./ContentEmptyState";
import { ContentLoadingState, ContentResultsStatus } from "./PublicContentState";

export function Services() {
  const { homepage, services } = getSiteContent();
  const [items, setItems] = useState<Service[]>(() => initialPublicItems(services));
  const [hasLoaded, setHasLoaded] = useState(publicContentStartsLoaded);
  const featuredServices = items.slice(0, 3);

  useEffect(() => {
    let mounted = true;

    loadPublishedServices().then((cmsItems) => {
      if (mounted) {
        setItems(mergeServiceItems(services, cmsItems));
        setHasLoaded(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [services]);

  return (
    <section id="services" className="relative bg-white py-16 text-ink md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="type-section-title max-w-3xl">{homepage.services.heading}</h2>
          </div>
          <a
            href="/services"
            className="focus-ring focus-ring-dark type-button group inline-flex min-h-11 w-fit shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            {homepage.services.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <ContentResultsStatus
          label="services"
          loading={!hasLoaded}
          visible={featuredServices.length}
          total={items.length}
        />
        {!hasLoaded ? (
          <div className="mt-10 md:mt-12">
            <ContentLoadingState count={2} className="grid-cols-1" />
          </div>
        ) : featuredServices.length ? (
          <StaggerGroup className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:gap-6">
            {featuredServices.map((service, index) => {
              const image =
                service.image?.src ?? serviceImages[service.slug] ?? serviceImages["pet-shop"];
              const imageAlt =
                service.image?.alt ?? `${service.title} at Healthy Pet Veterinary Clinic`;
              const reversed = index % 2 === 1;

              return (
                <StaggerItem key={service.slug} className={index > 1 ? "hidden sm:block" : ""}>
                  <a
                    href={`/services#${service.slug}`}
                    className="focus-ring focus-ring-dark group block min-w-0 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-38px_rgba(24,26,28,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-vet-green/35 hover:shadow-[0_22px_48px_-38px_rgba(24,26,28,0.42)]"
                  >
                    <div
                      className={`grid min-w-0 gap-0 md:grid-cols-[0.9fr_1.1fr] ${
                        reversed ? "" : "md:[&>*:first-child]:order-2"
                      }`}
                    >
                      <div className="border-b border-line bg-white md:border-b-0">
                        <img
                          src={image}
                          alt={imageAlt}
                          loading="lazy"
                          decoding="async"
                          width={1440}
                          height={1080}
                          sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 100vw"
                          className="aspect-[4/3] h-full w-full bg-sage object-cover object-center [filter:saturate(.94)_contrast(1.025)] transition-transform duration-500 group-hover:scale-[1.025]"
                        />
                      </div>
                      <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6 md:min-h-[22rem] md:p-8">
                        <span className="type-label text-vet-green">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="type-feature-title mt-5 line-clamp-2 [overflow-wrap:anywhere] text-ink">
                          {service.title}
                        </h3>
                        <p className="type-body mt-4 line-clamp-3 max-w-[56ch] [overflow-wrap:anywhere] text-ink/68">
                          {service.short}
                        </p>
                        <div className="type-button mt-8 inline-flex items-center gap-2 text-vet-green transition-colors duration-200 group-hover:text-vet-green-dark">
                          Learn more
                          <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </div>
                      </div>
                    </div>
                  </a>
                </StaggerItem>
              );
            })}
          </StaggerGroup>
        ) : (
          <div className="mt-10 md:mt-12">
            <ContentEmptyState
              title="Services are being updated"
              body="Please contact the clinic for current care options and availability."
            />
          </div>
        )}
      </div>
    </section>
  );
}

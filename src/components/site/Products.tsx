import { ExternalLink, Info, MessageCircle } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { loadPublishedProducts, mergeProductItems } from "@/lib/supabase/public-gallery";
import { ContentEmptyState } from "./ContentEmptyState";
import { ContentErrorState, ContentLoadingState, ContentResultsStatus } from "./PublicContentState";
import { usePublicItems } from "@/hooks/use-public-items";

export function Products() {
  const { homepage, products } = getSiteContent();
  const { items, hasLoaded, loading, hasError, retry } = usePublicItems(
    products,
    loadPublishedProducts,
    mergeProductItems,
  );
  const productGridClass =
    items.length === 1
      ? "mx-auto max-w-sm grid-cols-1"
      : items.length === 2
        ? "mx-auto max-w-2xl grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <section id="products" className="site-section bg-white py-16 text-ink lg:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <h2 className="type-section-title">{homepage.products.heading}</h2>
          <p className="type-section-copy mt-5 max-w-2xl text-ink/66">{homepage.products.body}</p>
        </Reveal>

        <ContentResultsStatus
          label="products"
          loading={loading}
          visible={items.length}
          total={items.length}
        />
        {hasError ? <ContentErrorState onRetry={retry} loading={loading} /> : null}
        {!hasLoaded ? (
          <div className="mt-10 md:mt-12">
            <ContentLoadingState className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" />
          </div>
        ) : items.length ? (
          <StaggerGroup className={`mt-10 grid gap-5 md:mt-12 ${productGridClass}`}>
            {items.map((product) => (
              <StaggerItem key={product.name} className="h-full">
                <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_24px_-22px_rgba(24,26,28,0.3)]">
                  <div className="aspect-[4/3] overflow-hidden bg-sage">
                    {product.image.src ? (
                      <img
                        src={product.image.src}
                        alt={product.image.alt}
                        loading="lazy"
                        decoding="async"
                        width={900}
                        height={675}
                        sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="grid h-full place-items-center px-5 text-center text-sm font-bold text-ink/68">
                        No image added
                      </div>
                    )}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col p-5 md:p-6">
                    <div className="type-label truncate text-vet-green" title={product.category}>
                      {product.category}
                    </div>
                    <h3 className="type-card-title mt-2 line-clamp-2 [overflow-wrap:anywhere] text-ink">
                      {product.name}
                    </h3>
                    {product.description ? (
                      <p className="type-card-copy mt-3 line-clamp-3 flex-1 [overflow-wrap:anywhere] text-ink/62">
                        {product.description}
                      </p>
                    ) : null}
                    {(product.links.wolt || product.links.foody) && (
                      <div className="mt-auto flex flex-wrap gap-2 pt-5">
                        {product.links.wolt && (
                          <a
                            href={product.links.wolt}
                            target="_blank"
                            rel="noreferrer"
                            className="focus-ring focus-ring-dark type-button inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-white transition-colors duration-200 hover:bg-vet-green"
                          >
                            Wolt
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                        {product.links.foody && (
                          <a
                            href={product.links.foody}
                            target="_blank"
                            rel="noreferrer"
                            className="focus-ring type-button inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-ink transition-colors duration-200 hover:border-vet-green hover:text-vet-green"
                          >
                            Foody
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </StaggerGroup>
        ) : (
          <div className="mt-10 md:mt-12">
            <ContentEmptyState
              title="Products are being updated"
              body="Contact the clinic to ask about current food and everyday care availability."
            />
          </div>
        )}

        <Reveal className="mt-6 rounded-[1.5rem] border border-line bg-white p-5 sm:mt-8 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex max-w-2xl items-start gap-3">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage text-vet-green">
              <Info className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="type-card-title text-ink">{homepage.products.helpHeading}</h3>
              <p className="type-card-copy mt-2 text-ink/64">{homepage.products.helpBody}</p>
            </div>
          </div>
          <a
            href="#contact"
            className="focus-ring focus-ring-dark type-button mt-5 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green sm:mt-0"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {homepage.products.ctaLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

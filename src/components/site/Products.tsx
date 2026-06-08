import { ExternalLink } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";

export function Products() {
  const { products } = getSiteContent();

  return (
    <section id="products" className="bg-clinic py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <div className="eyebrow">Food and essentials</div>
          <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-black leading-[1.02]">
            Recommended items, redirected to delivery apps.
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-ink/66">
            The clinic can highlight useful food and care items here, with links that send owners to
            external delivery apps when available.
          </p>
        </Reveal>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-5 md:mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <StaggerItem key={product.name}>
              <article className="group h-full overflow-hidden rounded-3xl border border-line bg-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_24px_-22px_rgba(24,26,28,0.3)]">
                <div className="aspect-[4/3] overflow-hidden bg-sage">
                  <img
                    src={product.image.src}
                    alt={product.image.alt}
                    loading="lazy"
                    width={900}
                    height={675}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col p-5 md:p-6">
                  <div className="text-sm font-bold text-vet-green">{product.category}</div>
                  <h3 className="mt-2 font-display text-xl font-black text-ink">{product.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/62">
                    {product.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {product.links.wolt && (
                      <a
                        href={product.links.wolt}
                        target="_blank"
                        rel="noreferrer"
                        className="focus-ring focus-ring-dark inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-white transition-colors duration-200 hover:bg-vet-green"
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
                        className="focus-ring inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2.5 text-xs font-bold text-ink transition-colors duration-200 hover:border-vet-green hover:text-vet-green"
                      >
                        Foody
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

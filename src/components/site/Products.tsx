import { ExternalLink, Info, MessageCircle } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";

export function Products() {
  const { homepage, products } = getSiteContent();

  return (
    <section id="products" className="bg-white py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="max-w-3xl">
          <h2 className="text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-black leading-[1.02]">
            {homepage.products.heading}
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed text-ink/66">{homepage.products.body}</p>
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
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                  />
                </div>
                <div className="flex flex-col p-5 md:p-6">
                  <div className="text-sm font-bold text-vet-green">{product.category}</div>
                  <h3 className="mt-2 font-display text-xl font-black text-ink">{product.name}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-ink/62">
                    {product.description}
                  </p>
                  {(product.links.wolt || product.links.foody) && (
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
                  )}
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <Reveal className="mt-6 rounded-[1.5rem] border border-line bg-white p-5 sm:mt-8 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div className="flex max-w-2xl items-start gap-3">
            <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage text-vet-green">
              <Info className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h3 className="font-display text-2xl font-black leading-tight text-ink">
                {homepage.products.helpHeading}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/64">
                {homepage.products.helpBody}
              </p>
            </div>
          </div>
          <a
            href="#contact"
            className="focus-ring focus-ring-dark mt-5 inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green sm:mt-0"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {homepage.products.ctaLabel}
          </a>
        </Reveal>
      </div>
    </section>
  );
}

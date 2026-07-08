import { ArrowUpRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { serviceImages } from "./ServiceDetailCard";

export function Services() {
  const { homepage, services } = getSiteContent();
  const featuredServices = services.slice(0, 3);

  return (
    <section id="services" className="relative bg-white py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">{homepage.services.label}</div>
            <h2 className="mt-3 max-w-3xl text-balance font-display text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1]">
              {homepage.services.heading}
            </h2>
          </div>
          <a
            href="/services"
            className="focus-ring focus-ring-dark group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            {homepage.services.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-5 md:mt-12 md:gap-6">
          {featuredServices.map((service, index) => {
            const image = serviceImages[service.slug];
            const reversed = index % 2 === 1;

            return (
              <StaggerItem key={service.slug}>
                <a
                  href={`/services#${service.slug}`}
                  className="focus-ring focus-ring-dark group block min-w-0 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-38px_rgba(24,26,28,0.32)] transition-all duration-300 hover:-translate-y-1 hover:border-vet-green/35 hover:shadow-[0_22px_48px_-38px_rgba(24,26,28,0.42)]"
                >
                  <div
                    className={`grid min-w-0 gap-0 lg:grid-cols-2 ${
                      reversed ? "" : "lg:[&>*:first-child]:order-2"
                    }`}
                  >
                    <div className="border-b border-line bg-white lg:border-b-0">
                      <img
                        src={image}
                        alt={`${service.title} at Healthy Pet Veterinary Clinic`}
                        loading="lazy"
                        className="aspect-[4/3] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                      />
                    </div>
                    <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6 md:p-8 lg:min-h-[22rem]">
                      <span className="font-display text-sm font-black text-vet-green">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-5 text-balance break-words font-display text-[clamp(1.65rem,5vw,2.8rem)] font-black leading-[1.04] text-ink">
                        {service.title}
                      </h3>
                      <p className="mt-4 max-w-[56ch] text-pretty leading-relaxed text-ink/68">
                        {service.short}
                      </p>
                      <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-vet-green transition-colors duration-200 group-hover:text-vet-green-dark">
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
      </div>
    </section>
  );
}

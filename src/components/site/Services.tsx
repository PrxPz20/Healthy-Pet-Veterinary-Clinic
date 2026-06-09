import { ArrowUpRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { iconFor } from "./Icons";

export function Services() {
  const { services } = getSiteContent();
  const featuredServices = services.slice(0, 6);

  return (
    <section id="care" className="relative bg-clinic py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">OUR CARE</div>
            <h2 className="mt-3 max-w-3xl text-balance font-display text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1]">
              Veterinary services, delivered with patience.
            </h2>
          </div>
          <a
            href="/services"
            className="focus-ring focus-ring-dark group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            View all services
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[1.5rem] border border-line bg-line md:mt-12 md:grid-cols-2 lg:grid-cols-3">
          {featuredServices.map((service, index) => {
            const Icon = iconFor(service.icon);
            return (
              <StaggerItem key={service.slug} className="h-full">
                <a
                  href={`/services#${service.slug}`}
                  className="focus-ring group relative flex h-full min-h-[17rem] flex-col overflow-hidden bg-white px-5 py-7 transition-colors duration-300 before:absolute before:inset-x-0 before:top-0 before:h-1 before:origin-left before:scale-x-0 before:bg-vet-green before:transition-transform before:duration-300 hover:bg-clinic/80 hover:before:scale-x-100 md:px-8 md:py-8"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-sm font-black text-vet-green">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-vet-green/10 text-vet-green transition-all duration-300 group-hover:scale-105 group-hover:bg-vet-green group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-6 font-display text-2xl font-black text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink/65">
                    {service.short}
                  </p>
                  <div className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-vet-green">
                    Learn more
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerGroup>

        <Reveal className="mt-6 text-sm font-semibold text-ink/62">
          Use the button above to see the full list of services.
        </Reveal>
      </div>
    </section>
  );
}

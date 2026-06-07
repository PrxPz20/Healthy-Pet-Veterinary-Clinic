import { ArrowRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { iconFor } from "./Icons";

export function Services() {
  const { services } = getSiteContent();

  return (
    <section id="care" className="relative bg-clinic py-24 text-ink md:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">Core care</div>
            <h2 className="mt-3 max-w-3xl text-balance font-display text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1]">
              Veterinary services with clear answers and calm handling.
            </h2>
          </div>
          <a
            href="/services"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            View all services
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </Reveal>

        <StaggerGroup className="mt-14 grid grid-cols-1 border-y border-line md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => {
            const Icon = iconFor(service.icon);
            return (
              <StaggerItem key={service.slug}>
                <a
                  href={`/services#${service.slug}`}
                  className="group block h-full border-b border-line py-8 transition-colors duration-300 hover:bg-white md:border-r md:px-8 lg:min-h-72"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-sm font-black text-vet-green">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-white text-vet-green transition-all duration-300 group-hover:bg-vet-green group-hover:text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h3 className="mt-8 font-display text-2xl font-black text-ink">{service.title}</h3>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink/65">{service.short}</p>
                  <div className="mt-7 inline-flex items-center gap-2 text-sm font-bold text-vet-green">
                    Learn more
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
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

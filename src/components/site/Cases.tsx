import { ArrowUpRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { CaseCard } from "./CaseCard";

export function Cases() {
  const { cases } = getSiteContent();
  const previewItems = cases.filter((item) => item.homepagePreview).slice(0, 4);

  return (
    <section id="cases" className="relative bg-clinic py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="eyebrow">CASES</div>
            <h2 className="mt-3 max-w-3xl text-balance font-display text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1]">
              Documented veterinary cases.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/64 md:text-lg">
              Selected case images are shared for educational review. Sensitive media stays
              protected until the viewer chooses to open it.
            </p>
          </div>
          <a
            href="/cases"
            className="focus-ring focus-ring-dark group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            View cases
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-4">
          {previewItems.map((item, index) => (
            <StaggerItem key={item.id} className="h-full">
              <CaseCard
                item={item}
                href="/cases"
                priority={index < 2}
                allowReveal={false}
                className="h-full"
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { Service } from "@/content/types";
import { quickTransition } from "@/lib/motion";
import { iconFor } from "./Icons";

type ServiceDetailCardProps = {
  service: Service;
  categoryLabel: string;
};

export function ServiceDetailCard({ service, categoryLabel }: ServiceDetailCardProps) {
  const reduceMotion = useReducedMotion();
  const Icon = iconFor(service.icon);

  return (
    <motion.article
      id={service.slug}
      className="group min-w-0 scroll-mt-28 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-38px_rgba(24,26,28,0.32)] transition-colors duration-300 hover:border-vet-green/35"
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={quickTransition}
    >
      <div className="grid min-w-0 gap-0 lg:grid-cols-[0.78fr_1fr]">
        <div className="min-w-0 border-b border-line p-5 sm:p-6 md:p-8 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4">
            <span className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-ink/72">
              {categoryLabel}
            </span>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-vet-green/10 text-vet-green transition-colors duration-300 group-hover:bg-vet-green group-hover:text-white">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>

          <h3 className="mt-6 text-balance break-words font-display text-[clamp(1.65rem,5.5vw,3rem)] font-black leading-[1.04] text-ink">
            {service.title}
          </h3>
          <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-ink/70">
            {service.short}
          </p>
        </div>

        <div className="flex min-w-0 flex-col p-5 sm:p-6 md:p-8">
          <p className="max-w-[68ch] text-pretty leading-relaxed text-ink/68">{service.detail}</p>

          <ul className="mt-7 grid min-w-0 gap-3 sm:grid-cols-3">
            {service.highlights.map((highlight) => (
              <li
                key={highlight}
                className="min-w-0 rounded-2xl bg-clinic px-4 py-4 text-sm font-bold leading-snug text-ink/74 ring-1 ring-line"
              >
                {highlight}
              </li>
            ))}
          </ul>

          <a
            href="/#contact"
            aria-label={`Ask about ${service.title}`}
            className="focus-ring focus-ring-dark group/link mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            Ask about this service
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

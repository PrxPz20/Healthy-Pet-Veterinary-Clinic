import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { serviceImages } from "@/content/cms-media";
import type { Service } from "@/content/types";
import { quickTransition } from "@/lib/motion";

type ServiceDetailCardProps = {
  service: Service;
  reversed?: boolean;
};

export function ServiceDetailCard({ service, reversed = false }: ServiceDetailCardProps) {
  const reduceMotion = useReducedMotion();
  const image = service.image?.src ?? serviceImages[service.slug] ?? serviceImages["pet-shop"];
  const imageAlt = service.image?.alt ?? `${service.title} at Healthy Pet Veterinary Clinic`;

  return (
    <motion.article
      id={service.slug}
      className="group min-w-0 scroll-mt-28 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-38px_rgba(24,26,28,0.32)] transition-colors duration-300 hover:border-vet-green/35"
      whileHover={reduceMotion ? undefined : { y: -3 }}
      transition={quickTransition}
    >
      <div
        className={`grid min-w-0 gap-0 md:grid-cols-[0.9fr_1.1fr] ${
          reversed ? "" : "md:[&>*:first-child]:order-2"
        }`}
      >
        <div className="min-h-full border-b border-line bg-white md:border-b-0">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
            width={1440}
            height={1080}
            sizes="(min-width: 1280px) 560px, (min-width: 768px) 45vw, 100vw"
            className="aspect-[4/3] h-full w-full bg-sage object-cover object-center [filter:saturate(.94)_contrast(1.025)]"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-center p-5 sm:p-6 md:min-h-[24rem] md:p-8 lg:min-h-[26rem]">
          <h3 className="type-feature-title [overflow-wrap:anywhere] text-ink">{service.title}</h3>
          <p className="type-body mt-4 max-w-[68ch] [overflow-wrap:anywhere] text-ink/68">
            {service.detail}
          </p>

          <a
            href="/#contact"
            aria-label={`Ask about ${service.title}`}
            className="focus-ring focus-ring-dark type-button group/link mt-8 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
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

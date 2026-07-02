import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { CaseItem } from "@/content/types";
import { quickTransition } from "@/lib/motion";
import { SensitiveImage } from "./SensitiveImage";

type CaseCardProps = {
  item: CaseItem;
  href?: string;
  className?: string;
  priority?: boolean;
  allowReveal?: boolean;
};

function imageAspect(orientation: CaseItem["orientation"]) {
  if (orientation === "portrait") {
    return "aspect-[4/5]";
  }

  if (orientation === "square") {
    return "aspect-square";
  }

  return "aspect-[4/3]";
}

export function CaseCard({
  item,
  href,
  className = "",
  priority = false,
  allowReveal = true,
}: CaseCardProps) {
  const reduceMotion = useReducedMotion();
  const cardClass = `group flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-36px_rgba(24,26,28,0.34)] transition-colors duration-300 hover:border-vet-green/35 ${className}`;
  const aspectClass = allowReveal ? imageAspect(item.orientation) : "aspect-[4/3]";
  const content = (
    <figure className="flex h-full flex-col">
      <SensitiveImage
        image={item.image}
        isSensitive={item.isSensitive}
        priority={priority}
        allowReveal={allowReveal}
        className={aspectClass}
      />
      <figcaption className="mt-auto p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {item.category ? (
                <span className="text-xs font-bold text-vet-green">{item.category}</span>
              ) : null}
              {item.isSensitive ? (
                <span className="rounded-full bg-sage px-3 py-1 text-[0.72rem] font-bold text-ink/72">
                  Sensitive image
                </span>
              ) : null}
            </div>
            <h3 className="mt-3 font-display text-xl font-black leading-tight text-ink">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/62">{item.description}</p>
          </div>
          {href ? (
            <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage text-vet-green transition-colors duration-300 group-hover:bg-vet-green group-hover:text-white">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          ) : null}
        </div>
      </figcaption>
    </figure>
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={`focus-ring focus-ring-dark ${cardClass}`}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={quickTransition}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.article
      className={cardClass}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={quickTransition}
    >
      {content}
    </motion.article>
  );
}

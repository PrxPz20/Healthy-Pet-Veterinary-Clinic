import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { coverImage } from "@/content/media";
import type { CaseItem } from "@/content/types";
import { quickTransition } from "@/lib/motion";
import { SensitiveImage } from "./SensitiveImage";

type CaseCardProps = {
  item: CaseItem;
  href?: string;
  onClick?: () => void;
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
  onClick,
  className = "",
  priority = false,
  allowReveal = true,
}: CaseCardProps) {
  const reduceMotion = useReducedMotion();
  const itemCover = coverImage(item);
  const hasImage = Boolean(itemCover.src);
  const cardClass = `group flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-36px_rgba(24,26,28,0.34)] transition-colors duration-300 hover:border-vet-green/35 ${className}`;
  const aspectClass = allowReveal ? imageAspect(item.orientation) : "aspect-[4/3]";
  const content = (
    <figure className="flex h-full flex-col">
      {hasImage ? (
        <SensitiveImage
          image={itemCover}
          isSensitive={item.isSensitive}
          priority={priority}
          allowReveal={allowReveal}
          className={aspectClass}
        />
      ) : (
        <div
          className={`grid place-items-center bg-sage px-5 text-center text-sm font-bold text-ink/68 ${aspectClass}`}
        >
          No image added
        </div>
      )}
      <figcaption className="flex min-h-[12rem] flex-1 p-5 sm:p-6">
        <div className="flex w-full items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {item.isSensitive ? (
                <span className="rounded-full bg-sage px-3 py-1 text-[0.72rem] font-bold text-ink/72">
                  Sensitive image
                </span>
              ) : null}
              {item.category ? (
                <span
                  className="type-label max-w-full truncate text-vet-green"
                  title={item.category}
                >
                  {item.category}
                </span>
              ) : null}
            </div>
            <h3 className="type-card-title mt-3 line-clamp-2 [overflow-wrap:anywhere] text-ink">
              {item.title}
            </h3>
            {item.description ? (
              <p className="type-card-copy mt-2 line-clamp-3 [overflow-wrap:anywhere] text-ink/62">
                {item.description}
              </p>
            ) : null}
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

  if (onClick) {
    return (
      <motion.article
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.currentTarget !== event.target) {
            return;
          }

          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onClick();
          }
        }}
        className={`focus-ring focus-ring-dark text-left ${cardClass}`}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={quickTransition}
        aria-label={`Open case: ${item.title}`}
      >
        {content}
      </motion.article>
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

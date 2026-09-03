import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { coverImage } from "@/content/media";
import type { GalleryItem } from "@/content/types";
import { quickTransition } from "@/lib/motion";

type GalleryCardProps = {
  item: GalleryItem;
  href?: string;
  onClick?: () => void;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
};

function imageAspect(orientation: GalleryItem["orientation"]) {
  if (orientation === "landscape") {
    return "aspect-[4/3]";
  }

  if (orientation === "square") {
    return "aspect-square";
  }

  return "aspect-[4/5]";
}

export function GalleryCard({
  item,
  href,
  onClick,
  className = "",
  imageClassName = "",
  priority = false,
}: GalleryCardProps) {
  const reduceMotion = useReducedMotion();
  const aspect = imageAspect(item.orientation);
  const itemCover = coverImage(item);
  const cardClass = `group flex min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-36px_rgba(24,26,28,0.34)] transition-colors duration-300 hover:border-vet-green/35 ${className}`;
  const image = (
    <div className={`relative overflow-hidden bg-white ${aspect} ${imageClassName}`}>
      <motion.img
        src={itemCover.src}
        alt={itemCover.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        width={900}
        height={item.orientation === "portrait" ? 1125 : item.orientation === "square" ? 900 : 675}
        sizes="(min-width: 1280px) 380px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="h-full w-full object-cover"
        whileHover={reduceMotion ? undefined : { scale: 1.035 }}
        transition={quickTransition}
      />
    </div>
  );
  const caption = (
    <figcaption className="mt-auto flex min-h-[9.5rem] flex-1 p-5 sm:p-6">
      <div className="flex w-full items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="type-card-title line-clamp-2 [overflow-wrap:anywhere] text-ink">
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
  );

  if (href) {
    return (
      <motion.a
        href={href}
        className={`focus-ring focus-ring-dark ${cardClass}`}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={quickTransition}
      >
        <figure className="flex h-full flex-col">
          {image}
          {caption}
        </figure>
      </motion.a>
    );
  }

  if (onClick) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        className={`focus-ring focus-ring-dark text-left ${cardClass}`}
        whileHover={reduceMotion ? undefined : { y: -4 }}
        transition={quickTransition}
        aria-label={`Open image: ${item.title}`}
      >
        <figure className="flex h-full flex-col">
          {image}
          {caption}
        </figure>
      </motion.button>
    );
  }

  return (
    <motion.figure
      className={cardClass}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={quickTransition}
    >
      <div className="flex h-full flex-col">
        {image}
        {caption}
      </div>
    </motion.figure>
  );
}

import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { GalleryItem } from "@/content/types";
import { quickTransition } from "@/lib/motion";

type GalleryCardProps = {
  item: GalleryItem;
  href?: string;
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
  className = "",
  imageClassName = "",
  priority = false,
}: GalleryCardProps) {
  const reduceMotion = useReducedMotion();
  const aspect = imageAspect(item.orientation);
  const cardClass = `group block min-w-0 overflow-hidden rounded-[1.5rem] border border-line bg-white shadow-[0_18px_45px_-36px_rgba(24,26,28,0.34)] transition-colors duration-300 hover:border-vet-green/35 ${className}`;
  const image = (
    <div className={`relative overflow-hidden bg-clinic ${aspect} ${imageClassName}`}>
      <motion.img
        src={item.image.src}
        alt={item.image.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover"
        whileHover={reduceMotion ? undefined : { scale: 1.035 }}
        transition={quickTransition}
      />
    </div>
  );
  const caption = (
    <figcaption className="p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-xl font-black leading-tight text-ink">{item.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/62">{item.description}</p>
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
        <figure>
          {image}
          {caption}
        </figure>
      </motion.a>
    );
  }

  return (
    <motion.figure
      className={cardClass}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={quickTransition}
    >
      {image}
      {caption}
    </motion.figure>
  );
}

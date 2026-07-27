import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { MediaAsset } from "@/content/types";
import { quickTransition, softTransition } from "@/lib/motion";
import { SensitiveImage } from "./SensitiveImage";

type MediaCarouselModalProps = {
  open: boolean;
  title: string;
  description?: string;
  media: MediaAsset[];
  isSensitive?: boolean;
  onClose: () => void;
};

export function MediaCarouselModal({
  open,
  title,
  description,
  media,
  isSensitive = false,
  onClose,
}: MediaCarouselModalProps) {
  const reduceMotion = useReducedMotion();
  const safeMedia = media.length ? media : [];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/78 px-4 py-6 backdrop-blur-sm"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : quickTransition}
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-modal-title"
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-4xl overflow-hidden rounded-[1.5rem] bg-white text-ink shadow-[0_24px_70px_-38px_rgba(0,0,0,0.72)]"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : softTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="focus-ring absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/92 text-ink shadow-[0_10px_24px_-18px_rgba(24,26,28,0.6)] transition-colors hover:bg-white"
              aria-label="Close media"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="bg-white">
              {safeMedia.length > 1 ? (
                <Carousel className="relative" opts={{ loop: false }}>
                  <CarouselContent>
                    {safeMedia.map((item, index) => (
                      <CarouselItem key={`${item.src}-${index}`}>
                        {isSensitive ? (
                          <SensitiveImage
                            image={item}
                            isSensitive
                            priority={index === 0}
                            className="max-h-[72vh] min-h-[20rem] bg-white"
                          />
                        ) : (
                          <img
                            src={item.src}
                            alt={item.alt}
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                            className="max-h-[72vh] w-full object-contain"
                          />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 border-white/70 bg-white/92 text-ink hover:bg-white" />
                  <CarouselNext className="right-4 border-white/70 bg-white/92 text-ink hover:bg-white" />
                </Carousel>
              ) : isSensitive && safeMedia[0] ? (
                <SensitiveImage
                  image={safeMedia[0]}
                  isSensitive
                  priority
                  className="max-h-[72vh] min-h-[20rem] bg-white"
                />
              ) : safeMedia[0] ? (
                <img
                  src={safeMedia[0].src}
                  alt={safeMedia[0].alt}
                  className="max-h-[72vh] w-full object-contain"
                />
              ) : null}
            </div>

            <div className="p-5 sm:p-6">
              <h2 id="media-modal-title" className="type-card-title">
                {title}
              </h2>
              {description ? <p className="type-body mt-2 text-ink/66">{description}</p> : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

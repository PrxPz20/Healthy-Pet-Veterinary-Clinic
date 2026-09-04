import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ImageOff, X } from "lucide-react";
import { useRef, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { MediaAsset } from "@/content/types";
import { useModalAccessibility } from "@/hooks/use-modal-accessibility";
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

const mediaFrameClass =
  "h-[min(64vh,42rem)] min-h-[16rem] w-full bg-white sm:h-[min(70vh,42rem)] sm:min-h-[24rem]";

function ModalImage({ item, priority }: { item: MediaAsset; priority: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={`relative grid place-items-center overflow-hidden ${mediaFrameClass}`}>
      {!loaded && !failed ? (
        <div className="absolute inset-0 animate-pulse bg-sage/65" aria-hidden="true" />
      ) : null}
      {failed ? (
        <div className="grid place-items-center gap-2 text-center text-ink/62" role="status">
          <ImageOff className="h-6 w-6" aria-hidden="true" />
          <span className="type-card-copy font-semibold">Image unavailable</span>
        </div>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          width={1440}
          height={1080}
          sizes="(min-width: 1024px) 896px, 100vw"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-contain transition-opacity duration-200 ${loaded ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </div>
  );
}

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
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useModalAccessibility({
    open,
    containerRef: dialogRef,
    initialFocusRef: closeButtonRef,
    onClose,
    closeOnEscape: true,
  });

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/78 px-4 py-6 backdrop-blur-sm"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reduceMotion ? { duration: 0 } : quickTransition}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="media-modal-title"
            aria-describedby={description ? "media-modal-description" : undefined}
            tabIndex={-1}
            className="relative max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-y-auto rounded-[1.5rem] bg-white text-ink shadow-[0_24px_70px_-38px_rgba(0,0,0,0.72)]"
            initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
            transition={reduceMotion ? { duration: 0 } : softTransition}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="focus-ring absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/92 text-ink shadow-[0_10px_24px_-18px_rgba(24,26,28,0.6)] transition-colors hover:bg-white"
              aria-label="Close media"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="bg-white">
              {safeMedia.length > 1 ? (
                <Carousel
                  className="relative touch-pan-y"
                  opts={{ loop: false }}
                  aria-label={`${title} media`}
                >
                  <CarouselContent>
                    {safeMedia.map((item, index) => (
                      <CarouselItem
                        key={`${item.src}-${index}`}
                        aria-label={`${index + 1} of ${safeMedia.length}`}
                      >
                        {isSensitive ? (
                          <SensitiveImage
                            image={item}
                            isSensitive
                            priority={index === 0}
                            fit="contain"
                            className={mediaFrameClass}
                          />
                        ) : (
                          <ModalImage item={item} priority={index === 0} />
                        )}
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-3 h-11 w-11 border-white/70 bg-white/92 text-ink hover:bg-white sm:left-4" />
                  <CarouselNext className="right-3 h-11 w-11 border-white/70 bg-white/92 text-ink hover:bg-white sm:right-4" />
                </Carousel>
              ) : isSensitive && safeMedia[0] ? (
                <SensitiveImage
                  image={safeMedia[0]}
                  isSensitive
                  priority
                  fit="contain"
                  className={mediaFrameClass}
                />
              ) : safeMedia[0] ? (
                <ModalImage item={safeMedia[0]} priority />
              ) : null}
            </div>

            <div className="p-5 sm:p-6">
              <h2 id="media-modal-title" className="type-card-title [overflow-wrap:anywhere]">
                {title}
              </h2>
              {description ? (
                <p
                  id="media-modal-description"
                  className="type-body mt-2 max-h-32 overflow-y-auto [overflow-wrap:anywhere] text-ink/66"
                >
                  {description}
                </p>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

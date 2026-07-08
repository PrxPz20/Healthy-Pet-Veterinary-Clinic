import { useState } from "react";
import { Eye } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import type { ImageAsset } from "@/content/types";
import { quickTransition } from "@/lib/motion";

type SensitiveImageProps = {
  image: ImageAsset;
  isSensitive: boolean;
  className?: string;
  priority?: boolean;
  allowReveal?: boolean;
};

export function SensitiveImage({
  image,
  isSensitive,
  className = "aspect-[4/3]",
  priority = false,
  allowReveal = true,
}: SensitiveImageProps) {
  const [revealed, setRevealed] = useState(!isSensitive);
  const reduceMotion = useReducedMotion();
  const protectedImage = isSensitive && !revealed;

  return (
    <div className={`relative overflow-hidden bg-white ${className}`}>
      <motion.img
        src={image.src}
        alt={image.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-cover transition-[filter,transform,opacity] duration-300 ${
          protectedImage ? "scale-[1.03] blur-2xl opacity-75" : "blur-0 opacity-100"
        }`}
        whileHover={reduceMotion || protectedImage ? undefined : { scale: 1.025 }}
        transition={quickTransition}
      />

      {protectedImage ? (
        <div className="absolute inset-0 grid place-items-center bg-ink/30 px-5 text-center backdrop-blur-[2px]">
          <div className="max-w-[16rem] rounded-[1.25rem] bg-white/92 p-4 text-ink shadow-[0_14px_32px_-22px_rgba(24,26,28,0.72)]">
            <div className="text-sm font-bold">Sensitive veterinary image</div>
            <p className="mt-1 text-xs leading-relaxed text-ink/66">
              This case photo may be uncomfortable to view.
            </p>
            {allowReveal ? (
              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="focus-ring focus-ring-dark mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold text-white transition-colors duration-200 hover:bg-vet-green"
              >
                <Eye className="h-4 w-4" />
                View image
              </button>
            ) : (
              <span className="mt-4 inline-flex min-h-10 items-center justify-center rounded-full bg-ink px-4 py-2 text-xs font-bold text-white">
                Protected preview
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

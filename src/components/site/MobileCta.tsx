import { MessageCircle, Phone } from "lucide-react";
import { getSiteContent } from "@/content/provider";

export function MobileCta() {
  const { hero } = getSiteContent();

  return (
    <div className="fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] left-3 z-40 flex w-fit max-w-[calc(100vw-1.5rem)] gap-2 rounded-full border border-white/12 bg-ink/92 p-2 shadow-[0_14px_38px_-22px_rgba(24,26,28,0.72)] backdrop-blur-xl md:hidden">
      <a
        href={hero.primaryCta.href}
        className="focus-ring inline-flex min-h-11 w-[116px] items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-ink"
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
      <a
        href={hero.secondaryCta.href}
        target="_blank"
        rel="noreferrer"
        className="focus-ring focus-ring-dark inline-flex min-h-11 w-[116px] items-center justify-center gap-2 rounded-full bg-vet-green px-4 py-3 text-sm font-bold text-white"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </a>
    </div>
  );
}

import { MessageCircle, Phone } from "lucide-react";
import { getSiteContent } from "@/content/provider";

export function MobileCta() {
  const { hero } = getSiteContent();

  return (
    <div className="fixed bottom-3 left-3 z-40 flex w-fit max-w-[calc(100vw-1.5rem)] gap-2 rounded-full border border-white/12 bg-ink/92 p-2 shadow-[0_18px_52px_-18px_rgba(24,26,28,0.72)] backdrop-blur-xl md:hidden">
      <a
        href={hero.primaryCta.href}
        className="inline-flex w-[116px] items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-bold text-ink"
      >
        <Phone className="h-4 w-4" />
        Call
      </a>
      <a
        href={hero.secondaryCta.href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex w-[116px] items-center justify-center gap-2 rounded-full bg-vet-green px-4 py-3 text-sm font-bold text-white"
      >
        <MessageCircle className="h-4 w-4" />
        Chat
      </a>
    </div>
  );
}

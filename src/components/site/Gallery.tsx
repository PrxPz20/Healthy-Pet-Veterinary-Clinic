import { ArrowUpRight } from "lucide-react";
import { Reveal, StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { GalleryCard } from "./GalleryCard";

export function Gallery() {
  const { gallery, homepage } = getSiteContent();
  const previewItems = gallery.slice(0, 6);

  return (
    <section id="gallery" className="relative bg-white py-20 text-ink md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="max-w-3xl text-balance font-display text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1]">
              {homepage.gallery.heading}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/64 md:text-lg">
              {homepage.gallery.body}
            </p>
          </div>
          <a
            href="/gallery"
            className="focus-ring focus-ring-dark group inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green"
          >
            {homepage.gallery.ctaLabel}
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </Reveal>

        <StaggerGroup className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {previewItems.map((item) => (
            <StaggerItem key={item.slug} className="h-full">
              <GalleryCard item={item} href="/gallery" className="h-full" />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}

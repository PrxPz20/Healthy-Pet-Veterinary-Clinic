import { Clock, Languages, MapPin, MessageCircle, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { StaggerGroup, StaggerItem } from "@/components/anim";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { getSiteContent } from "@/content/provider";

export function TrustStrip() {
  const { clinic, openingHours } = getSiteContent();
  const [api, setApi] = useState<CarouselApi>();
  const regularHours = openingHours
    .filter((item) => ["Monday", "Tuesday", "Thursday", "Friday"].includes(item.day))
    .at(0)
    ?.ranges.map((range) => `${range.opens}-${range.closes}`)
    .join(" / ");

  const trustItems = [
    {
      icon: MapPin,
      title: "Location",
      body: "Agios Athanasios, Limassol",
      href: clinic.mapUrl,
      external: true,
      ariaLabel: "Open clinic location on Google Maps",
    },
    {
      icon: Phone,
      title: "Phone",
      body: clinic.phoneDisplay,
      href: `tel:${clinic.phone}`,
      ariaLabel: `Call the clinic at ${clinic.phoneDisplay}`,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      body: clinic.vetPhoneDisplay ?? clinic.whatsappDisplay,
      href: clinic.whatsapp,
      external: true,
      ariaLabel: "Message the clinic on WhatsApp",
    },
    {
      icon: Clock,
      title: "Hours",
      body: regularHours ?? "See weekly hours",
      href: "#contact",
      ariaLabel: "View clinic opening hours",
    },
    {
      icon: Languages,
      title: "Languages",
      body: "Russian, Greek, English",
      href: "#doctor",
      ariaLabel: "View doctor information and spoken languages",
    },
  ];
  useEffect(() => {
    if (!api) return;

    const id = window.setInterval(() => api.scrollNext(), 2600);
    return () => window.clearInterval(id);
  }, [api]);

  return (
    <section className="relative z-10 border-b border-line bg-white text-ink">
      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: true, dragFree: true }}
        className="px-5 py-4 sm:px-8 md:hidden"
        aria-label="Clinic quick information"
      >
        <CarouselContent className="-ml-3">
          {trustItems.map((item) => (
            <CarouselItem key={item.title} className="basis-[15rem] pl-3">
              <TrustItem item={item} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <StaggerGroup className="mx-auto hidden max-w-7xl grid-cols-5 gap-3 px-8 py-4 md:grid">
        {trustItems.map((item) => (
          <StaggerItem key={item.title}>
            <TrustItem item={item} />
          </StaggerItem>
        ))}
      </StaggerGroup>
    </section>
  );
}

type TrustStripItem = {
  icon: typeof MapPin;
  title: string;
  body: string;
  href: string;
  external?: boolean;
  ariaLabel: string;
};

function TrustItem({ item }: { item: TrustStripItem }) {
  const Icon = item.icon;

  return (
    <a
      href={item.href}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noreferrer" : undefined}
      aria-label={item.ariaLabel}
      className="focus-ring focus-ring-dark group flex h-full min-h-20 items-center gap-3 rounded-2xl px-3 py-3 transition-colors duration-200 hover:bg-clinic"
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sage text-vet-green transition-colors duration-200 group-hover:bg-vet-green group-hover:text-white">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-bold leading-tight text-ink">{item.title}</span>
        <span className="mt-1 block truncate text-sm leading-relaxed text-ink/64">{item.body}</span>
      </span>
    </a>
  );
}

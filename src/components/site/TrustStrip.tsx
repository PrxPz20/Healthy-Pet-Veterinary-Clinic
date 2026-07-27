import { Clock, Languages, MapPin, MessageCircle, Phone } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/anim";
import { formatPhone, phoneHref, whatsappHref } from "@/content/contact";
import { useContactSettings } from "./contact-settings-context";

export function TrustStrip() {
  const contact = useContactSettings();
  const regularHours = contact.openingHours
    .filter((item) => ["Monday", "Tuesday", "Thursday", "Friday"].includes(item.day))
    .at(0)
    ?.ranges.map((range) => `${range.opens}-${range.closes}`)
    .join(" / ");

  const phone = contact.phones[0];
  const trustItems = [
    {
      icon: MapPin,
      title: "Location",
      body: `${contact.address.street}, ${contact.address.city}`,
      href: contact.address.mapUrl || "#contact",
      external: Boolean(contact.address.mapUrl),
      ariaLabel: "Open clinic location on Google Maps",
    },
    ...(phone
      ? [
          {
            icon: Phone,
            title: "Phone",
            body: formatPhone(phone.number),
            href: phoneHref(phone.number),
            ariaLabel: `Call the clinic at ${formatPhone(phone.number)}`,
          },
        ]
      : []),
    ...(contact.whatsapp
      ? [
          {
            icon: MessageCircle,
            title: "WhatsApp",
            body: formatPhone(contact.whatsapp),
            href: whatsappHref(contact.whatsapp),
            external: true,
            ariaLabel: "Message the clinic on WhatsApp",
          },
        ]
      : []),
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
  const desktopColumns =
    trustItems.length === 3
      ? "md:grid-cols-3"
      : trustItems.length === 4
        ? "md:grid-cols-4"
        : "md:grid-cols-5";

  return (
    <section className="relative z-10 border-b border-line bg-white text-ink">
      <div className="overflow-hidden py-4 md:hidden" aria-label="Clinic quick information">
        <div className="trust-strip-loop flex w-max">
          {[0, 1].map((setIndex) => (
            <div key={setIndex} className="flex" aria-hidden={setIndex > 0 ? true : undefined}>
              {trustItems.map((item) => (
                <div key={`${setIndex}-${item.title}`} className="mr-3 w-[15rem] shrink-0">
                  <TrustItem item={item} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <StaggerGroup
        className={`mx-auto hidden max-w-7xl gap-3 px-8 py-4 md:grid ${desktopColumns}`}
      >
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
        <span className="type-label block text-ink">{item.title}</span>
        <span className="type-card-copy mt-1 block truncate text-ink/64">{item.body}</span>
      </span>
    </a>
  );
}

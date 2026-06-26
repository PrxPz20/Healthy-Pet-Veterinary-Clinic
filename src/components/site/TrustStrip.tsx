import { StaggerGroup, StaggerItem } from "@/components/anim";
import { getSiteContent } from "@/content/provider";
import { Clock, Languages, MapPin, MessageCircle, Phone } from "lucide-react";

export function TrustStrip() {
  const { clinic, openingHours } = getSiteContent();
  const weekdayHours = openingHours
    .filter((item) => ["Monday", "Tuesday", "Thursday", "Friday"].includes(item.day))
    .at(0)
    ?.ranges.map((range) => `${range.opens}-${range.closes}`)
    .join(" / ");
  const quickItems = [
    {
      icon: MapPin,
      title: "Location",
      body: "Agios Athanasios, Limassol",
      href: clinic.mapUrl,
      external: true,
    },
    {
      icon: Phone,
      title: "Phone",
      body: clinic.phoneDisplay,
      href: `tel:${clinic.phone}`,
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      body: clinic.vetPhoneDisplay ?? clinic.whatsappDisplay,
      href: clinic.whatsapp,
      external: true,
    },
    {
      icon: Clock,
      title: "Opening hours",
      body: weekdayHours ? `Mon, Tue, Thu, Fri: ${weekdayHours}` : "See weekly hours",
      href: "#contact",
    },
    {
      icon: Languages,
      title: "Languages",
      body: "Russian, Greek, English",
      href: "#doctor",
    },
  ];

  return (
    <section className="relative z-10 bg-white text-ink">
      <StaggerGroup className="mx-auto grid max-w-7xl grid-cols-1 border-b border-line px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-5">
        {quickItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <>
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-sage text-vet-green">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block font-display text-base font-black text-ink">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink/62">{item.body}</span>
              </span>
            </>
          );

          return (
            <StaggerItem key={item.title}>
              <a
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className="focus-ring focus-ring-dark flex h-full gap-4 border-line py-6 transition-colors duration-200 hover:text-vet-green sm:pr-7 md:py-7 lg:border-r"
              >
                {content}
              </a>
            </StaggerItem>
          );
        })}
      </StaggerGroup>
    </section>
  );
}

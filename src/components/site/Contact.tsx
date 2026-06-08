import { Reveal } from "@/components/anim";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSiteContent } from "@/content/provider";

function formatHourRanges(ranges: { opens: string; closes: string }[]) {
  if (ranges.length === 0) return "Closed";
  return ranges.map((range) => `${range.opens}-${range.closes}`).join(" / ");
}

export function Contact() {
  const { clinic, openingHours, hero } = getSiteContent();
  const fullAddress = `${clinic.address.street}, ${clinic.address.city} ${clinic.address.postalCode}, Cyprus`;
  const rows = [
    { icon: MapPin, label: "Address", value: fullAddress },
    { icon: Phone, label: "Phone", value: clinic.phoneDisplay },
    ...(clinic.vetPhoneDisplay
      ? [{ icon: Phone, label: "Vet Phone", value: clinic.vetPhoneDisplay }]
      : []),
    { icon: Mail, label: "Email", value: clinic.email },
    {
      icon: Clock,
      label: "Hours",
      value: openingHours.map((row) => `${row.label}: ${formatHourRanges(row.ranges)}`).join(" | "),
    },
  ];

  return (
    <section id="contact" className="relative bg-ink py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <div className="eyebrow text-sage-light">Visit, call, message</div>
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-black leading-[1.02]">
              Speak with the clinic before you visit.
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/72">
              Call or send a WhatsApp message for guidance, visit timing, product questions, or next
              steps for your pet's symptoms.
            </p>

            <ul className="mt-7 space-y-4 text-sm">
              {rows.map((row) => (
                <li key={row.label} className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/6 text-sage-light">
                    <row.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white/55">{row.label}</div>
                    <div className="mt-1 text-white/92">{row.value}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={hero.primaryCta.href}
                className="focus-ring inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-clinic"
              >
                <Phone className="h-4 w-4" />
                {hero.primaryCta.label}
              </a>
              <a
                href={hero.secondaryCta.href}
                target="_blank"
                rel="noreferrer"
                className="focus-ring focus-ring-dark inline-flex min-h-11 items-center gap-2 rounded-full bg-vet-green px-6 py-3 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-vet-green-dark"
              >
                <MessageCircle className="h-4 w-4" />
                {hero.secondaryCta.label}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="overflow-hidden rounded-3xl border border-white/12 bg-white/5">
              <iframe
                title={`${clinic.name} map`}
                src={clinic.mapEmbedUrl}
                loading="lazy"
                className="h-[420px] w-full border-0 grayscale"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="flex flex-col gap-3 border-t border-white/12 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-display text-xl font-black">
                    {clinic.address.city}, Cyprus
                  </div>
                  <p className="mt-1 text-sm text-white/68">
                    {clinic.address.street}, {clinic.address.postalCode}
                  </p>
                </div>
                <a
                  href={clinic.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition-colors duration-200 hover:bg-clinic"
                >
                  Open Map
                  <MapPin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

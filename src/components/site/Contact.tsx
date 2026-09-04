import { Reveal } from "@/components/anim";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSiteContent } from "@/content/provider";
import {
  contactAddressLine,
  formatPhone,
  mapEmbedUrl,
  phoneHref,
  whatsappHref,
} from "@/content/contact";
import { useContactSettings } from "./contact-settings-context";

function formatHourRanges(ranges: { opens: string; closes: string }[]) {
  if (ranges.length === 0) return "Closed";
  return ranges.map((range) => `${range.opens}-${range.closes}`).join(" / ");
}

export function Contact() {
  const { clinic, homepage } = getSiteContent();
  const contact = useContactSettings();
  const fullAddress = contactAddressLine(contact);
  const mapUrl =
    contact.address.mapUrl ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  const rows: {
    icon: typeof MapPin;
    label: string;
    value: string;
    href: string;
    external?: boolean;
  }[] = [
    { icon: MapPin, label: "Address", value: fullAddress, href: mapUrl },
    ...(contact.whatsapp
      ? [
          {
            icon: MessageCircle,
            label: "WhatsApp",
            value: "Open WhatsApp",
            href: whatsappHref(contact.whatsapp),
            external: true,
          },
        ]
      : []),
    ...(contact.email
      ? [{ icon: Mail, label: "Email", value: contact.email, href: `mailto:${contact.email}` }]
      : []),
  ];

  return (
    <section id="contact" className="site-section relative bg-ink py-20 text-white lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <h2 className="type-section-title">{homepage.contact.heading}</h2>
            {homepage.contact.body ? (
              <p className="type-section-copy mt-5 max-w-xl text-white/72">
                {homepage.contact.body}
              </p>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-10 grid items-end gap-x-14 gap-y-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <address className="not-italic">
                <ul className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-1">
                  {contact.phones.length ? (
                    <li className="flex items-start gap-4 md:col-span-2 lg:col-span-1">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/6 text-sage-light">
                        <Phone className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="type-label text-white/70">Phone</div>
                        <div className="mt-1 grid gap-2">
                          <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center">
                            {contact.phones.slice(0, 2).map((phone, index) => (
                              <span
                                key={phone.id ?? phone.number}
                                className="inline-flex items-center"
                              >
                                {index ? (
                                  <span className="mx-2 hidden text-white/32 sm:inline">|</span>
                                ) : null}
                                <a
                                  href={phoneHref(phone.number)}
                                  className="focus-ring focus-ring-dark inline-flex min-h-11 items-center rounded text-white/92 transition-colors duration-200 hover:text-sage-light"
                                >
                                  {phone.label} {formatPhone(phone.number)}
                                </a>
                              </span>
                            ))}
                          </div>
                          {contact.phones[2] ? (
                            <a
                              href={phoneHref(contact.phones[2].number)}
                              className="focus-ring focus-ring-dark inline-flex min-h-11 w-fit items-center rounded text-white/92 transition-colors duration-200 hover:text-sage-light"
                            >
                              {contact.phones[2].label} {formatPhone(contact.phones[2].number)}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  ) : null}
                  {rows.map((row) => (
                    <li key={row.label} className="flex items-start gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/6 text-sage-light">
                        <row.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="type-label text-white/70">{row.label}</div>
                        <a
                          href={row.href}
                          target={row.label === "Address" || row.external ? "_blank" : undefined}
                          rel={row.label === "Address" || row.external ? "noreferrer" : undefined}
                          className="focus-ring focus-ring-dark mt-1 inline-flex min-h-11 items-center rounded text-white/92 transition-colors duration-200 hover:text-sage-light"
                        >
                          {row.value}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </address>

              <div className="mt-7 flex max-w-md items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/6 text-sage-light">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="type-label text-white/70">Opening hours</div>
                  <dl className="type-card-copy mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                    {contact.openingHours.map((row) => (
                      <div
                        key={row.day}
                        className="flex items-baseline justify-between gap-4 border-b border-white/8 px-4 py-3 last:border-b-0"
                      >
                        <dt className="font-semibold text-white/76">{row.label}</dt>
                        <dd className="text-right text-white/92">{formatHourRanges(row.ranges)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <div className="overflow-hidden rounded-3xl border border-white/12 bg-white/5">
              <div className="relative h-[360px] bg-white/5 lg:h-[420px]">
                <iframe
                  title={`${clinic.name} map`}
                  src={mapEmbedUrl(contact)}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0 grayscale"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col gap-3 border-t border-white/12 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="type-card-title">
                    {contact.address.city}, {contact.address.country}
                  </div>
                  <p className="type-card-copy mt-1 text-white/68">
                    {contact.address.street}, {contact.address.postalCode}
                  </p>
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="focus-ring type-button inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-ink transition-colors duration-200 hover:bg-white/90"
                >
                  {homepage.contact.mapCtaLabel}
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

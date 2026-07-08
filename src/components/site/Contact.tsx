import { Reveal } from "@/components/anim";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { getSiteContent } from "@/content/provider";

function formatHourRanges(ranges: { opens: string; closes: string }[]) {
  if (ranges.length === 0) return "Closed";
  return ranges.map((range) => `${range.opens}-${range.closes}`).join(" / ");
}

export function Contact() {
  const { clinic, homepage, openingHours } = getSiteContent();
  const fullAddress = `${clinic.address.street}, ${clinic.address.city} ${clinic.address.postalCode}, Cyprus`;
  const rows = [
    { icon: MapPin, label: "Address", value: fullAddress, href: clinic.mapUrl },
    {
      icon: Phone,
      label: "Phone",
      value: clinic.phoneDisplay,
      href: `tel:${clinic.phone}`,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: "Open WhatsApp",
      href: clinic.whatsapp,
      external: true,
    },
    { icon: Mail, label: "Email", value: clinic.email, href: `mailto:${clinic.email}` },
  ];

  return (
    <section id="contact" className="relative bg-ink py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl">
            <div className="eyebrow text-sage-light">{homepage.contact.label}</div>
            <h2 className="mt-3 text-balance font-display text-[clamp(2.1rem,5vw,4rem)] font-black leading-[1.02]">
              {homepage.contact.heading}
            </h2>
            {homepage.contact.body ? (
              <p className="mt-5 max-w-xl leading-relaxed text-white/72">{homepage.contact.body}</p>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-10 grid items-end gap-x-14 gap-y-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <address className="not-italic">
                <ul className="grid gap-4 text-sm md:grid-cols-2 lg:grid-cols-1">
                  {rows.map((row) => (
                    <li key={row.label} className="flex items-start gap-4">
                      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/6 text-sage-light">
                        <row.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white/55">{row.label}</div>
                        {row.label === "Phone" ? (
                          <div className="mt-1 flex flex-wrap items-center gap-y-1 text-white/92">
                            <a
                              href={`tel:${clinic.phone}`}
                              className="focus-ring focus-ring-dark rounded transition-colors duration-200 hover:text-sage-light"
                            >
                              {clinic.phoneDisplay}
                            </a>
                            {clinic.vetPhone && clinic.vetPhoneDisplay ? (
                              <>
                                <span className="mx-2 text-white/32">|</span>
                                <a
                                  href={`tel:${clinic.vetPhone}`}
                                  className="focus-ring focus-ring-dark rounded transition-colors duration-200 hover:text-sage-light"
                                >
                                  Vet Phone {clinic.vetPhoneDisplay}
                                </a>
                              </>
                            ) : null}
                          </div>
                        ) : (
                          <a
                            href={row.href}
                            target={row.label === "Address" || row.external ? "_blank" : undefined}
                            rel={row.label === "Address" || row.external ? "noreferrer" : undefined}
                            className="focus-ring focus-ring-dark mt-1 inline-block rounded text-white/92 transition-colors duration-200 hover:text-sage-light"
                          >
                            {row.value}
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </address>

              <div className="mt-7 flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/12 bg-white/6 text-sage-light">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white/55">Opening hours</div>
                  <dl className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-sm">
                    {openingHours.map((row) => (
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
                  src={clinic.mapEmbedUrl}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full border-0 grayscale"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
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
                  className="focus-ring inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-ink transition-colors duration-200 hover:bg-white/90"
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

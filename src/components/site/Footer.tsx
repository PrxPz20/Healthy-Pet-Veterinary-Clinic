import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { getSiteContent } from "@/content/provider";
import { formatPhone, phoneHref, whatsappHref } from "@/content/contact";
import { useContactSettings } from "./contact-settings-context";
import { isActiveHref, useActiveSection } from "@/hooks/use-active-section";
import { layoutSpring } from "@/lib/motion";
import logoUrl from "@/assets/healthy_pet_logo_white.svg";
import { SocialIcon } from "./SocialIcon";

export function Footer() {
  const { clinic, navigation, services } = getSiteContent();
  const contact = useContactSettings();
  const reduceMotion = useReducedMotion();
  const navHrefs = useMemo(() => navigation.map((item) => item.href), [navigation]);
  const activeId = useActiveSection(navHrefs);
  const serviceLinks = services.slice(0, 5).map((service) => ({
    label: service.title,
    href: `/services#${service.slug}`,
  }));

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-[1.25fr_0.8fr_1fr_1.35fr] lg:gap-x-12">
          <div className="col-span-2 lg:col-span-1">
            <img
              src={logoUrl}
              alt="Healthy Pet Veterinary Clinic"
              className="h-14 w-auto max-w-[260px] object-contain sm:h-16"
            />
            <p className="type-card-copy mt-4 max-w-xs text-white/65">
              {clinic.tagline} Located in {contact.address.city}, {contact.address.country}.
            </p>
            <div className="mt-5 flex items-center gap-3 sm:mt-6" aria-label="Social media">
              {contact.socialLinks.map((link) => {
                return (
                  <a
                    key={`${link.label}-${link.href}`}
                    href={link.href}
                    aria-label={link.label}
                    title={link.label}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring focus-ring-dark inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition duration-200 hover:border-vet-green/55 hover:bg-vet-green hover:text-white"
                  >
                    <SocialIcon platform={link.label} className="size-4" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
          <FooterColumn
            title="Website"
            links={navigation}
            activeId={activeId}
            reduceMotion={reduceMotion}
          />
          <FooterColumn title="Services" links={serviceLinks} />
          <div className="col-span-2 lg:col-span-1">
            <FooterColumn
              title="Contact"
              links={[
                ...contact.phones.map((phone) => ({
                  label: `${phone.label}: ${formatPhone(phone.number)}`,
                  href: phoneHref(phone.number),
                })),
                ...(contact.whatsapp
                  ? [{ label: "WhatsApp", href: whatsappHref(contact.whatsapp) }]
                  : []),
                ...(contact.email
                  ? [{ label: contact.email, href: `mailto:${contact.email}` }]
                  : []),
                ...(contact.address.mapUrl
                  ? [{ label: "Google Maps", href: contact.address.mapUrl }]
                  : []),
              ]}
            />
          </div>
        </div>

        <div className="type-label mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-white/65 sm:mt-12 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} {clinic.legalName}. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-x-5">
            <a
              href="/privacy"
              className="focus-ring focus-ring-dark inline-flex min-h-11 items-center rounded transition-colors hover:text-white"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="focus-ring focus-ring-dark inline-flex min-h-11 items-center rounded transition-colors hover:text-white"
            >
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  activeId,
  reduceMotion,
}: {
  title: string;
  links: { label: string; href: string }[];
  activeId?: string;
  reduceMotion?: boolean | null;
}) {
  return (
    <div>
      <h2 className="type-label text-white/70">{title}</h2>
      <ul className="mt-3 grid grid-cols-1 gap-x-4 sm:mt-4">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <a
              href={link.href}
              className={`focus-ring focus-ring-dark group relative flex min-h-11 w-full min-w-0 items-center justify-between gap-2 rounded px-1 py-2 text-sm transition-colors duration-200 hover:text-vet-green ${
                activeId && isActiveHref(link.href, activeId) ? "text-vet-green" : "text-white/75"
              }`}
            >
              <span className="min-w-0 break-words">{link.label}</span>
              <ArrowUpRight
                className="size-3.5 shrink-0 opacity-0 transition-[opacity,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                aria-hidden="true"
              />
              {activeId && isActiveHref(link.href, activeId) ? (
                <motion.span
                  layoutId="footer-active-underline"
                  className="absolute bottom-1 left-1 h-px w-[calc(100%-0.5rem)] bg-vet-green"
                  transition={reduceMotion ? { duration: 0 } : layoutSpring}
                />
              ) : null}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

import { useMemo, type ComponentType, type SVGProps } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Facebook, Instagram, Youtube } from "lucide-react";
import { getSiteContent } from "@/content/provider";
import { formatPhone, phoneHref, whatsappHref } from "@/content/contact";
import { useContactSettings } from "./contact-settings-context";
import { isActiveHref, useActiveSection } from "@/hooks/use-active-section";
import { layoutSpring } from "@/lib/motion";
import logoUrl from "@/assets/healthy_pet_logo_white.svg";

const socialIcons: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = {
  Instagram,
  Facebook,
  TikTok: TikTokIcon,
  YouTube: Youtube,
};

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
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.8fr_1fr_1.35fr] lg:gap-x-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <img
              src={logoUrl}
              alt="Healthy Pet Veterinary Clinic"
              className="h-16 w-auto max-w-[260px] object-contain"
            />
            <p className="type-card-copy mt-4 max-w-xs text-white/55">
              {clinic.tagline} Located in {contact.address.city}, {contact.address.country}.
            </p>
            <div className="mt-6 flex items-center gap-3" aria-label="Social media">
              {clinic.socialLinks.map((link) => {
                const Icon = socialIcons[link.label];

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    aria-label={link.label}
                    title={link.label}
                    target="_blank"
                    rel="noreferrer"
                    className="focus-ring focus-ring-dark inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition duration-200 hover:border-vet-green/55 hover:bg-vet-green hover:text-white"
                  >
                    {Icon ? <Icon className="size-4" aria-hidden="true" /> : null}
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
            twoColumnsOnMobile
          />
          <FooterColumn title="Services" links={serviceLinks} />
          <div className="sm:col-span-2 lg:col-span-1">
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

        <div className="type-label mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-white/55 sm:flex-row sm:items-center sm:justify-between">
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
  twoColumnsOnMobile = false,
}: {
  title: string;
  links: { label: string; href: string }[];
  activeId?: string;
  reduceMotion?: boolean | null;
  twoColumnsOnMobile?: boolean;
}) {
  return (
    <div>
      <h2 className="type-label text-white/55">{title}</h2>
      <ul
        className={`mt-4 grid gap-x-4 ${twoColumnsOnMobile ? "grid-cols-2 sm:grid-cols-1" : "grid-cols-1"}`}
      >
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

function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.2 6.05a5.95 5.95 0 0 0 3.45 1.1v3.1a8.82 8.82 0 0 1-3.44-.7v5.65a6.04 6.04 0 1 1-6.04-6.04c.35 0 .7.03 1.03.09v3.18a2.93 2.93 0 1 0 2.17 2.83V3.4h3.03c.1 1 .67 1.91 1.5 2.45l-.7 1.1Z" />
    </svg>
  );
}

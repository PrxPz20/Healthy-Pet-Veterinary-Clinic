import { getSiteContent } from "@/content/provider";
import logoUrl from "@/assets/healthy_pet_logo_white.svg";

export function Footer() {
  const { clinic, navigation, services } = getSiteContent();
  const serviceLinks = services.slice(0, 5).map((service) => ({
    label: service.title,
    href: `/services#${service.slug}`,
  }));

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="mx-auto max-w-7xl px-5 pb-32 pt-16 sm:px-8 md:pb-16">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <img
              src={logoUrl}
              alt="Healthy Pet Veterinary Clinic"
              className="h-16 w-auto max-w-[260px] object-contain"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              {clinic.tagline} Located in {clinic.address.city}, Cyprus.
            </p>
          </div>
          <FooterColumn title="Website" links={navigation} />
          <FooterColumn title="Services" links={serviceLinks} />
          <FooterColumn
            title="Contact"
            links={[
              { label: clinic.phoneDisplay, href: `tel:${clinic.phone}` },
              ...(clinic.vetPhone && clinic.vetPhoneDisplay
                ? [{ label: clinic.vetPhoneDisplay, href: `tel:${clinic.vetPhone}` }]
                : []),
              { label: "WhatsApp", href: clinic.whatsapp },
              { label: clinic.email, href: `mailto:${clinic.email}` },
              { label: "Google Maps", href: clinic.mapUrl },
            ]}
          />
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <div>
            © {new Date().getFullYear()} {clinic.legalName}. All rights reserved.
          </div>
          <div className="flex gap-5">
            <span aria-disabled="true" className="text-white/45" title="Privacy page to be added">
              Privacy
            </span>
            <span aria-disabled="true" className="text-white/45" title="Terms page to be added">
              Terms
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <div className="text-sm font-bold text-white/55">{title}</div>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={`${title}-${link.label}`}>
            <a
              href={link.href}
              className="focus-ring focus-ring-dark rounded text-sm text-white/75 transition-colors duration-200 hover:text-vet-green"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

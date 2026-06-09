import type { FaqItem, Service, SiteContent } from "@/content/types";

export function buildClinicSchema(content: SiteContent) {
  const { clinic, openingHours, services } = content;

  return {
    "@context": "https://schema.org",
    "@type": ["VeterinaryCare", "LocalBusiness"],
    "@id": `${clinic.siteUrl}/#clinic`,
    name: clinic.name,
    legalName: clinic.legalName,
    url: clinic.siteUrl,
    logo: clinic.logoUrl,
    image: content.media.heroPoster.src,
    description: clinic.tagline,
    telephone: [clinic.phone, clinic.vetPhone].filter(Boolean),
    email: clinic.email,
    isAcceptingNewPatients: true,
    address: {
      "@type": "PostalAddress",
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.region,
      postalCode: clinic.address.postalCode,
      addressCountry: clinic.address.country,
    },
    areaServed: {
      "@type": "City",
      name: "Limassol",
    },
    sameAs: clinic.socialLinks.map((link) => link.href),
    openingHoursSpecification: openingHours.flatMap((row) =>
      row.ranges.map((range) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: row.day,
        opens: range.opens,
        closes: range.closes,
      })),
    ),
    hasOfferCatalog: buildOfferCatalog(services),
  };
}

export function buildOfferCatalog(services: Service[]) {
  return {
    "@type": "OfferCatalog",
    name: "Veterinary services",
    itemListElement: services.map((service) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: service.seoTitle,
        description: service.short,
      },
    })),
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBreadcrumbSchema(
  siteUrl: string,
  currentName = "Veterinary Services",
  currentPath = "/services",
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: currentName,
        item: `${siteUrl}${currentPath}`,
      },
    ],
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

import type { FaqItem, Service, SiteContent } from "@/content/types";

const dayMap: Record<string, string[]> = {
  "Monday to Friday": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  Saturday: ["Saturday"],
};

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
    telephone: clinic.phone,
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
    openingHoursSpecification: openingHours.map((row) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: dayMap[row.days] ?? [row.days],
      opens: row.opens,
      closes: row.closes,
    })),
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

export function buildBreadcrumbSchema(siteUrl: string) {
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
        name: "Veterinary Services",
        item: `${siteUrl}/services`,
      },
    ],
  };
}

export function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export type Cta = {
  label: string;
  href: string;
  external?: boolean;
};

export type ImageAsset = {
  src: string;
  alt: string;
};

export type MediaAsset = ImageAsset & {
  type?: "image";
};

export type ClinicInfo = {
  name: string;
  legalName: string;
  tagline: string;
  siteUrl: string;
  logoUrl: string;
  phone: string;
  phoneDisplay: string;
  vetPhone?: string;
  vetPhoneDisplay?: string;
  whatsapp: string;
  whatsappDisplay: string;
  email: string;
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
  };
  mapUrl: string;
  mapEmbedUrl: string;
  socialLinks: Cta[];
};

export type OpeningHour = {
  day: string;
  label: string;
  ranges: {
    opens: string;
    closes: string;
  }[];
};

export type ContactPhone = {
  id?: string;
  label: string;
  number: string;
};

export type ContactSettings = {
  address: {
    street: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    mapUrl: string;
  };
  phones: ContactPhone[];
  whatsapp: string;
  email: string;
  socialLinks: Cta[];
  openingHours: OpeningHour[];
};

export type HeroContent = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export type HomepageContent = {
  services: {
    label: string;
    heading: string;
    ctaLabel: string;
  };
  approach: {
    label: string;
    heading: string;
    body: string;
  };
  gallery: {
    heading: string;
    body: string;
    ctaLabel: string;
  };
  cases: {
    heading: string;
    body: string;
    ctaLabel: string;
  };
  products: {
    heading: string;
    body: string;
    helpHeading: string;
    helpBody: string;
    ctaLabel: string;
  };
  ctaStrip: {
    heading: string;
    body: string;
  };
  testimonials: {
    heading: string;
    body: string;
    emptyState: string;
    reviewsUrl: string;
  };
  faq: {
    heading: string;
  };
  contact: {
    label: string;
    heading: string;
    body: string;
    mapCtaLabel: string;
  };
  servicesCta: Cta;
  finalCta: {
    heading: string;
    body: string;
  };
};

export type Service = {
  slug: string;
  icon: string;
  category: string;
  title: string;
  seoTitle: string;
  short: string;
  detail: string;
  highlights: string[];
  image?: ImageAsset;
};

export type ServiceCategory = {
  id: string;
  label: string;
  description: string;
  serviceSlugs: string[];
};

export type Product = {
  name: string;
  category: string;
  description: string;
  image: ImageAsset;
  links: {
    wolt?: string;
    foody?: string;
  };
};

export type GalleryItem = {
  slug: string;
  title: string;
  description: string;
  image: ImageAsset;
  media?: MediaAsset[];
  orientation?: "portrait" | "landscape" | "square";
};

export type CaseItem = {
  id: string;
  title: string;
  description: string;
  category?: string;
  image: ImageAsset;
  media?: MediaAsset[];
  isSensitive: boolean;
  homepagePreview?: boolean;
  orientation?: "portrait" | "landscape" | "square";
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type Testimonial = {
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
};

export type SeoMeta = {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
};

export type SiteContent = {
  clinic: ClinicInfo;
  media: {
    heroVideo: string;
    heroPoster: ImageAsset;
    about: ImageAsset;
    care: ImageAsset;
  };
  openingHours: OpeningHour[];
  navigation: Cta[];
  hero: HeroContent;
  homepage: HomepageContent;
  about: {
    label: string;
    heading: string;
    paragraphs: string[];
    badgeLocation: string;
    badgeTitle: string;
    metrics: {
      label: string;
      value?: number;
      suffix?: string;
    }[];
  };
  trustPoints: {
    icon: string;
    title: string;
    body: string;
  }[];
  serviceCategories: ServiceCategory[];
  services: Service[];
  approach: {
    step: string;
    title: string;
    body: string;
  }[];
  gallery: GalleryItem[];
  cases: CaseItem[];
  products: Product[];
  testimonials: Testimonial[];
  faqs: FaqItem[];
  seo: {
    home: SeoMeta;
    services: SeoMeta;
    gallery: SeoMeta;
    cases: SeoMeta;
  };
};

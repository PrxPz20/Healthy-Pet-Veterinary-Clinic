export type Cta = {
  label: string;
  href: string;
  external?: boolean;
};

export type ImageAsset = {
  src: string;
  alt: string;
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

export type HeroContent = {
  eyebrow: string;
  title: string;
  body: string;
  primaryCta: Cta;
  secondaryCta: Cta;
};

export type Service = {
  slug: string;
  icon: string;
  title: string;
  seoTitle: string;
  short: string;
  detail: string;
  highlights: string[];
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
  orientation?: "portrait" | "landscape" | "square";
};

export type CaseItem = {
  id: string;
  title: string;
  description: string;
  category?: string;
  image: ImageAsset;
  isSensitive: boolean;
  homepagePreview?: boolean;
  orientation?: "portrait" | "landscape" | "square";
};

export type FaqItem = {
  question: string;
  answer: string;
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
  about: {
    heading: string;
    paragraphs: string[];
    badgeLocation: string;
    badgeTitle: string;
  };
  trustPoints: {
    icon: string;
    title: string;
    body: string;
  }[];
  services: Service[];
  approach: {
    step: string;
    title: string;
    body: string;
  }[];
  gallery: GalleryItem[];
  cases: CaseItem[];
  products: Product[];
  faqs: FaqItem[];
  seo: {
    home: SeoMeta;
    services: SeoMeta;
    gallery: SeoMeta;
    cases: SeoMeta;
  };
};

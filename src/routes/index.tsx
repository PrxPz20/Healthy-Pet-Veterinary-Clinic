import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, type ReactNode } from "react";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { PageLoader } from "@/components/site/PageLoader";
import { getSiteContent } from "@/content/provider";
import { buildClinicSchema, buildFaqSchema, JsonLd } from "@/lib/schema";
import { useContactSettings } from "@/components/site/contact-settings-context";
import { useEditorialContent } from "@/components/site/editorial-content-context";

const content = getSiteContent();
const Gallery = lazy(() =>
  import("@/components/site/Gallery").then((module) => ({ default: module.Gallery })),
);
const Cases = lazy(() =>
  import("@/components/site/Cases").then((module) => ({ default: module.Cases })),
);
const Testimonials = lazy(() =>
  import("@/components/site/Testimonials").then((module) => ({ default: module.Testimonials })),
);
const Products = lazy(() =>
  import("@/components/site/Products").then((module) => ({ default: module.Products })),
);
const Faq = lazy(() => import("@/components/site/Faq").then((module) => ({ default: module.Faq })));
const Contact = lazy(() =>
  import("@/components/site/Contact").then((module) => ({ default: module.Contact })),
);
const FinalCta = lazy(() =>
  import("@/components/site/FinalCta").then((module) => ({ default: module.FinalCta })),
);
const Footer = lazy(() =>
  import("@/components/site/Footer").then((module) => ({ default: module.Footer })),
);
const MobileCta = lazy(() =>
  import("@/components/site/MobileCta").then((module) => ({ default: module.MobileCta })),
);

function DeferredSection({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <Suspense fallback={<div id={id} className="min-h-40 bg-white" aria-hidden="true" />}>
      {children}
    </Suspense>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: content.seo.home.title },
      {
        name: "description",
        content: content.seo.home.description,
      },
      { property: "og:title", content: content.seo.home.title },
      { property: "og:description", content: content.seo.home.description },
      { property: "og:image", content: content.seo.home.ogImage },
      { name: "twitter:image", content: content.seo.home.ogImage },
    ],
    links: [{ rel: "canonical", href: content.seo.home.canonical }],
  }),
  component: Page,
});

function Page() {
  const contact = useContactSettings();
  const { faqs } = useEditorialContent();
  return (
    <main id="main-content" className="min-h-screen bg-white text-ink">
      <JsonLd data={buildClinicSchema(content, contact)} />
      <JsonLd data={buildFaqSchema(faqs)} />
      <PageLoader />
      <Nav />
      <Hero />
      <TrustStrip />
      <Services />
      <About />
      <DeferredSection id="gallery">
        <Gallery />
      </DeferredSection>
      <DeferredSection id="cases">
        <Cases />
      </DeferredSection>
      <DeferredSection id="reviews">
        <Testimonials />
      </DeferredSection>
      <DeferredSection id="products">
        <Products />
      </DeferredSection>
      <DeferredSection id="faq">
        <Faq />
      </DeferredSection>
      <DeferredSection id="contact">
        <Contact />
      </DeferredSection>
      <DeferredSection>
        <FinalCta />
      </DeferredSection>
      <DeferredSection>
        <Footer />
      </DeferredSection>
      <DeferredSection>
        <MobileCta />
      </DeferredSection>
    </main>
  );
}

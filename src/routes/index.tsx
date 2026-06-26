import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { Gallery } from "@/components/site/Gallery";
import { Cases } from "@/components/site/Cases";
import { Testimonials } from "@/components/site/Testimonials";
import { Products } from "@/components/site/Products";
import { CtaStrip } from "@/components/site/CtaStrip";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
import { FinalCta } from "@/components/site/FinalCta";
import { Footer } from "@/components/site/Footer";
import { PageLoader } from "@/components/site/PageLoader";
import { MobileCta } from "@/components/site/MobileCta";
import { getSiteContent } from "@/content/provider";
import { buildClinicSchema, buildFaqSchema, JsonLd } from "@/lib/schema";

const content = getSiteContent();

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
  return (
    <main id="main-content" className="min-h-screen bg-white text-ink">
      <JsonLd data={buildClinicSchema(content)} />
      <JsonLd data={buildFaqSchema(content.faqs)} />
      <PageLoader />
      <Nav />
      <Hero />
      <TrustStrip />
      <Services />
      <About />
      <Gallery />
      <Cases />
      <Testimonials />
      <Products />
      <CtaStrip />
      <Faq />
      <Contact />
      <FinalCta />
      <Footer />
      <MobileCta />
    </main>
  );
}

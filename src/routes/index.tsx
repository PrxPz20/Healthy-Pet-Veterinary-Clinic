import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Hero } from "@/components/site/Hero";
import { TrustStrip } from "@/components/site/TrustStrip";
import { Services } from "@/components/site/Services";
import { About } from "@/components/site/About";
import { CareApproach } from "@/components/site/CareApproach";
import { Products } from "@/components/site/Products";
import { Faq } from "@/components/site/Faq";
import { Contact } from "@/components/site/Contact";
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
    <main className="min-h-screen bg-white text-ink">
      <JsonLd data={buildClinicSchema(content)} />
      <JsonLd data={buildFaqSchema(content.faqs)} />
      <PageLoader />
      <Nav />
      <Hero />
      <TrustStrip />
      <Services />
      <About />
      <CareApproach />
      <Products />
      <Faq />
      <Contact />
      <Footer />
      <MobileCta />
    </main>
  );
}

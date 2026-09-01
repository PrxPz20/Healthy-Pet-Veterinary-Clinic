import type { ReactNode } from "react";
import { ChevronDown, Home } from "lucide-react";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

export function LegalPage({
  title,
  intro,
  heroImage,
  sections,
}: {
  title: string;
  intro: string;
  heroImage: string;
  sections: LegalSection[];
}) {
  return (
    <main id="main-content" className="min-h-screen bg-white text-ink">
      <Nav />

      <header className="relative overflow-hidden bg-ink pb-16 pt-32 text-white md:pb-20 md:pt-36">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          width={1672}
          height={941}
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/88 to-ink/35" />
        <div className="absolute inset-0 bg-ink/20" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <nav aria-label="Breadcrumb" className="text-sm text-white/70">
            <a
              href="/"
              className="focus-ring focus-ring-dark inline-flex min-h-11 items-center gap-1.5 rounded transition-colors hover:text-white"
            >
              <Home className="size-3.5" aria-hidden="true" />
              Home
            </a>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span aria-current="page" className="font-semibold text-white">
              {title}
            </span>
          </nav>
          <div className="mt-8 max-w-4xl">
            <h1 className="type-page-title">{title}</h1>
            <p className="type-section-copy mt-5 max-w-3xl text-white/72">{intro}</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-16">
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <nav aria-label={`${title} sections`} className="lg:hidden">
            <details className="group rounded-2xl border border-line bg-white">
              <summary className="focus-ring flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                On this page
                <ChevronDown
                  className="size-4 shrink-0 text-vet-green transition-transform duration-200 group-open:rotate-180"
                  aria-hidden="true"
                />
              </summary>
              <LegalSectionLinks
                sections={sections}
                className="grid grid-cols-2 gap-x-4 border-t border-line px-4 sm:grid-cols-3"
              />
            </details>
          </nav>

          <nav aria-label={`${title} sections`} className="hidden lg:block">
            <h2 className="type-label text-ink/68">On this page</h2>
            <LegalSectionLinks
              sections={sections}
              className="mt-3 grid grid-cols-1 border-t border-line"
            />
          </nav>
        </aside>

        <article className="min-w-0 max-w-[75ch]">
          <div className="mb-10 border-l-4 border-amber-500 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950">
            <strong>Required before publication:</strong> replace every bracketed placeholder and
            confirm that the clinic has permission or another valid legal basis to publish all
            gallery and case media.
          </div>

          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-32 border-b border-line py-9 first:pt-0 last:border-b-0 last:pb-0"
            >
              <h2 className="type-card-title text-ink">{section.title}</h2>
              <div className="legal-copy type-body mt-5 space-y-4 text-ink/72">
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>

      <Footer />
    </main>
  );
}

function LegalSectionLinks({
  sections,
  className,
}: {
  sections: LegalSection[];
  className: string;
}) {
  return (
    <ul className={className}>
      {sections.map((section) => (
        <li key={section.id} className="border-b border-line">
          <a
            href={`#${section.id}`}
            onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
            className="focus-ring focus-ring-dark flex min-h-11 items-center rounded py-2 text-sm font-semibold text-ink/72 transition-colors hover:text-vet-green-dark"
          >
            {section.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

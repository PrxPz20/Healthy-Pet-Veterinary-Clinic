import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

import appCss from "../styles.css?url";
import notFoundImage from "@/assets/404_image.webp";
import logoUrl from "@/assets/healthy_pet_logo_white.svg";
import { getStaticContactSettings } from "@/content/contact";
import { getSiteContent } from "@/content/provider";
import { ContactSettingsProvider } from "@/components/site/ContactSettingsProvider";
import { loadPublicContactSettings } from "@/lib/supabase/public-contact";
import { EditorialContentProvider } from "@/components/site/EditorialContentProvider";
import { loadPublicEditorialContent } from "@/lib/supabase/public-editorial";
import { reportClientError } from "@/lib/safe-errors";

function NotFoundComponent() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7f8f4] px-4 pb-10 pt-28 text-ink sm:px-8 sm:pt-32">
      <header className="absolute inset-x-0 top-0 px-4 pt-4 sm:px-8 sm:pt-5">
        <nav
          aria-label="404 navigation"
          className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 rounded-full bg-ink px-5 py-3 shadow-[0_18px_40px_-24px_rgba(24,26,28,0.65)] sm:px-7"
        >
          <Link
            to="/"
            aria-label="Healthy Pet Veterinary Clinic homepage"
            className="focus-ring focus-ring-dark rounded-lg"
          >
            <img
              src={logoUrl}
              alt="Healthy Pet Veterinary Clinic"
              width={448}
              height={115}
              className="h-auto w-40 object-contain sm:w-48"
            />
          </Link>
          <button
            type="button"
            onClick={() => {
              if (window.history.length > 1) {
                router.history.back();
              } else {
                window.location.assign("/");
              }
            }}
            className="focus-ring focus-ring-dark type-button inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-white px-5 text-ink transition-colors hover:bg-sage"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </button>
        </nav>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-9.5rem)] max-w-3xl flex-col items-center justify-center text-center">
        <img
          src={notFoundImage}
          alt="A puzzled dog and cat looking for the right page"
          width={2508}
          height={1412}
          fetchPriority="high"
          className="h-auto w-full max-w-[32rem] object-contain"
        />
        <p className="mt-1 text-sm font-bold uppercase text-vet-green">404</p>
        <h1 className="type-section-title mt-4 max-w-2xl text-balance text-ink">
          Paws! You may have taken a wrong turn.
        </h1>
        <p className="type-section-copy mt-4 max-w-xl text-pretty text-ink/64">
          Double-check the web address, or head back to our homepage.
        </p>
        <Link
          to="/"
          className="focus-ring focus-ring-dark type-button mt-7 inline-flex min-h-12 items-center justify-center rounded-full bg-vet-green-dark px-6 text-white transition-colors hover:bg-ink"
        >
          Go to homepage
        </Link>
      </main>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  reportClientError("Route render failed", error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="type-card-title text-foreground">This page didn't load</h1>
        <p className="type-card-copy mt-2 text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="focus-ring type-button inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="focus-ring type-button inline-flex min-h-11 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  loader: async ({ location }) => {
    if (location.pathname.startsWith("/admin")) {
      const content = getSiteContent();
      return {
        contact: getStaticContactSettings(),
        editorial: {
          about: content.about,
          aboutImage: content.media.about,
          faqs: content.faqs,
          testimonials: content.testimonials,
        },
      };
    }

    const [contact, editorial] = await Promise.all([
      loadPublicContactSettings(),
      loadPublicEditorialContent(),
    ]);
    return { contact, editorial };
  },
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: getSiteContent().seo.home.title },
      { name: "description", content: getSiteContent().seo.home.description },
      { name: "author", content: getSiteContent().clinic.name },
      { property: "og:title", content: getSiteContent().seo.home.title },
      { property: "og:description", content: getSiteContent().seo.home.description },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_CY" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: getSiteContent().seo.home.title },
      { name: "twitter:description", content: getSiteContent().seo.home.description },
      { property: "og:image", content: getSiteContent().seo.home.ogImage },
      { name: "twitter:image", content: getSiteContent().seo.home.ogImage },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap",
      },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { contact, editorial } = Route.useLoaderData();

  return (
    <QueryClientProvider client={queryClient}>
      <ContactSettingsProvider value={contact}>
        <EditorialContentProvider value={editorial}>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </EditorialContentProvider>
      </ContactSettingsProvider>
    </QueryClientProvider>
  );
}

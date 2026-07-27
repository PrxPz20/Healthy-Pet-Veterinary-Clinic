import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { getStaticContactSettings } from "@/content/contact";
import { getSiteContent } from "@/content/provider";
import { ContactSettingsProvider } from "@/components/site/ContactSettingsProvider";
import { loadPublicContactSettings } from "@/lib/supabase/public-contact";
import { EditorialContentProvider } from "@/components/site/EditorialContentProvider";
import { loadPublicEditorialContent } from "@/lib/supabase/public-editorial";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="type-page-title text-foreground">404</h1>
        <h2 className="type-card-title mt-4 text-foreground">Page not found</h2>
        <p className="type-card-copy mt-2 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="focus-ring type-button inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
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

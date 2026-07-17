import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import heroImg from "../assets/hero-exterior.jpg";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-5xl text-foreground">Page not found</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-saddle"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center border border-ink bg-ink px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-cream transition-colors hover:bg-saddle"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-ink px-5 py-2.5 text-xs uppercase tracking-[0.2em] text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Vulcan, Ahuriri — Boutique 2-bedroom retreat in Napier" },
      {
        name: "description",
        content:
          "Your harbourside home in Ahuriri. A self-contained 2-bedroom apartment beneath our own home — walking distance to the beach, restaurants, and Napier's Art Deco quarter.",
      },
      { name: "author", content: "H&H Property Group Limited" },
      { property: "og:title", content: "The Vulcan, Ahuriri — Boutique 2-bedroom retreat in Napier" },
      {
        property: "og:description",
        content:
          "Your harbourside home in Ahuriri. A self-contained 2-bedroom apartment beneath our own home — walking distance to the beach, restaurants, and Napier's Art Deco quarter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "The Vulcan, Ahuriri — Boutique 2-bedroom retreat in Napier" },
      { name: "twitter:description", content: "Your harbourside home in Ahuriri. A self-contained 2-bedroom apartment beneath our own home — walking distance to the beach, restaurants, and Napier's Art Deco quarter." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

const ldJson = {
  "@context": "https://schema.org",
  "@type": "LodgingBusiness",
  "name": "The Vulcan, Ahuriri",
  "description": "A self-contained 2-bedroom boutique apartment in Ahuriri, Napier — walking distance to the beach, restaurants, and the Art Deco quarter.",
  "url": "https://ahuriri-haven-booking.vercel.app",
  "telephone": "+64-6-000-0000",
  "email": "bookings@hhproperties.co.nz",
  "image": heroImg,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "1 Vulcan Lane",
    "addressLocality": "Ahuriri, Napier",
    "addressRegion": "Hawke's Bay",
    "addressCountry": "NZ"
  },
  "priceRange": "NZ$220 - NZ$400/night",
  "numberOfBedrooms": 2,
  "numberOfBathroomsTotal": 1,
  "maximumAttendeeCapacity": 4,
  "amenityFeature": [
    "Free parking",
    "Wifi",
    "Smart TV",
    "Kitchen",
    "Contactless entry"
  ],
  "parentOrganization": {
    "@type": "Organization",
    "name": "H&H Property Group Limited"
  }
};

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ldJson) }}
        />
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

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}

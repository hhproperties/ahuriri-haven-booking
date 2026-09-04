import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/book/success")({
  component: BookSuccessPage,
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: typeof search.session_id === "string" ? search.session_id : "",
  }),
  head: () => ({
    meta: [
      { title: "Booking received — The Vulcan, Ahuriri" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function BookSuccessPage() {
  const { session_id } = Route.useSearch();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="flex min-h-[60vh] items-center px-6 pt-32 pb-24 lg:px-10">
        <div className="mx-auto w-full max-w-2xl">
          <p className="eyebrow">Booking received</p>
          <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Thank you.</h1>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            Your payment is being processed and your dates are held. We'll email a
            confirmation with your arrival details shortly.
          </p>
          {session_id && (
            <p className="mt-6 font-mono text-[11px] text-muted-foreground">
              Session {session_id.slice(0, 16)}…
            </p>
          )}
          <div className="mt-10 flex gap-4">
            <Link
              to="/"
              className="border border-ink px-6 py-3 text-xs uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-cream transition-colors"
            >
              Back home
            </Link>
            <Link
              to="/location"
              className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.22em] text-cream hover:bg-saddle transition-colors"
            >
              Plan your stay
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

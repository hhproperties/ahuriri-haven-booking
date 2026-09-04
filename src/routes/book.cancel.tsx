import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export const Route = createFileRoute("/book/cancel")({
  component: BookCancelPage,
  head: () => ({
    meta: [
      { title: "Booking cancelled — The Vulcan, Ahuriri" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function BookCancelPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="flex min-h-[60vh] items-center px-6 pt-32 pb-24 lg:px-10">
        <div className="mx-auto w-full max-w-2xl">
          <p className="eyebrow">Payment cancelled</p>
          <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">No payment taken.</h1>
          <p className="mt-6 text-base text-muted-foreground md:text-lg">
            Your booking wasn't completed and no charge was made. You can try again
            whenever you're ready.
          </p>
          <div className="mt-10 flex gap-4">
            <Link
              to="/book"
              className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.22em] text-cream hover:bg-saddle transition-colors"
            >
              Try again
            </Link>
            <Link
              to="/"
              className="border border-ink px-6 py-3 text-xs uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-cream transition-colors"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

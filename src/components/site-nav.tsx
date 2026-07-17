import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const links = [
  { to: "/#apartment", label: "The Apartment" },
  { to: "/#amenities", label: "Amenities" },
  { to: "/#location", label: "Location" },
  { to: "/#hosts", label: "Meet Your Hosts" },
  { to: "/#reviews", label: "Reviews" },
  { to: "/journal", label: "Journal" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "bg-cream/95 backdrop-blur-sm shadow-[0_1px_0_0_var(--color-border)]" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-gold text-ink font-display text-lg tracking-tight">
            VL
          </span>
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-lg text-ink">The Vulcan</span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-gold">Retreat · Ahuriri</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="gold-underline text-xs uppercase tracking-[0.22em] text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
          <Link
            to="/book"
            className="inline-flex items-center border border-ink bg-ink px-5 py-2.5 text-xs uppercase tracking-[0.22em] text-cream transition-all hover:bg-saddle"
          >
            Book Now
          </Link>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden flex flex-col gap-1.5 p-2"
          aria-label="Menu"
        >
          <span className={`h-px w-6 bg-ink transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-ink transition-opacity ${open ? "opacity-0" : ""}`} />
          <span className={`h-px w-6 bg-ink transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border bg-cream">
          <nav className="flex flex-col gap-1 px-6 py-6">
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm uppercase tracking-[0.22em] text-ink"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-4 inline-flex justify-center border border-ink bg-ink px-5 py-3 text-xs uppercase tracking-[0.22em] text-cream"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

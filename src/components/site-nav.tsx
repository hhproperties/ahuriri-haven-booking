import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import logoImg from "@/assets/vulcan-retreat-logo.png";
import logoLightImg from "@/assets/vulcan-retreat-logo-dark.png";

const links = [
  { to: "/apartment", label: "Apartment" },
  { to: "/amenities", label: "Amenities" },
  { to: "/location", label: "Location" },
  { to: "/hosts", label: "Hosts" },
  { to: "/reviews", label: "Reviews" },
  { to: "/blog", label: "Blog" },
];

/**
 * @param overlay Render transparent over a full-bleed hero instead of in a solid
 *   cream band. Past 80px of scroll the cream surface and walnut link colour
 *   fade in. Book Now stays solid walnut in both states so it never loses
 *   prominence. Pages using this must own the top of their own layout — no
 *   spacer is rendered.
 */
export function SiteNav({ overlay = false }: { overlay?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const prevScrollY = useRef(0);
  const [tickerHidden, setTickerHidden] = useState(false);
  const [pastHero, setPastHero] = useState(false);

  // Close mobile sheet on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Hide ticker on scroll-down (mobile), show on scroll-up
  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 80) {
        setTickerHidden(y > prevScrollY.current);
      } else {
        setTickerHidden(false);
      }
      // Book Now gains a surface once past the hero. Surface only — no size or
      // position change, so nothing in the nav reflows.
      setPastHero(y > 80);
      prevScrollY.current = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* ── Fixed cream header ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-[var(--motion-base)] ${
          overlay && !pastHero ? "bg-transparent" : "bg-[#EFE8DA]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 sm:px-8 lg:px-10 lg:py-3">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={overlay && !pastHero ? logoLightImg : logoImg}
              alt="The Vulcan, Ahuriri"
              className="h-12 w-auto sm:h-14 lg:h-20"
              width={120}
              height={56}
            />
          </Link>

          <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`wood-underline text-[11px] uppercase tracking-[0.24em] transition-colors tap-target inline-flex items-center ${
                  overlay && !pastHero
                    ? "text-[#EFE8DA] hover:text-[#E8D5BC]"
                    : "text-[#17181A] hover:text-[#6B4630]"
                } ${
                  location.pathname === l.to || (l.to !== "/" && location.pathname.startsWith(l.to))
                    ? "is-active"
                    : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/book"
              className={`btn-primary text-[11px] tap-target inline-flex items-center transition-shadow duration-[var(--motion-fast)] ${
                pastHero ? "shadow-[0_2px_14px_rgba(23,24,26,0.18)]" : "shadow-none"
              }`}
            >
              Book Now
            </Link>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="relative z-50 flex flex-col gap-1.5 p-2 tap-target lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span
              className={`h-px w-6 bg-[#17181A] transition-all duration-400 ${open ? "translate-y-2 rotate-45" : ""}`}
            />
            <span
              className={`h-px w-6 bg-[#17181A] transition-all duration-400 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`h-px w-6 bg-[#17181A] transition-all duration-400 ${open ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* ── Wood-textured marquee ticker ── */}
      <div
        className={`fixed inset-x-0 z-40 transition-transform duration-400 ${
          tickerHidden ? "-translate-y-full" : "translate-y-0"
        }`}
        style={{ top: "52px" }}
      >
        <div className="marquee-track wood-texture h-7 sm:h-8">
          <div className="marquee-scroll items-center gap-8 px-4 sm:gap-12 sm:px-6">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-8 sm:gap-12">
                <span className="text-[0.6rem] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#EFE8DA] opacity-80">
                  The Vulcan, Ahuriri — Napier
                </span>
                <span className="text-[0.6rem] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#EFE8DA] opacity-50">
                  ✦
                </span>
                <span className="text-[0.6rem] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#EFE8DA] opacity-80">
                  Boutique harbourside retreat
                </span>
                <span className="text-[0.6rem] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#EFE8DA] opacity-50">
                  ✦
                </span>
                <span className="text-[0.6rem] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#EFE8DA] opacity-80">
                  2 bedrooms · 1 bathroom
                </span>
                <span className="text-[0.6rem] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] text-[#EFE8DA] opacity-50">
                  ✦
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Full-screen mobile nav sheet ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-[#EFE8DA] lg:hidden"
          style={{ paddingTop: "56px" }}
        >
          <nav className="flex flex-col items-center gap-2 px-5 w-full max-w-xs">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`w-full border-b border-[#17181A]/10 py-4 text-center text-base uppercase tracking-[0.24em] text-[#17181A] transition-colors hover:text-[#6B4630] tap-target ${
                  location.pathname === l.to ? "italic opacity-60" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-8 w-full btn-primary text-center text-sm tap-target"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}

      {/* Spacer to push content below the fixed header. Not rendered when the
          nav overlays a hero — that page owns the top of its own layout. */}
      {!overlay && <div className="h-[76px] sm:h-[88px]" />}
    </>
  );
}

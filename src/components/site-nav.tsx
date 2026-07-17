import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logoImg from "@/assets/vulcan-logo.jpg";

const links = [
  { to: "/apartment", label: "Apartment" },
  { to: "/amenities", label: "Amenities" },
  { to: "/location", label: "Location" },
  { to: "/hosts", label: "Hosts" },
  { to: "/reviews", label: "Reviews" },
  { to: "/journal", label: "Journal" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Close mobile sheet on route change
  useEffect(() => { setOpen(false); }, [location.pathname]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* ── Fixed cream header ── */}
      <header className="fixed inset-x-0 top-0 z-50 bg-[#EFE8DA]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img
              src={logoImg}
              alt="The Vulcan, Ahuriri"
              className="h-11 w-auto lg:h-14 mix-blend-multiply"
              width={120}
              height={56}
              style={{ filter: "contrast(1.1) brightness(1.1)" }}
            />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`wood-underline text-[11px] uppercase tracking-[0.24em] text-[#17181A] transition-colors hover:text-[#6B4630] ${
                  location.pathname === l.to || (l.to !== "/" && location.pathname.startsWith(l.to))
                    ? "is-active"
                    : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link to="/book" className="btn-outline text-[11px]">
              Book Now
            </Link>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="relative z-50 flex flex-col gap-1.5 p-2 lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className={`h-px w-6 bg-[#17181A] transition-all duration-400 ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-[#17181A] transition-all duration-400 ${open ? "opacity-0" : ""}`} />
            <span className={`h-px w-6 bg-[#17181A] transition-all duration-400 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {/* ── Wood-textured marquee ticker ── */}
      <div className="fixed inset-x-0 z-40" style={{ top: "60px" }}>
        <div className="marquee-track wood-texture h-8">
          <div className="marquee-scroll items-center gap-12 px-6">
            {[...Array(6)].map((_, i) => (
              <span key={i} className="flex items-center gap-12">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#EFE8DA] opacity-80">
                  The Vulcan, Ahuriri — Napier
                </span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#EFE8DA] opacity-50">
                  ✦
                </span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#EFE8DA] opacity-80">
                  Boutique harbourside retreat
                </span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#EFE8DA] opacity-50">
                  ✦
                </span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#EFE8DA] opacity-80">
                  2 bedrooms · 1 bathroom
                </span>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#EFE8DA] opacity-50">
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
          style={{ paddingTop: "80px" }}
        >
          <nav className="flex flex-col items-center gap-2 px-6">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`py-3 text-lg uppercase tracking-[0.24em] text-[#17181A] transition-colors hover:text-[#6B4630] ${
                  location.pathname === l.to ? "italic opacity-60" : ""
                }`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-8 btn-outline text-sm"
            >
              Book Now
            </Link>
          </nav>
        </div>
      )}

      {/* Spacer to push content below fixed header + ticker */}
      <div className="h-[88px]" />
    </>
  );
}

import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/vulcan-retreat-logo-dark.png";
import hhLogoImg from "@/assets/hh-logo-v2.png";

export function SiteFooter() {
  return (
    <footer className="bg-[#17181A] text-[#EFE8DA]">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        {/* Mobile: stacked. Desktop: 3-column */}
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-3">
          {/* Brand column */}
          <div className="text-center sm:text-left lg:col-span-1">
            <img
              src={logoImg}
              alt="The Vulcan, Ahuriri"
              className="mx-auto h-14 w-auto opacity-90 sm:mx-0"
              width={140}
              height={52}
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed opacity-60 font-[Archivo] mx-auto sm:mx-0">
              A private, self-contained 2-bedroom retreat in Ahuriri,
              walking distance to the beach, waterfront restaurants, and
              Napier's Art Deco heart.
            </p>
          </div>

          {/* Navigation links — horizontal on mobile too */}
          <div className="flex justify-center gap-10 sm:justify-start lg:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E] mb-4">
                Stay
              </p>
              <ul className="space-y-3">
                <li><Link to="/apartment" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo] tap-target inline-flex items-center">Apartment</Link></li>
                <li><Link to="/amenities" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo] tap-target inline-flex items-center">Amenities</Link></li>
                <li><Link to="/location" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo] tap-target inline-flex items-center">Location</Link></li>
                <li><Link to="/book" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo] tap-target inline-flex items-center">Book</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E] mb-4">
                About
              </p>
              <ul className="space-y-3">
                <li><Link to="/hosts" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo] tap-target inline-flex items-center">Hosts</Link></li>
                <li><Link to="/reviews" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo] tap-target inline-flex items-center">Reviews</Link></li>
                <li><Link to="/blog" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo] tap-target inline-flex items-center">Blog</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center sm:text-left">
            <p className="text-[10px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E] mb-4">
              Contact
            </p>
            <address className="not-italic space-y-3">
              <p className="text-sm opacity-70 font-[Archivo]">1 Vulcan Lane, Ahuriri, Napier</p>
              <p><a href="mailto:bookings@hhproperties.co.nz" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo] tap-target inline-flex items-center">bookings@hhproperties.co.nz</a></p>
              <p className="text-sm opacity-70 font-[Archivo]">027 583 9279</p>
            </address>
          </div>
        </div>

        {/* Wood divider */}
        <div className="wood-divider my-12 sm:my-16" />

        {/* Bottom bar — stacked on mobile */}
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            <img
              src={hhLogoImg}
              alt="H&H Property Group Limited"
              className="h-8 w-auto opacity-80"
              width={70}
              height={28}
            />
            <span className="text-[11px] opacity-40 font-[Archivo]">
              © {new Date().getFullYear()} H&H Property Group Limited
            </span>
          </div>
          <div className="flex gap-6">
            <Link to="/terms" className="text-[11px] opacity-40 hover:opacity-70 transition-opacity font-[Archivo] tap-target inline-flex items-center">Terms</Link>
            <Link to="/privacy" className="text-[11px] opacity-40 hover:opacity-70 transition-opacity font-[Archivo] tap-target inline-flex items-center">Privacy</Link>
            <Link to="/cancellation" className="text-[11px] opacity-40 hover:opacity-70 transition-opacity font-[Archivo] tap-target inline-flex items-center">Cancellation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

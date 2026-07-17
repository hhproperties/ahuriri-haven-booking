import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/vulcan-logo-dark.png";
import hhLogoImg from "@/assets/hh-logo-dark.png";

export function SiteFooter() {
  return (
    <footer className="bg-[#17181A] text-[#EFE8DA]">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-3">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <img
              src={logoImg}
              alt="The Vulcan, Ahuriri"
              className="h-13 w-auto opacity-90"
              width={140}
              height={52}
            />
            <p className="mt-6 max-w-xs text-sm leading-relaxed opacity-60 font-[Archivo]">
              A private, self-contained 2-bedroom retreat in Ahuriri,
              walking distance to the beach, waterfront restaurants, and
              Napier's Art Deco heart.
            </p>
          </div>

          {/* Navigation */}
          <div className="flex flex-wrap gap-10 lg:gap-16">
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E] mb-4">
                Stay
              </p>
              <ul className="space-y-2.5">
                <li><Link to="/apartment" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo]">Apartment</Link></li>
                <li><Link to="/amenities" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo]">Amenities</Link></li>
                <li><Link to="/location" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo]">Location</Link></li>
                <li><Link to="/book" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo]">Book</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E] mb-4">
                About
              </p>
              <ul className="space-y-2.5">
                <li><Link to="/hosts" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo]">Hosts</Link></li>
                <li><Link to="/reviews" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo]">Reviews</Link></li>
                <li><Link to="/journal" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo]">Journal</Link></li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E] mb-4">
              Contact
            </p>
            <address className="not-italic space-y-2">
              <p className="text-sm opacity-70 font-[Archivo]">1 Vulcan Lane, Ahuriri, Napier</p>
              <p><a href="mailto:stay@hhproperties.co.nz" className="text-sm opacity-70 hover:opacity-100 transition-opacity font-[Archivo]">stay@hhproperties.co.nz</a></p>
            </address>
          </div>
        </div>

        {/* Wood divider */}
        <div className="wood-divider my-16" />

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <img
              src={hhLogoImg}
              alt="H&H Property Group Limited"
              className="h-7 w-auto opacity-70"
              width={70}
              height={28}
            />
            <span className="text-[11px] opacity-40 font-[Archivo]">
              © {new Date().getFullYear()} H&H Property Group Limited
            </span>
          </div>
          <div className="flex gap-6">
            <Link to="/terms" className="text-[11px] opacity-40 hover:opacity-70 transition-opacity font-[Archivo]">Terms</Link>
            <Link to="/privacy" className="text-[11px] opacity-40 hover:opacity-70 transition-opacity font-[Archivo]">Privacy</Link>
            <Link to="/cancellation-policy" className="text-[11px] opacity-40 hover:opacity-70 transition-opacity font-[Archivo]">Cancellation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-cream">
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full border border-gold font-display text-lg text-cream">
                VL
              </span>
              <div className="leading-tight">
                <div className="font-display text-xl">The Vulcan</div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-gold">Retreat · Ahuriri</div>
              </div>
            </div>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-cream/70">
              A private, self-contained 2-bedroom retreat beneath our own home in Ahuriri —
              walking distance to the beach, the waterfront restaurants, and Napier's Art
              Deco heart.
            </p>
          </div>

          <div>
            <p className="eyebrow text-gold">Visit</p>
            <address className="mt-4 not-italic text-sm leading-relaxed text-cream/80">
              1 Vulcan Lane<br />
              Ahuriri, Napier<br />
              Hawke's Bay, New Zealand
            </address>
          </div>

          <div>
            <p className="eyebrow text-gold">Contact</p>
            <ul className="mt-4 space-y-2 text-sm text-cream/80">
              <li>
                <a href="mailto:stay@hhproperties.co.nz" className="hover:text-gold">
                  stay@hhproperties.co.nz
                </a>
              </li>
              <li>
                <Link to="/book" className="hover:text-gold">
                  Check availability
                </Link>
              </li>
              <li>
                <Link to="/journal" className="hover:text-gold">
                  Journal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-cream/10 pt-8 text-xs text-cream/50 lg:flex-row lg:items-center lg:justify-between">
          <div>
            © {new Date().getFullYear()} H&H Property Group Limited. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link to="/terms" className="hover:text-gold">Terms</Link>
            <Link to="/privacy" className="hover:text-gold">Privacy</Link>
            <Link to="/cancellation-policy" className="hover:text-gold">Cancellation</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

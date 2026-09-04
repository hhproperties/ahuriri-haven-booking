import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { WalkTimeline } from "@/components/WalkTimeline";
import heroImg from "@/assets/ahuriri-waterfront.jpg";
import { OG_IMAGE } from "@/lib/site";

export const Route = createFileRoute("/location")({
  component: LocationPage,
  head: () => ({
    meta: [
      { title: "Location — The Vulcan, Ahuriri, Napier" },
      {
        name: "description",
        content:
          "1 Vulcan Lane, Ahuriri — a quiet harbourside street walking distance from Napier's beaches, restaurants, and Art Deco quarter.",
      },
      { property: "og:title", content: "Location — The Vulcan, Ahuriri" },
      {
        property: "og:description",
        content:
          "A quiet lane in Ahuriri, Napier — five minutes from the beach, walking distance to waterfront restaurants and the Art Deco quarter.",
      },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
});

/** Split so walking destinations can carry the timeline and drives stay a grid. */
const nearby = [
  { name: "Ahuriri Beach", distance: "5 min walk" },
  { name: "Milk & Honey", distance: "3 min walk", type: "Café" },
  { name: "Thirsty Whale", distance: "5 min walk", type: "Restaurant" },
  { name: "Madam Social", distance: "5 min walk", type: "Restaurant" },
  { name: "Ahuriri Marina", distance: "7 min walk" },
  { name: "Marine Parade", distance: "20 min walk" },
  { name: "National Aquarium", distance: "5 min drive" },
  { name: "Art Deco Quarter", distance: "20 min walk" },
  { name: "Te Mata Peak", distance: "20 min drive" },
  { name: "Cape Kidnappers", distance: "30 min drive" },
  { name: "Hawke's Bay Airport", distance: "10 min drive" },
  { name: "Napier CBD", distance: "5 min drive" },
];

const walking = nearby.filter((n) => n.distance.includes("walk"));
const driving = nearby.filter((n) => !n.distance.includes("walk"));

function LocationPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />

      {/* Hero */}
      <section className="relative min-h-[35vh] min-h-half-screen-safe overflow-hidden bg-[#17181A]">
        <div className="absolute inset-0 ken-burns">
          <img
            src={heroImg}
            alt="Ahuriri waterfront at sunset"
            className="h-full w-full object-cover hero-image-grade"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#17181A]/80 via-[#17181A]/30 to-transparent" />
        <div className="absolute inset-0 warm-veil" />
        <div className="relative z-10 mx-auto flex h-full min-h-[35vh] min-h-half-screen-safe max-w-7xl flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">
            Location
          </p>
          <h1 className="mt-2 sm:mt-3 font-[Fraunces] text-[clamp(2rem,6vw,5rem)] leading-[0.95] text-[#EFE8DA] tracking-[-0.02em] text-shadow-overlay">
            1 Vulcan Lane, <span className="word-wood-light">Ahuriri.</span>
          </h1>
        </div>
      </section>

      {/* Cream band */}
      <section className="bg-[#EFE8DA] section-y px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl space-y-12 sm:space-y-20">
          {/* About */}
          <div className="grid gap-6 sm:gap-12 lg:grid-cols-2">
            <div className="reveal-up">
              <p className="text-sm sm:text-base leading-relaxed font-[Archivo] text-[#17181A]/70">
                A quiet street a short walk from Ahuriri's waterfront village — a cluster of
                restaurants, cafés, and the harbour. Napier's Marine Parade and Art Deco quarter are
                an easy stroll away.
              </p>
            </div>
            <div className="reveal-up reveal-stagger-1">
              <p className="text-sm sm:text-base leading-relaxed font-[Archivo] text-[#17181A]/70">
                Hawke's Bay's best wineries, the gannet colony at Cape Kidnappers, and Te Mata Peak
                are all within a short drive — making The Vulcan the perfect base for exploring the
                region.
              </p>
            </div>
          </div>

          {/* Map.
              The sepia/hue-rotate filter that used to sit here tinted everything
              the iframe painted — including Google's white attribution strip and
              its low-resolution tile placeholders — which is what produced the
              brown blurred band under the map. Real map styling needs a Maps API
              key, which this project does not have; see the report. Until then
              the embed renders untinted and simply larger, since it was smaller
              than the paragraph beside it. */}
          <div className="reveal-up reveal-stagger-2 aspect-[16/10] overflow-hidden border border-[#6B4630]/20 sm:aspect-[2/1]">
            <iframe
              title="Map of 1 Vulcan Lane, Ahuriri"
              src="https://www.google.com/maps?q=1+Vulcan+Lane,+Ahuriri,+Napier&output=embed"
              className="h-full w-full"
              loading="lazy"
            />
          </div>

          {/* Nearby.
              P4.4: the previous brief specified a filling timeline and it
              shipped as a flat wrapped list. Walking destinations are now the
              timeline; drives stay a plain aligned grid below, because a
              "20 min drive" is not a walk and should not share the spine. */}
          <div>
            <div className="wood-divider mb-8 sm:mb-12" />
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
              <div>
                <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630]">
                  On foot
                </p>
                <h3 className="mt-3 max-w-[20ch] font-[Fraunces] text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.1] text-[#17181A] display-balance">
                  Everything worth doing is a walk away.
                </h3>
              </div>
              <WalkTimeline items={walking} />
            </div>

            <p className="mt-14 text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630]">
              A short drive
            </p>
            <div className="mt-5 grid gap-x-10 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {driving.map((n) => (
                <div
                  key={n.name}
                  className="flex items-baseline justify-between gap-3 border-b border-[#6B4630]/10 pb-2.5"
                >
                  <span className="font-[Fraunces] text-sm text-[#17181A] sm:text-base">
                    {n.name}
                  </span>
                  <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] font-[Archivo] text-[#6B4630] sm:text-[11px]">
                    {n.distance}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630]">
              Getting here
            </p>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm font-[Archivo] text-[#17181A]/60 max-w-md mx-auto">
              Hawke's Bay Airport is a 10-minute drive. The Art Deco quarter is a 20-minute walk
              along Marine Parade. Free off-street parking is on site.
            </p>
            <div className="mt-6 sm:mt-8">
              <Link
                to="/book"
                className="btn-outline text-xs group tap-target inline-flex items-center"
              >
                Book Your Stay{" "}
                <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

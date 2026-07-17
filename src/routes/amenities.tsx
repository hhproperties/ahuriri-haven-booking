import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import livingImg from "@/assets/living-room.jpg";
import gardenImg from "@/assets/garden-courtyard.jpg";

export const Route = createFileRoute("/amenities")({
  component: AmenitiesPage,
  head: () => ({
    meta: [
      { title: "Amenities — The Vulcan, Ahuriri" },
      { name: "description", content: "Everything you need for a relaxed stay — two queen bedrooms, kitchenette, free parking, wifi, smart TV, courtyard garden, digital entry." },
      { property: "og:title", content: "Amenities — The Vulcan, Ahuriri" },
      { property: "og:description", content: "Two queen bedrooms, kitchenette, free off-street parking, wifi, smart TV, and a private courtyard garden." },
      { property: "og:image", content: livingImg },
    ],
  }),
});

const categories = [
  {
    label: "Sleeping",
    items: [
      "Two queen bedrooms with storage",
      "Premium linens and towels provided",
      "Velvet headboards, reading lamps",
      "Blackout curtains for deep sleep",
    ],
  },
  {
    label: "Kitchen",
    items: [
      "Microwave and two-hob cooktop",
      "Full-size fridge with freezer",
      "Kettle, toaster, cafetière",
      "Plates, glassware, cookware",
    ],
  },
  {
    label: "Bathroom",
    items: [
      "One bathroom with walk-in shower",
      "Fresh towels, hand soap, toiletries",
      "Hair dryer provided",
    ],
  },
  {
    label: "Outdoor",
    items: [
      "Private courtyard garden",
      "Tropical plantings, sun-dappled",
      "Outdoor seating for two",
      "Five minutes to the beach",
    ],
  },
  {
    label: "Tech & Comfort",
    items: [
      "Free high-speed wifi",
      "Smart TV with streaming",
      "Heat pump for year-round comfort",
      "Contactless digital keypad entry",
    ],
  },
  {
    label: "Parking & Access",
    items: [
      "Free off-street parking on site",
      "Level entry from the driveway",
      "Quick walk to Ahuriri village",
      "20-min stroll to Art Deco quarter",
    ],
  },
];

function AmenitiesPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
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
          <img src={gardenImg} alt="Courtyard garden" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#17181A]/70 via-[#17181A]/20 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full min-h-[35vh] min-h-half-screen-safe max-w-7xl flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">Amenities</p>
          <h1 className="mt-2 sm:mt-3 font-[Fraunces] text-[clamp(2rem,6vw,5rem)] leading-[0.95] text-[#EFE8DA] tracking-[-0.02em]">
            Everything you need for a{" "}
            <span className="word-wood-light">relaxed stay.</span>
          </h1>
        </div>
      </section>

      {/* Cream band */}
      <section className="bg-[#EFE8DA] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-5xl">
          <div className="wood-divider mb-10 sm:mb-16" />
          <div className="grid gap-8 sm:gap-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <div key={cat.label} className={`reveal-up reveal-stagger-${Math.min(i + 1, 4)}`}>
                <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630] mb-3 sm:mb-5">{cat.label}</p>
                <ul className="space-y-2 sm:space-y-3">
                  {cat.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm font-[Archivo] text-[#17181A]/70">
                      <span className="mt-[5px] sm:mt-[6px] h-[4px] w-[4px] sm:h-[5px] sm:w-[5px] shrink-0 rounded-full bg-[#6B4630]/40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="wood-divider my-12 sm:my-20" />
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630]">House rules</p>
            <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-12 gap-y-2 sm:gap-y-3 text-xs sm:text-sm font-[Archivo] text-[#17181A]/60">
              <span>Check-in from 2:00pm</span>
              <span className="h-px w-4 sm:w-6 bg-[#6B4630]/30" />
              <span>Check-out by 10:00am</span>
              <span className="h-px w-4 sm:w-6 bg-[#6B4630]/30" />
              <span>No smoking indoors</span>
              <span className="h-px w-4 sm:w-6 bg-[#6B4630]/30" />
              <span>Well-behaved pets considered</span>
            </div>
            <div className="mt-8 sm:mt-12">
              <Link to="/book" className="btn-outline text-xs group tap-target inline-flex items-center">
                Book Your Stay <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

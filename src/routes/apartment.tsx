import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import livingImg from "@/assets/living-room.jpg";
import bedroomOne from "@/assets/bedroom-one.jpg";
import bedroomTwo from "@/assets/bedroom-two.jpg";
import gardenImg from "@/assets/garden-courtyard.jpg";
import heroImg from "@/assets/hero-exterior.jpg";

export const Route = createFileRoute("/apartment")({
  component: ApartmentPage,
  head: () => ({
    meta: [
      { title: "The Apartment — The Vulcan, Ahuriri" },
      { name: "description", content: "A self-contained 2-bedroom apartment beneath our home in Ahuriri, Napier. Two queen bedrooms, one bathroom, kitchenette, courtyard — sleeping four." },
      { property: "og:title", content: "The Apartment — The Vulcan, Ahuriri" },
      { property: "og:description", content: "Two queen bedrooms, one bathroom, private courtyard — a boutique harbourside retreat in Ahuriri, Napier." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

function ApartmentPage() {
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
      <section className="relative min-h-[40vh] min-h-half-screen-safe overflow-hidden bg-[#17181A]">
        <div className="absolute inset-0 ken-burns">
          <img src={heroImg} alt="The Vulcan exterior" className="h-full w-full object-cover hero-image-grade" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#17181A]/80 via-[#17181A]/30 to-transparent" />
        <div className="absolute inset-0 warm-veil" />
        <div className="relative z-10 mx-auto flex h-full min-h-[40vh] min-h-half-screen-safe max-w-7xl flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">The Apartment</p>
          <h1 className="mt-2 sm:mt-3 font-[Fraunces] text-[clamp(2rem,6vw,5rem)] leading-[0.95] text-[#EFE8DA] tracking-[-0.02em] text-shadow-overlay">
            Boutique lodge,{" "}
            <span className="word-champagne">not a listing.</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[#EFE8DA] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-5xl space-y-10 sm:space-y-12">
          {/* Description */}
          <div className="grid gap-6 sm:gap-12 lg:grid-cols-2">
            <div className="reveal-up">
              <p className="text-sm sm:text-base leading-relaxed font-[Archivo] text-[#17181A]/70">
                Warm, tactile, and considered — The Vulcan is a two-bedroom apartment
                sitting quietly beneath our own home. Boucle sofas, velvet headboards,
                a highland cow watching over the room. Everything set up exactly the
                way we'd want to stay ourselves.
              </p>
            </div>
            <div className="reveal-up reveal-stagger-1">
              <p className="text-sm sm:text-base leading-relaxed font-[Archivo] text-[#17181A]/70">
                Five minutes to the beach on foot. A short walk to Milk & Honey for
                your morning coffee, and to the Thirsty Whale for dinner. Napier's Art
                Deco quarter is a gentle 20-minute stroll along Marine Parade.
              </p>
            </div>
          </div>

          <div className="wood-divider my-10 sm:my-16" />

          {/* Room by room */}
          <div className="grid gap-10 sm:gap-16">
            {[
              { img: bedroomOne, label: "Bedroom One", desc: "Cream tufted queen bed with velvet headboard. Plenty of built-in storage, reading lamps, and a window that catches the morning sun through the garden foliage." },
              { img: bedroomTwo, label: "Bedroom Two", desc: "Navy velvet queen bed with matching linens. A quiet room tucked at the back of the apartment — dark, cool, and perfectly still for a good night's sleep." },
              { img: livingImg, label: "Living & Kitchen", desc: "Open-plan living with a boucle sofa, smart TV, and a kitchenette with microwave, two-hob cooktop, fridge, and everything you need for a relaxed self-catered stay." },
              { img: gardenImg, label: "Courtyard Garden", desc: "A private, sun-dappled courtyard with tropical plantings — the perfect spot for an afternoon read or a glass of Hawke's Bay Syrah before heading out for dinner." },
            ].map((room, i) => (
              <div key={room.label} className={`reveal-up reveal-stagger-${i + 1} grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-center`}>
                {/* Image always first on mobile, alternates on desktop */}
                <figure className={`aspect-[4/5] sm:aspect-[4/3] overflow-hidden ${i % 2 === 1 ? "lg:order-2" : ""}`}>
                  <img src={room.img} alt={room.label} loading="lazy" decoding="async" className="h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-105" />
                </figure>
                <div className={i % 2 === 1 ? "lg:order-1 lg:pr-12" : "lg:pl-12"}>
                  <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630] mt-1 sm:mt-0">{room.label}</p>
                  <p className="mt-2 sm:mt-4 text-sm sm:text-base leading-relaxed font-[Archivo] text-[#17181A]/70">{room.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="wood-divider my-10 sm:my-16" />
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630]">Ready to stay?</p>
            <h2 className="mt-3 sm:mt-4 font-[Fraunces] text-[clamp(1.6rem,4vw,3.5rem)] leading-[1.05] text-[#17181A] tracking-[-0.02em]">
              Come and{" "}
              <span className="word-wood">see for yourself.</span>
            </h2>
            <div className="mt-6 sm:mt-8">
              <Link to="/book" className="btn-outline text-xs group tap-target inline-flex items-center">
                Check Availability <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

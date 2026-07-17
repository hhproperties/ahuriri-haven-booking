import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import heroImg from "@/assets/hero-exterior.jpg";
import gardenImg from "@/assets/garden-courtyard.jpg";
import livingImg from "@/assets/living-room.jpg";
import bedroomOne from "@/assets/bedroom-one.jpg";
import bedroomTwo from "@/assets/bedroom-two.jpg";
import cowImg from "@/assets/highland-cow.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "The Vulcan, Ahuriri — Boutique 2-bedroom retreat in Napier" },
      {
        name: "description",
        content:
          "Your harbourside home in Ahuriri — a self-contained 2-bedroom apartment beneath our own home, steps from beaches, restaurants, and Napier's Art Deco quarter.",
      },
    ],
  }),
});

const amenities = [
  { title: "Two queen bedrooms", sub: "Sleeps 4 · max occupancy" },
  { title: "One bathroom", sub: "Fresh linen & towels" },
  { title: "Fully self-contained", sub: "Private entrance" },
  { title: "Kitchen", sub: "Microwave · two-hob cooktop" },
  { title: "Free off-street parking", sub: "Right at the door" },
  { title: "Walk everywhere", sub: "Beach & restaurants · five min" },
  { title: "Wifi & Smart TV", sub: "Heating throughout" },
  { title: "Contactless entry", sub: "Digital keypad" },
];

const nearby = [
  { name: "Ahuriri Beach", distance: "5 min walk" },
  { name: "Waterfront Restaurants", distance: "5 min walk" },
  { name: "Ahuriri Village Shops", distance: "3 min walk" },
  { name: "Marine Parade & Art Deco quarter", distance: "20 min walk" },
  { name: "Hawke's Bay Cycle Trails", distance: "On your doorstep" },
];

/* ── Scroll reveal hook ── */
function useReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("is-visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Components ── */

function Index() {
  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />
      <Hero />
      <CountingMoment />
      <IntroSection />
      <ApartmentGallery />
      <DarkAmenities />
      <CreamLocation />
      <DarkHosts />
      <ReviewsSection />
      <SpectacleBookingCTA />
      <SiteFooter />
    </div>
  );
}

/* ── Hero ── */
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useReveal();
  const words = "Your harbourside home".split(" ");

  return (
    <section className="relative h-screen min-h-[680px] w-full overflow-hidden bg-[#17181A]">
      {/* Ken Burns background */}
      <div className="absolute inset-0 ken-burns">
        <img
          src={heroImg}
          alt="The Vulcan, Ahuriri"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#17181A]/80 via-[#17181A]/30 to-[#17181A]/50" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-24 lg:px-10 lg:pb-32">
        <p
          className={`font-[Archivo] text-[11px] uppercase tracking-[0.24em] text-[#BD8A5E] transition-all duration-1000 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          The Vulcan · Ahuriri
        </p>

        {/* Spectacle headline */}
        <h1 className="mt-6 max-w-5xl font-[Fraunces] font-optical-sizing-auto leading-[0.92] text-[#EFE8DA] max-sm:text-[clamp(2.8rem,12vw,5rem)] sm:text-[clamp(3.5rem,10vw,7rem)] lg:text-[clamp(5rem,8vw,9rem)] tracking-[-0.02em] text-balance">
          {words.map((w, i) => (
            <span
              key={i}
              className="mr-4 inline-block transition-all duration-800"
              style={{
                transitionDelay: `${200 + i * 100}ms`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
              }}
            >
              {w}
            </span>
          ))}{" "}
          <span
            className="word-champagne inline-block transition-all duration-1000"
            style={{
              transitionDelay: "500ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(30px)",
            }}
          >
            in Ahuriri.
          </span>
        </h1>

        <p
          className="mt-8 max-w-xl text-lg leading-relaxed font-[Archivo] text-[#EFE8DA]/80 transition-all duration-1000"
          style={{ transitionDelay: "800ms", opacity: mounted ? 1 : 0 }}
        >
          A self-contained two-bedroom apartment beneath our home — five minutes
          from the beach and Ahuriri's best cafés.
        </p>

        <div
          className="mt-12 flex flex-wrap gap-6 transition-all duration-1000"
          style={{ transitionDelay: "1000ms", opacity: mounted ? 1 : 0 }}
        >
          <Link
            to="/book"
            className="btn-outline-light text-xs group"
          >
            Check Availability
            <span className="ml-3 inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            to="/apartment"
            className="wood-underline inline-flex items-center text-xs uppercase tracking-[0.24em] font-[Archivo] text-[#EFE8DA]"
          >
            Explore the apartment
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── Counting moment (stats row) ── */
function CountingMoment() {
  useReveal();

  useEffect(() => {
    const counters = document.querySelectorAll(".count-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const target = parseInt(el.dataset.target || "0");
            let current = 0;
            const step = Math.ceil(target / 60);
            const interval = setInterval(() => {
              current += step;
              if (current >= target) { current = target; clearInterval(interval); }
              el.textContent = current.toString();
            }, 25);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#EFE8DA] px-6 py-20 lg:px-10 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {[
            { target: "2", label: "Bedrooms" },
            { target: "4", label: "Guests" },
            { target: "5", label: "Min walk to beach" },
            { target: "100", label: "5-Star Reviews" },
          ].map((s, i) => (
            <div key={s.label} className={`reveal-up reveal-stagger-${i + 1} text-center`}>
              <p className="font-[Fraunces] text-5xl md:text-6xl font-[300] italic text-[#6B4630] counter-num">
                <span className="count-up" data-target={s.target}>0</span>
                {s.label.includes("Min") || s.label.includes("%") ? "" : ""}
              </p>
              {s.label.includes("Min") && <span className="font-[Fraunces] text-2xl font-[300] italic text-[#6B4630] counter-num"> min</span>}
              {s.label.includes("%") || s.label === "5-Star Reviews" ? <span className="font-[Fraunces] text-2xl font-[300] italic text-[#6B4630] counter-num">%</span> : null}
              <p className="mt-2 text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#17181A]/60">
                {s.label.replace("Min walk to beach", "").replace("5-Star Reviews", "").replace("Bedrooms", "").replace("Guests", "").trim() || s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Intro section ── */
function IntroSection() {
  useReveal();
  return (
    <section className="bg-[#17181A] px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-5xl text-center">
        <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
          A quiet arrival
        </p>
        <h2 className="reveal-up reveal-stagger-1 mt-10 font-[Fraunces] text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
          A private, self-contained{" "}
          <span className="word-wood-light">retreat</span> beneath our home.
        </h2>
        <h2 className="reveal-up reveal-stagger-2 mt-8 font-[Fraunces] text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
          Two queen bedrooms. One bathroom.{" "}
          <span className="word-wood-light">Room for four.</span>
        </h2>
        <p className="reveal-up reveal-stagger-3 mx-auto mt-12 max-w-2xl text-base leading-relaxed font-[Archivo] text-[#EFE8DA]/60">
          Minutes from the sand, the cafés, and Napier's Art Deco heart — a
          quiet lane in Ahuriri, set up exactly as we'd want to stay ourselves.
        </p>
        <div className="wood-divider mx-auto mt-16 max-w-xs" />
      </div>
    </section>
  );
}

/* ── Apartment gallery ── */
function ApartmentGallery() {
  useReveal();
  const items = [
    { src: bedroomOne, label: "Queen Bedroom One" },
    { src: bedroomTwo, label: "Queen Bedroom Two" },
    { src: livingImg, label: "Living & Kitchen" },
    { src: gardenImg, label: "Garden Courtyard" },
  ];

  return (
    <section className="bg-[#EFE8DA] px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-8">
          <div>
            <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
              The apartment
            </p>
            <h2 className="reveal-up reveal-stagger-1 mt-4 font-[Fraunces] text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-[#17181A] font-optical-sizing-auto tracking-[-0.02em]">
              Every corner,{" "}
              <span className="word-wood">considered.</span>
            </h2>
          </div>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <figure key={it.label} className={`reveal-up reveal-stagger-${i + 1} group relative aspect-[4/5] overflow-hidden`}>
              <img
                src={it.src}
                alt={it.label}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <figcaption className="absolute bottom-0 left-0 flex items-center gap-3 bg-[#EFE8DA] px-5 py-3">
                <span className="h-px w-8 bg-[#6B4630]" />
                <span className="text-[10px] uppercase tracking-[0.24em] font-[Archivo] text-[#17181A]">
                  {it.label}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Dark amenities band ── */
function DarkAmenities() {
  useReveal();
  return (
    <section className="bg-[#17181A] px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
            Amenities
          </p>
          <h2 className="reveal-up reveal-stagger-1 mt-4 font-[Fraunces] text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
            Everything you need for a{" "}
            <span className="word-wood-light">relaxed stay.</span>
          </h2>
        </div>
        <div className="reveal-up reveal-stagger-2 mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          <div className="wood-divider col-span-full mb-4" />
          {amenities.map((a, i) => (
            <div key={a.title}>
              <h3 className="font-[Fraunces] text-xl text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
                {a.title}
              </h3>
              <p className="mt-2 text-sm font-[Archivo] text-[#EFE8DA]/50">{a.sub}</p>
            </div>
          ))}
        </div>
        <div className="reveal-up reveal-stagger-3 mt-16 flex flex-wrap items-center gap-x-12 gap-y-4 pt-8 text-[11px] uppercase tracking-[0.22em] font-[Archivo] text-[#BD8A5E]">
          <span>Check-in from 2:00pm</span>
          <span className="h-px w-8 bg-[#BD8A5E] opacity-40" />
          <span>Check-out by 10:00am</span>
          <span className="h-px w-8 bg-[#BD8A5E] opacity-40" />
          <span>Entry via digital keypad</span>
        </div>
      </div>
    </section>
  );
}

/* ── Cream location band ── */
function CreamLocation() {
  useReveal();
  return (
    <section className="bg-[#EFE8DA] px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
              Location
            </p>
            <h2 className="reveal-up reveal-stagger-1 mt-4 font-[Fraunces] text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-[#17181A] font-optical-sizing-auto tracking-[-0.02em]">
              1 Vulcan Lane,{" "}
              <span className="word-wood">Ahuriri.</span>
            </h2>
            <p className="reveal-up reveal-stagger-2 mt-8 max-w-lg text-base leading-relaxed font-[Archivo] text-[#17181A]/60">
              A quiet street a short walk from Ahuriri's waterfront village —
              a cluster of restaurants, cafés, and the harbour. Napier's Marine
              Parade and Art Deco quarter are an easy stroll away.
            </p>
          </div>
          <div className="reveal-up reveal-stagger-2">
            <div className="aspect-video overflow-hidden border border-[#6B4630]/20">
              <iframe
                title="Map of 1 Vulcan Lane, Ahuriri"
                src="https://www.google.com/maps?q=1+Vulcan+Lane,+Ahuriri,+Napier&output=embed"
                className="h-full w-full"
                style={{ filter: "sepia(0.3) hue-rotate(320deg) saturate(0.6)" }}
                loading="lazy"
              />
            </div>
          </div>
        </div>

        <div className="reveal-up reveal-stagger-3 mt-20 wood-divider pt-10" />
        <div className="mt-10">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
            As seen nearby
          </p>
          <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
            {nearby.map((n) => (
              <div key={n.name} className="flex items-baseline gap-3">
                <span className="font-[Fraunces] text-lg text-[#17181A]">{n.name}</span>
                <span className="text-[11px] uppercase tracking-[0.2em] font-[Archivo] text-[#6B4630]">{n.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Dark hosts band ── */
function DarkHosts() {
  useReveal();
  return (
    <section className="bg-[#17181A] px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-5 lg:items-center">
        <div className="reveal-up lg:col-span-2">
          <div className="arch-frame-group relative inline-block">
            <div className="arch-accent" />
            <div className="arch-frame">
              <img
                src={cowImg}
                alt="Leah and Wayne — your hosts"
                loading="lazy"
                className="h-full w-full object-cover"
                width={800}
                height={1067}
              />
            </div>
          </div>
        </div>
        <div className="reveal-up reveal-stagger-2 lg:col-span-3">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
            Meet your hosts
          </p>
          <h2 className="mt-4 font-[Fraunces] text-[clamp(2rem,5vw,4.5rem)] leading-[1.05] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
            Leah <span className="word-wood-light">&</span> Wayne.
          </h2>
          <p className="mt-8 max-w-lg text-base leading-relaxed font-[Archivo] text-[#EFE8DA]/60">
            We've spent years travelling the world and staying in other people's
            homes — now we love doing the same for guests in ours. The Vulcan is
            our own slice of Ahuriri: five minutes from the beach, walking
            distance to our favourite restaurants, and set up exactly how we'd
            want to stay ourselves.
          </p>
          <blockquote className="mt-10 border-l-2 border-[#BD8A5E] pl-6 font-[Fraunces] text-2xl italic leading-snug text-[#BD8A5E]">
            "We host the way we like to be hosted — quietly, warmly, and out of
            the way unless you need us."
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* ── Reviews ── */
function ReviewsSection() {
  useReveal();
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <section className="bg-[#EFE8DA] px-6 py-28 lg:px-10 lg:py-40">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
            Reviews
          </p>
          <h2 className="reveal-up reveal-stagger-1 mt-4 font-[Fraunces] text-[clamp(2rem,5vw,4rem)] leading-[1.05] text-[#17181A] font-optical-sizing-auto tracking-[-0.02em]">
            What guests{" "}
            <span className="word-wood">say.</span>
          </h2>
        </div>
        <div className="reveal-up reveal-stagger-2 mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <figure key={r.id} className="flex h-full flex-col justify-between border border-[#6B4630]/10 bg-white/60 p-8">
              <div>
                <div className="flex gap-1 text-[#6B4630] text-sm">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <span key={k}>★</span>
                  ))}
                </div>
                <blockquote className="mt-6 font-[Fraunces] text-lg leading-snug text-[#17181A]">
                  "{r.body}"
                </blockquote>
              </div>
              <figcaption className="mt-8 text-[11px] uppercase tracking-[0.22em] font-[Archivo] text-[#6B4630]">
                — {r.author_name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Spectacle booking CTA ── */
function SpectacleBookingCTA() {
  useReveal();
  return (
    <section className="relative overflow-hidden bg-[#17181A] px-6 py-32 lg:px-10 lg:py-48">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
          Ready when you are
        </p>
        <h2 className="reveal-up reveal-stagger-1 mt-10 font-[Fraunces] text-[clamp(2.5rem,6vw,6rem)] leading-[0.95] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
          Come and{" "}
          <span className="word-champagne">stay</span> with us.
        </h2>
        <p className="reveal-up reveal-stagger-2 mx-auto mt-8 max-w-xl text-lg font-[Archivo] text-[#EFE8DA]/60">
          From NZ$220/night. Two bedrooms, sleeps four. Free parking, walking
          distance to everything.
        </p>
        <div className="reveal-up reveal-stagger-3 mt-12">
          <Link
            to="/book"
            className="btn-outline-light group text-xs"
          >
            Check Availability
            <span className="ml-3 inline-block transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import {
  BedDouble,
  CarFront,
  CookingPot,
  DoorOpen,
  Flame,
  Footprints,
  KeyRound,
  ShowerHead,
  Sofa,
  Trees,
  Users,
  Wifi,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
import { useRevealSection as useReveal } from "@/hooks/use-reveal";
import { DayAtTheVulcan } from "@/components/DayAtTheVulcan";
import { PropertyGallery } from "@/components/PropertyGallery";
import { StickyBookingBar } from "@/components/StickyBookingBar";
import heroImg from "@/assets/hero-exterior.jpg";
import gardenImg from "@/assets/garden-courtyard.jpg";
import livingImg from "@/assets/living-room.jpg";
import bedroomOne from "@/assets/bedroom1.jpg";
import bedroomTwo from "@/assets/bedroom2.jpg";
import hostsImg from "@/assets/leah-and-wayne.jpg";
import patioBbqImg from "@/assets/patio-bbq.jpg";
import patioDiningImg from "@/assets/patio-dining.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "The Vulcan, Ahuriri — Boutique 2-bedroom retreat in Napier" },
      {
        name: "description",
        content:
          "Your harbourside home in Ahuriri — a self-contained 2-bedroom apartment with a private courtyard and BBQ patio, steps from beaches, restaurants, and Napier's Art Deco quarter.",
      },
    ],
  }),
});

const amenities = [
  { Icon: BedDouble, title: "Two queen bedrooms", sub: "Both open to the garden" },
  { Icon: ShowerHead, title: "One bathroom", sub: "Walk-in corner shower" },
  { Icon: DoorOpen, title: "Fully self-contained", sub: "Private entrance" },
  { Icon: CookingPot, title: "Kitchenette", sub: "Two-hob cooktop · microwave · fridge" },
  { Icon: Sofa, title: "Open-plan living", sub: "Smart TV, dining for four" },
  { Icon: Flame, title: "Covered patio & BBQ", sub: "Weber barbecue, table for six" },
  { Icon: Trees, title: "Private courtyard garden", sub: "Palms, water feature, lounge seating" },
  { Icon: Users, title: "Sleeps 4 · max occupancy", sub: "Fresh linen & towels" },
  { Icon: CarFront, title: "Free off-street parking", sub: "Right at the door" },
  { Icon: Footprints, title: "Walk everywhere", sub: "Beach & restaurants · five min" },
  { Icon: Wifi, title: "Wifi & Smart TV", sub: "Heating throughout" },
  { Icon: KeyRound, title: "Contactless entry", sub: "Digital keypad" },
];

const nearby = [
  { name: "Ahuriri Beach", distance: "5 min walk" },
  { name: "Waterfront Restaurants", distance: "5 min walk" },
  { name: "Ahuriri Village Shops", distance: "3 min walk" },
  { name: "Marine Parade & Art Deco quarter", distance: "20 min walk" },
  { name: "Hawke's Bay Cycle Trails", distance: "On your doorstep" },
];

/* ── Scroll reveal hook ── */

/* ── Components ── */

function Index() {
  return (
    <div className="min-h-screen bg-[#EFE8DA] pb-[76px] md:pb-0">
      <SiteNav overlay />
      <Hero />
      <CountingMoment />
      <IntroSection />
      <ApartmentGallery />
      <DayAtTheVulcan />
      <DarkAmenities />
      <CreamLocation />
      <DarkHosts />
      <ReviewsSection />
      <SpectacleBookingCTA />
      <SiteFooter />
      <StickyBookingBar />
    </div>
  );
}

/* ── Hero ── */
function Hero() {
  useReveal();

  return (
    <section className="relative min-h-[85vh] min-h-screen-safe w-full overflow-hidden bg-[#17181A]">
      {/* Ken Burns background (3% on mobile for CPU) */}
      <div className="absolute inset-0 ken-burns">
        <img
          src={heroImg}
          alt="The Vulcan, Ahuriri"
          className="h-full w-full object-cover hero-image-grade"
          width={1920}
          height={1280}
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {/* Scrim. The headline and paragraph sit over brightly lit weatherboard on
          the left of this frame, so the darkening is directional: strong at the
          left edge, gone by 65% width, which leaves the sunset — the reason this
          photo works — untouched on the right. The second gradient lifts the
          bottom for the CTA row. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(26,22,20,0.72) 0%, rgba(26,22,20,0.55) 35%, rgba(26,22,20,0) 65%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(0deg, rgba(26,22,20,0.72) 0%, rgba(26,22,20,0.28) 28%, rgba(26,22,20,0) 55%)",
        }}
      />
      {/* Warm veil — wood/cream wash */}
      <div className="absolute inset-0 warm-veil" />
      <div className="grain absolute inset-0" />

      <div className="relative z-10 mx-auto flex h-full min-h-[85vh] min-h-screen-safe max-w-7xl flex-col justify-end px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-32">
        <p className="font-[Archivo] text-[11px] uppercase tracking-[0.24em] text-[#E8D5BC]">
          The Vulcan · Ahuriri
        </p>

        {/* Spectacle headline — the LCP element. Deliberately not animated:
            it must be painted at first frame, and it renders without JS. */}
        <h1 className="mt-4 sm:mt-6 max-w-5xl font-[Fraunces] font-optical-sizing-auto leading-[1.05] text-[#EFE8DA] text-[clamp(3rem,7vw,6.5rem)] tracking-[-0.02em] text-balance text-shadow-overlay">
          Your harbourside home <span className="word-champagne">in Ahuriri.</span>
        </h1>

        <p className="mt-5 sm:mt-8 max-w-xl text-sm sm:text-base lg:text-lg leading-relaxed font-[Archivo] text-[#EFE8DA] text-pretty">
          A self-contained two-bedroom apartment beneath our home, opening onto its own courtyard
          garden — five minutes from the beach and Ahuriri's best cafés.
        </p>

        <div className="mt-8 sm:mt-12 flex flex-wrap gap-4 sm:gap-6">
          <Link
            to="/book"
            className="btn-primary group text-xs tap-target inline-flex cursor-pointer items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFE8DA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17181A]"
          >
            Check Availability
            <span className="ml-3 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            to="/apartment"
            className="inline-flex cursor-pointer items-center text-xs uppercase tracking-[0.24em] font-[Archivo] text-[#EFE8DA] underline decoration-[#E8D5BC] decoration-1 underline-offset-4 transition-[text-decoration-thickness] duration-[var(--motion-fast)] hover:decoration-2 tap-target focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFE8DA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17181A]"
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
              if (current >= target) {
                current = target;
                clearInterval(interval);
              }
              el.textContent = current.toString();
            }, 25);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );
    counters.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-[#EFE8DA] section-y-tight px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        {/* Hairline above the row so the band reads as a deliberate summary
            strip closing the hero, not as an orphaned block of cream. */}
        <div className="mb-10 h-px w-full bg-[rgba(74,55,40,0.15)]" />
        <div className="grid grid-cols-2 gap-8 sm:gap-12 md:grid-cols-4">
          {[
            { target: "2", suffix: "", label: "Bedrooms" },
            { target: "4", suffix: "", label: "Guests" },
            { target: "5", suffix: " min", label: "Walk to beach" },
            { target: "100", suffix: "%", label: "5-Star Reviews" },
          ].map((s, i) => (
            <div key={s.label} className={`reveal-up reveal-stagger-${i + 1} text-center`}>
              <p className="font-[Fraunces] text-[clamp(2.5rem,8vw,4rem)] md:text-5xl lg:text-6xl font-[300] italic text-[#6B4630] counter-num leading-none">
                <span className="count-up" data-target={s.target}>
                  0
                </span>
                {s.suffix && (
                  <span className="font-[Fraunces] text-[clamp(1.25rem,4vw,2rem)] font-[300] italic text-[#6B4630] counter-num">
                    {s.suffix}
                  </span>
                )}
              </p>
              <p className="mt-1 sm:mt-2 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.24em] font-[Archivo] text-[#17181A]/60">
                {s.label}
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
    <section className="to-dark bg-[#17181A] section-y px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl text-center">
        <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
          Private courtyard
        </p>
        <h2 className="reveal-up reveal-stagger-1 mx-auto max-w-[28ch] mt-6 sm:mt-10 font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] display-balance leading-[1.05] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
          A private, self-contained <span className="word-wood-light">retreat</span> beneath our
          home.
        </h2>
        <h2 className="reveal-up reveal-stagger-2 mx-auto max-w-[28ch] mt-4 sm:mt-8 font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] display-balance leading-[1.05] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
          Two queen bedrooms. One bathroom. <span className="word-wood-light">Room for four.</span>
        </h2>
        <p className="reveal-up reveal-stagger-3 mx-auto mt-8 sm:mt-12 max-w-[52ch] text-sm sm:text-base leading-relaxed font-[Archivo] text-[#EFE8DA]/75 body-pretty">
          Minutes from the sand, the cafés, and Napier's Art Deco heart — a quiet lane in Ahuriri,
          with a fenced tropical courtyard of your own.
        </p>
        <div className="wood-divider mx-auto mt-12 sm:mt-16 max-w-xs" />
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
    { src: patioBbqImg, label: "Covered Patio & BBQ" },
    { src: patioDiningImg, label: "Outdoor Dining" },
    { src: gardenImg, label: "Garden Courtyard" },
  ];

  return (
    <section className="bg-[#EFE8DA] section-y px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
            The apartment
          </p>
          <h2 className="reveal-up reveal-stagger-1 mt-3 sm:mt-4 font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] display-balance leading-[1.05] text-[#17181A] font-optical-sizing-auto tracking-[-0.02em]">
            Every corner, <span className="word-wood">considered.</span>
          </h2>
          <p className="stack-md max-w-[46ch] text-sm leading-relaxed font-[Archivo] text-[#17181A]/70 body-pretty sm:text-base">
            Six rooms, photographed as they are. Tap any frame to see it full size.
          </p>
        </div>
        <PropertyGallery items={items} className="mt-10 sm:mt-16" />
      </div>
    </section>
  );
}

/* ── Dark amenities band ── */
function DarkAmenities() {
  useReveal();
  return (
    <section className="to-dark bg-[#17181A] section-y px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
            Amenities
          </p>
          <h2 className="reveal-up reveal-stagger-1 mt-3 sm:mt-4 font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] display-balance leading-[1.05] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
            Everything you need for a <span className="word-wood-light">relaxed stay.</span>
          </h2>
        </div>
        <div className="reveal-up reveal-stagger-2 mt-10 sm:mt-16 grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4">
          <div className="wood-divider col-span-full mb-2 sm:mb-4" />
          {amenities.map((a) => (
            <div key={a.title}>
              {/* Icons are lucide SVG at 20px in the gold accent. Never emoji. */}
              <a.Icon aria-hidden="true" strokeWidth={1.25} className="h-5 w-5 text-[#BD8A5E]" />
              <h3 className="mt-3 font-[Fraunces] text-base sm:text-xl text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
                {a.title}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm font-[Archivo] text-[#EFE8DA]/75">
                {a.sub}
              </p>
            </div>
          ))}
        </div>
        <div className="reveal-up reveal-stagger-3 mt-10 sm:mt-16 flex flex-wrap items-center gap-x-8 sm:gap-x-12 gap-y-3 sm:gap-y-4 pt-6 sm:pt-8 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] font-[Archivo] text-[#BD8A5E]">
          <span>Check-in from 2:00pm</span>
          <span className="h-px w-5 sm:w-8 bg-[#BD8A5E] opacity-40 hidden xs:inline-block" />
          <span>Check-out by 10:00am</span>
          <span className="h-px w-5 sm:w-8 bg-[#BD8A5E] opacity-40 hidden xs:inline-block" />
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
    <section className="bg-[#EFE8DA] section-y px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
              Location
            </p>
            <h2 className="reveal-up reveal-stagger-1 mt-3 sm:mt-4 font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] display-balance leading-[1.05] text-[#17181A] font-optical-sizing-auto tracking-[-0.02em]">
              1 Vulcan Lane, <span className="word-wood">Ahuriri.</span>
            </h2>
            <p className="reveal-up reveal-stagger-2 mt-5 sm:mt-8 max-w-lg text-sm sm:text-base leading-relaxed font-[Archivo] text-[#17181A]/60">
              A quiet street a short walk from Ahuriri's waterfront village — a cluster of
              restaurants, cafés, and the harbour. Napier's Marine Parade and Art Deco quarter are
              an easy stroll away.
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

        <div className="reveal-up reveal-stagger-3 mt-14 sm:mt-20 wood-divider pt-8 sm:pt-10" />
        <div className="mt-6 sm:mt-10">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
            As seen nearby
          </p>
          <div className="mt-5 sm:mt-8 flex flex-wrap gap-x-8 sm:gap-x-12 gap-y-4 sm:gap-y-6">
            {nearby.map((n) => (
              <div key={n.name} className="flex items-baseline gap-2 sm:gap-3">
                <span className="font-[Fraunces] text-sm sm:text-lg text-[#17181A]">{n.name}</span>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-[Archivo] text-[#6B4630]">
                  {n.distance}
                </span>
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
    <section className="to-dark bg-[#17181A] section-y px-5 sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 sm:gap-16 lg:grid-cols-5 lg:items-center">
        {/* Image first on mobile (always above text) */}
        <div className="reveal-up lg:col-span-2">
          <div className="arch-frame-group relative inline-block mx-auto block w-fit">
            <div className="arch-accent" />
            <div className="arch-frame max-w-[280px] sm:max-w-full mx-auto">
              <img
                src={hostsImg}
                alt="Leah and Wayne — your hosts"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                width={800}
                height={1067}
              />
            </div>
          </div>
        </div>
        <div className="reveal-up reveal-stagger-2 lg:col-span-3 text-center lg:text-left">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
            Meet your hosts
          </p>
          <h2 className="mt-3 sm:mt-4 font-[Fraunces] text-[clamp(1.8rem,5vw,4.5rem)] leading-[1.05] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
            Leah <span className="word-wood-light">&</span> Wayne.
          </h2>
          <p className="mt-5 sm:mt-8 max-w-lg text-sm sm:text-base leading-relaxed font-[Archivo] text-[#EFE8DA]/75 mx-auto lg:mx-0">
            We've spent years travelling the world and staying in other people's homes — now we love
            doing the same for guests in ours. The Vulcan is our own slice of Ahuriri: five minutes
            from the beach, walking distance to our favourite restaurants, and set up exactly how
            we'd want to stay ourselves.
          </p>
          <blockquote className="mt-8 sm:mt-10 border-l-2 border-[#BD8A5E] pl-4 sm:pl-6 font-[Fraunces] text-lg sm:text-2xl italic leading-snug text-[#BD8A5E] text-left">
            "We host the way we like to be hosted — quietly, warmly, and out of the way unless you
            need us."
          </blockquote>
        </div>
      </div>
    </section>
  );
}

/* ── Reviews ── */
function ReviewsSection() {
  useReveal();
  const {
    data: reviews = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data, error: queryError } = await supabase
        .from("reviews")
        .select("*")
        .eq("published", true)
        .order("sort_order");
      // Discarding this error is why the section went blank silently: a failed
      // request resolved as an empty success and React Query reported no problem.
      if (queryError) throw queryError;
      return data ?? [];
    },
  });

  return (
    <section className="bg-[#EFE8DA] section-y px-5 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
            Reviews
          </p>
          <h2 className="reveal-up reveal-stagger-1 mt-3 sm:mt-4 font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] display-balance leading-[1.05] text-[#17181A] font-optical-sizing-auto tracking-[-0.02em]">
            What guests <span className="word-wood">say.</span>
          </h2>
        </div>
        {!isPending && (error || !reviews.length) && (
          <p className="reveal-up reveal-stagger-2 mt-10 sm:mt-16 max-w-xl text-sm leading-relaxed font-[Archivo] text-[#17181A]/60">
            Guest reviews are unavailable right now.{" "}
            <Link to="/reviews" className="underline underline-offset-4 hover:text-[#6B4630]">
              Read them on the reviews page
            </Link>
            .
          </p>
        )}
        <div className="reveal-up reveal-stagger-2 mt-10 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <figure
              key={r.id}
              className="flex h-full flex-col justify-between border border-[#6B4630]/10 bg-white/60 p-5 sm:p-8"
            >
              <div>
                <div className="flex gap-1 text-[#6B4630] text-sm">
                  {Array.from({ length: r.rating }).map((_, k) => (
                    <span key={k}>★</span>
                  ))}
                </div>
                <blockquote className="mt-4 sm:mt-6 font-[Fraunces] text-base sm:text-lg leading-snug text-[#17181A]">
                  "{r.body}"
                </blockquote>
              </div>
              <figcaption className="mt-6 sm:mt-8 text-[10px] sm:text-[11px] uppercase tracking-[0.2em] sm:tracking-[0.22em] font-[Archivo] text-[#6B4630]">
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
    <section className="to-dark relative overflow-hidden bg-[#17181A] section-y px-5 sm:px-8 lg:px-10">
      <div className="grain absolute inset-0" />
      <div className="relative mx-auto max-w-3xl text-center">
        <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
          Ready when you are
        </p>
        <h2 className="reveal-up reveal-stagger-1 mt-6 sm:mt-10 font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] display-balance leading-[0.95] text-[#EFE8DA] font-optical-sizing-auto tracking-[-0.02em]">
          Come and <span className="word-champagne">stay</span> with us.
        </h2>
        <p className="mx-auto mt-6 sm:mt-8 max-w-xl text-sm sm:text-lg font-[Archivo] text-[#EFE8DA]/75">
          From NZ$220/night. Two queen bedrooms, sleeps four. Private courtyard, barbecue, free
          parking, and everything within walking distance.
        </p>
        <div className="mt-8 sm:mt-12">
          <Link
            to="/book"
            className="btn-primary group text-xs tap-target inline-flex cursor-pointer items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EFE8DA] focus-visible:ring-offset-2 focus-visible:ring-offset-[#17181A]"
          >
            Check Availability
            <span className="ml-3 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

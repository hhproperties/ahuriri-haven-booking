import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
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
          "Your harbourside home in Ahuriri. A self-contained 2-bedroom apartment beneath our own home — walking distance to the beach, restaurants, and Napier's Art Deco quarter.",
      },
    ],
  }),
});

const amenities = [
  { title: "2 Queen bedrooms", sub: "Sleeps 4 · max occupancy" },
  { title: "One bathroom", sub: "Fresh linen & towels" },
  { title: "Fully self-contained", sub: "Private entrance" },
  { title: "Kitchen", sub: "Microwave · 2-hob cooktop · fridge" },
  { title: "Free off-street parking", sub: "Right at the door" },
  { title: "Walk everywhere", sub: "Beach & restaurants · 5 min" },
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

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <Hero />
      <IntroStatement />
      <Apartment />
      <Gallery />
      <Amenities />
      <Location />
      <Hosts />
      <ReviewsSection />
      <BookingCTA />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const words = "Your harbourside home in Ahuriri.".split(" ");

  return (
    <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
      <div className="absolute inset-0 ken-burns">
        <img
          src={heroImg}
          alt="The Vulcan, Ahuriri at golden hour"
          className="h-full w-full object-cover"
          width={1920}
          height={1280}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-ink/40" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-20 lg:px-10 lg:pb-28">
        <p className={`eyebrow text-gold transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          The Vulcan · Ahuriri
        </p>
        <h1 className="mt-4 max-w-4xl font-display text-5xl leading-[1.05] text-cream sm:text-6xl md:text-7xl lg:text-8xl">
          {words.map((w, i) => (
            <span
              key={i}
              className="mr-3 inline-block transition-all duration-700"
              style={{
                transitionDelay: `${200 + i * 70}ms`,
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(30px)",
              }}
            >
              {w}
            </span>
          ))}
        </h1>
        <p
          className="mt-6 max-w-xl text-lg text-cream/85 transition-all duration-1000"
          style={{ transitionDelay: "800ms", opacity: mounted ? 1 : 0 }}
        >
          A self-contained 2-bedroom apartment, steps from the beach and Ahuriri's
          best restaurants.
        </p>
        <div
          className="mt-10 flex flex-wrap gap-4 transition-all duration-1000"
          style={{ transitionDelay: "1000ms", opacity: mounted ? 1 : 0 }}
        >
          <Link
            to="/book"
            className="group inline-flex items-center gap-3 border border-gold bg-gold px-8 py-4 text-xs uppercase tracking-[0.24em] text-ink transition-all hover:scale-[1.03] hover:bg-cream hover:border-cream"
          >
            Check Availability & Book
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <a
            href="#apartment"
            className="gold-underline inline-flex items-center text-xs uppercase tracking-[0.24em] text-cream"
          >
            Explore the apartment
          </a>
        </div>
      </div>
    </section>
  );
}

function IntroStatement() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-32 lg:px-10 lg:py-48">
      <div className="mx-auto max-w-4xl text-center">
        <Reveal>
          <p className="eyebrow">A quiet arrival</p>
        </Reveal>
        <Reveal delay={200}>
          <h2 className="mt-8 font-display text-3xl leading-[1.25] text-ink md:text-5xl">
            A private, self-contained retreat beneath our own home.
          </h2>
        </Reveal>
        <Reveal delay={400}>
          <h2 className="mt-6 font-display text-3xl leading-[1.25] text-ink md:text-5xl">
            Two queen bedrooms. One bathroom. Room for four.
          </h2>
        </Reveal>
        <Reveal delay={600}>
          <h2 className="mt-6 font-display text-3xl leading-[1.25] text-saddle md:text-5xl italic">
            Minutes from the sand, the cafés, and Napier's Art Deco heart.
          </h2>
        </Reveal>
      </div>
    </section>
  );
}

function Apartment() {
  return (
    <section id="apartment" className="bg-cream px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={livingImg}
              alt="Living room of The Vulcan apartment"
              loading="lazy"
              width={1600}
              height={1067}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={200}>
          <div>
            <p className="eyebrow">The Apartment</p>
            <h2 className="mt-6 font-display text-4xl leading-[1.15] text-ink md:text-5xl">
              Boutique lodge, not a listing.
            </h2>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
              Warm, tactile, and considered — The Vulcan is a two-bedroom apartment
              sitting quietly beneath our own home. Boucle sofas, velvet headboards,
              a highland cow watching over the room. Everything set up exactly the
              way we'd want to stay ourselves.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              Five minutes to the beach on foot. A short walk to Milk & Honey for
              your morning coffee, and to the Thirsty Whale or Madam Social for
              dinner. Napier's Art Deco quarter is a gentle 20-minute stroll along
              Marine Parade.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Gallery() {
  const items = [
    { src: bedroomOne, label: "Queen Bedroom One", alt: "Cream tufted queen bedroom" },
    { src: bedroomTwo, label: "Queen Bedroom Two", alt: "Navy velvet queen bedroom" },
    { src: livingImg, label: "Living & Kitchen", alt: "Living room with kitchenette" },
    { src: gardenImg, label: "Garden Courtyard", alt: "Tropical garden courtyard" },
  ];
  return (
    <section className="bg-putty/40 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-end justify-between gap-8">
            <div>
              <p className="eyebrow">Sleeping Quarters & Beyond</p>
              <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">
                Every corner, considered.
              </h2>
            </div>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {items.map((it, i) => (
            <Reveal key={it.label} delay={i * 100}>
              <figure className="group relative aspect-[4/5] overflow-hidden">
                <img
                  src={it.src}
                  alt={it.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
                <figcaption className="absolute bottom-0 left-0 flex items-center gap-3 bg-cream px-5 py-3">
                  <span className="h-px w-8 bg-gold" />
                  <span className="text-[10px] uppercase tracking-[0.24em] text-ink">
                    {it.label}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Amenities() {
  return (
    <section id="amenities" className="bg-cream px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Amenities</p>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">
              Everything you need for a relaxed stay.
            </h2>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-x-8 gap-y-10 border-t border-border pt-16 sm:grid-cols-2 lg:grid-cols-4">
          {amenities.map((a, i) => (
            <Reveal key={a.title} delay={i * 60}>
              <div className="border-l border-gold pl-5">
                <h3 className="font-display text-xl text-ink">{a.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{a.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={400}>
          <div className="mt-16 flex flex-wrap items-center gap-x-12 gap-y-4 border-t border-border pt-8 text-xs uppercase tracking-[0.22em] text-ink">
            <span>Check-in from 2:00pm</span>
            <span className="h-px w-8 bg-gold" />
            <span>Check-out by 10:00am</span>
            <span className="h-px w-8 bg-gold" />
            <span>Entry via digital keypad</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Location() {
  return (
    <section id="location" className="relative overflow-hidden bg-ink px-6 py-24 text-cream lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <p className="eyebrow text-gold">Location</p>
              <h2 className="mt-4 font-display text-4xl md:text-5xl">
                1 Vulcan Lane, Ahuriri.
              </h2>
              <p className="mt-6 max-w-lg text-base leading-relaxed text-cream/70 md:text-lg">
                A quiet street a short walk from Ahuriri's waterfront village — a
                cluster of restaurants, cafés, and the harbour. Napier's Marine
                Parade and Art Deco quarter are an easy stroll away.
              </p>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="aspect-video overflow-hidden border border-cream/10">
              <iframe
                title="Map of 1 Vulcan Lane, Ahuriri"
                src="https://www.google.com/maps?q=1+Vulcan+Lane,+Ahuriri,+Napier&output=embed"
                className="h-full w-full grayscale-[0.4]"
                loading="lazy"
              />
            </div>
          </Reveal>
        </div>

        <div className="mt-20 border-t border-cream/10 pt-10">
          <p className="eyebrow text-gold">As seen nearby</p>
          <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
            {nearby.map((n) => (
              <div key={n.name} className="flex items-baseline gap-3">
                <span className="font-display text-lg text-cream">{n.name}</span>
                <span className="text-xs uppercase tracking-[0.2em] text-gold">{n.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Hosts() {
  return (
    <section id="hosts" className="bg-cream px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto grid max-w-7xl gap-16 lg:grid-cols-5 lg:items-center">
        <Reveal className="lg:col-span-2">
          <div className="relative aspect-[3/4] overflow-hidden">
            <img
              src={cowImg}
              alt="Highland cow portrait — a signature piece from Leah & Wayne's collection"
              loading="lazy"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-cream/95 px-5 py-3">
              <span className="text-[10px] uppercase tracking-[0.24em] text-ink">
                From Leah & Wayne's collection
              </span>
            </div>
          </div>
        </Reveal>
        <Reveal delay={200} className="lg:col-span-3">
          <div>
            <p className="eyebrow">Meet your hosts</p>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">Leah & Wayne.</h2>
            <p className="mt-8 text-base leading-relaxed text-muted-foreground md:text-lg">
              We're Leah and Wayne — we've spent years travelling the world and
              staying in other people's homes, and now we love doing the same for
              guests in ours.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
              The Vulcan is our own slice of Ahuriri: five minutes from the beach,
              walking distance to our favourite local restaurants, and set up
              exactly how we'd want to stay ourselves. We're usually just upstairs
              if you need anything, and always happy to point you toward the best
              flat white in town.
            </p>
            <blockquote className="mt-10 border-l-2 border-gold pl-6 font-display text-2xl italic leading-snug text-saddle md:text-3xl">
              "We host the way we like to be hosted — quietly, warmly,
              and out of the way unless you need us."
            </blockquote>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ReviewsSection() {
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
    <section id="reviews" className="bg-putty/40 px-6 py-24 lg:px-10 lg:py-32">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="max-w-2xl">
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-4 font-display text-4xl text-ink md:text-5xl">
              What guests say.
            </h2>
          </div>
        </Reveal>
        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.id} delay={i * 80}>
              <figure className="flex h-full flex-col justify-between bg-cream p-8">
                <div>
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <span key={k}>★</span>
                    ))}
                  </div>
                  <blockquote className="mt-6 font-display text-xl leading-snug text-ink">
                    "{r.body}"
                  </blockquote>
                </div>
                <figcaption className="mt-8 text-xs uppercase tracking-[0.22em] text-saddle">
                  — {r.author_name}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function BookingCTA() {
  return (
    <section
      className="relative overflow-hidden bg-cover bg-center px-6 py-32 lg:px-10 lg:py-48"
      style={{ backgroundImage: `url(${gardenImg})` }}
    >
      <div className="absolute inset-0 bg-ink/60" />
      <div className="relative mx-auto max-w-3xl text-center text-cream">
        <Reveal>
          <p className="eyebrow text-gold">Ready when you are</p>
        </Reveal>
        <Reveal delay={200}>
          <h2 className="mt-6 font-display text-4xl md:text-6xl">
            Come and stay with us.
          </h2>
        </Reveal>
        <Reveal delay={400}>
          <p className="mx-auto mt-6 max-w-xl text-lg text-cream/85">
            From NZ$220/night. Two bedrooms, sleeps four. Free parking, walking
            distance to everything.
          </p>
        </Reveal>
        <Reveal delay={600}>
          <div className="mt-10">
            <Link
              to="/book"
              className="inline-flex items-center gap-3 border border-gold bg-gold px-10 py-4 text-xs uppercase tracking-[0.24em] text-ink transition-all hover:scale-[1.03] hover:bg-cream hover:border-cream"
            >
              Check Availability & Book →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

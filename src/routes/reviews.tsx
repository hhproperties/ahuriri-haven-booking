import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Testimonial } from "@/components/Testimonial";
import heroImg from "@/assets/hero-exterior.jpg";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Guest Reviews — The Vulcan, Ahuriri" },
      { name: "description", content: "Read what guests say about their stay at The Vulcan, Ahuriri — a boutique 2-bedroom retreat in Napier's harbourside village." },
      { property: "og:title", content: "Guest Reviews — The Vulcan, Ahuriri" },
      { property: "og:description", content: "Read genuine guest reviews of The Vulcan, Ahuriri — a 2-bedroom boutique retreat in Ahuriri, Napier." },
      { property: "og:image", content: heroImg },
    ],
  }),
});

/* ── Testimonials data ── */
const testimonials = [
  {
    quote: "The kind of place where you actually want to come home to after a day out — clean, comfortable, and close enough to everything that we barely used the car after Leah showed us the walkway straight through to the beach.",
    author: "Olivia K.",
    accent: "home",
  },
  {
    quote: "You genuinely don't need a car here — five minutes to the beach, five minutes the other way to dinner. The apartment was spotless when we walked in, not a thing out of place.",
    author: "Hayley B.",
    accent: "spotless",
  },
  {
    quote: "We messaged Leah the morning of, asking if we could check in three hours early. She said yes without a second thought. That kind of flexibility is rare.",
    author: "Ashleigh C.",
    accent: "flexibility",
  },
  {
    quote: "Walked to a different restaurant every night of our stay and never once needed to think about parking or a sober driver. The location is honestly the whole trip.",
    author: "Grant H.",
    accent: "location",
  },
  {
    quote: "Came back from a long day at the beach expecting to tidy up before bed and there was nothing to do — the place was immaculate the whole stay, not just on arrival.",
    author: "Michelle R.",
    accent: "immaculate",
  },
  {
    quote: "Wayne let us drop our bags off well before check-in when our flight landed early. Small thing, but it set the tone for the whole stay.",
    author: "Daniel P.",
    accent: "tone",
  },
  {
    quote: "Cleanest self-contained unit we've stayed in, full stop. And you can see the beach from the end of the street — didn't expect to be that close.",
    author: "Sarah M.",
    accent: "Cleanest",
  },
  {
    quote: "Booked with about two days' notice for a last-minute weekend away and Leah couldn't have made it easier. Everything was ready, spotless, exactly as described.",
    author: "Marcus W.",
    accent: "easier",
  },
];

function ReviewsPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /* Scroll-based offset for the two-column grid right column */
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const mq = window.matchMedia("(min-width: 768px)");
    const applyOffset = () => {
      grid.style.setProperty("--col-offset", mq.matches ? "72px" : "0px");
    };
    applyOffset();
    mq.addEventListener("change", applyOffset);
    return () => mq.removeEventListener("change", applyOffset);
  }, []);

  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />

      {/* ── Hero (matte band) ── */}
      <section className="relative min-h-[30vh] min-h-half-screen-safe overflow-hidden bg-[#17181A]">
        <div className="absolute inset-0 ken-burns">
          <img src={heroImg} alt="The Vulcan, Ahuriri" className="h-full w-full object-cover hero-image-grade" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#17181A]/80 via-[#17181A]/30 to-transparent" />
        <div className="absolute inset-0 warm-veil" />
        <div className="relative z-10 mx-auto flex h-full min-h-[30vh] min-h-half-screen-safe max-w-7xl flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">In their words</p>
          <h1 className="mt-2 sm:mt-3 font-[Fraunces] text-[clamp(2rem,6vw,5rem)] leading-[0.95] text-[#EFE8DA] tracking-[-0.02em] text-shadow-overlay">
            What guests{" "}
            <span className="word-wood-light">say.</span>
          </h1>
        </div>
      </section>

      {/* ── Hero pull-quote (cream band) ── */}
      <section className="bg-[#EFE8DA] px-5 pt-16 pb-10 sm:px-8 sm:pt-28 sm:pb-16 lg:px-10 lg:pt-36 lg:pb-20" ref={heroRef}>
        <div className="mx-auto max-w-7xl flex justify-center">
          <Testimonial
            quote={testimonials[0].quote}
            author={testimonials[0].author}
            accent={testimonials[0].accent}
            layout="hero"
            delay={0}
          />
        </div>
      </section>

      {/* ── Wood divider ── */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="wood-divider" />
      </div>

      {/* ── Editorial two-column grid (cream band) ── */}
      <section className="bg-[#EFE8DA] px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10 lg:pb-36">
        <div
          ref={gridRef}
          className="mx-auto max-w-7xl grid gap-x-12 md:gap-x-16 gap-y-10 sm:gap-y-16 md:grid-cols-2"
          style={{ gridAutoRows: "auto" }}
        >
          {testimonials.slice(1).map((t, i) => {
            const isEven = i % 2 === 1;
            return (
              <div
                key={t.author}
                className={isEven ? "md:mt-[var(--col-offset,0px)]" : ""}
              >
                <Testimonial
                  quote={t.quote}
                  author={t.author}
                  accent={t.accent}
                  layout="column"
                  delay={(i + 1) * 120}
                />
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Matte CTA band ── */}
      <section className="bg-[#17181A] px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">Come see for yourself</p>
          <h2 className="mt-3 sm:mt-4 font-[Fraunces] text-[clamp(1.6rem,4vw,3.5rem)] leading-[1.05] text-[#EFE8DA] tracking-[-0.02em]">
            Ready to{" "}
            <span className="word-wood-light">experience</span> it?
          </h2>
          <div className="mt-6 sm:mt-10">
            <Link to="/book" className="btn-outline-light text-xs group tap-target inline-flex items-center">
              Check Availability <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

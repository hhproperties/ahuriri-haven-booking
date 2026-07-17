import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";
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

function ReviewsPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
  });

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />

      {/* Hero */}
      <section className="relative h-[40vh] min-h-[320px] overflow-hidden bg-[#17181A]">
        <div className="absolute inset-0 ken-burns">
          <img src={heroImg} alt="The Vulcan, Ahuriri" className="h-full w-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#17181A]/70 via-[#17181A]/20 to-transparent" />
        <div className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-14 lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">Reviews</p>
          <h1 className="mt-3 font-[Fraunces] text-[clamp(2.5rem,6vw,5rem)] leading-[0.95] text-[#EFE8DA] tracking-[-0.02em]">
            What guests{" "}
            <span className="word-wood-light">say.</span>
          </h1>
        </div>
      </section>

      {/* Cream band */}
      <section className="bg-[#EFE8DA] px-6 py-24 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Rating summary */}
          <div className="flex flex-wrap items-baseline gap-6 mb-16">
            <span className="font-[Fraunces] text-6xl font-[300] italic text-[#6B4630]">{avgRating}</span>
            <div className="flex gap-1 text-[#6B4630] text-lg">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s}>{Math.round(Number(avgRating)) >= s ? "★" : "☆"}</span>
              ))}
            </div>
            <span className="text-sm font-[Archivo] text-[#17181A]/50">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="wood-divider mb-16" />

          {/* Review cards */}
          {reviews.length === 0 && (
            <p className="text-sm font-[Archivo] text-[#17181A]/50 italic">Reviews loading from the database...</p>
          )}
          <div className="grid gap-8 md:grid-cols-2">
            {reviews.map((r: any, i: number) => (
              <figure key={r.id} className={`reveal-up reveal-stagger-${Math.min(i + 1, 4)} border border-[#6B4630]/10 bg-white/60 p-10 flex flex-col justify-between`}>
                <div>
                  <div className="flex gap-1 text-[#6B4630] text-sm mb-4">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <span key={k}>★</span>
                    ))}
                  </div>
                  <blockquote className="font-[Fraunces] text-lg leading-snug text-[#17181A]">
                    "{r.body}"
                  </blockquote>
                </div>
                <figcaption className="mt-8 flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-[0.22em] font-[Archivo] text-[#6B4630]">
                    — {r.author_name}
                  </span>
                  {r.stay_date && (
                    <span className="text-[10px] font-[Archivo] text-[#17181A]/40">
                      {new Date(r.stay_date).toLocaleDateString("en-NZ", { month: "short", year: "numeric" })}
                    </span>
                  )}
                </figcaption>
              </figure>
            ))}
          </div>

          {/* CTA */}
          <div className="wood-divider my-20" />
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630]">Come see for yourself</p>
            <h2 className="mt-4 font-[Fraunces] text-[clamp(2rem,4vw,3.5rem)] leading-[1.05] text-[#17181A] tracking-[-0.02em]">
              Ready to{" "}
              <span className="word-wood">experience</span> it?
            </h2>
            <div className="mt-8">
              <Link to="/book" className="btn-outline text-xs group">
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

import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BlogHeader } from "@/components/blog-header";
import { BlogBody, ImageHeader } from "@/components/blog/content";
import { Reveal, WoodDivider } from "@/components/blog/motion";
import type { JournalPost } from "@/components/blog/types";
import { supabase } from "@/integrations/supabase/client";

// ── Static image map ──

import imgRestaurant from "@/assets/blog-restaurant.jpg";
import imgWeekend from "@/assets/blog-weekend.jpg";
import imgFamily from "@/assets/blog-family.jpg";
import imgGirls from "@/assets/blog-girls.jpg";
import imgArtDeco from "@/assets/blog-art-deco.jpg";
import imgKids from "@/assets/blog-kids.jpg";
import imgCoffee from "@/assets/blog-coffee.jpg";
import imgCycling from "@/assets/blog-cycling.jpg";
import imgWine from "@/assets/blog-wine.jpg";

const heroImages: Record<string, { src: string; alt: string }> = {
  "where-to-eat-in-ahuriri": { src: imgRestaurant, alt: "Waterfront restaurant in Ahuriri, Napier" },
  "weekend-in-hawkes-bay": { src: imgWeekend, alt: "Vineyard landscape at sunset in Hawke's Bay" },
  "family-friendly-hawkes-bay": { src: imgFamily, alt: "Family walking along a sandy beach in Hawke's Bay" },
  "girls-getaway-ahuriri": { src: imgGirls, alt: "Women toasting wine glasses at a waterfront table" },
  "art-deco-napier-walking-tour": { src: imgArtDeco, alt: "Art Deco building facades in Napier city centre" },
  "what-to-do-with-kids-hawkes-bay": { src: imgKids, alt: "Children playing on a sandy beach" },
  "best-coffee-in-ahuriri": { src: imgCoffee, alt: "Coffee cups on a wooden table at a waterfront café" },
  "cycling-hawkes-bay-trails": { src: imgCycling, alt: "Cyclists riding the coastal cycle trail in Hawke's Bay" },
  "hawkes-bay-wine-country-guide": { src: imgWine, alt: "Vineyard landscape in Hawke's Bay wine country" },
};

const eyebrowMap: Record<string, string> = {
  "where-to-eat-in-ahuriri": "ISSUE 001 · DINING",
  "weekend-in-hawkes-bay": "ISSUE 002 · WEEKENDS",
  "family-friendly-hawkes-bay": "ISSUE 003 · FAMILY",
  "girls-getaway-ahuriri": "ISSUE 004 · GIRLS' GETAWAY",
  "art-deco-napier-walking-tour": "ISSUE 005 · ARCHITECTURE",
  "what-to-do-with-kids-hawkes-bay": "ISSUE 006 · FAMILY",
  "best-coffee-in-ahuriri": "ISSUE 007 · FOOD & DRINK",
  "cycling-hawkes-bay-trails": "ISSUE 008 · ACTIVE",
  "hawkes-bay-wine-country-guide": "ISSUE 009 · WINE",
};

const creditMap: Record<string, string> = {
  "where-to-eat-in-ahuriri": "PHOTOGRAPHED ON LOCATION · AHURIRI WATERFRONT",
  "weekend-in-hawkes-bay": "PHOTOGRAPHED ON LOCATION · HAWKE'S BAY",
  "family-friendly-hawkes-bay": "PHOTOGRAPHED ON LOCATION · AHURIRI BEACH",
  "girls-getaway-ahuriri": "PHOTOGRAPHED ON LOCATION · AHURIRI WATERFRONT",
  "art-deco-napier-walking-tour": "PHOTOGRAPHED ON LOCATION · NAPIER CBD",
  "what-to-do-with-kids-hawkes-bay": "PHOTOGRAPHED ON LOCATION · AHURIRI BEACH",
  "best-coffee-in-ahuriri": "PHOTOGRAPHED ON LOCATION · AHURIRI VILLAGE",
  "cycling-hawkes-bay-trails": "PHOTOGRAPHED ON LOCATION · HAWKE'S BAY TRAILS",
  "hawkes-bay-wine-country-guide": "PHOTOGRAPHED ON LOCATION · HAWKE'S BAY",
};

const fallbackHero = { src: imgRestaurant, alt: "Ahuriri waterfront" };

// ── Accent word map ──

const accentWordMap: Record<string, string> = {
  "where-to-eat-in-ahuriri": "Restaurant",
  "weekend-in-hawkes-bay": "Weekend",
  "family-friendly-hawkes-bay": "Family-Friendly",
  "girls-getaway-ahuriri": "Girls'",
  "art-deco-napier-walking-tour": "Art Deco",
  "what-to-do-with-kids-hawkes-bay": "Kids",
  "best-coffee-in-ahuriri": "Coffee",
  "cycling-hawkes-bay-trails": "Cycling",
  "hawkes-bay-wine-country-guide": "Wine",
};

// ── Route ──

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — The Vulcan, Ahuriri` },
    ],
  }),
});

function BlogPost() {
  const { slug } = Route.useParams();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      return data as JournalPost | null;
    },
  });

  if (!isLoading && !post) throw notFound();

  const hero = heroImages[slug] ?? fallbackHero;
  const eyebrow = eyebrowMap[slug] ?? "ISSUE · BLOG";
  const credit = creditMap[slug];
  const variant = post?.variant ?? 1;
  const accentWord = accentWordMap[slug] ?? "";

  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />

      {/* ── Header per variant ── */}

      {/* Variant 9 — Statement Opener: no image, full-viewport matte band */}
      {variant === 9 && (
        <section className="relative min-h-screen flex items-center bg-[#17181A] px-5 sm:px-8 lg:px-10 pt-24 sm:pt-28 lg:pt-32 pb-16 sm:pb-20">
          <div className="mx-auto max-w-3xl w-full">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">{eyebrow}</p>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="mt-3 sm:mt-4 font-[Fraunces] text-[clamp(2.2rem,7vw,6rem)] leading-[1.05] text-[#BD8A5E] tracking-[-0.02em] text-wrap-balance text-shadow-overlay">
                {accentWord && post?.title?.includes(accentWord)
                  ? post.title.split(accentWord).map((part: string, i: number, arr: string[]) => (
                      <span key={i}>{part}{i < arr.length - 1 ? <span className="word-wood">{accentWord}</span> : ""}</span>
                    ))
                  : post?.title}
              </h1>
            </Reveal>
            {post?.excerpt && (
              <Reveal delay={200}>
                <p className="mt-4 sm:mt-6 font-[Fraunces] text-lg sm:text-xl italic leading-relaxed text-cream/70 max-w-[52ch]">
                  {post.excerpt}
                </p>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* Variant 2 — Split Hero */}
      {variant === 2 && (
        <div className="min-h-screen flex flex-col lg:flex-row lg:min-h-[70vh]">
          {/* Left: title + standfirst */}
          <div className="flex items-center bg-[#EFE8DA] px-5 sm:px-8 lg:px-10 pt-28 lg:pt-0 pb-10 lg:pb-0 lg:w-1/2">
            <div className="max-w-lg">
              <Reveal>
                <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">{eyebrow}</p>
              </Reveal>
              <Reveal delay={100}>
                <h1 className="mt-3 sm:mt-4 font-[Fraunces] text-[clamp(1.8rem,5vw,4rem)] leading-[1.05] text-[#17181A] tracking-[-0.02em] text-wrap-balance">
                  {accentWord && post?.title?.includes(accentWord)
                    ? post.title.split(accentWord).map((part: string, i: number, arr: string[]) => (
                        <span key={i}>{part}{i < arr.length - 1 ? <span className="word-wood">{accentWord}</span> : ""}</span>
                      ))
                    : post?.title}
                </h1>
              </Reveal>
              {post?.excerpt && (
                <Reveal delay={200}>
                  <p className="mt-4 sm:mt-6 font-[Fraunces] text-lg sm:text-xl italic leading-relaxed text-[#17181A]/70 max-w-[52ch]">
                    {post.excerpt}
                  </p>
                </Reveal>
              )}
            </div>
          </div>
          {/* Right: image pinned */}
          <div className="lg:w-1/2 lg:min-h-[70vh] overflow-hidden relative">
            <div className="absolute inset-0 hero-image-grade">
              <img
                src={hero.src}
                alt={hero.alt}
                className="h-full w-full object-cover"
                style={{
                  animation: "ken-burns 20s ease-in-out infinite",
                }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#17181A]/30 to-transparent" />
            <div className="absolute inset-0 warm-veil" />
            {/* Photo credit tab */}
            {credit && (
              <div className="absolute bottom-0 left-0 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] text-cream bg-[#6B4630]">
                {credit}
              </div>
            )}
          </div>
        </div>
      )}

      {/* V3 uses ImageHeader (Framed Portrait) */}
      {variant === 3 && (
        <ImageHeader
          src={hero.src}
          alt={hero.alt}
          variant={3}
          title={(post?.title ?? "")}
          accentWord={accentWord}
          standfirst={post?.excerpt ?? ""}
          credit={credit}
        />
      )}

      {/* V6 uses ImageHeader (Field Notes) */}
      {variant === 6 && (
        <ImageHeader
          src={hero.src}
          alt={hero.alt}
          variant={6}
          title={(post?.title ?? "")}
          accentWord={accentWord}
          standfirst={post?.excerpt ?? ""}
          credit={credit}
        />
      )}

      {/* V8 uses ImageHeader (Postcard) */}
      {variant === 8 && (
        <ImageHeader
          src={hero.src}
          alt={hero.alt}
          variant={8}
          title={(post?.title ?? "")}
          accentWord={accentWord}
          standfirst={post?.excerpt ?? ""}
          credit={credit}
        />
      )}

      {/* Variant 4 — Overline Slab (BlogHeader but 70vh) */}
      {variant === 4 && (
        <BlogHeader
          src={hero.src}
          alt={hero.alt}
          eyebrow={eyebrow}
          title={post?.title ?? "Loading..."}
          credit={credit}
        />
      )}

      {/* Variant 1, 5, 7 — standard BlogHeader */}
      {([1, 5, 7].includes(variant) && variant !== 4) && (
        <BlogHeader
          src={hero.src}
          alt={hero.alt}
          eyebrow={eyebrow}
          title={post?.title ?? "Loading..."}
          credit={credit}
        />
      )}

      {/* ── Body content ── */}

      {post && (
        <>
          {/* Back link */}
          <div className="pt-10 sm:pt-14 lg:pt-16">
            <div className={`mx-auto ${[3, 6, 8].includes(variant) ? "max-w-3xl" : "max-w-[65ch]"} px-5 sm:px-6 lg:px-10`}>
              <Reveal delay={50}>
                <Link to="/blog" className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630] wood-underline inline-flex items-center tap-target">
                  ← Back to Blog
                </Link>
              </Reveal>
            </div>
          </div>

          {/* BlogBody handles all variant-specific body rendering */}
          <BlogBody
            rawBody={post.body}
            variant={variant}
            post={post}
            accentWord={accentWord}
          />

          {/* Variant 9 — delayed hero image after first body block */}
          {variant === 9 && (
            <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-10 pb-10 sm:pb-14">
              <Reveal delay={300}>
                <div className="relative overflow-hidden aspect-[16/9] hero-image-grade">
                  <img
                    src={hero.src}
                    alt={hero.alt}
                    className="h-full w-full object-cover"
                    style={{
                      animation: "ken-burns 20s ease-in-out infinite",
                    }}
                  />
                </div>
                <div className="absolute inset-0 warm-veil" />
                {credit && (
                  <p className="mt-2 font-[Fraunces] italic text-sm text-[#6B4630]/60 text-right">{credit}</p>
                )}
              </Reveal>
            </div>
          )}

          {/* CTA section */}
          <div className="mx-auto max-w-[65ch] px-5 sm:px-6 lg:px-10 pb-16 sm:pb-20 lg:pb-24">
            <Reveal delay={500}>
              <WoodDivider />
              <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
                Stay with us
              </p>
              <p className="mt-3 sm:mt-4 font-[Fraunces] text-xl sm:text-2xl lg:text-3xl text-[#17181A] tracking-[-0.02em]">
                Book The Vulcan, Ahuriri.
              </p>
              <Link
                to="/book"
                className="mt-5 sm:mt-6 inline-flex items-center border border-[#17181A] bg-[#17181A] px-6 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#EFE8DA] hover:bg-[#6B4630] hover:border-[#6B4630] transition-colors duration-400 tap-target"
              >
                Check availability →
              </Link>
            </Reveal>
          </div>
        </>
      )}

      <SiteFooter />
    </div>
  );
}

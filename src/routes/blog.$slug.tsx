import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { BlogHeader } from "@/components/blog-header";
import { BlogBody } from "@/components/blog/content";
import { Reveal, WoodDivider } from "@/components/blog/motion";
import type { JournalPost } from "@/components/blog/types";
import { supabase } from "@/integrations/supabase/client";

// ── Hero image map ──

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

const fallbackHero = { src: imgRestaurant, alt: "Ahuriri waterfront" };

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

// ── Supporting imagery (inserted partway through the body) ──

import imgAhuririCoffee from "@/assets/ahuriri-coffee.jpg";
import imgAhuririDining from "@/assets/ahuriri-dining.jpg";
import imgAhuririWaterfront from "@/assets/ahuriri-waterfront.jpg";
import imgPatioDining from "@/assets/patio-dining.jpg";
import imgPathway from "@/assets/pathway.jpg";

const supportingImages: Record<string, { src: string; alt: string; caption: string }> = {
  "where-to-eat-in-ahuriri": { src: imgAhuririDining, alt: "Waterfront dining in Ahuriri", caption: "Dinner by the water · Ahuriri" },
  "weekend-in-hawkes-bay": { src: imgAhuririWaterfront, alt: "The Ahuriri waterfront", caption: "The Ahuriri waterfront" },
  "family-friendly-hawkes-bay": { src: imgAhuririWaterfront, alt: "Calm water at Ahuriri Beach", caption: "Ahuriri Beach" },
  "girls-getaway-ahuriri": { src: imgPatioDining, alt: "Outdoor dining at The Vulcan", caption: "Evening on the patio" },
  "art-deco-napier-walking-tour": { src: imgAhuririWaterfront, alt: "Looking across to Napier's waterfront", caption: "A short drive from Napier's Art Deco quarter" },
  "what-to-do-with-kids-hawkes-bay": { src: imgAhuririWaterfront, alt: "Ahuriri Beach", caption: "Ahuriri Beach" },
  "best-coffee-in-ahuriri": { src: imgAhuririCoffee, alt: "Morning coffee in Ahuriri", caption: "Morning coffee · Ahuriri" },
  "cycling-hawkes-bay-trails": { src: imgPathway, alt: "The coastal pathway from Ahuriri", caption: "The pathway from Ahuriri" },
  "hawkes-bay-wine-country-guide": { src: imgPatioDining, alt: "A long lunch on the patio", caption: "The long-lunch life" },
};

// ── Helpers ──

function readTimeMinutes(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function formatPublishDate(iso: string | null | undefined): string {
  const d = iso ? new Date(iso) : new Date();
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-NZ", { day: "numeric", month: "long", year: "numeric" });
}

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

  const { data: allPosts = [] } = useQuery({
    queryKey: ["blog_posts_related"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("slug, title, excerpt")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return (data ?? []) as { slug: string; title: string; excerpt: string | null }[];
    },
  });

  if (!isLoading && !post) throw notFound();

  const hero = heroImages[slug] ?? fallbackHero;
  const eyebrow = eyebrowMap[slug] ?? "ISSUE · BLOG";
  const supporting = supportingImages[slug];
  const related = allPosts.filter((p) => p.slug !== slug).slice(0, 3);
  const dateStr = post ? formatPublishDate(post.published_at ?? post.created_at) : "";
  const readTime = post ? readTimeMinutes(post.body) : 1;

  return (
    <>
      <BlogHeader src={hero.src} alt={hero.alt} eyebrow={eyebrow} title={post?.title ?? ""} credit={undefined} />

      {/* Back link */}
      <div className="bg-[#EFE8DA] pt-8 sm:pt-10">
        <div className="mx-auto max-w-[45rem] px-6 sm:px-8">
          <Link
            to="/blog"
            className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630] tap-target"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1" aria-hidden="true">←</span>
            <span className="wood-underline">Back to Blog</span>
          </Link>
        </div>
      </div>

      {/* Byline / meta row */}
      {post && (
        <div className="bg-[#EFE8DA] pt-6 sm:pt-8">
          <div className="mx-auto max-w-[45rem] px-6 sm:px-8">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] sm:text-xs uppercase tracking-[0.14em] font-[Archivo] text-[#17181A]/60">
              <span>Written by Leah &amp; Wayne</span>
              {dateStr && (
                <>
                  <span className="text-[#B9985A]" aria-hidden="true">·</span>
                  <span>{dateStr}</span>
                </>
              )}
              <span className="text-[#B9985A]" aria-hidden="true">·</span>
              <span>{readTime} min read</span>
            </div>
            <WoodDivider className="mt-6 sm:mt-8" />
          </div>
        </div>
      )}

      {/* Body */}
      {post && (
        <BlogBody rawBody={post.body} excerpt={post.excerpt} supportingImage={supporting} />
      )}

      {/* Continue reading */}
      {related.length > 0 && (
        <section className="bg-[#EFE8DA] pb-20 sm:pb-24">
          <div className="mx-auto max-w-[45rem] px-6 sm:px-8">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
                Continue reading
              </p>
            </Reveal>
            <div className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 sm:grid-cols-3">
              {related.map((p) => (
                <Reveal key={p.slug}>
                  <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                    <div className="aspect-[4/3] w-full overflow-hidden bg-[#E8E0D0]">
                      <img
                        src={heroImages[p.slug]?.src ?? fallbackHero.src}
                        alt={p.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ filter: "saturate(0.92) contrast(1.05) sepia(0.08) brightness(0.96)" }}
                      />
                    </div>
                    <h3 className="mt-3 font-[Fraunces] text-base sm:text-lg leading-tight text-[#17181A] transition-colors group-hover:text-[#6B4630]">
                      {p.title}
                    </h3>
                    {p.excerpt && (
                      <p className="mt-1.5 text-xs leading-relaxed text-[#17181A]/60 line-clamp-2">{p.excerpt}</p>
                    )}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      {post && (
        <section className="bg-[#17181A] px-6 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
              Stay with us
            </p>
            <h2 className="mt-3 font-[Fraunces] text-2xl sm:text-3xl lg:text-4xl text-[#EFE8DA] tracking-[-0.02em]">
              Book The Vulcan, Ahuriri.
            </h2>
            <Link
              to="/book"
              className="mt-6 inline-flex items-center gap-3 border border-[#B9985A] bg-[#B9985A] px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-[#17181A] hover:bg-[#a8824a] transition-colors tap-target"
            >
              Check availability →
            </Link>
          </div>
        </section>
      )}
    </>
  );
}

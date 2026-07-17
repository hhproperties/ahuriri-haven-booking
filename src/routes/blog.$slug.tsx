import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { BlogHeader } from "@/components/blog-header";
import { supabase } from "@/integrations/supabase/client";

// Per-slug photo mapping — imported statically so Vite hashes them
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
  "where-to-eat-in-ahuriri": {
    src: imgRestaurant,
    alt: "Waterfront restaurant in Ahuriri, Napier",
  },
  "weekend-in-hawkes-bay": {
    src: imgWeekend,
    alt: "Vineyard landscape at sunset in Hawke's Bay",
  },
  "family-friendly-hawkes-bay": {
    src: imgFamily,
    alt: "Family walking along a sandy beach in Hawke's Bay",
  },
  "girls-getaway-ahuriri": {
    src: imgGirls,
    alt: "Women toasting wine glasses at a waterfront table",
  },
  "art-deco-napier-walking-tour": {
    src: imgArtDeco,
    alt: "Art Deco building facades in Napier city centre",
  },
  "what-to-do-with-kids-hawkes-bay": {
    src: imgKids,
    alt: "Children playing on a sandy beach",
  },
  "best-coffee-in-ahuriri": {
    src: imgCoffee,
    alt: "Coffee cups on a wooden table at a waterfront café",
  },
  "cycling-hawkes-bay-trails": {
    src: imgCycling,
    alt: "Cyclists riding the coastal cycle trail in Hawke's Bay",
  },
  "hawkes-bay-wine-country-guide": {
    src: imgWine,
    alt: "Vineyard landscape in Hawke's Bay wine country",
  },
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

export const Route = createFileRoute("/blog/$slug")({
  component: BlogPost,
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
      return data;
    },
  });

  if (!isLoading && !post) throw notFound();

  const hero = heroImages[slug] ?? fallbackHero;
  const eyebrow = eyebrowMap[slug] ?? "ISSUE · BLOG";
  const credit = creditMap[slug];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* Editorial header */}
      <BlogHeader
        src={hero.src}
        alt={hero.alt}
        eyebrow={eyebrow}
        title={post?.title ?? "Loading..."}
        credit={credit}
      />

      {/* Body */}
      <article className="bg-cream pb-24 pt-20">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          {/* Back link */}
          <Link to="/blog" className="eyebrow wood-underline text-saddle">
            ← Back to Blog
          </Link>

          {post && (
            <>
              {/* Excerpt as pull quote */}
              {post.excerpt && (
                <p className="mt-10 border-l-2 border-gold pl-6 font-display text-xl italic leading-snug text-saddle md:text-2xl">
                  {post.excerpt}
                </p>
              )}

              {/* Body content */}
              <div className="prose mt-12 max-w-none font-sans text-base leading-[1.8] text-ink">
                {post.body.split("\n\n").map((para, i) => {
                  if (para.startsWith("## ")) return <h2 key={i} className="mt-12 font-display text-3xl text-ink">{para.slice(3)}</h2>;
                  if (para.startsWith("### ")) return <h3 key={i} className="mt-10 font-display text-2xl text-ink">{para.slice(4)}</h3>;
                  if (para.startsWith("- ") || para.startsWith("* ")) {
                    return (
                      <ul key={i} className="my-6 space-y-2 pl-5 list-disc marker:text-gold">
                        {para.split("\n").map((li, k) => (
                          <li key={k}>{li.replace(/^[-*]\s*/, "").replace(/\*\*(.+?)\*\*/g, "$1")}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (/^\d+\./.test(para)) {
                    return (
                      <ol key={i} className="my-6 space-y-2 pl-5 list-decimal marker:text-gold">
                        {para.split("\n").map((li, k) => (
                          <li key={k}>{li.replace(/^\d+\.\s*/, "")}</li>
                        ))}
                      </ol>
                    );
                  }
                  return <p key={i} className="my-6">{para}</p>;
                })}
              </div>

              {/* CTA */}
              <div className="mt-20 border-t border-border pt-10">
                <p className="eyebrow">Stay with us</p>
                <p className="mt-4 font-display text-3xl text-ink">Book The Vulcan, Ahuriri.</p>
                <Link
                  to="/book"
                  className="mt-6 inline-flex border border-ink bg-ink px-8 py-4 text-xs uppercase tracking-[0.24em] text-cream hover:bg-saddle"
                >
                  Check availability →
                </Link>
              </div>
            </>
          )}
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}

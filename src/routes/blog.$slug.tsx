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
    <div className="min-h-screen bg-[#EFE8DA]">
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
      <article className="bg-[#EFE8DA] pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-20">
        <div className="mx-auto max-w-3xl px-5 sm:px-6 lg:px-10">
          {/* Back link */}
          <Link to="/blog" className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630] wood-underline inline-flex items-center tap-target">
            ← Back to Blog
          </Link>

          {post && (
            <>
              {/* Excerpt as pull quote */}
              {post.excerpt && (
                <p className="mt-6 sm:mt-10 border-l-2 border-[#6B4630] pl-4 sm:pl-6 font-[Fraunces] text-lg sm:text-xl lg:text-2xl italic leading-snug text-[#6B4630]">
                  {post.excerpt}
                </p>
              )}

              {/* Body content */}
              <div className="mt-8 sm:mt-12 font-[Archivo] text-sm sm:text-base leading-relaxed sm:leading-[1.8] text-[#17181A] space-y-5 sm:space-y-6">
                {post.body.split("\n\n").map((para, i) => {
                  if (para.startsWith("## ")) return <h2 key={i} className="mt-8 sm:mt-12 font-[Fraunces] text-xl sm:text-2xl lg:text-3xl text-[#17181A] tracking-[-0.02em]">{para.slice(3)}</h2>;
                  if (para.startsWith("### ")) return <h3 key={i} className="mt-6 sm:mt-10 font-[Fraunces] text-lg sm:text-xl lg:text-2xl text-[#17181A] tracking-[-0.02em]">{para.slice(4)}</h3>;
                  if (para.startsWith("- ") || para.startsWith("* ")) {
                    return (
                      <ul key={i} className="my-4 sm:my-6 space-y-1.5 sm:space-y-2 pl-4 sm:pl-5 list-disc">
                        {para.split("\n").map((li, k) => (
                          <li key={k} className="text-[#6B4630] marker:text-[#6B4630]">{li.replace(/^[-*]\s*/, "").replace(/\*\*(.+?)\*\*/g, "$1")}</li>
                        ))}
                      </ul>
                    );
                  }
                  if (/^\d+\./.test(para)) {
                    return (
                      <ol key={i} className="my-4 sm:my-6 space-y-1.5 sm:space-y-2 pl-4 sm:pl-5 list-decimal">
                        {para.split("\n").map((li, k) => (
                          <li key={k}>{li.replace(/^\d+\.\s*/, "")}</li>
                        ))}
                      </ol>
                    );
                  }
                  return <p key={i} className="my-4 sm:my-6">{para}</p>;
                })}
              </div>

              {/* CTA */}
              <div className="mt-14 sm:mt-20 border-t border-[#6B4630]/20 pt-8 sm:pt-10">
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
              </div>
            </>
          )}
        </div>
      </article>

      <SiteFooter />
    </div>
  );
}

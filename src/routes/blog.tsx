import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { supabase } from "@/integrations/supabase/client";

// Per-slug thumbnail mapping
import thumbRestaurant from "@/assets/blog-restaurant.jpg";
import thumbWeekend from "@/assets/blog-weekend.jpg";
import thumbFamily from "@/assets/blog-family.jpg";
import thumbGirls from "@/assets/blog-girls.jpg";
import thumbArtDeco from "@/assets/blog-art-deco.jpg";
import thumbKids from "@/assets/blog-kids.jpg";
import thumbCoffee from "@/assets/blog-coffee.jpg";
import thumbCycling from "@/assets/blog-cycling.jpg";
import thumbWine from "@/assets/blog-wine.jpg";

const thumbnails: Record<string, string> = {
  "where-to-eat-in-ahuriri": thumbRestaurant,
  "weekend-in-hawkes-bay": thumbWeekend,
  "family-friendly-hawkes-bay": thumbFamily,
  "girls-getaway-ahuriri": thumbGirls,
  "art-deco-napier-walking-tour": thumbArtDeco,
  "what-to-do-with-kids-hawkes-bay": thumbKids,
  "best-coffee-in-ahuriri": thumbCoffee,
  "cycling-hawkes-bay-trails": thumbCycling,
  "hawkes-bay-wine-country-guide": thumbWine,
};

const fallbackThumb = thumbRestaurant;

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Blog — The Vulcan, Ahuriri" },
      {
        name: "description",
        content:
          "Local guides to Ahuriri, Napier, and Hawke's Bay — from restaurants and cafés to Art Deco walking tours and wine country.",
      },
    ],
  }),
});

function BlogIndex() {
  const { data: posts = [] } = useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      return data ?? [];
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="pt-32 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <p className="eyebrow">Blog</p>
            <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">
              Ahuriri, on foot.
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              Local guides from Leah and Wayne — the restaurants we send guests to,
              the walks we do on our own weekends, and the corners of Hawke's Bay
              we can't stop recommending.
            </p>
          </Reveal>

          <div className="mt-20 grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.id} delay={i * 60}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-putty">
                    <img
                      src={thumbnails[p.slug] ?? fallbackThumb}
                      alt={p.title}
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                      style={{
                        filter: "saturate(0.92) contrast(1.05) sepia(0.08) brightness(0.96)",
                      }}
                    />
                  </div>
                  <div className="mt-6">
                    {p.audience_tag && (
                      <span className="text-[10px] uppercase tracking-[0.24em] text-gold">
                        {p.audience_tag}
                      </span>
                    )}
                    <h2 className="mt-3 font-display text-2xl leading-tight text-ink transition-colors group-hover:text-saddle">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                        {p.excerpt}
                      </p>
                    )}
                    <span className="mt-4 inline-block wood-underline text-xs uppercase tracking-[0.22em] text-ink">
                      Read →
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

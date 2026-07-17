import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
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

  /* Scroll reveal */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts]);

  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />
      <div className="pt-24 pb-16 px-5 sm:pt-28 sm:pb-20 sm:px-8 lg:pt-32 lg:pb-24 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="reveal-up text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">Blog</p>
          <h1 className="reveal-up reveal-stagger-1 mt-3 sm:mt-4 font-[Fraunces] text-[clamp(1.8rem,5vw,4rem)] leading-[1.05] text-[#17181A] tracking-[-0.02em]">
            Ahuriri, on foot.
          </h1>
          <p className="reveal-up reveal-stagger-2 mt-4 sm:mt-6 max-w-2xl text-sm sm:text-base font-[Archivo] text-[#17181A]/60">
            Local guides from Leah and Wayne — the restaurants we send guests to,
            the walks we do on our own weekends, and the corners of Hawke's Bay
            we can't stop recommending.
          </p>

          <div className="wood-divider my-10 sm:my-14" />

          <div className="grid gap-x-8 lg:gap-x-10 gap-y-12 sm:gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <div key={p.id} className={`reveal-up reveal-stagger-${Math.min(i + 1, 4)}`}>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="group block">
                  <div className="aspect-[4/5] w-full overflow-hidden bg-[#E8E0D0]">
                    <img
                      src={thumbnails[p.slug] ?? fallbackThumb}
                      alt={p.title}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-all duration-700 group-hover:scale-105"
                      style={{
                        filter: "saturate(0.92) contrast(1.05) sepia(0.08) brightness(0.96)",
                      }}
                    />
                  </div>
                  <div className="mt-4 sm:mt-6">
                    {p.audience_tag && (
                      <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#6B4630]">
                        {p.audience_tag}
                      </span>
                    )}
                    <h2 className="mt-2 sm:mt-3 font-[Fraunces] text-xl sm:text-2xl leading-tight text-[#17181A] transition-colors group-hover:text-[#6B4630]">
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-relaxed text-[#17181A]/60 line-clamp-3">
                        {p.excerpt}
                      </p>
                    )}
                    <span className="mt-3 sm:mt-4 inline-block wood-underline text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.22em] text-[#17181A]">
                      Read →
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

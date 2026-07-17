import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Reveal } from "@/components/reveal";
import { supabase } from "@/integrations/supabase/client";

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
                    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-putty via-cream to-putty/60 transition-transform duration-700 group-hover:scale-105">
                      <span className="font-display text-6xl italic text-saddle/40">VL</span>
                    </div>
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
                    <span className="mt-4 inline-block gold-underline text-xs uppercase tracking-[0.22em] text-ink">
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

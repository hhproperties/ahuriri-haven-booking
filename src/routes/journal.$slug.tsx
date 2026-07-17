import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/journal/$slug")({
  component: JournalPost,
});

function JournalPost() {
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

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <article className="pt-32 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-3xl">
          <Link to="/journal" className="eyebrow gold-underline">← Journal</Link>
          {post && (
            <>
              {post.audience_tag && (
                <p className="mt-10 eyebrow">{post.audience_tag}</p>
              )}
              <h1 className="mt-4 font-display text-4xl leading-[1.1] text-ink md:text-6xl">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="mt-8 border-l-2 border-gold pl-6 font-display text-xl italic leading-snug text-saddle md:text-2xl">
                  {post.excerpt}
                </p>
              )}
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

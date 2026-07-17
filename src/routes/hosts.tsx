import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import cowImg from "@/assets/highland-cow.jpg";
import heroImg from "@/assets/hero-exterior.jpg";

export const Route = createFileRoute("/hosts")({
  component: HostsPage,
  head: () => ({
    meta: [
      { title: "Meet Your Hosts — The Vulcan, Ahuriri" },
      { name: "description", content: "Meet Leah and Wayne — your hosts at The Vulcan, Ahuriri. A quiet, warm welcome to our harbourside home in Napier." },
      { property: "og:title", content: "Meet Your Hosts — The Vulcan, Ahuriri" },
      { property: "og:description", content: "Leah and Wayne welcome you to The Vulcan — their private retreat in Ahuriri, Napier." },
      { property: "og:image", content: cowImg },
    ],
  }),
});

function HostsPage() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#17181A]">
      <SiteNav />

      {/* Hero — dark band */}
      <section className="relative min-h-[40vh] min-h-half-screen-safe overflow-hidden bg-[#17181A]">
        <div className="absolute inset-0 ken-burns">
          <img src={heroImg} alt="The Vulcan, Ahuriri" className="h-full w-full object-cover hero-image-grade" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#17181A] via-[#17181A]/30 to-transparent" />
        <div className="absolute inset-0 warm-veil" />
        <div className="relative z-10 mx-auto flex h-full min-h-[40vh] min-h-half-screen-safe max-w-7xl flex-col justify-end px-5 pb-10 sm:px-8 sm:pb-14 lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E]">Meet your hosts</p>
          <h1 className="mt-2 sm:mt-3 font-[Fraunces] text-[clamp(2rem,6vw,5rem)] leading-[0.95] text-[#EFE8DA] tracking-[-0.02em] text-shadow-overlay">
            Leah{" "}
            <span className="word-wood-light">&</span>{" "}
            <span className="word-champagne">Wayne.</span>
          </h1>
        </div>
      </section>

      {/* Dark band content */}
      <section className="bg-[#17181A] px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-32">
        <div className="mx-auto max-w-5xl space-y-14 sm:space-y-20">
          {/* Bio */}
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-5 lg:items-center">
            <div className="reveal-up lg:col-span-2 text-center lg:text-left">
              <div className="arch-frame-group relative inline-block mx-auto">
                <div className="arch-accent" />
                <div className="arch-frame max-w-[280px] mx-auto lg:max-w-full">
                  <img src={cowImg} alt="Leah and Wayne" loading="lazy" decoding="async" className="h-full w-full object-cover" width={800} height={1067} />
                </div>
              </div>
            </div>
            <div className="reveal-up reveal-stagger-1 lg:col-span-3">
              <p className="text-sm sm:text-base leading-relaxed font-[Archivo] text-[#EFE8DA]/60">
                We're Leah and Wayne — we've spent years travelling the world and
                staying in other people's homes, and now we love doing the same for
                guests in ours.
              </p>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base leading-relaxed font-[Archivo] text-[#EFE8DA]/60">
                The Vulcan is our own slice of Ahuriri: five minutes from the beach,
                walking distance to our favourite local restaurants, and set up
                exactly how we'd want to stay ourselves. We're usually just upstairs
                if you need anything, and always happy to point you toward the best
                flat white in town.
              </p>
              <blockquote className="mt-6 sm:mt-10 border-l-2 border-[#BD8A5E] pl-4 sm:pl-6 font-[Fraunces] text-lg sm:text-2xl italic leading-snug text-[#BD8A5E]">
                "We host the way we like to be hosted — quietly, warmly, and out of
                the way unless you need us."
              </blockquote>
            </div>
          </div>

          {/* Philosophy */}
          <div className="grid gap-8 sm:gap-12 lg:grid-cols-3">
            {[
              { title: "Our approach", body: "We believe in quiet hospitality — setting things up so you don't need to ask, being available when you do, and giving you the space to enjoy your stay your way." },
              { title: "The property", body: "Everything in the apartment is chosen with the same care we'd give our own home. We stay here ourselves when guests aren't booked, so nothing gets tired." },
              { title: "The neighbourhood", body: "We've lived in Ahuriri for years and love it. Ask us anything — where to eat, which winery to visit, the best walking trails. We'll send you there with real enthusiasm." },
            ].map((item, i) => (
              <div key={item.title} className={`reveal-up reveal-stagger-${i + 1}`}>
                <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#BD8A5E] mb-3 sm:mb-4">{item.title}</p>
                <p className="text-xs sm:text-sm leading-relaxed font-[Archivo] text-[#EFE8DA]/60">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="wood-divider" />
          <div className="text-center">
            <Link to="/book" className="btn-outline-light text-xs group tap-target inline-flex items-center">
              Book Your Stay <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import coffeeImg from "@/assets/ahuriri-coffee.jpg";
import courtyardImg from "@/assets/garden-courtyard.jpg";
import patioBbqImg from "@/assets/patio-bbq.jpg";
import diningImg from "@/assets/ahuriri-dining.jpg";

/**
 * "A day at The Vulcan" — the one scrollytelling section on the site.
 *
 * Structure is the classic sticky-figure pattern: text steps in normal flow on
 * the left, a sticky image frame on the right that cross-fades as each step
 * becomes active.
 *
 * Two things worth knowing before editing:
 *
 * 1. The mobile layout is not a fallback bolted on afterwards — it is the base
 *    case. Below `md` the sticky mechanism does not exist at all; the section is
 *    four stacked image-then-text cards. A sticky column on a 375px viewport
 *    whose browser chrome resizes on scroll is a bad experience, not a
 *    degraded one.
 * 2. The sticky images are decorative duplicates of photography already in the
 *    gallery, so they are aria-hidden. The step text is real DOM content in
 *    reading order and is what a screen reader gets.
 *
 * No scroll-jacking, no pinning, no clip-path wipes: the images cross-fade and
 * that is the entire effect. A flick scrolls where the user flicked.
 */

const STEPS = [
  {
    id: "morning",
    label: "Morning",
    image: coffeeImg,
    alt: "Coffee on a wooden table overlooking Ahuriri harbour",
    body: "Three minutes on foot to Milk & Honey. Coffee by the water before the town properly wakes up, and back before anyone else is out of bed.",
  },
  {
    id: "afternoon",
    label: "Afternoon",
    image: courtyardImg,
    alt: "The fenced courtyard garden with palms and lounge chairs",
    body: "Back to the courtyard for the afternoon — palms, the wall fountain, two deep chairs, and nobody overlooking you.",
  },
  {
    id: "evening",
    label: "Evening",
    image: patioBbqImg,
    alt: "The covered patio with a Weber barbecue and lounge chairs",
    body: "The Weber is on the covered patio and the table seats six. Most evenings there is no reason to go out at all.",
  },
  {
    id: "sunset",
    label: "Sunset",
    image: diningImg,
    alt: "Friends sharing wine at a waterfront table in Ahuriri at sunset",
    body: "Or walk five minutes down to the marina and let somebody else cook, with the light going gold over the water.",
  },
] as const;

export function DayAtTheVulcan() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // The sticky column only exists at md+; below that there is nothing to drive.
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") return;
    const desktop = window.matchMedia("(min-width: 768px)");
    if (!desktop.matches) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const i = stepRefs.current.indexOf(entry.target as HTMLDivElement);
            if (i !== -1) setActive(i);
          }
        }
      },
      // Middle band of the viewport: a step is "active" while it sits in the
      // centre third, which keeps the image in step with what is being read.
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    stepRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      aria-labelledby="day-at-the-vulcan"
      className="bg-[#EFE8DA] section-y px-5 sm:px-8 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading is in flow on mobile. On md+ it moves into the sticky
            column (below) so the left column opens straight onto the first
            step instead of leaving a several-hundred-pixel void. */}
        <ScrollReveal className="md:hidden">
          <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
            A day here
          </p>
          <h2 className="mt-3 max-w-3xl font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.05] text-[#17181A] font-optical-sizing-auto tracking-[-0.02em] display-balance">
            A day at <span className="word-wood">The Vulcan.</span>
          </h2>
        </ScrollReveal>

        {/* ── Mobile: stacked image-then-text cards. No sticky, no observer. ── */}
        <div className="mt-10 grid gap-10 md:hidden">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.id} index={i}>
              <figure className="aspect-[4/5] overflow-hidden">
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </figure>
              <p className="mt-4 text-[11px] uppercase tracking-[0.24em] font-[Archivo] text-[#6B4630]">
                {step.label}
              </p>
              <p className="mt-2 text-sm leading-relaxed font-[Archivo] text-[#17181A]/70">
                {step.body}
              </p>
            </ScrollReveal>
          ))}
        </div>

        {/* ── md+: text in flow, sticky cross-fading image frame ── */}
        <div className="hidden gap-12 md:grid md:grid-cols-2 lg:gap-20">
          <div>
            {STEPS.map((step, i) => (
              <div
                key={step.id}
                ref={(el) => {
                  stepRefs.current[i] = el;
                }}
                className="flex min-h-[62vh] flex-col justify-center"
              >
                <p
                  className="flex items-center gap-3 text-[11px] uppercase tracking-[0.24em] font-[Archivo] transition-opacity"
                  style={{
                    transitionDuration: "var(--motion-base)",
                    opacity: reduced || active === i ? 1 : 0.45,
                    color: active === i ? "var(--sage)" : "#6B4630",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="h-px transition-all duration-[var(--motion-base)]"
                    style={{
                      width: active === i ? "28px" : "12px",
                      background: active === i ? "var(--sage)" : "#6B4630",
                    }}
                  />
                  {step.label}
                </p>
                <p
                  className="mt-3 max-w-md font-[Fraunces] text-xl leading-snug text-[#17181A] transition-opacity lg:text-2xl"
                  style={{
                    transitionDuration: "var(--motion-base)",
                    opacity: reduced || active === i ? 1 : 0.35,
                  }}
                >
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="sticky top-0 flex h-screen flex-col justify-center">
              <div className="hidden md:block">
                <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#6B4630]">
                  A day here
                </p>
                <h2
                  id="day-at-the-vulcan"
                  className="mt-3 mb-6 font-[Fraunces] text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.05] text-[#17181A] font-optical-sizing-auto tracking-[-0.02em] display-balance"
                >
                  A day at <span className="word-wood">The Vulcan.</span>
                </h2>
              </div>
              <div aria-hidden="true" className="relative aspect-[4/5] w-full overflow-hidden">
                {STEPS.map((step, i) => (
                  <img
                    key={step.id}
                    src={step.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover transition-opacity"
                    style={{
                      transitionDuration: reduced ? "0ms" : "var(--motion-slow)",
                      transitionTimingFunction: "var(--ease-in-out)",
                      opacity: active === i ? 1 : 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

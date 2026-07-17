import { useEffect, useRef, useState } from "react";

interface TestimonialProps {
  /** The full review quote — italic reserved for the accent word only */
  quote: string;
  /** Author attribution */
  author: string;
  /** Optional role line (omit for Airbnb reviews) */
  role?: string;
  /** Optional context line (e.g. "Vineyard wedding · Hawke's Bay · 2024") */
  context?: string;
  /** Exact word inside `quote` that gets the wood-grain accent treatment */
  accent: string;
  /** Layout variant */
  layout?: "hero" | "column" | "marquee";
  /** Stagger delay in ms */
  delay?: number;
}

/* ── Helper: split a quote on the accent word, returning parts ── */
function splitOnAccent(text: string, accent: string): (string | { word: string; accent: true })[] {
  const idx = text.indexOf(accent);
  if (idx === -1) return [text];
  const parts: (string | { word: string; accent: true })[] = [];
  const before = text.slice(0, idx);
  const after = text.slice(idx + accent.length);
  if (before) parts.push(before);
  parts.push({ word: accent, accent: true });
  if (after) parts.push(after);
  return parts;
}

export function Testimonial({
  quote,
  author,
  role,
  context,
  accent,
  layout = "column",
  delay = 0,
}: TestimonialProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // small delay to let the observer settle
          setTimeout(() => setInView(true), 80);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const visible = inView || reduceMotion;
  const parts = splitOnAccent(quote, accent);

  /* ── Hero layout ── */
  if (layout === "hero") {
    return (
      <figure
        ref={ref}
        className="relative mx-auto max-w-4xl"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {/* Decorative open-quote glyph */}
        <span
          className="absolute -top-4 left-0 select-none pointer-events-none leading-none"
          style={{
            fontSize: "clamp(6rem, 10vw, 8rem)",
            color: reduceMotion ? "#6B4630" : undefined,
            opacity: reduceMotion ? 0.35 : visible ? 0.35 : 0,
            transform: reduceMotion ? "none" : visible ? "none" : "scale(0.6) rotate(-8deg)",
            transition: `opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)`,
            transitionDelay: `${delay + 200}ms`,
          }}
        >
          <span className="text-[#6B4630] opacity-35">"</span>
        </span>

        <blockquote className="font-[Fraunces] text-[clamp(2rem,4.5vw,3.6rem)] leading-[1.05] text-[#17181A] tracking-[-0.02em] text-balance" style={{ maxWidth: "22ch" }}>
          {parts.map((p, i) =>
            typeof p === "string" ? (
              <span key={i}>{p}</span>
            ) : (
              <span key={i} className="word-wood">
                {p.word}
              </span>
            )
          )}
        </blockquote>

        {/* Wood divider */}
        <div
          className="h-px w-48 bg-[#6B4630] my-8"
          style={{
            transformOrigin: "left",
            transform: reduceMotion ? "scaleX(1)" : visible ? "scaleX(1)" : "scaleX(0)",
            transition: `transform 0.7s ease-out`,
            transitionDelay: `${delay + 400}ms`,
          }}
        />

        <figcaption className="font-[Archivo]">
          <p className="text-sm font-medium text-[#17181A]">{author}</p>
          {role && <p className="text-[11px] uppercase tracking-[0.14em] text-[#17181A]/50 mt-1">{role}</p>}
          {context && <p className="text-[11px] uppercase tracking-[0.14em] text-[#17181A]/50">{context}</p>}
        </figcaption>
      </figure>
    );
  }

  /* ── Column layout (two-column side-by-side) ── */
  if (layout === "column") {
    return (
      <figure
        ref={ref}
        className="relative"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)`,
          transitionDelay: `${delay}ms`,
        }}
      >
        {/* Decorative open-quote glyph */}
        <span
          className="block select-none pointer-events-none leading-none mb-2"
          style={{
            fontSize: "clamp(3rem, 5vw, 4rem)",
            color: "#6B4630",
            opacity: reduceMotion ? 0.35 : visible ? 0.35 : 0,
            transform: reduceMotion ? "none" : visible ? "none" : "scale(0.6) rotate(-8deg)",
            transition: `opacity 1.1s cubic-bezier(0.22,1,0.36,1), transform 1.1s cubic-bezier(0.22,1,0.36,1)`,
            transitionDelay: `${delay + 200}ms`,
          }}
        >
          "
        </span>

        <blockquote className="font-[Fraunces] text-[clamp(1.2rem,2vw,1.8rem)] leading-[1.25] text-[#17181A]" style={{ maxWidth: "38ch" }}>
          {parts.map((p, i) =>
            typeof p === "string" ? (
              <span key={i}>{p}</span>
            ) : (
              <span key={i} className="word-wood">
                {p.word}
              </span>
            )
          )}
        </blockquote>

        {/* Wood divider */}
        <div
          className="h-px w-32 bg-[#6B4630] my-6"
          style={{
            transformOrigin: "left",
            transform: reduceMotion ? "scaleX(1)" : visible ? "scaleX(1)" : "scaleX(0)",
            transition: `transform 0.7s ease-out`,
            transitionDelay: `${delay + 400}ms`,
          }}
        />

        <figcaption className="font-[Archivo]">
          <p className="text-[11px] uppercase tracking-[0.22em] font-medium text-[#6B4630]">{author}</p>
          {role && <p className="text-[10px] uppercase tracking-[0.14em] text-[#17181A]/50 mt-0.5">{role}</p>}
          {context && <p className="text-[10px] uppercase tracking-[0.14em] text-[#17181A]/50">{context}</p>}
        </figcaption>
      </figure>
    );
  }

  /* ── Marquee panel layout ── */
  return (
    <figure
      ref={ref}
      className="flex-shrink-0 px-10 py-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)`,
        transitionDelay: `${delay}ms`,
        minWidth: "32rem",
      }}
    >
      <span className="block text-[2.5rem] leading-none text-[#6B4630] opacity-25 select-none mb-2">"</span>
      <blockquote className="font-[Fraunces] text-[1.3rem] leading-[1.2] text-[#17181A]">
        {parts.map((p, i) =>
          typeof p === "string" ? (
            <span key={i}>{p}</span>
          ) : (
            <span key={i} className="word-wood">
              {p.word}
            </span>
          )
        )}
      </blockquote>
      <p className="mt-4 text-[11px] uppercase tracking-[0.22em] font-[Archivo] font-medium text-[#6B4630]">{author}</p>
    </figure>
  );
}

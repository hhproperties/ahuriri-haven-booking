import { useEffect, useState } from "react";

interface BlogHeaderProps {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  credit?: string;
}

/**
 * Blog post hero — fixed aspect ratio, safe content padding, a bottom-to-
 * transparent Ink Charcoal scrim, Ken Burns slow zoom, and a word-by-word
 * headline reveal. Shared across every post for a consistent editorial feel.
 */
export function BlogHeader({ src, alt, eyebrow, title, credit }: BlogHeaderProps) {
  const [loaded, setLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const titleWords = title.split(" ");

  return (
    <div className="relative w-full overflow-hidden bg-[#17181A] aspect-[16/9] sm:aspect-[21/9]">
      {/* Image — object-fit cover, Ken Burns slow zoom once loaded */}
      <img
        src={src}
        alt={alt}
        className={`absolute inset-0 h-full w-full object-cover ${loaded && !reduceMotion ? "ken-burns" : ""}`}
        style={{
          opacity: reduceMotion ? 1 : loaded ? 1 : 0,
          filter: reduceMotion
            ? "none"
            : loaded
              ? "saturate(0.92) contrast(1.05) sepia(0.08) brightness(0.96)"
              : "blur(12px) saturate(0.85)",
          transition: "opacity 1.4s cubic-bezier(0.22,1,0.36,1), filter 1.4s cubic-bezier(0.22,1,0.36,1)",
        }}
        onLoad={() => setLoaded(true)}
      />

      {/* Scrim — bottom-to-transparent Ink Charcoal for headline legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(23,24,26,0.78) 0%, rgba(23,24,26,0.42) 48%, rgba(23,24,26,0) 100%)",
        }}
      />

      {/* Warm veil */}
      <div className="pointer-events-none absolute inset-0 warm-veil" />

      {/* Content — fully inside safe padding (24px mobile / 64px desktop) */}
      <div className="absolute inset-x-0 bottom-0 px-6 pb-8 sm:px-10 sm:pb-12 lg:px-16 lg:pb-16">
        <p className="text-[11px] uppercase tracking-[0.24em] font-[Archivo] font-medium text-[#BD8A5E]">
          {eyebrow}
        </p>

        <h1
          className="mt-3 sm:mt-4 max-w-3xl font-[Fraunces] font-semibold leading-[1.05] text-[#EFE8DA] text-shadow-overlay"
          style={{ fontSize: "clamp(1.9rem, 5vw, 4rem)" }}
        >
          {titleWords.map((word, i) => (
            <span
              key={i}
              className="inline-block"
              style={{
                opacity: reduceMotion ? 1 : loaded ? 1 : 0,
                transform: reduceMotion ? "translateY(0)" : loaded ? "translateY(0)" : "translateY(14px)",
                transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${loaded ? "0ms" : `${i * 70}ms`}, transform 600ms cubic-bezier(0.22,1,0.36,1) ${loaded ? "0ms" : `${i * 70}ms`}`,
              }}
            >
              {word}
              {i < titleWords.length - 1 ? "\u00A0" : ""}
            </span>
          ))}
        </h1>

        {credit && (
          <p className="mt-3 sm:mt-4 text-[10px] uppercase tracking-[0.2em] font-[Archivo] text-[#EFE8DA]/60">
            {credit}
          </p>
        )}
      </div>
    </div>
  );
}

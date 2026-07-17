import { useEffect, useRef, useState } from "react";

interface BlogHeaderProps {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  credit?: string;
}

export function BlogHeader({ src, alt, eyebrow, title, credit }: BlogHeaderProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  // Detect prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Scroll handler for parallax + title fade
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      // scrollY is how far the container top has scrolled past viewport top
      setScrollY(Math.max(0, -rect.top));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Title words for stagger reveal
  const titleWords = title.split(" ");

  return (
    <div ref={containerRef} className="relative w-full bg-cream" style={{ minHeight: "62vh" }}>
      {/* Cream inset frame */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{
          minHeight: "78svh",
          padding: "clamp(12px, 2vw, 24px)",
          paddingTop: "calc(56px + clamp(12px, 2vw, 24px))",
        }}
      >
        {/* Image container with wood hairline */}
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            border: "1px solid rgba(107, 70, 48, 0.4)",
          }}
        >
          {/* Image */}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className="h-full w-full object-cover will-change-transform"
            style={{
              opacity: reduceMotion ? 1 : loaded ? 1 : 0,
              transform:
                reduceMotion
                  ? "none"
                  : loaded
                    ? `translateY(${scrollY * 0.5}px)`
                    : "scale(1.08)",
              filter:
                reduceMotion
                  ? "none"
                  : loaded
                    ? "saturate(0.92) contrast(1.05) sepia(0.08) brightness(0.96)"
                    : "blur(12px) saturate(0.85)",
              transition: loaded
                ? "transform 0.1s linear"
                : "opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1), filter 1.4s cubic-bezier(0.22, 1, 0.36, 1)",
              animation: reduceMotion
                ? "none"
                : loaded
                  ? "ken-burns 20s ease-in-out infinite"
                  : "none",
            }}
            onLoad={() => setLoaded(true)}
          />

          {/* Scrim — soft gradient from bottom */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: "linear-gradient(to top, rgba(23,24,26,0.55), transparent 55%)",
            }}
          />

          {/* Bottom-left content area */}
          <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:p-12 lg:p-16">
            {/* Eyebrow */}
            <p
              className="eyebrow text-cream/90"
              style={{
                opacity: reduceMotion || loaded ? 1 : 0,
                transform: reduceMotion || loaded ? "translateY(0)" : "translateY(20px)",
                transition:
                  `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${loaded ? "0ms" : "1400ms"}, ` +
                  `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${loaded ? "0ms" : "1400ms"}`,
              }}
            >
              {eyebrow}
            </p>

            {/* Wood divider */}
            <div
              className="mt-3 h-[2px] origin-left"
              style={{
                width: "24px",
                backgroundColor: "#6B4630",
                transform: reduceMotion ? "scaleX(1)" : loaded ? "scaleX(1)" : "scaleX(0)",
                transition: `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${loaded ? "0ms" : "1520ms"}`,
              }}
            />

            {/* Title word-by-word reveal */}
            <div ref={titleRef} className="mt-3 sm:mt-4 max-w-3xl">
              <h1 className="font-display font-semibold leading-[1.1] text-cream" style={{ fontSize: "clamp(2.2rem, 7vw, 6rem)" }}>
                {titleWords.map((word, i) => (
                  <span
                    key={i}
                    className="inline-block"
                    style={{
                      opacity: reduceMotion ? 1 : loaded ? 1 : 0,
                      transform: reduceMotion ? "translateY(0)" : loaded ? "translateY(0)" : "translateY(20px)",
                      transition:
                        `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${loaded ? "0ms" : `${1520 + i * 100 + 700}ms`}, ` +
                        `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${loaded ? "0ms" : `${1520 + i * 100 + 700}ms`}`,
                    }}
                  >
                    {word}{i < titleWords.length - 1 ? "\u00A0" : ""}
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </div>

        {/* Wood Tab — photo credit */}
        {credit && !reduceMotion && (
          <div
            className="absolute left-[calc(24px+16px)]"
            style={{
              bottom: "0px",
              transform: "translateY(50%)",
            }}
          >
            <div
              className="px-3 py-1.5 text-[10px] uppercase leading-none tracking-[0.2em] text-cream"
              style={{ backgroundColor: "#6B4630" }}
            >
              {credit}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

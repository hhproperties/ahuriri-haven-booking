import { useEffect, useRef, useState } from "react";

/** Reveal component — fade + translate up on scroll enter */
export function Reveal({
  children,
  threshold = 0.15,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  threshold?: number;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/** Pull-quote with scale-in animation */
export function PullQuote({
  text,
  delay = 200,
}: {
  text: string;
  delay?: number;
}) {
  return (
    <Reveal threshold={0.3} delay={delay}>
      <blockquote className="my-10 sm:my-14 border-l-2 border-[#6B4630] pl-4 sm:pl-6 font-[Fraunces] text-lg sm:text-xl lg:text-2xl italic leading-snug text-[#6B4630]">
        {text}
      </blockquote>
    </Reveal>
  );
}

/** Wood divider that draws in from left on enter */
export function WoodDivider({
  className = "my-10 sm:my-14",
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) { setVisible(true); return; }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: visible ? "scaleX(1)" : "scaleX(0)",
        transformOrigin: "left center",
        transition: `transform 800ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
      }}
    >
      <div className="h-px w-full bg-gradient-to-r from-[#6B4630]/70 to-transparent" />
    </div>
  );
}

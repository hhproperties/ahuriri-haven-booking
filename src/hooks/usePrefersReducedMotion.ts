import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Read at the top of every animated component. When true: no transforms, no
 * parallax, no staggering, no counters — content appears at its final state
 * instantly. Opacity fades under 200ms are still acceptable.
 *
 * This is a hard gate, not a nice-to-have. There is also a CSS safety net in
 * src/styles.css, so a component that forgets to call this still degrades.
 *
 * Starts `false` so server-rendered markup matches the common case and hydration
 * does not mismatch; the real value lands on the first client effect.
 */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(QUERY);
    setReduced(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

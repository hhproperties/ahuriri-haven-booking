import { useEffect, useRef, useState } from "react";
import { REVEAL_OBSERVER } from "@/lib/motion";

/**
 * Fires once when the element enters the viewport, then disconnects.
 *
 * Nothing re-animates on scroll-up. Re-triggering reveals is the single most
 * common way sites like this become unusable — you scroll back to check a price
 * and the page dissolves and rebuilds itself around you.
 *
 * SSR/hydration safe: if IntersectionObserver is unavailable the initial state is
 * `true`, so content is never trapped invisible behind a missing API.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = REVEAL_OBSERVER,
) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (inView) return;
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
          break;
        }
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
    // `options` is a module-level constant by default; callers passing a literal
    // should memoise it. Intentionally not in deps to avoid re-observing per render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  return { ref, inView };
}

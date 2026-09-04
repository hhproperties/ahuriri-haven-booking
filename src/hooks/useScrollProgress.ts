import { useEffect, useRef } from "react";

/**
 * Writes an element's scroll progress (0..1) to a CSS custom property.
 *
 * Deliberately never touches React state. Setting state from a scroll event is a
 * re-render per frame and it will jank on a mid-range Android — which is most of
 * this site's traffic. The value goes straight to the DOM node as a custom
 * property and CSS does the rest.
 *
 * Gated by IntersectionObserver so the scroll listener is only attached while the
 * element is actually on screen, and torn down again when it leaves.
 *
 * @param property CSS custom property to write, e.g. "--progress"
 * @param enabled  pass false under reduced motion; the property is then pinned to 0
 */
export function useScrollProgress<T extends HTMLElement = HTMLDivElement>(
  property: string,
  enabled = true,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!enabled) {
      el.style.setProperty(property, "0");
      return;
    }
    if (typeof IntersectionObserver === "undefined") return;

    let frame = 0;
    let listening = false;

    const measure = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const total = rect.height + window.innerHeight;
      // 0 as the element's top enters from below, 1 as its bottom clears the top.
      const progress = total > 0 ? (window.innerHeight - rect.top) / total : 0;
      el.style.setProperty(property, String(Math.min(1, Math.max(0, progress))));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        listening = true;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        measure();
      } else if (!entry.isIntersecting && listening) {
        listening = false;
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [property, enabled]);

  return ref;
}

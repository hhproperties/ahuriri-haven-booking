import { useEffect, useRef } from "react";
import { REVEAL_OBSERVER } from "@/lib/motion";

const REDUCED = "(prefers-reduced-motion: reduce)";

function prefersReduced() {
  return typeof window !== "undefined" && window.matchMedia?.(REDUCED).matches;
}

/**
 * Reveals a single element once, then stops observing it.
 *
 * Prefer <ScrollReveal> for new code. This hook remains for the existing
 * `.reveal-up` call sites.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      el.classList.add("is-visible");
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    }, REVEAL_OBSERVER);
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/**
 * Section-level reveal for the existing `.reveal-up` markup.
 *
 * The previous implementation ran `document.querySelectorAll('.reveal-up')` on
 * every section mount, so a page with eight sections built eight observers each
 * watching every revealable element on the page, and never unobserved a fired
 * one. This scopes the scan to elements that have not yet fired and releases each
 * element as it lands.
 *
 * Under reduced motion nothing is observed at all — every element is marked
 * visible synchronously so content can never be trapped mid-reveal.
 */
export function useRevealSection() {
  useEffect(() => {
    const targets = document.querySelectorAll(".reveal-up:not(.is-visible)");
    if (!targets.length) return;

    if (prefersReduced() || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    }, REVEAL_OBSERVER);

    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

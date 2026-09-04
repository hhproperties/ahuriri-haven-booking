/**
 * Motion tokens and helpers.
 *
 * Every animated component reads its timing from here — no component gets its own
 * bespoke duration or curve. The values are also declared as CSS custom properties
 * in src/styles.css; this module is the TypeScript mirror for the cases where a
 * value has to reach JS (observer thresholds, stagger arithmetic).
 *
 * Durations are deliberately short. Roughly 60% of this site's traffic is a phone
 * on rural data deciding between us and three Airbnb listings, so motion is paid
 * for in scroll latency and battery.
 */

/** Milliseconds. Nothing in the critical path may exceed MOTION.slow. */
export const MOTION = {
  /** hover, focus, button press */
  fast: 180,
  /** reveals, fades, card lifts */
  base: 320,
  /** hero, section transitions */
  slow: 480,
} as const;

export const EASE = {
  /** everything entering */
  out: "cubic-bezier(0.16, 1, 0.3, 1)",
  /** everything moving in place */
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

/** How far a revealing element travels. Small on purpose — long travel reads as "template". */
export const REVEAL_DISTANCE_PX = 16;

/** Shared IntersectionObserver settings for reveals. */
export const REVEAL_OBSERVER: IntersectionObserverInit = {
  rootMargin: "0px 0px -12% 0px",
  threshold: 0.15,
};

/** Per-item stagger step, and the cap past which items stop being delayed at all. */
export const STAGGER_STEP_MS = 60;
export const STAGGER_MAX_ITEMS = 4;

/**
 * Delay for the nth item in a staggered group, capped at STAGGER_MAX_ITEMS.
 * Past the cap every remaining item shares the last delay, so a fast scroller
 * never watches an empty page waiting for item twelve.
 */
export function staggerDelay(index: number): number {
  return Math.min(index, STAGGER_MAX_ITEMS - 1) * STAGGER_STEP_MS;
}

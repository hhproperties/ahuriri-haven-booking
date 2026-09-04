import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { staggerDelay } from "@/lib/motion";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /**
   * Position within a staggered group. Delay is capped at 4 items x 60ms
   * (see staggerDelay) so a fast scroller never watches an empty page.
   */
  index?: number;
  /** Explicit delay in ms. Overrides `index`. */
  delay?: number;
  /** Render as something other than a div — e.g. "li" inside a list. */
  as?: ElementType;
  /** Fade-only reveal (opacity, no translate) for featured pull-quotes. */
  fade?: boolean;
};

/**
 * Fades content in from 16px below, once, when it enters the viewport.
 *
 * Apply to: section headings, amenity tiles, gallery items, review cards,
 * location list rows.
 *
 * Do NOT apply to: nav, the hero headline, the price, or any booking CTA. Those
 * must be painted and interactive at first frame — an animated price is a
 * conversion bug, not a flourish.
 *
 * Under reduced motion the wrapper renders as a plain element with no reveal
 * class at all, so there is no transition to interrupt and no chance of content
 * being trapped invisible.
 */
export function ScrollReveal({
  children,
  className,
  index,
  delay,
  as: Tag = "div",
  fade = false,
}: ScrollRevealProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  const ms = delay ?? (index !== undefined ? staggerDelay(index) : 0);

  return (
    <Tag
      ref={ref}
      className={cn(fade ? "sr-fade" : "sr-reveal", className)}
      data-in-view={inView ? "true" : "false"}
      style={ms ? ({ "--sr-delay": `${ms}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}

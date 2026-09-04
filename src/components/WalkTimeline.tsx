import { ScrollReveal } from "@/components/ScrollReveal";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useScrollProgress } from "@/hooks/useScrollProgress";

export type Destination = { name: string; distance: string; type?: string };

/**
 * Walking destinations as a vertical timeline whose connecting line fills as the
 * section scrolls through the viewport.
 *
 * The fill is driven by useScrollProgress, which writes a `--walk-progress`
 * custom property from a requestAnimationFrame-throttled scroll listener gated
 * by an IntersectionObserver. No React state is touched per frame.
 *
 * Under reduced motion the line is drawn at full height immediately — the fill
 * is decoration, and the list must never depend on motion to be readable.
 */
export function WalkTimeline({ items }: { items: Destination[] }) {
  const reduced = usePrefersReducedMotion();
  const ref = useScrollProgress<HTMLOListElement>("--walk-progress", !reduced);

  return (
    <ol ref={ref} className="relative ml-3 border-l border-[#6B4630]/15 pl-8">
      {/* The filling line. Decorative: the list is already a list. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-px top-0 w-px origin-top"
        style={{
          background: "var(--sage)",
          height: "100%",
          transform: reduced ? "scaleY(1)" : "scaleY(var(--walk-progress, 0))",
        }}
      />
      {items.map((n, i) => (
        <ScrollReveal as="li" key={n.name} index={i} className="relative pb-7 last:pb-0">
          <span
            aria-hidden="true"
            className="absolute -left-[38px] top-1.5 h-2 w-2 rounded-full ring-4 ring-[#EFE8DA]"
            style={{ background: "var(--sage)" }}
          />
          <div className="flex items-baseline justify-between gap-4">
            <span className="font-[Fraunces] text-base text-[#17181A] sm:text-lg">{n.name}</span>
            <span className="shrink-0 text-[10px] uppercase tracking-[0.2em] font-[Archivo] text-[#6B4630] sm:text-[11px]">
              {n.distance}
            </span>
          </div>
          {n.type && (
            <span className="mt-1 block text-[10px] uppercase tracking-[0.18em] font-[Archivo] text-[#17181A]/60">
              {n.type}
            </span>
          )}
        </ScrollReveal>
      ))}
    </ol>
  );
}

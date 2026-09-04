import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/ScrollReveal";

/**
 * Thin alias kept so existing call sites keep working. New code should use
 * <ScrollReveal> directly — it takes an `index` prop that caps the stagger.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <ScrollReveal className={className} delay={delay}>
      {children}
    </ScrollReveal>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const NIGHTLY_FROM = "NZ$220";

function toIso(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Mobile sticky booking bar.
 *
 * Appears once the hero is scrolled past, slides up once, and never animates
 * again. The price and the button inside it are painted at full opacity the
 * moment the bar exists — the entrance is on the container, never on the price
 * or the CTA.
 *
 * Below md only. On desktop the nav's Book Now covers this job (see SiteNav,
 * which gains a surface once past the hero).
 *
 * Dates chosen here are passed to /book as query params, which that route reads
 * via validateSearch, so nobody re-enters them.
 *
 * The bar is fixed, so <main> carries matching bottom padding on mobile —
 * see the `pb-[var(--sticky-bar-h)]` on the page shell. Nothing is ever
 * stranded behind it, including a focused control.
 */
export function StickyBookingBar() {
  const reduced = usePrefersReducedMotion();
  const navigate = useNavigate();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Reveal once the hero is behind us. Threshold is a viewport height rather
    // than an observer on the hero so this component stays self-contained.
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.85);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const confirm = () => {
    setOpen(false);
    navigate({
      to: "/book",
      search: {
        checkIn: range?.from ? toIso(range.from) : undefined,
        checkOut: range?.to ? toIso(range.to) : undefined,
      },
    });
  };

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 md:hidden"
      style={{
        transform: shown || reduced ? "translateY(0)" : "translateY(100%)",
        transition: reduced ? "none" : "transform var(--motion-base) var(--ease-out)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      // Hidden from assistive tech until it is actually on screen, so it is not
      // announced while the hero still fills the viewport.
      aria-hidden={!shown}
      inert={!shown ? true : undefined}
    >
      <div className="flex items-center justify-between gap-3 border-t border-[#6B4630]/20 bg-[#EFE8DA] px-4 py-3">
        <div className="leading-tight">
          <p className="font-[Fraunces] text-lg text-[#17181A]">
            From {NIGHTLY_FROM}
            <span className="text-xs text-[#17181A]/60">/night</span>
          </p>
          <p className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] font-[Archivo] text-[#6B4630]">
            Sleeps 4 · 2 beds
          </p>
        </div>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button className="h-11 cursor-pointer bg-[#6B4630] px-5 text-[11px] uppercase tracking-[0.18em] font-[Archivo] text-[#EFE8DA] hover:bg-[#17181A]">
              Check availability
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="top"
            className="w-auto border-[#6B4630]/20 bg-[#EFE8DA] p-0"
          >
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={1}
              disabled={{ before: new Date() }}
              autoFocus
            />
            <div className="flex items-center justify-between gap-2 border-t border-[#6B4630]/20 p-3">
              <span className="text-[10px] uppercase tracking-[0.18em] font-[Archivo] text-[#17181A]/60">
                {range?.from && range?.to ? "Dates selected" : "Pick your dates"}
              </span>
              <Button
                onClick={confirm}
                className="h-9 cursor-pointer bg-[#17181A] px-4 text-[10px] uppercase tracking-[0.18em] font-[Archivo] text-[#EFE8DA] hover:bg-[#6B4630]"
              >
                Continue
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

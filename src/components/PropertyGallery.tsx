import { useCallback, useEffect, useRef, useState } from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  src: string;
  label: string;
  alt?: string;
  /** object-position override, for photos whose subject is off-centre. */
  position?: string;
};

/**
 * Property gallery: an Embla carousel with a Dialog lightbox.
 *
 * Every slide sits inside AspectRatio so the box is reserved before the image
 * decodes. That is the highest-value change in this pass for Core Web Vitals —
 * the page previously shipped large unsized photos and shifted as each landed.
 *
 * Keyboard: Embla binds arrow keys on the carousel root; the lightbox binds its
 * own arrows and Dialog handles Escape and focus return to the trigger.
 * `loop` is off deliberately, so arrowing does not cycle forever.
 */
export function PropertyGallery({
  items,
  className,
}: {
  items: GalleryItem[];
  className?: string;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [openAt, setOpenAt] = useState<number | null>(null);
  // The lightbox is opened programmatically rather than through DialogTrigger,
  // so Radix has no trigger to restore focus to. Track it ourselves.
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const closeLightbox = useCallback(() => {
    setOpenAt(null);
    // Let Radix finish unmounting before moving focus, or it gets clobbered.
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const step = useCallback(
    (delta: number) => {
      setOpenAt((prev) => {
        if (prev === null) return prev;
        const next = prev + delta;
        return next < 0 || next >= items.length ? prev : next;
      });
    },
    [items.length],
  );

  useEffect(() => {
    if (openAt === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openAt, step]);

  const active = openAt !== null ? items[openAt] : null;

  return (
    <div className={className}>
      <Carousel opts={{ loop: false, align: "start" }} setApi={setApi}>
        <CarouselContent className="-ml-4">
          {items.map((item, i) => (
            <CarouselItem key={item.label} className="pl-4 sm:basis-1/2 lg:basis-1/3">
              <button
                type="button"
                onClick={(e) => {
                  triggerRef.current = e.currentTarget;
                  setOpenAt(i);
                }}
                aria-label={`View ${item.label} full size`}
                className="group relative block w-full cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B4630] focus-visible:ring-offset-2 focus-visible:ring-offset-[#EFE8DA]"
              >
                <AspectRatio ratio={3 / 2}>
                  <Skeleton className="absolute inset-0 h-full w-full rounded-none bg-[#17181A]/5" />
                  <img
                    src={item.src}
                    alt={item.alt ?? item.label}
                    loading="lazy"
                    decoding="async"
                    style={item.position ? { objectPosition: item.position } : undefined}
                    className="relative h-full w-full object-cover transition-transform duration-[var(--motion-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                  />
                </AspectRatio>
                <span className="absolute bottom-0 left-0 right-0 flex items-center gap-3 bg-[#EFE8DA] px-4 py-2.5 sm:px-5 sm:py-3">
                  <span className="h-px w-6 bg-[#6B4630] sm:w-8" />
                  <span className="text-[9px] uppercase tracking-[0.2em] font-[Archivo] text-[#17181A] sm:text-[10px] sm:tracking-[0.24em]">
                    {item.label}
                  </span>
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2" role="tablist" aria-label="Gallery position">
            {items.map((item, i) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={current === i}
                aria-label={`Go to ${item.label}`}
                onClick={() => api?.scrollTo(i)}
                className={cn(
                  "h-1.5 cursor-pointer rounded-full transition-all duration-[var(--motion-fast)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6B4630] focus-visible:ring-offset-2",
                  current === i ? "w-6 bg-[#6B4630]" : "w-1.5 bg-[#6B4630]/30",
                )}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <CarouselPrevious className="static translate-y-0 cursor-pointer border-[#6B4630]/30 text-[#6B4630] hover:bg-[#6B4630] hover:text-[#EFE8DA]" />
            <CarouselNext className="static translate-y-0 cursor-pointer border-[#6B4630]/30 text-[#6B4630] hover:bg-[#6B4630] hover:text-[#EFE8DA]" />
          </div>
        </div>
      </Carousel>

      <Dialog open={openAt !== null} onOpenChange={(open) => !open && closeLightbox()}>
        <DialogContent className="max-w-5xl border-none bg-[#17181A] p-2 sm:p-4">
          <DialogTitle className="sr-only">{active?.label ?? "Gallery image"}</DialogTitle>
          <DialogDescription className="sr-only">
            Use the left and right arrow keys to move between photos, or Escape to close.
          </DialogDescription>
          {active && (
            <figure>
              <img
                src={active.src}
                alt={active.alt ?? active.label}
                className="max-h-[80vh] w-full object-contain"
              />
              <figcaption className="mt-3 flex items-center justify-between px-2 pb-1 text-[10px] uppercase tracking-[0.24em] font-[Archivo] text-[#EFE8DA]/70">
                <span>{active.label}</span>
                <span aria-hidden="true">
                  {(openAt ?? 0) + 1} / {items.length}
                </span>
              </figcaption>
            </figure>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

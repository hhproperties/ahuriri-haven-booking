import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

/**
 * The date-range picker body of the sticky booking bar.
 *
 * Split into its own module purely so it can be lazy-loaded: react-day-picker
 * and its date helpers are around 60KB gzipped, and importing Calendar directly
 * from the homepage pulled all of it into the shared routes chunk that every
 * page loads. Nobody needs a calendar until they tap "Check availability", so
 * it is fetched on that tap instead.
 */
export default function BookingDatePicker({
  range,
  onRangeChange,
  onConfirm,
}: {
  range: DateRange | undefined;
  onRangeChange: (r: DateRange | undefined) => void;
  onConfirm: () => void;
}) {
  return (
    <>
      <Calendar
        mode="range"
        selected={range}
        onSelect={onRangeChange}
        numberOfMonths={1}
        disabled={{ before: new Date() }}
        autoFocus
      />
      <div className="flex items-center justify-between gap-2 border-t border-[#6B4630]/20 p-3">
        <span className="text-[10px] uppercase tracking-[0.18em] font-[Archivo] text-[#17181A]/60">
          {range?.from && range?.to ? "Dates selected" : "Pick your dates"}
        </span>
        <Button
          onClick={onConfirm}
          className="h-9 cursor-pointer bg-[#17181A] px-4 text-[10px] uppercase tracking-[0.18em] font-[Archivo] text-[#EFE8DA] hover:bg-[#6B4630]"
        >
          Continue
        </Button>
      </div>
    </>
  );
}

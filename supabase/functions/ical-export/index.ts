import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

/** YYYY-MM-DD -> YYYYMMDD */
function icalDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

function stamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function vevent(uid: string, start: string, end: string, summary: string): string {
  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp()}`,
    `DTSTART;VALUE=DATE:${icalDate(start)}`,
    `DTEND;VALUE=DATE:${icalDate(end)}`,
    `SUMMARY:${summary.replace(/\n/g, " ").replace(/,/g, "\\,")}`,
    "END:VEVENT",
  ].join("\r\n");
}

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const [bookingsRes, gcalRes] = await Promise.all([
      supabase.from("bookings").select("id, booking_reference, guest_name, check_in, check_out").in("status", ["pending_payment", "confirmed"]),
      supabase.from("google_calendar_events").select("id, start_date, end_date, summary"),
    ]);

    if (bookingsRes.error) throw bookingsRes.error;
    if (gcalRes.error) throw gcalRes.error;

    const lines: string[] = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//The Vulcan Ahuriri//Booking Sync//EN",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
    ];

    for (const b of bookingsRes.data ?? []) {
      lines.push(
        vevent(
          `vulcan-booking-${b.id}`,
          b.check_in,
          b.check_out,
          `Blocked — The Vulcan (${b.booking_reference})`
        )
      );
    }

    for (const e of gcalRes.data ?? []) {
      lines.push(
        vevent(
          `vulcan-gcal-${e.id}`,
          e.start_date,
          e.end_date,
          e.summary || "Blocked — Google Calendar"
        )
      );
    }

    lines.push("END:VCALENDAR");
    const ics = lines.join("\r\n") + "\r\n";

    return new Response(ics, {
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": "attachment; filename=\"vulcan-availability.ics\"",
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error("ical-export error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

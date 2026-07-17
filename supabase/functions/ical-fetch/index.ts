import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

interface ICalEvent {
  start: string;
  end: string;
  summary?: string;
}

/**
 * Parse an iCal (.ics) string into a list of event date ranges.
 */
function parseICal(ics: string): ICalEvent[] {
  const events: ICalEvent[] = [];
  const lines = ics.split(/\r?\n/);
  let current: Partial<ICalEvent> | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "BEGIN:VEVENT") {
      current = {};
    } else if (trimmed === "END:VEVENT") {
      if (current?.start && current?.end) {
        events.push({
          start: current.start,
          end: current.end,
          summary: current.summary,
        });
      }
      current = null;
    } else if (current) {
      if (trimmed.startsWith("DTSTART")) {
        const val = trimmed.split(":")[1] || trimmed.split(";")[1] || "";
        current.start = formatICalDate(val);
      } else if (trimmed.startsWith("DTEND")) {
        const val = trimmed.split(":")[1] || trimmed.split(";")[1] || "";
        current.end = formatICalDate(val);
      } else if (trimmed.startsWith("SUMMARY:")) {
        current.summary = trimmed.slice(8);
      }
    }
  }

  return events;
}

/** Convert iCal date format (20240325 or 20240325T100000Z) to YYYY-MM-DD */
function formatICalDate(ical: string): string {
  const d = ical.replace(/T.*$/, "");
  if (d.length >= 8) {
    return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
  }
  return d;
}

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get the Airbnb iCal URL from payment_settings
    const { data: settings } = await supabase
      .from("payment_settings")
      .select("airbnb_ical_url")
      .eq("id", 1)
      .single();

    const icalUrl = settings?.airbnb_ical_url;
    if (!icalUrl) {
      return new Response(JSON.stringify({ error: "No iCal URL configured. Set it in Admin > Settings." }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Fetch the iCal feed
    const response = await fetch(icalUrl);
    if (!response.ok) {
      console.error("iCal fetch failed:", response.status, await response.text());
      return new Response(JSON.stringify({ error: "Failed to fetch iCal feed" }), { status: 500, headers: corsHeaders });
    }

    const ics = await response.text();
    const events = parseICal(ics);

    if (events.length === 0) {
      return new Response(JSON.stringify({ synced: 0, message: "No events found in iCal feed" }), {
        headers: corsHeaders,
      });
    }

    // Clear old blocked dates and insert fresh ones
    await supabase.from("airbnb_blocked_dates").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const rows = events.map((ev) => ({
      source: "airbnb",
      start_date: ev.start,
      end_date: ev.end,
      summary: ev.summary?.slice(0, 200) ?? null,
      fetched_at: new Date().toISOString(),
    }));

    const { error: insertErr } = await supabase.from("airbnb_blocked_dates").insert(rows);
    if (insertErr) {
      console.error("Error inserting blocked dates:", insertErr);
      return new Response(JSON.stringify({ error: insertErr.message }), { status: 500, headers: corsHeaders });
    }

    return new Response(
      JSON.stringify({
        synced: events.length,
        range: `${events[0].start} — ${events[events.length - 1].end}`,
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("ical-fetch error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

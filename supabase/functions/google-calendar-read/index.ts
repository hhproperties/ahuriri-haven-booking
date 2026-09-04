import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

interface ICalEvent {
  start: string;
  end: string;
  summary?: string;
}

/** Parse an iCal (.ics) string into a list of event date ranges. */
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
        events.push({ start: current.start, end: current.end, summary: current.summary });
      }
      current = null;
    } else if (current) {
      if (trimmed.startsWith("DTSTART")) {
        current.start = formatICalDate(trimmed.split(":")[1] || trimmed.split(";")[1] || "");
      } else if (trimmed.startsWith("DTEND")) {
        current.end = formatICalDate(trimmed.split(":")[1] || trimmed.split(";")[1] || "");
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

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { data: settings } = await supabase
      .from("payment_settings")
      .select("google_calendar_ical_url")
      .eq("id", 1)
      .single();

    const icalUrl = settings?.google_calendar_ical_url;
    if (!icalUrl) {
      return new Response(JSON.stringify({ error: "No Google Calendar iCal URL configured. Set it in Admin > Settings." }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const response = await fetch(icalUrl);
    if (!response.ok) {
      console.error("Google iCal fetch failed:", response.status, await response.text());
      return new Response(JSON.stringify({ error: "Failed to fetch Google iCal feed" }), { status: 500, headers: corsHeaders });
    }

    const ics = await response.text();
    const events = parseICal(ics);

    // Replace the stored Google events with a fresh snapshot.
    await supabase.from("google_calendar_events").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    if (events.length === 0) {
      await supabase.from("calendar_sync_log").insert({
        source: "google_calendar",
        direction: "read",
        status: "ok",
        event_count: 0,
        message: "No events found in Google iCal feed",
      });
      return new Response(JSON.stringify({ synced: 0, message: "No events found in Google iCal feed" }), {
        headers: corsHeaders,
      });
    }

    const rows = events.map((ev) => ({
      source: "google_calendar",
      start_date: ev.start,
      end_date: ev.end,
      summary: ev.summary?.slice(0, 200) ?? null,
      fetched_at: new Date().toISOString(),
    }));

    const { error: insertErr } = await supabase.from("google_calendar_events").insert(rows);
    if (insertErr) {
      console.error("Error inserting Google events:", insertErr);
      await supabase.from("calendar_sync_log").insert({
        source: "google_calendar",
        direction: "read",
        status: "error",
        event_count: events.length,
        message: insertErr.message,
      });
      return new Response(JSON.stringify({ error: insertErr.message }), { status: 500, headers: corsHeaders });
    }

    await supabase.from("calendar_sync_log").insert({
      source: "google_calendar",
      direction: "read",
      status: "ok",
      event_count: events.length,
      message: `Synced ${events.length} events from Google iCal`,
    });

    return new Response(
      JSON.stringify({
        synced: events.length,
        range: `${events[0].start} — ${events[events.length - 1].end}`,
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("google-calendar-read error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

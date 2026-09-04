import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

/** Base64url-encode a UTF-8 string (JWT header/payload). */
function b64urlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode a PEM private key body into its DER bytes. */
function pemToBytes(pem: string): Uint8Array {
  const body = pem
    .replace(/-----BEGIN [A-Z ]+-----/, "")
    .replace(/-----END [A-Z ]+-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri: string;
}

/** Exchange a signed JWT for a Google OAuth2 access token. */
async function getAccessToken(sa: ServiceAccount): Promise<string> {
  const header = b64urlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const now = Math.floor(Date.now() / 1000);
  const claims = b64urlEncode(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/calendar",
      aud: sa.token_uri || "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const key = await crypto.subtle.importKey(
    "pkcs8",
    pemToBytes(sa.private_key),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    key,
    new TextEncoder().encode(`${header}.${claims}`)
  );
  const sigBytes = new Uint8Array(signature);
  let binary = "";
  for (const b of sigBytes) binary += String.fromCharCode(b);
  const assertion = `${header}.${claims}.${btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}`;

  const params = new URLSearchParams();
  params.append("grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer");
  params.append("assertion", assertion);

  const res = await fetch(sa.token_uri || "https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const json = await res.json();
  if (!res.ok || !json.access_token) {
    throw new Error(`Google token exchange failed: ${JSON.stringify(json)}`);
  }
  return json.access_token as string;
}

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId required" }), { status: 400, headers: corsHeaders });
    }

    const saJson = Deno.env.get("GOOGLE_SERVICE_ACCOUNT_JSON");
    if (!saJson) {
      return new Response(JSON.stringify({ error: "GOOGLE_SERVICE_ACCOUNT_JSON not set" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();
    if (bErr || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404, headers: corsHeaders });
    }

    if (booking.google_calendar_event_id) {
      return new Response(JSON.stringify({ skipped: true, message: "Google event already exists" }), {
        headers: corsHeaders,
      });
    }

    const { data: settings } = await supabase
      .from("payment_settings")
      .select("google_calendar_id")
      .eq("id", 1)
      .single();

    const calendarId = settings?.google_calendar_id || Deno.env.get("GOOGLE_CALENDAR_ID");
    if (!calendarId) {
      return new Response(JSON.stringify({ error: "No Google Calendar ID configured" }), { status: 400, headers: corsHeaders });
    }

    const sa: ServiceAccount = JSON.parse(saJson);
    const accessToken = await getAccessToken(sa);

    const event = {
      summary: `The Vulcan — ${booking.guest_name} (${booking.booking_reference})`,
      description: `${booking.guests_count} guest(s), ${booking.bedrooms_booked} bedroom(s). Contact: ${booking.email} / ${booking.phone}`,
      start: { date: booking.check_in },
      end: { date: booking.check_out },
    };

    const calRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      }
    );

    const calJson = await calRes.json();
    if (!calRes.ok) {
      console.error("Google Calendar insert failed:", calJson);
      await supabase.from("calendar_sync_log").insert({
        source: "google_calendar",
        direction: "write",
        status: "error",
        event_count: 0,
        message: calJson?.error?.message || "Google Calendar insert failed",
      });
      return new Response(JSON.stringify({ error: calJson?.error?.message || "Google Calendar insert failed" }), {
        status: 502,
        headers: corsHeaders,
      });
    }

    const { error: updErr } = await supabase
      .from("bookings")
      .update({ google_calendar_event_id: calJson.id, sync_status: "calendar_created" })
      .eq("id", bookingId);
    if (updErr) console.error("Failed to store Google event id:", updErr);

    await supabase.from("calendar_sync_log").insert({
      source: "google_calendar",
      direction: "write",
      status: "ok",
      event_count: 1,
      message: `Created event ${calJson.id} for ${booking.booking_reference}`,
    });

    return new Response(JSON.stringify({ created: true, event_id: calJson.id }), { headers: corsHeaders });
  } catch (err) {
    console.error("google-calendar-write error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

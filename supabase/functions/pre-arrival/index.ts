import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail, emailLayout } from "../_shared/resend.ts";

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    // Accept both cron trigger and manual call
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // If specific bookingId provided, send for that booking
    // Otherwise, find all confirmed bookings checking in tomorrow
    let bookings;
    if (body.bookingId) {
      const { data } = await supabase.from("bookings").select("*").eq("id", body.bookingId).eq("status", "confirmed");
      bookings = data ?? [];
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().slice(0, 10);

      // Check which bookings already received this email
      const { data: alreadySent } = await supabase
        .from("email_log")
        .select("booking_id")
        .eq("template", "pre_arrival");

      const sentIds = new Set(alreadySent?.map((r) => r.booking_id) ?? []);

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("status", "confirmed")
        .eq("check_in", tomorrowStr);

      bookings = (data ?? []).filter((b) => !sentIds.has(b.id));
    }

    const results: { ref: string; sent: boolean }[] = [];

    for (const booking of bookings) {
      const reference = booking.booking_reference;
      const name = booking.guest_name;

      // Fetch booking details for the email
      const checkIn = new Date(booking.check_in + "T14:00:00").toLocaleDateString("en-NZ", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });
      const checkOut = new Date(booking.check_out + "T10:00:00").toLocaleDateString("en-NZ", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      });

      // Generate a random 4-digit lockbox code (in production, store this per booking)
      const lockboxCode = Math.floor(1000 + Math.random() * 9000).toString();

      const html = emailLayout(`
        <h1>You're checking in tomorrow, ${name}! 🎉</h1>
        <p>We're looking forward to hosting you at <strong>The Vulcan, Ahuriri</strong>. Here's everything you need for a smooth arrival.</p>

        <h2>Your stay</h2>
        <dl class="detail">
          <dt>Reference</dt>
          <dd>${reference}</dd>
          <dt>Check-in</dt>
          <dd>${checkIn} (from 2 PM)</dd>
          <dt>Check-out</dt>
          <dd>${checkOut} (by 10 AM)</dd>
        </dl>

        <h2>Arrival details</h2>
        <dl class="detail">
          <dt>Address</dt>
          <dd>1 Vulcan Lane, Ahuriri, Napier</dd>
          <dt>Lockbox code</dt>
          <dd><strong>${lockboxCode}</strong></dd>
          <dt>Parking</dt>
          <dd>Free on-street parking on Vulcan Lane</dd>
        </dl>

        <h2>House notes</h2>
        <ul style="font-size:15px;line-height:1.7;color:#3A3226;padding-left:20px">
          <li>WiFi network: <strong>Vulcan_Guest</strong> · Password: on the welcome card inside</li>
          <li>Please remove shoes inside the apartment</li>
          <li>No smoking anywhere on the property</li>
          <li>Report any issues to Leah or Wayne — we're just upstairs</li>
        </ul>

        <p>Safe travels, and we'll see you tomorrow!</p>

        <hr />
        <p>Warm regards,<br />Leah & Wayne<br /><em>Your hosts at The Vulcan, Ahuriri</em></p>
      `);

      const result = await sendEmail({
        to: booking.email,
        subject: `Arriving tomorrow — ${reference}`,
        html,
      });

      await supabase.from("email_log").insert({
        booking_id: booking.id,
        template: "pre_arrival",
        recipient: booking.email,
      });

      results.push({ ref: reference, sent: !!result });
    }

    return new Response(JSON.stringify({ sent: results.length, bookings: results }), { headers: corsHeaders });
  } catch (err) {
    console.error("pre-arrival error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

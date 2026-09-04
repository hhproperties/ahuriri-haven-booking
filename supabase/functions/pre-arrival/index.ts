import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail, emailLayout, formatDate, deriveDoorCode, firstName } from "../_shared/resend.ts";

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
      const name = firstName(booking.guest_name);
      const doorCode = deriveDoorCode(booking.phone ?? "");
      const checkIn = formatDate(booking.check_in);
      const checkOut = formatDate(booking.check_out);

      const html = emailLayout(`
        <h1>Getting ready for your stay, ${name}.</h1>
        <p>Just a few days until your stay at <strong>The Vulcan, Ahuriri</strong> — here's everything you need.</p>

        <h2>Your stay</h2>
        <dl class="detail">
          <dt>Address</dt>
          <dd>1 Vulcan Lane, Ahuriri, Napier</dd>
          <dt>Check-in</dt>
          <dd>${checkIn} (from 2:00pm)</dd>
          <dt>Check-out</dt>
          <dd>${checkOut} (by 10:00am)</dd>
          <dt>Parking</dt>
          <dd>Free off-street parking is available on site</dd>
        </dl>

        <h2>Your door code</h2>
        <p>Your door code is the last 4 digits of the cellphone number you booked with — <strong>${doorCode}</strong>. Simply enter this on the keypad at the door.</p>

        <h2>House notes</h2>
        <ul style="font-size:15px;line-height:1.7;color:#17181A;padding-left:20px">
          <li>WiFi network name and password are provided at the property</li>
          <li>Please remove shoes inside the apartment</li>
          <li>No smoking anywhere on the property</li>
          <li>Report any issues to Leah or Wayne — we're just upstairs</li>
        </ul>

        <p>If your plans change or your arrival time shifts, just let us know.</p>

        <hr />
        <p class="signoff">See you soon,<br />Leah &amp; Wayne<br /><em>The Vulcan, Ahuriri</em></p>
      `);

      const result = await sendEmail({
        to: booking.email,
        subject: `Getting ready for your stay at The Vulcan (${booking.check_in})`,
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

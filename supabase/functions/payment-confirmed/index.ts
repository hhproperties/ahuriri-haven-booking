import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail, emailLayout } from "../_shared/resend.ts";

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { bookingId } = await req.json();

    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId required" }), { status: 400, headers: corsHeaders });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bErr || !booking) {
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404, headers: corsHeaders });
    }

    const reference = booking.booking_reference;
    const name = booking.guest_name;
    const checkIn = new Date(booking.check_in + "T14:00:00").toLocaleDateString("en-NZ", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const checkOut = new Date(booking.check_out + "T10:00:00").toLocaleDateString("en-NZ", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });

    const html = emailLayout(`
      <h1>Confirmed — see you soon, ${name}!</h1>
      <p>Your booking at <strong>The Vulcan, Ahuriri</strong> is confirmed. We've received your payment and everything is locked in.</p>

      <h2>Booking details</h2>
      <dl class="detail">
        <dt>Reference</dt>
        <dd>${reference}</dd>
        <dt>Check-in</dt>
        <dd>${checkIn}</dd>
        <dt>Check-out</dt>
        <dd>${checkOut}</dd>
      </dl>

      <h2>Arrival information</h2>
      <dl class="detail">
        <dt>Address</dt>
        <dd>1 Vulcan Lane, Ahuriri, Napier</dd>
        <dt>Check-in</dt>
        <dd>From 2 PM — contactless self-check-in via lockbox</dd>
        <dt>Parking</dt>
        <dd>Free on-street parking on Vulcan Lane</dd>
        <dt>Check-out</dt>
        <dd>10 AM — please leave the lockbox key inside</dd>
      </dl>

      <p>We'll send you arrival instructions (WiFi code, lockbox code, house manual) closer to your stay. If you need anything in the meantime, just reply to this email.</p>

      <hr />
      <p>Warm regards,<br />Leah & Wayne<br /><em>Your hosts at The Vulcan, Ahuriri</em></p>
    `);

    const result = await sendEmail({ to: booking.email, subject: `Booking confirmed — ${reference}`, html });

    await supabase.from("email_log").insert({
      booking_id: bookingId,
      template: "payment_confirmed",
      recipient: booking.email,
    });

    return new Response(JSON.stringify({ sent: !!result, reference }), { headers: corsHeaders });
  } catch (err) {
    console.error("payment-confirmed error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

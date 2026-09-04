import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail, emailLayout, formatDate, formatNZD, firstName, TERMS_URL } from "../_shared/resend.ts";

const DAY_MS = 86400000;

/**
 * Triggered by booking_cancelled_trigger when a booking's status flips to
 * 'cancelled'. Emails the guest with refund eligibility per the 30-day policy.
 */
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
      console.error("Booking not found:", bookingId, bErr);
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404, headers: corsHeaders });
    }

    // Skip if this cancellation was an automatic hold expiry — the guest was
    // already emailed by the hold-expiry function (Template 6).
    const { data: holdEmail } = await supabase
      .from("email_log")
      .select("id")
      .eq("booking_id", bookingId)
      .eq("template", "payment_hold_expired")
      .maybeSingle();

    if (holdEmail) {
      return new Response(JSON.stringify({ skipped: true, reason: "hold_expiry" }), { headers: corsHeaders });
    }

    const name = firstName(booking.guest_name);
    const reference = booking.booking_reference;
    const checkIn = formatDate(booking.check_in);
    const checkOut = formatDate(booking.check_out);
    const total = formatNZD(booking.total_amount_cents);

    // Full refund if cancelled more than 30 days before check-in.
    const checkInDate = new Date(booking.check_in + "T00:00:00");
    const cancelledAt = booking.cancelled_at ? new Date(booking.cancelled_at) : new Date();
    const daysUntilCheckIn = Math.floor((checkInDate.getTime() - cancelledAt.getTime()) / DAY_MS);
    const refundEligible = daysUntilCheckIn > 30;

    const refundBlock = refundEligible
      ? `<p>As this cancellation was made more than 30 days before check-in, you're entitled to a full refund. <strong>${total}</strong> will be returned to your original payment method within 5&ndash;10 business days.</p>`
      : `<p>As this cancellation falls within 30 days of check-in, it isn't eligible for a refund under our cancellation policy. <a href="${TERMS_URL}">View full terms</a>. If there are exceptional circumstances, please reply to this email and we're happy to discuss.</p>`;

    const html = emailLayout(`
      <h1>Your booking has been cancelled, ${name}.</h1>
      <p>This confirms your booking for ${checkIn} &ndash; ${checkOut} at <strong>The Vulcan, Ahuriri</strong> has been cancelled.</p>

      ${refundBlock}

      <dl class="detail">
        <dt>Booking reference</dt>
        <dd>${reference}</dd>
      </dl>

      <p>We're sorry not to be hosting you this time — you're welcome back any time.</p>

      <hr />
      <p class="signoff">Leah &amp; Wayne<br /><em>The Vulcan, Ahuriri</em></p>
    `);

    const result = await sendEmail({
      to: booking.email,
      subject: `Your Vulcan, Ahuriri booking has been cancelled`,
      html,
    });

    await supabase.from("email_log").insert({
      booking_id: bookingId,
      template: "cancellation",
      recipient: booking.email,
    });

    return new Response(JSON.stringify({ sent: !!result, reference }), { headers: corsHeaders });
  } catch (err) {
    console.error("cancellation error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

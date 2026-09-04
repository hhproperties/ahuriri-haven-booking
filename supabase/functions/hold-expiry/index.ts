import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail, emailLayout, formatDate, firstName } from "../_shared/resend.ts";

/**
 * Cron-triggered function that cancels pending_payment bookings
 * where the 48-hour payment hold has expired, and notifies the guest.
 * Runs every 10 minutes via pg_cron.
 */
serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find expired holds that haven't already been cancelled
    const now = new Date().toISOString();
    const { data: expired, error: fetchErr } = await supabase
      .from("bookings")
      .select("id, booking_reference, guest_name, email, phone, check_in, check_out, created_at")
      .eq("status", "pending_payment")
      .lt("payment_hold_expires_at", now);

    if (fetchErr) {
      console.error("Error fetching expired bookings:", fetchErr);
      return new Response(JSON.stringify({ error: fetchErr.message }), { status: 500, headers: corsHeaders });
    }

    if (!expired || expired.length === 0) {
      return new Response(JSON.stringify({ cancelled: 0 }), { headers: corsHeaders });
    }

    // Notify each guest, then cancel
    const results: { reference: string; sent: boolean }[] = [];
    for (const b of expired) {
      const name = firstName(b.guest_name);
      const checkIn = formatDate(b.check_in);
      const checkOut = formatDate(b.check_out);

      const html = emailLayout(`
        <h1>Your held dates have been released, ${name}.</h1>
        <p>We haven't yet received payment for your requested stay at <strong>The Vulcan, Ahuriri</strong> (${checkIn} &ndash; ${checkOut}), so we've released these dates back to other guests.</p>

        <p>If you'd still like to stay with us, you're welcome to submit a new booking request any time — just note the dates will need to be available again at that point.</p>

        <p>If you did send a bank transfer and this seems wrong, please reply straight away and we'll sort it out — sometimes bank transfers take a little longer to land than expected.</p>

        <hr />
        <p class="signoff">Leah &amp; Wayne<br /><em>The Vulcan, Ahuriri</em></p>
      `);

      const result = await sendEmail({
        to: b.email,
        subject: `Your held dates at The Vulcan have been released`,
        html,
      });

      await supabase.from("email_log").insert({
        booking_id: b.id,
        template: "payment_hold_expired",
        recipient: b.email,
      });

      results.push({ reference: b.booking_reference, sent: !!result });
    }

    // Cancel them
    const ids = expired.map((b) => b.id);
    const { error: updateErr } = await supabase
      .from("bookings")
      .update({ status: "cancelled", cancelled_at: now })
      .in("id", ids);

    if (updateErr) {
      console.error("Error cancelling expired bookings:", updateErr);
      return new Response(JSON.stringify({ error: updateErr.message }), { status: 500, headers: corsHeaders });
    }

    // Log cancelled bookings
    for (const b of expired) {
      console.log(`Hold expired — cancelled booking ${b.booking_reference} (${b.guest_name}, ${b.email})`);
    }

    return new Response(
      JSON.stringify({ cancelled: expired.length, references: expired.map((b) => b.booking_reference), results }),
      { headers: corsHeaders }
    );
  } catch (err) {
    console.error("hold-expiry error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

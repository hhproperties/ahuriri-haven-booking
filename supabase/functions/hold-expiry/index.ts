import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

/**
 * Cron-triggered function that cancels pending_payment bookings
 * where the 48-hour payment hold has expired.
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
      .select("id, booking_reference, guest_name, email, created_at")
      .eq("status", "pending_payment")
      .lt("payment_hold_expires_at", now);

    if (fetchErr) {
      console.error("Error fetching expired bookings:", fetchErr);
      return new Response(JSON.stringify({ error: fetchErr.message }), { status: 500, headers: corsHeaders });
    }

    if (!expired || expired.length === 0) {
      return new Response(JSON.stringify({ cancelled: 0 }), { headers: corsHeaders });
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

    return new Response(JSON.stringify({ cancelled: expired.length, references: expired.map((b) => b.booking_reference) }), {
      headers: corsHeaders,
    });
  } catch (err) {
    console.error("hold-expiry error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

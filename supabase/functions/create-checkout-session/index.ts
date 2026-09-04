import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

const SITE_URL = Deno.env.get("SITE_URL") || "https://ahuriri-haven-booking.vercel.app";

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const { bookingId } = await req.json();
    if (!bookingId) {
      return new Response(JSON.stringify({ error: "bookingId required" }), { status: 400, headers: corsHeaders });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      console.error("STRIPE_SECRET_KEY not set");
      return new Response(JSON.stringify({ error: "Stripe is not configured" }), { status: 500, headers: corsHeaders });
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

    if (booking.status !== "pending_payment") {
      return new Response(JSON.stringify({ error: `Booking is ${booking.status}, not payable` }), { status: 400, headers: corsHeaders });
    }

    if (!booking.total_amount_cents || booking.total_amount_cents <= 0) {
      return new Response(JSON.stringify({ error: "Booking has no amount due" }), { status: 400, headers: corsHeaders });
    }

    const params = new URLSearchParams();
    params.append("mode", "payment");
    params.append("customer_email", booking.email);
    params.append("client_reference_id", bookingId);
    params.append("success_url", `${SITE_URL}/book/success?session_id={CHECKOUT_SESSION_ID}`);
    params.append("cancel_url", `${SITE_URL}/book/cancel`);
    params.append("expires_at", String(Math.floor(Date.now() / 1000) + 30 * 60));
    params.append("line_items[0][price_data][currency]", "nzd");
    params.append("line_items[0][price_data][product_data][name]", "Stay at The Vulcan, Ahuriri");
    params.append("line_items[0][price_data][unit_amount]", String(booking.total_amount_cents));
    params.append("line_items[0][quantity]", "1");
    params.append("metadata[bookingId]", bookingId);
    params.append("payment_intent_data[metadata][bookingId]", bookingId);

    const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    const stripeJson = await stripeRes.json();
    if (!stripeRes.ok) {
      console.error("Stripe checkout session error:", stripeJson);
      return new Response(JSON.stringify({ error: stripeJson?.error?.message || "Stripe request failed" }), {
        status: 502,
        headers: corsHeaders,
      });
    }

    const { error: updErr } = await supabase
      .from("bookings")
      .update({
        stripe_session_id: stripeJson.id,
        stripe_checkout_url: stripeJson.url,
        stripe_payment_status: "unpaid",
        sync_status: "checkout_created",
      })
      .eq("id", bookingId);

    if (updErr) {
      console.error("Failed to store session on booking:", updErr);
    }

    return new Response(JSON.stringify({ url: stripeJson.url, session_id: stripeJson.id }), { headers: corsHeaders });
  } catch (err) {
    console.error("create-checkout-session error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";

function hexEncode(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i++) out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return out === 0;
}

/** Verify the Stripe-Signature header against STRIPE_WEBHOOK_SECRET. */
async function verifyStripeSignature(payload: string, sigHeader: string | null, secret: string): Promise<boolean> {
  if (!sigHeader) return false;
  const parts = sigHeader.split(",").map((p) => p.trim());
  const ts = parts.find((p) => p.startsWith("t="))?.slice(2);
  const v1 = parts.find((p) => p.startsWith("v1="))?.slice(3);
  if (!ts || !v1) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`${ts}.${payload}`));
  return timingSafeEqual(hexEncode(sig), v1);
}

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });
  }

  const secret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!secret) {
    console.error("STRIPE_WEBHOOK_SECRET not set");
    return new Response(JSON.stringify({ error: "Webhook not configured" }), { status: 500, headers: corsHeaders });
  }

  const payload = await req.text();
  const sigHeader = req.headers.get("Stripe-Signature");

  const valid = await verifyStripeSignature(payload, sigHeader, secret);
  if (!valid) {
    console.error("Invalid Stripe webhook signature");
    return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400, headers: corsHeaders });
  }

  let event: { type: string; data: { object: Record<string, unknown> } };
  try {
    event = JSON.parse(payload);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const object = event.data?.object ?? {};
  const bookingId =
    (object.client_reference_id as string | undefined) ||
    ((object.metadata as Record<string, string> | undefined)?.bookingId);

  if (!bookingId) {
    // Not one of our checkout sessions — acknowledge so Stripe stops retrying.
    return new Response(JSON.stringify({ received: true, ignored: true }), { headers: corsHeaders });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const paymentStatus = (object.payment_status as string | undefined) ?? "paid";
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          confirmed_at: new Date().toISOString(),
          stripe_session_id: object.id,
          stripe_payment_status: paymentStatus,
          payment_hold_expires_at: null,
          sync_status: "payment_confirmed",
        })
        .eq("id", bookingId)
        .eq("status", "pending_payment");
      if (error) console.error("Failed to confirm booking:", error);
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
    case "payment_intent.payment_failed": {
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "cancelled",
          cancelled_at: new Date().toISOString(),
          stripe_payment_status: "failed",
          sync_status: "payment_failed",
        })
        .eq("id", bookingId)
        .eq("status", "pending_payment");
      if (error) console.error("Failed to cancel booking:", error);
      break;
    }
    default:
      // Ignore other event types.
  }

  return new Response(JSON.stringify({ received: true }), { headers: corsHeaders });
});

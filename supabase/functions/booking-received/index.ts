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

    // Init Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch booking with payment settings
    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", bookingId)
      .single();

    if (bErr || !booking) {
      console.error("Booking not found:", bookingId, bErr);
      return new Response(JSON.stringify({ error: "Booking not found" }), { status: 404, headers: corsHeaders });
    }

    const { data: settings } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("id", 1)
      .single();

    const reference = booking.booking_reference;
    const name = booking.guest_name;
    const checkIn = new Date(booking.check_in + "T14:00:00").toLocaleDateString("en-NZ", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const checkOut = new Date(booking.check_out + "T10:00:00").toLocaleDateString("en-NZ", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    const total = (booking.total_amount_cents / 100).toLocaleString("en-NZ", { style: "currency", currency: "NZD" });
    const bedrooms = booking.bedrooms_booked;
    const guests = booking.guests_count;

    const accountName = settings?.bank_account_name ?? "H&H Property Group Limited";
    const accountNumber = settings?.bank_account_number ?? "";
    const particulars = (settings?.particulars_format ?? "VULCAN-{ref}").replace("{ref}", reference);

    const html = emailLayout(`
      <h1>Thanks for your booking, ${name}.</h1>
      <p>We've received your reservation at <strong>The Vulcan, Ahuriri</strong> and it's being held for 48 hours while we await payment.</p>

      <h2>Booking summary</h2>
      <dl class="detail">
        <dt>Reference</dt>
        <dd>${reference}</dd>
        <dt>Bedrooms</dt>
        <dd>${bedrooms} bedroom${bedrooms > 1 ? "s" : ""} (${guests} guest${guests > 1 ? "s" : ""})</dd>
        <dt>Check-in</dt>
        <dd>${checkIn} (2 PM)</dd>
        <dt>Check-out</dt>
        <dd>${checkOut} (10 AM)</dd>
        <dt>Total</dt>
        <dd>${total}</dd>
      </dl>

      <h2>How to pay</h2>
      <p>Please transfer the total amount to the account below within 48 hours. Use your booking reference as the reference so we can match your payment.</p>
      <dl class="detail">
        <dt>Account name</dt>
        <dd>${accountName}</dd>
        <dt>Account number</dt>
        <dd>${accountNumber}</dd>
        <dt>Particulars / Reference</dt>
        <dd><strong>${particulars}</strong></dd>
      </dl>

      <p>Once your payment is received and confirmed, we'll send your arrival details. If you have any questions in the meantime, just reply to this email or call us.</p>

      <hr />
      <p>Warm regards,<br />Leah & Wayne<br /><em>Your hosts at The Vulcan, Ahuriri</em></p>
    `);

    const result = await sendEmail({ to: booking.email, subject: `Payment instructions — ${reference}`, html });

    // Log the email
    await supabase.from("email_log").insert({
      booking_id: bookingId,
      template: "booking_received",
      recipient: booking.email,
    });

    return new Response(JSON.stringify({ sent: !!result, reference }), { headers: corsHeaders });
  } catch (err) {
    console.error("booking-received error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

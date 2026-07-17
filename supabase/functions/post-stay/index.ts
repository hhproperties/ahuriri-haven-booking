import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { sendEmail, emailLayout } from "../_shared/resend.ts";

serve(async (req: Request) => {
  const cors = handleCors(req);
  if (cors) return cors;

  try {
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let bookings;
    if (body.bookingId) {
      const { data } = await supabase.from("bookings").select("*").eq("id", body.bookingId).eq("status", "confirmed");
      bookings = data ?? [];
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      const { data: alreadySent } = await supabase
        .from("email_log")
        .select("booking_id")
        .eq("template", "post_stay");

      const sentIds = new Set(alreadySent?.map((r) => r.booking_id) ?? []);

      const { data } = await supabase
        .from("bookings")
        .select("*")
        .eq("status", "confirmed")
        .eq("check_out", yesterdayStr);

      bookings = (data ?? []).filter((b) => !sentIds.has(b.id));
    }

    const results: { ref: string; sent: boolean }[] = [];

    for (const booking of bookings) {
      const reference = booking.booking_reference;
      const name = booking.guest_name;

      const html = emailLayout(`
        <h1>Thanks for staying, ${name}!</h1>
        <p>We hope you enjoyed your time at <strong>The Vulcan, Ahuriri</strong>. It was a pleasure having you as our guest.</p>

        <p>If you have a moment, we'd love to hear about your stay. Your review helps other travellers discover Ahuriri and helps us keep improving.</p>

        <p style="text-align:center">
          <a href="https://ahuriri-haven-booking.vercel.app/#reviews" class="btn">Leave a review</a>
        </p>

        <p>Couldn't find something? Left something behind? Just reply to this email and we'll sort it out.</p>

        <p>We'd love to welcome you back to Ahuriri again sometime.</p>

        <hr />
        <p>With thanks,<br />Leah & Wayne<br /><em>Your hosts at The Vulcan, Ahuriri</em></p>
      `);

      const result = await sendEmail({
        to: booking.email,
        subject: `Thanks for staying — ${reference}`,
        html,
      });

      await supabase.from("email_log").insert({
        booking_id: booking.id,
        template: "post_stay",
        recipient: booking.email,
      });

      results.push({ ref: reference, sent: !!result });
    }

    return new Response(JSON.stringify({ sent: results.length, bookings: results }), { headers: corsHeaders });
  } catch (err) {
    console.error("post-stay error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: corsHeaders });
  }
});

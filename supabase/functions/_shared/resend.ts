/**
 * Shared email helpers for The Vulcan, Ahuriri.
 *
 * Sends via Resend (https://resend.com). The RESEND_API_KEY secret must be set
 * in the Supabase project. Sender domain is hhproperties.co.nz.
 *
 * Brand tokens (see design-system): Retreat Cream #F5F0E6, Ink Charcoal #17181A,
 * Vulcan Gold #B9985A.
 */

export const SITE_URL = "https://ahuriri-haven-booking.vercel.app";
export const ADMIN_EMAIL = "admin@hhproperties.co.nz";
export const FROM_EMAIL = "The Vulcan, Ahuriri <stay@hhproperties.co.nz>";
export const TERMS_URL = `${SITE_URL}/terms`;
export const REVIEW_URL_FALLBACK = `${SITE_URL}/reviews`;

export async function sendEmail({
  to,
  subject,
  html,
  from = FROM_EMAIL,
  replyTo = "Leah & Wayne <stay@hhproperties.co.nz>",
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}): Promise<{ id: string } | null> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    console.error("RESEND_API_KEY not set — skipping email to", to);
    return null;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      reply_to: replyTo,
      to: [to],
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Resend error:", err);
    return null;
  }

  return res.json();
}

/** Wrap body HTML in the brand email template. */
export function emailLayout(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; background: #F5F0E6; font-family: 'Archivo', Helvetica, Arial, sans-serif; color: #17181A; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 20px; }
    .wordmark { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-size: 22px; letter-spacing: 0.02em; color: #17181A; text-align: center; }
    .wordmark .gold { color: #B9985A; }
    .rule { border: none; border-top: 1px solid #B9985A; margin: 12px auto 24px; width: 64px; }
    .card { background: #ffffff; border: 1px solid #EFE8DA; border-radius: 8px; padding: 32px; }
    h1 { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-size: 26px; font-weight: 600; margin: 0 0 16px; color: #17181A; line-height: 1.2; }
    h2 { font-family: 'Fraunces', Georgia, 'Times New Roman', serif; font-size: 18px; font-weight: 500; margin: 24px 0 8px; color: #17181A; }
    p { font-size: 15px; line-height: 1.65; margin: 0 0 16px; color: #17181A; }
    a { color: #B9985A; }
    .detail { background: #F5F0E6; border: 1px solid #EFE8DA; border-radius: 8px; padding: 16px 20px; margin: 20px 0; }
    .detail dt { font-size: 11px; text-transform: uppercase; letter-spacing: 0.16em; color: #8A7F6F; margin-top: 12px; }
    .detail dt:first-child { margin-top: 0; }
    .detail dd { font-size: 15px; margin: 2px 0 0; color: #17181A; font-weight: 500; }
    .btn { display: inline-block; background: #17181A; color: #F5F0E6 !important; text-decoration: none; padding: 12px 28px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 2px; margin: 12px 0; }
    hr { border: none; border-top: 1px solid #B9985A; margin: 24px 0; }
    .footer { font-size: 12px; color: #8A7F6F; text-align: center; margin-top: 32px; }
    .monogram { display: inline-block; width: 28px; height: 28px; line-height: 28px; border-radius: 50%; background: #17181A; color: #B9985A; font-family: 'Fraunces', Georgia, serif; font-weight: 600; text-align: center; margin-bottom: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="wordmark">The Vulcan <span class="gold">&middot;</span> Ahuriri</div>
    <hr class="rule" />
    <div class="card">
      ${bodyHtml}
    </div>
    <div class="footer">
      <div class="monogram">V</div>
      <p style="margin:0">The Vulcan, Ahuriri &middot; 1 Vulcan Lane, Ahuriri, Napier</p>
      <p style="margin:4px 0 0">H&amp;H Property Group Limited</p>
    </div>
  </div>
</body>
</html>`;
}

/** Format cents as NZD currency, e.g. 22000 -> "$220.00". */
export function formatNZD(cents: number): string {
  return (cents / 100).toLocaleString("en-NZ", { style: "currency", currency: "NZD" });
}

/** Format a YYYY-MM-DD date string as a long human-readable date. */
export function formatDate(dateStr: string, time = "14:00:00"): string {
  return new Date(`${dateStr}T${time}`).toLocaleDateString("en-NZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Door code is always the last 4 digits of the guest's booking cellphone. */
export function deriveDoorCode(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-4);
}

/** First word of a guest name, for "Hi {{first_name}}" salutations. */
export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? name;
}

/**
 * Internal notification to the owner when a booking is submitted or confirmed.
 * Not logged to email_log (internal, no guest-facing dedup needed).
 */
export async function sendAdminNotification(
  booking: {
    guest_name: string;
    email: string;
    phone: string;
    check_in: string;
    check_out: string;
    guests_count: number;
    total_amount_cents: number;
    booking_reference: string;
    payment_reference?: string | null;
    payment_method?: string | null;
    payment_hold_expires_at?: string | null;
  },
  statusLabel: string,
): Promise<{ id: string } | null> {
  const total = formatNZD(booking.total_amount_cents);
  const html = emailLayout(`
    <h1>New booking &mdash; ${booking.guest_name}</h1>
    <p><strong>${statusLabel}</strong> &middot; payment via ${booking.payment_method ?? "bank_transfer"}.</p>
    <dl class="detail">
      <dt>Guest</dt><dd>${booking.guest_name}</dd>
      <dt>Email</dt><dd>${booking.email}</dd>
      <dt>Phone</dt><dd>${booking.phone}</dd>
      <dt>Check-in</dt><dd>${booking.check_in}</dd>
      <dt>Check-out</dt><dd>${booking.check_out}</dd>
      <dt>Guests</dt><dd>${booking.guests_count}</dd>
      <dt>Total</dt><dd>${total}</dd>
      <dt>Booking reference</dt><dd>${booking.booking_reference}</dd>
    </dl>
    <p><a href="${SITE_URL}/admin">View in Admin Dashboard</a></p>
  `);
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `New booking — ${booking.guest_name}, ${booking.check_in} to ${booking.check_out} [${statusLabel}]`,
    html,
  });
}

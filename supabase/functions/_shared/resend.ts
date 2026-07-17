/**
 * Send email via Resend.
 * The RESEND_API_KEY secret must be set in the Supabase project.
 */
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
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
      from: "The Vulcan, Ahuriri <stay@hhproperties.co.nz>",
      reply_to: "Leah & Wayne <stay@hhproperties.co.nz>",
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

/** Wrap body text in a minimal email template. */
export function emailLayout(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Inter', Helvetica, Arial, sans-serif; background: #F5F0E6; color: #2C2416; }
    .container { max-width: 600px; margin: 0 auto; padding: 32px 24px; }
    .card { background: #ffffff; border-radius: 4px; padding: 32px; }
    h1 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 28px; font-weight: 600; margin: 0 0 16px; color: #2C2416; }
    h2 { font-family: 'Cormorant Garamond', Georgia, serif; font-size: 20px; font-weight: 500; margin: 24px 0 8px; color: #2C2416; }
    p { font-size: 15px; line-height: 1.7; margin: 0 0 16px; color: #3A3226; }
    .detail { border: 1px solid #E6DFD4; border-radius: 4px; padding: 16px 20px; margin: 20px 0; }
    .detail dt { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: #8A7F6F; margin-top: 12px; }
    .detail dt:first-child { margin-top: 0; }
    .detail dd { font-size: 15px; margin: 2px 0 0; color: #2C2416; font-weight: 500; }
    .btn { display: inline-block; background: #2C2416; color: #F5F0E6 !important; text-decoration: none; padding: 12px 28px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 2px; margin: 12px 0; }
    hr { border: none; border-top: 1px solid #E6DFD4; margin: 24px 0; }
    .footer { font-size: 12px; color: #8A7F6F; text-align: center; margin-top: 32px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      ${bodyHtml}
    </div>
    <div class="footer">
      <p style="margin:0">The Vulcan, Ahuriri · 1 Vulcan Lane, Ahuriri, Napier</p>
      <p style="margin:4px 0 0">H&H Property Group Limited</p>
    </div>
  </div>
</body>
</html>`;
}

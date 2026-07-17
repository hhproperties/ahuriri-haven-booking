import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PolicyPage } from "@/components/PolicyPage";

export const Route = createFileRoute("/cancellation")({
  component: CancellationPage,
  head: () => ({
    meta: [
      { title: "Cancellation Policy — The Vulcan, Ahuriri" },
      {
        name: "description",
        content:
          "Cancellation policy for direct bookings at The Vulcan, Ahuriri. Full refund outside 30 days. See our sliding scale and force majeure terms.",
      },
      { property: "og:title", content: "Cancellation Policy — The Vulcan, Ahuriri" },
      { property: "og:description", content: "Cancellation policy for The Vulcan, Ahuriri — full refund outside 30 days. Straightforward, fair, and written in plain English." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ahuriri-haven-booking.vercel.app/cancellation" }],
  }),
});

const timeline = [
  { label: "More than 30 days before check-in", detail: "100%" },
  { label: "Within 30 days of check-in", detail: "Non-refundable" },
];

const sections = [
  {
    number: "01",
    title: "Our policy, in short",
    lead: "Full refund if you cancel more than 30 days out. Within 30 days, the booking is non-refundable.",
    body: [
      {
        type: "list" as const,
        items: [
          "More than 30 days before check-in: Full refund (100%).",
          "Within 30 days of check-in: No refund.",
        ],
      },
      {
        type: "callout" as const,
        text: "Refunds are processed within 5–10 business days.",
      },
      {
        type: "paragraph" as const,
        text: "This applies to all direct bookings made through hhproperties.co.nz, regardless of payment method (bank transfer or, once available, card payment via Stripe).",
      },
    ],
  },
  {
    number: "02",
    title: "How cancellations work",
    lead: "Email us with your booking reference and we'll handle the rest.",
    body: [
      {
        type: "subheading" as const,
        text: "To cancel:",
      },
      {
        type: "paragraph" as const,
        text: 'Email us at <strong>admin@hhproperties.co.nz</strong> with your booking reference and the dates you\'d like to cancel. We\'ll confirm your cancellation and refund eligibility in writing.',
      },
      {
        type: "subheading" as const,
        text: "If you're outside 30 days of check-in:",
      },
      {
        type: "list" as const,
        items: [
          "Bank transfer bookings: your full payment will be refunded to the bank account it was paid from, generally within 5–10 business days.",
          "Stripe bookings (once live): your full payment will be refunded to your original payment method via Stripe, generally within 5–10 business days depending on your bank.",
        ],
      },
      {
        type: "subheading" as const,
        text: "If you're within 30 days of check-in:",
      },
      {
        type: "paragraph" as const,
        text: "Your booking is non-refundable under this policy. We understand this can be disappointing, particularly for genuinely unexpected circumstances (illness, bereavement, natural events) — please contact us regardless, as we're happy to discuss options at our discretion (for example, rescheduling to another available date where possible), even though this isn't guaranteed.",
      },
    ],
  },
  {
    number: "03",
    title: "If your booking is still pending payment",
    lead: "Haven't paid yet? The 48-hour window will expire on its own — no need to cancel.",
    body: [
      {
        type: "paragraph" as const,
        text: "If you've submitted a booking request by bank transfer but haven't yet paid, you can simply let the 48-hour payment window lapse and no cancellation is needed — the dates will release automatically and no charge occurs. If you've already sent payment and wish to cancel before we've confirmed your booking, contact us as above.",
      },
    ],
  },
  {
    number: "04",
    title: "If we need to cancel your booking",
    lead: "On the rare occasion we cancel, you get a full refund — no matter how close to check-in.",
    body: [
      {
        type: "paragraph" as const,
        text: "On rare occasions, we may need to cancel a confirmed booking (for example, due to an unforeseen issue with the Property, or a genuine double-booking error during the calendar sync process with Airbnb). In this situation:",
      },
      {
        type: "list" as const,
        items: [
          "You will receive a full refund of any amount paid, regardless of how close to check-in this occurs.",
          "Where possible, we will also try to help you find alternative accommodation, though we're not obligated to arrange or pay for this.",
        ],
      },
    ],
  },
  {
    number: "05",
    title: "No-shows & early departures",
    lead: "If you don't arrive, or leave early, the same 30-day rule applies based on your original check-in date.",
    body: [
      {
        type: "paragraph" as const,
        text: "If you don't arrive for your booking, or choose to leave early, no refund is provided for unused nights, in line with the policy above — the same 30-day rule applies based on your original check-in date, not your actual arrival or departure.",
      },
    ],
  },
  {
    number: "06",
    title: "Changes to your dates",
    lead: "Want to move your stay rather than cancel? Contact us early and we'll do our best to help.",
    body: [
      {
        type: "paragraph" as const,
        text: "If you'd like to move your stay to different dates rather than cancel, contact us as early as possible — we'll do our best to accommodate a date change (subject to availability and any price difference) without treating it as a cancellation, provided it's requested with reasonable notice.",
      },
    ],
  },
  {
    number: "07",
    title: "Questions",
    lead: "If anything here is unclear, or your situation doesn't fit neatly into the above, just email us.",
    body: [
      {
        type: "paragraph" as const,
        text: 'Leah and Wayne read every message personally and would rather have a conversation than leave you guessing. Email <strong>admin@hhproperties.co.nz</strong>.',
      },
    ],
  },
];

function CancellationPage() {
  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />
      <PolicyPage
        path="/cancellation"
        title="Cancellation Policy — The Vulcan, Ahuriri"
        description="Cancellation policy for direct bookings at The Vulcan, Ahuriri. Full refund outside 30 days — clear, fair, and written in plain English."
        eyebrow="Policy"
        headline="If plans change"
        accentWord="plans change"
        standfirst="Cancellations happen. Here's exactly what to expect — written so you know where you stand, no fine print required."
        lastUpdated="17 July 2026"
        datePublished="2026-07-17"
        dateModified="2026-07-17"
        summaryBullets={[
          "Full refund if you cancel more than 30 days before check-in.",
          "Within 30 days, the booking is non-refundable — but talk to us, we're human.",
          "If we need to cancel (rare, but it happens), you get every cent back.",
          "Want to move dates instead? Contact us early and we'll do our best.",
          "If anything's unclear, just ask — we'd rather talk than leave you guessing.",
        ]}
        timeline={timeline}
        sections={sections}
      />
      <SiteFooter />
    </div>
  );
}

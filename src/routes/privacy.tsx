import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PolicyPage } from "@/components/PolicyPage";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Notice — The Vulcan, Ahuriri" },
      {
        name: "description",
        content:
          "How H&H Property Group Limited collects, uses, stores, and protects your personal information when you book or enquire about The Vulcan, Ahuriri.",
      },
      { property: "og:title", content: "Privacy Notice — The Vulcan, Ahuriri" },
      { property: "og:description", content: "Privacy policy for The Vulcan, Ahuriri — how we handle your personal information when you book with us." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ahuriri-haven-booking.vercel.app/privacy" }],
  }),
});

const sections = [
  {
    number: "01",
    title: "Who we are",
    lead: "H&H Property Group Limited operates The Vulcan, Ahuriri and the website hhproperties.co.nz. We take your privacy seriously.",
    body: [
      {
        type: "paragraph" as const,
        text: 'H&H Property Group Limited ("we," "us," "our") operates The Vulcan, Ahuriri, a self-contained holiday apartment at 1 Vulcan Lane, Ahuriri, Napier, New Zealand, and the website hhproperties.co.nz. This policy explains how we collect, use, store, and protect your personal information in connection with your booking and use of our website, in accordance with the <strong>Privacy Act 2020</strong> (NZ).',
      },
    ],
  },
  {
    number: "02",
    title: "Information we collect",
    lead: "We collect only what we need to handle your booking — name, email, phone, dates, and any special requests you share.",
    body: [
      {
        type: "subheading" as const,
        text: "When you make a booking or contact us, we may collect:",
      },
      {
        type: "list" as const,
        items: [
          "Your name, email address, and phone number",
          "Booking details: check-in/check-out dates, number of guests, special requests or notes",
          "Payment information: for bank transfer bookings, the reference used and confirmation of receipt from our bank; once card payments via Stripe are live, payment is processed directly by Stripe and we do not store full card details ourselves",
          "Communications you send us (email correspondence, review submissions)",
          "Basic website usage data (e.g. pages visited), where analytics tools are enabled",
        ],
      },
      {
        type: "paragraph" as const,
        text: "We do not knowingly collect information from children; bookings must be made by someone 18 or over.",
      },
    ],
  },
  {
    number: "03",
    title: "How we use your information",
    lead: "Your information helps us host you. That's it. We don't sell it, we don't market to you without permission.",
    body: [
      {
        type: "paragraph" as const,
        text: "We use your information to:",
      },
      {
        type: "list" as const,
        items: [
          "Process and confirm your booking, including generating your door access code (derived from your phone number)",
          "Communicate with you before, during, and after your stay (confirmation, payment instructions, pre-arrival information, post-stay follow-up)",
          "Process payments and refunds",
          "Respond to enquiries or complaints",
          "Maintain our own booking records and calendar, including syncing booked dates with our Airbnb listing calendar to prevent double-bookings",
          "Improve our website and services",
          "Where you've agreed, feature your review (first name and initial only) on our website",
        ],
      },
      {
        type: "paragraph" as const,
        text: "We do not use your information for marketing communications unless you've separately opted in, and we do not sell your personal information to third parties.",
      },
    ],
  },
  {
    number: "04",
    title: "Who we share it with",
    lead: "We share limited information with trusted providers who help us run the booking — nothing more than necessary.",
    body: [
      {
        type: "paragraph" as const,
        text: "We share limited information with the following third parties, solely to operate our booking and communication systems:",
      },
      {
        type: "list" as const,
        items: [
          "Supabase (database and hosting) — stores booking records",
          "Resend — sends transactional emails (confirmation, pre-arrival, post-stay, cancellation)",
          "Stripe — processes card payments securely (once live); Stripe holds your payment details, not us",
          "Google Workspace — our business email and calendar tools",
          "Airbnb — where a booking is made or cross-referenced via Airbnb's calendar, limited date-range information (not personal guest details) is shared via calendar sync to avoid double-booking",
        ],
      },
      {
        type: "paragraph" as const,
        text: "We do not share your information with any other third party except where required by law, or to protect the safety of guests, hosts, or the public.",
      },
    ],
  },
  {
    number: "05",
    title: "Where your information is stored",
    lead: "Your data lives with cloud providers who meet NZ privacy standards.",
    body: [
      {
        type: "paragraph" as const,
        text: "Your information is stored using cloud-based services (Supabase, Google Workspace, Stripe, Resend) which may store data outside New Zealand. We take reasonable steps to ensure these providers maintain appropriate security and privacy standards consistent with the Privacy Act 2020's requirements for information sent overseas.",
      },
    ],
  },
  {
    number: "06",
    title: "How long we keep it",
    lead: "We keep booking records for as long as NZ tax law requires — generally 7 years — then delete or anonymise.",
    body: [
      {
        type: "paragraph" as const,
        text: "We retain booking and guest information for as long as reasonably necessary for tax, accounting, and legal purposes (generally at least 7 years, in line with NZ tax record-keeping requirements), and delete or anonymise it thereafter unless you request earlier deletion and we're not legally required to retain it.",
      },
    ],
  },
  {
    number: "07",
    title: "Your rights",
    lead: "You can ask us what we hold, correct it, or request deletion — and we'll respond promptly.",
    body: [
      {
        type: "paragraph" as const,
        text: "Under the Privacy Act 2020, you have the right to:",
      },
      {
        type: "list" as const,
        items: [
          "Ask us what personal information we hold about you",
          "Ask us to correct any information that is inaccurate",
          "Ask us to delete your information, where we're not required to retain it for legal or accounting reasons",
        ],
      },
      {
        type: "paragraph" as const,
        text: 'To make a request, email <strong>admin@hhproperties.co.nz</strong>. We\'ll respond within a reasonable time and in line with our obligations under the Act.',
      },
    ],
  },
  {
    number: "08",
    title: "Complaints",
    lead: "If you're unhappy with how we've handled your data, tell us first. If we can't resolve it, the Privacy Commissioner can help.",
    body: [
      {
        type: "paragraph" as const,
        text: 'If you have concerns about how we\'ve handled your personal information, please contact us first at admin@hhproperties.co.nz so we can try to resolve it directly. If you\'re not satisfied with our response, you can contact the <strong>Office of the Privacy Commissioner</strong> (privacy.org.nz).',
      },
    ],
  },
  {
    number: "09",
    title: "Changes to this policy",
    lead: "If this policy changes, we'll update the date and let you know. We'll never change it without notice.",
    body: [
      {
        type: "paragraph" as const,
        text: 'We may update this policy from time to time to reflect changes in our practices or the law. The "last updated" date at the top of this page will reflect the most recent version.',
      },
    ],
  },
  {
    number: "10",
    title: "Contact",
    lead: "We're here if you have questions about your privacy.",
    body: [
      {
        type: "paragraph" as const,
        text: "H&H Property Group Limited, 1 Vulcan Lane, Ahuriri, Napier, Hawke's Bay, New Zealand.",
      },
      {
        type: "paragraph" as const,
        text: "Email: admin@hhproperties.co.nz",
      },
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />
      <PolicyPage
        path="/privacy"
        title="Privacy Notice — The Vulcan, Ahuriri"
        description="How H&H Property Group Limited collects, uses, stores, and protects your personal information when you book The Vulcan, Ahuriri."
        eyebrow="Privacy"
        headline="How we handle your data"
        accentWord="your data"
        standfirst="We collect only what we need to host you well. We don't sell it. Ever. Here's exactly how it works."
        lastUpdated="17 July 2026"
        datePublished="2026-07-17"
        dateModified="2026-07-17"
        summaryBullets={[
          "We collect your name, email, phone, and booking details — nothing more than we need to host you.",
          "We never sell your personal information. Full stop.",
          "Your data is stored securely with cloud providers who meet NZ privacy standards.",
          "You can request to see, correct, or delete your information anytime.",
          "If something's unclear, just ask — we'll give you a straight answer.",
        ]}
        sections={sections}
      />
      <SiteFooter />
    </div>
  );
}

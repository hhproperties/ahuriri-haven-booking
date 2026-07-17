import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PolicyPage } from "@/components/PolicyPage";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms of Stay — The Vulcan, Ahuriri" },
      {
        name: "description",
        content:
          "Terms and conditions for direct bookings at The Vulcan, Ahuriri, operated by H&H Property Group Limited. Booking, payment, cancellation, and guest conduct.",
      },
      { property: "og:title", content: "Terms of Stay — The Vulcan, Ahuriri" },
      { property: "og:description", content: "Terms and conditions for direct bookings at The Vulcan, Ahuriri — your harbourfront retreat in Ahuriri, Napier." },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://ahuriri-haven-booking.vercel.app/terms" }],
  }),
});

const sections = [
  {
    number: "01",
    title: "About this agreement",
    lead: "These terms apply to every direct booking made through our website. If you book via Airbnb, different rules apply.",
    body: [
      {
        type: "paragraph" as const,
        text: 'These Terms & Conditions apply to all bookings made directly through hhproperties.co.nz for The Vulcan, Ahuriri, a self-contained apartment located at 1 Vulcan Lane, Ahuriri, Napier, New Zealand ("the Property"), operated by H&H Property Group Limited ("we," "us," "the operator"). By submitting a booking, you ("the guest," "you") agree to these terms.',
      },
      {
        type: "paragraph" as const,
        text: "These terms apply to direct bookings made through our website. Bookings made via Airbnb are separately governed by Airbnb's own terms and conditions.",
      },
    ],
  },
  {
    number: "02",
    title: "Bookings & payment",
    lead: "Bookings are confirmed once we receive your payment. Your dates are held for 48 hours while payment clears.",
    body: [
      {
        type: "paragraph" as const,
        text: "Bookings are requested through our website by selecting available dates and submitting your details.",
      },
      {
        type: "paragraph" as const,
        text: 'Current payment method: payment is by direct bank transfer, in full, at the time of booking. Your booking is held for 48 hours pending payment; if payment is not received within that window, the dates are released and your booking request is cancelled. Once we\'ve confirmed receipt of payment, you\'ll receive a confirmation email and your dates are secured.',
      },
      {
        type: "paragraph" as const,
        text: "All prices are shown in New Zealand dollars (NZD) and are inclusive of GST.",
      },
      {
        type: "paragraph" as const,
        text: "Pricing is based on occupancy: a base rate covers one bedroom for up to 2 guests including a standard clean; a second-bedroom rate applies if the second bedroom is required, regardless of whether it is used by one or two guests. Maximum occupancy is 4 guests.",
      },
      {
        type: "paragraph" as const,
        text: "The person making the booking must be at least 18 years old and will be the primary contact for the reservation.",
      },
    ],
  },
  {
    number: "03",
    title: "Check-in & check-out",
    lead: "Check-in from 2:00pm on your arrival date. Check-out by 10:00am on departure. Door codes are generated from your mobile number.",
    body: [
      {
        type: "paragraph" as const,
        text: "Check-in: from 2:00pm on the arrival date. Check-out: by 10:00am on the departure date.",
      },
      {
        type: "paragraph" as const,
        text: "Access is via an electronic door code, generated from the last 4 digits of the mobile number provided at booking, and communicated to you before arrival.",
      },
      {
        type: "paragraph" as const,
        text: "Early check-in or late check-out may be available on request and is subject to the hosts' discretion and availability — please contact us in advance rather than assuming this will be possible.",
      },
    ],
  },
  {
    number: "04",
    title: "Guest conduct & house rules",
    lead: "Be considerate. No parties, no smoking inside, and please keep noise down after 10:00pm — we live upstairs.",
    body: [
      {
        type: "paragraph" as const,
        text: "Maximum occupancy is 4 guests. Please contact us before booking if your group is larger, or if you wish to bring additional visitors during your stay who are not staying overnight.",
      },
      {
        type: "list" as const,
        items: [
          "No parties, events, or gatherings beyond the registered guests. The Property sits beneath the hosts' own residence — please be considerate of noise, particularly after 10:00pm and before 8:00am.",
          "Smoking/vaping is not permitted inside the apartment.",
          "Pets: please confirm with us before booking if you wish to bring a pet, as this is not automatically included in a booking.",
          "Guests are responsible for leaving the Property in a reasonably tidy state; a standard clean is included in your booking, but excessive mess, breakages, or damage beyond fair wear and tear may incur an additional charge, which we will discuss with you directly before charging.",
        ],
      },
      {
        type: "paragraph" as const,
        text: "We reserve the right to end a stay without refund if house rules are seriously breached, illegal activity occurs, or the safety of the hosts, neighbours, or property is put at risk.",
      },
    ],
  },
  {
    number: "05",
    title: "Guest responsibilities & liability",
    lead: "You're responsible for your own safety and belongings, and for the conduct of everyone in your party.",
    body: [
      {
        type: "paragraph" as const,
        text: "Guests are responsible for their own safety and belongings during their stay, and for the conduct of everyone in their party, including any visitors.",
      },
      {
        type: "paragraph" as const,
        text: "Guests are liable for any loss or damage to the Property or its contents caused by their negligence, misuse, or breach of these terms, beyond fair wear and tear.",
      },
      {
        type: "paragraph" as const,
        text: "To the extent permitted by law, H&H Property Group Limited's liability to guests is limited to the amount paid for the booking, except where liability cannot lawfully be excluded or limited (including under the Consumer Guarantees Act 1993 or the Fair Trading Act 1986, where these apply).",
      },
      {
        type: "paragraph" as const,
        text: "We take reasonable care to ensure the Property is safe, clean, and as described, but we do not guarantee an uninterrupted stay free of matters outside our reasonable control (see Force Majeure below).",
      },
    ],
  },
  {
    number: "06",
    title: "Cancellations & refunds",
    lead: "Cancellations and refunds are governed by our separate Cancellation Policy.",
    body: [
      {
        type: "paragraph" as const,
        text: 'Cancellations and refunds are governed by our separate <a href="/cancellation" class="word-wood no-underline">Cancellation Policy</a>, which forms part of these Terms.',
      },
    ],
  },
  {
    number: "07",
    title: "Force majeure",
    lead: "Neither side is penalised for events genuinely beyond control — natural disasters, civil emergencies, or government restrictions.",
    body: [
      {
        type: "paragraph" as const,
        text: "Neither party is liable for delay or failure to perform obligations under these terms where this is caused by circumstances beyond reasonable control, including natural disasters, extreme weather, civil emergency, government restrictions, or similar events.",
      },
      {
        type: "paragraph" as const,
        text: "Where such an event prevents a stay from proceeding, we will work with you in good faith on rescheduling or a refund, but this is not automatic and will depend on the circumstances.",
      },
    ],
  },
  {
    number: "08",
    title: "Photography, reviews & communications",
    lead: "We may ask to feature your review on our site. We'll send booking-related emails — nothing more, nothing less.",
    body: [
      {
        type: "paragraph" as const,
        text: "With your consent, we may ask to feature guest reviews (with first name and initial only, as submitted via Google Reviews or directly to us) on our website.",
      },
      {
        type: "paragraph" as const,
        text: "We will send booking-related communications (confirmation, pre-arrival information, and a post-stay follow-up) to the email address provided at booking. See our Privacy Policy for more on how your information is used.",
      },
    ],
  },
  {
    number: "09",
    title: "Governing law",
    lead: "These terms are governed by the laws of New Zealand.",
    body: [
      {
        type: "paragraph" as const,
        text: "These terms are governed by the laws of New Zealand, and any disputes are subject to the non-exclusive jurisdiction of the New Zealand courts.",
      },
    ],
  },
  {
    number: "10",
    title: "Contact",
    lead: "We're here if you need anything.",
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

function TermsPage() {
  return (
    <div className="min-h-screen bg-[#EFE8DA]">
      <SiteNav />
      <PolicyPage
        path="/terms"
        title="Terms of Stay — The Vulcan, Ahuriri"
        description="Terms and conditions for direct bookings at The Vulcan, Ahuriri, operated by H&H Property Group Limited."
        eyebrow="Legal"
        headline="The fine print"
        accentWord="fine print"
        standfirst="Written in plain English. Read once, keep for reference, and ask us if anything reads sideways."
        lastUpdated="17 July 2026"
        datePublished="2026-07-17"
        dateModified="2026-07-17"
        summaryBullets={[
          "You book, we host. Here's what each side agrees to.",
          "Full payment secures your dates — held for 48 hours while bank transfers clear.",
          "Be considerate of the house rules (no parties, no smoking, quiet after 10pm).",
          "Cancellations governed by our separate Cancellation Policy — see the link.",
          "If something's unclear, just ask. We'd rather talk than leave you guessing.",
        ]}
        sections={sections}
      />
      <SiteFooter />
    </div>
  );
}

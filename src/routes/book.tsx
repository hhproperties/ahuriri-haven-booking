import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/book")({
  component: BookPage,
  head: () => ({
    meta: [
      { title: "Book The Vulcan, Ahuriri — Check availability" },
      {
        name: "description",
        content:
          "Check live availability and book The Vulcan, Ahuriri directly. From NZ$220/night, two queen bedrooms, walking distance to Napier's beach and restaurants.",
      },
    ],
  }),
});

type Settings = {
  base_rate_cents: number;
  second_bedroom_rate_cents: number;
  bank_account_name: string;
  bank_account_number: string;
  particulars_format: string;
  payment_mode: "bank_transfer" | "stripe";
};

function formatNZD(cents: number) {
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(cents / 100);
}

function toDateStr(d: Date) {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.max(0, Math.round(ms / 86400000));
}

function BookPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <div className="pt-32 pb-24 px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow">Reserve your stay</p>
          <h1 className="mt-4 font-display text-5xl text-ink md:text-6xl">Book The Vulcan.</h1>
          <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            Two queen bedrooms, sleeps four. Check-in from 2:00pm · Check-out by 10:00am.
            Full refund if cancelled more than 30 days before check-in.
          </p>
          <BookingForm />
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function BookingForm() {
  const { data: settings } = useQuery({
    queryKey: ["payment_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("payment_settings").select("*").eq("id", 1).maybeSingle();
      return data as Settings | null;
    },
  });

  const { data: blocked = [] } = useQuery({
    queryKey: ["availability"],
    queryFn: async () => {
      const [av, ab] = await Promise.all([
        supabase.from("booking_availability").select("check_in, check_out"),
        supabase.from("airbnb_blocked_dates").select("start_date, end_date"),
      ]);
      const ranges: { start: string; end: string }[] = [];
      av.data?.forEach((r) => {
        if (r.check_in && r.check_out) ranges.push({ start: r.check_in, end: r.check_out });
      });
      ab.data?.forEach((r) => ranges.push({ start: r.start_date, end: r.end_date }));
      return ranges;
    },
  });

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | {
    reference: string;
    total: number;
    bank_account_name: string;
    bank_account_number: string;
  }>(null);
  const [error, setError] = useState<string | null>(null);

  const bedrooms = guests > 2 ? 2 : 1;
  const nights = checkIn && checkOut ? daysBetween(checkIn, checkOut) : 0;
  const baseRate = settings?.base_rate_cents ?? 22000;
  const secondRate = settings?.second_bedroom_rate_cents ?? 18000;
  const nightlyTotal = baseRate + (bedrooms === 2 ? secondRate : 0);
  const total = nightlyTotal * nights;

  const conflictsWithBlocked = useMemo(() => {
    if (!checkIn || !checkOut) return false;
    return blocked.some((r) => !(checkOut <= r.start || checkIn >= r.end));
  }, [checkIn, checkOut, blocked]);

  const canSubmit =
    checkIn &&
    checkOut &&
    nights > 0 &&
    name.trim() &&
    /\S+@\S+\.\S+/.test(email) &&
    phone.replace(/\D/g, "").length >= 8 &&
    !conflictsWithBlocked &&
    !submitting;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const ref = `VULCAN-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
      const hold = new Date(Date.now() + 48 * 3600 * 1000).toISOString();
      const { error: insErr } = await supabase.from("bookings").insert({
        booking_reference: ref,
        guest_name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        check_in: checkIn,
        check_out: checkOut,
        guests_count: guests,
        bedrooms_booked: bedrooms,
        total_amount_cents: total,
        payment_method: settings?.payment_mode ?? "bank_transfer",
        status: "pending_payment",
        payment_hold_expires_at: hold,
      });
      if (insErr) throw insErr;
      setResult({
        reference: ref,
        total,
        bank_account_name: settings?.bank_account_name ?? "H&H Property Group Limited",
        bank_account_number: settings?.bank_account_number ?? "(to be provided)",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unable to submit booking.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="mt-16 border border-border bg-cream p-10">
        <p className="eyebrow">Booking received</p>
        <h2 className="mt-4 font-display text-4xl text-ink">Thanks — we're holding your dates.</h2>
        <p className="mt-6 max-w-2xl text-base text-muted-foreground">
          Please complete the bank transfer below within <strong>48 hours</strong> to
          secure your stay. We'll email a confirmation once payment is received.
        </p>
        <dl className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
          <div>
            <dt className="eyebrow">Amount due</dt>
            <dd className="mt-2 font-display text-3xl text-ink">{formatNZD(result.total)}</dd>
          </div>
          <div>
            <dt className="eyebrow">Reference (use this exactly)</dt>
            <dd className="mt-2 font-display text-2xl text-saddle">{result.reference}</dd>
          </div>
          <div>
            <dt className="eyebrow">Bank account name</dt>
            <dd className="mt-2 text-base text-ink">{result.bank_account_name}</dd>
          </div>
          <div>
            <dt className="eyebrow">Bank account number</dt>
            <dd className="mt-2 text-base text-ink">{result.bank_account_number}</dd>
          </div>
        </dl>
        <div className="mt-10 flex gap-4">
          <Link to="/" className="border border-ink px-6 py-3 text-xs uppercase tracking-[0.22em] text-ink hover:bg-ink hover:text-cream transition-colors">
            Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-16 grid gap-12 lg:grid-cols-[1fr_400px] lg:gap-16">
      <div className="space-y-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Check-in">
            <input
              type="date"
              value={checkIn}
              min={toDateStr(new Date())}
              onChange={(e) => setCheckIn(e.target.value)}
              required
              className="input"
            />
          </Field>
          <Field label="Check-out">
            <input
              type="date"
              value={checkOut}
              min={checkIn || toDateStr(new Date())}
              onChange={(e) => setCheckOut(e.target.value)}
              required
              className="input"
            />
          </Field>
        </div>

        <Field label="Guests (max 4)">
          <select value={guests} onChange={(e) => setGuests(Number(e.target.value))} className="input">
            <option value={1}>1 guest — 1 bedroom</option>
            <option value={2}>2 guests — 1 bedroom</option>
            <option value={3}>3 guests — 2 bedrooms</option>
            <option value={4}>4 guests — 2 bedrooms</option>
          </select>
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Your name">
            <input value={name} onChange={(e) => setName(e.target.value)} required className="input" />
          </Field>
          <Field label="Email">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input" />
          </Field>
        </div>

        <Field label="Cellphone (last 4 digits become your door code)">
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="input" />
        </Field>

        {conflictsWithBlocked && (
          <p className="text-sm text-destructive">
            Those dates overlap an existing booking. Please choose different dates.
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <aside className="h-fit border border-border bg-cream p-8 lg:sticky lg:top-32">
        <p className="eyebrow">Your stay</p>
        <div className="mt-6 space-y-3 border-b border-border pb-6 text-sm">
          <Row label={`1 Bedroom (up to 2 guests, cleaning incl.)`} value={`${formatNZD(baseRate)}/night`} />
          {bedrooms === 2 && (
            <Row label="Second Bedroom add-on" value={`+${formatNZD(secondRate)}/night`} />
          )}
          <Row label="Nights" value={String(nights)} />
        </div>
        <div className="mt-6 flex items-baseline justify-between">
          <span className="eyebrow">Total</span>
          <span className="font-display text-3xl text-ink">{formatNZD(total)}</span>
        </div>
        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-8 w-full border border-ink bg-ink py-4 text-xs uppercase tracking-[0.24em] text-cream transition-all hover:bg-saddle disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : "Request booking"}
        </button>
        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
          Full refund if cancelled more than 30 days before check-in. No refund
          within 30 days. Rates in NZD, GST-inclusive.
        </p>
      </aside>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyebrow">{label}</span>
      <div className="mt-3">{children}</div>
      <style>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          font-family: var(--font-sans);
          font-size: 0.95rem;
          color: var(--color-ink);
          outline: none;
          transition: border-color 200ms;
        }
        .input:focus { border-color: var(--color-gold); }
      `}</style>
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-ink">{value}</span>
    </div>
  );
}

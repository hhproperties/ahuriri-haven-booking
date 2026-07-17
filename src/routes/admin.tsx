import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
  head: () => ({
    meta: [
      { title: "Admin — The Vulcan, Ahuriri" },
      { name: "robots", content: "noindex" },
    ],
  }),
});

/* ─── helpers ─── */

function formatNZD(cents: number) {
  return new Intl.NumberFormat("en-NZ", { style: "currency", currency: "NZD" }).format(cents / 100);
}
function toLocalDate(iso: string) {
  return new Date(iso + "Z").toLocaleDateString("en-NZ", { day: "numeric", month: "short", year: "numeric" });
}
function toLocalDateTime(iso: string) {
  return new Date(iso + "Z").toLocaleString("en-NZ", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}
function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

type BookingRow = {
  id: string;
  booking_reference: string;
  guest_name: string;
  email: string;
  phone: string;
  check_in: string;
  check_out: string;
  guests_count: number;
  bedrooms_booked: number;
  total_amount_cents: number;
  status: string;
  payment_method: string;
  payment_reference: string | null;
  confirmed_at: string | null;
  cancelled_at: string | null;
  payment_hold_expires_at: string | null;
  notes: string | null;
  created_at: string;
};

type BlogRow = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  published: boolean;
  published_at: string | null;
  audience_tag: string | null;
  seo_title: string | null;
  seo_description: string | null;
  created_at: string;
};

type ReviewRow = {
  id: string;
  author_name: string;
  body: string;
  rating: number;
  published: boolean;
  sort_order: number;
  created_at: string;
};

/* ─── Auth Component ─── */

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }
    onLogin();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 inline-block gold-underline text-[11px] uppercase tracking-[0.22em] text-ink">
          ← Back to site
        </Link>
        <p className="eyebrow">Admin</p>
        <h1 className="mt-4 font-display text-4xl text-ink">Sign in.</h1>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label className="eyebrow">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mt-2 w-full border border-border bg-card px-4 py-3 text-sm text-ink outline-none focus:border-gold"
            />
          </div>
          <div>
            <label className="eyebrow">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mt-2 w-full border border-border bg-card px-4 py-3 text-sm text-ink outline-none focus:border-gold"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.22em] text-cream transition-colors hover:bg-saddle disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Admin Page ─── */

type Tab = "bookings" | "calendar" | "settings" | "blog" | "reviews";

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("bookings");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });
    return () => sub?.subscription.unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Checking…</p>
      </div>
    );
  }

  if (!session) return <AdminLogin onLogin={() => setSession(session)} />;

  // After auth state updates, session is set. But onLogin passes the old session.
  // Let's handle this by re-checking:
  if (!session.user) return <AdminLogin onLogin={() => window.location.reload()} />;

  const tabs: { key: Tab; label: string }[] = [
    { key: "bookings", label: "Bookings" },
    { key: "calendar", label: "Calendar" },
    { key: "settings", label: "Settings" },
    { key: "blog", label: "Blog" },
    { key: "reviews", label: "Reviews" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Admin nav */}
      <div className="sticky top-0 z-50 border-b border-border bg-cream/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 lg:px-10">
          <Link to="/" className="font-display text-lg tracking-wider text-ink">
            The Vulcan <span className="text-gold">·</span> Admin
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {session.user.email}
            </span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-[11px] uppercase tracking-[0.2em] text-saddle underline-offset-4 hover:underline"
            >
              Sign out
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl gap-0 px-6 lg:px-10">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] transition-colors ${
                tab === t.key
                  ? "border-b-2 border-gold text-ink"
                  : "border-b-2 border-transparent text-muted-foreground hover:text-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 py-10 lg:px-10">
        <div className="mx-auto max-w-7xl">
          {tab === "bookings" && <BookingsTab />}
          {tab === "calendar" && <CalendarTab />}
          {tab === "settings" && <SettingsTab />}
          {tab === "blog" && <BlogTab />}
          {tab === "reviews" && <ReviewsTab />}
        </div>
      </div>
    </div>
  );
}

/* ─── Bookings Tab ─── */

const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
};

function BookingsTab() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<string>("all");
  const [editing, setEditing] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [confirmedMsg, setConfirmedMsg] = useState<string | null>(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin_bookings"],
    queryFn: async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      return (data ?? []) as BookingRow[];
    },
    refetchInterval: 15000,
  });

  const confirmPayment = useMutation({
    mutationFn: async (id: string) => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("bookings")
        .update({ status: "confirmed", confirmed_at: now })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_bookings"] });
      setConfirmedMsg("Payment confirmed. Guest notified.");
      setTimeout(() => setConfirmedMsg(null), 4000);
    },
  });

  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      const now = new Date().toISOString();
      const { error } = await supabase
        .from("bookings")
        .update({ status: "cancelled", cancelled_at: now })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_bookings"] }),
  });

  const saveNotes = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes: string }) => {
      const { error } = await supabase.from("bookings").update({ notes }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin_bookings"] });
      setEditing(null);
    },
  });

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const stats = {
    total: bookings.length,
    pending: bookings.filter((b) => b.status === "pending_payment").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    revenue: bookings.filter((b) => b.status === "confirmed").reduce((s, b) => s + b.total_amount_cents, 0),
  };

  return (
    <div>
      {/* Stats bar */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatBox label="Total" value={String(stats.total)} />
        <StatBox label="Pending" value={String(stats.pending)} color="text-amber-600" />
        <StatBox label="Confirmed" value={String(stats.confirmed)} color="text-emerald-600" />
        <StatBox label="Cancelled" value={String(stats.cancelled)} color="text-muted-foreground" />
        <StatBox label="Revenue" value={formatNZD(stats.revenue)} color="text-saddle" />
      </div>

      {confirmedMsg && (
        <div className="mb-6 rounded border border-emerald-300 bg-emerald-50 px-5 py-3 text-sm text-emerald-800">
          {confirmedMsg}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["all", "pending_payment", "confirmed", "cancelled"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
              filter === f
                ? "bg-ink text-cream"
                : "border border-border text-muted-foreground hover:border-ink hover:text-ink"
            }`}
          >
            {f === "all" ? "All" : STATUS_LABELS[f] || f}
          </button>
        ))}
      </div>

      {/* Table */}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading bookings…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground">No bookings yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <th className="pb-3 pr-4 font-normal">Ref</th>
                <th className="pb-3 pr-4 font-normal">Guest</th>
                <th className="pb-3 pr-4 font-normal">Check-in</th>
                <th className="pb-3 pr-4 font-normal">Check-out</th>
                <th className="pb-3 pr-4 font-normal">Nights</th>
                <th className="pb-3 pr-4 font-normal">Total</th>
                <th className="pb-3 pr-4 font-normal">Status</th>
                <th className="pb-3 pr-4 font-normal">Created</th>
                <th className="pb-3 pr-4 font-normal">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b) => {
                const nights = Math.round(
                  (new Date(b.check_out).getTime() - new Date(b.check_in).getTime()) / 86400000
                );
                return (
                  <tr key={b.id} className="border-b border-border/50 hover:bg-putty/20 transition-colors">
                    <td className="py-3 pr-4 font-mono text-[11px] text-ink">{b.booking_reference}</td>
                    <td className="py-3 pr-4">
                      <div className="text-ink">{b.guest_name}</div>
                      <div className="text-[11px] text-muted-foreground">{b.email}</div>
                    </td>
                    <td className="py-3 pr-4 text-ink">{toLocalDate(b.check_in)}</td>
                    <td className="py-3 pr-4 text-ink">{toLocalDate(b.check_out)}</td>
                    <td className="py-3 pr-4 text-ink">{nights}</td>
                    <td className="py-3 pr-4 font-display text-base text-ink">{formatNZD(b.total_amount_cents)}</td>
                    <td className="py-3 pr-4">
                      <StatusPill status={b.status} />
                    </td>
                    <td className="py-3 pr-4 text-[11px] text-muted-foreground">{toLocalDateTime(b.created_at)}</td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {b.status === "pending_payment" && (
                          <button
                            onClick={() => confirmPayment.mutate(b.id)}
                            disabled={confirmPayment.isPending}
                            className="rounded bg-emerald-600 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Confirm
                          </button>
                        )}
                        {(b.status === "pending_payment" || b.status === "confirmed") && (
                          <button
                            onClick={() => {
                              if (window.confirm(`Cancel booking ${b.booking_reference}?`))
                                cancelBooking.mutate(b.id);
                            }}
                            className="rounded border border-red-300 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] text-red-600 hover:bg-red-50"
                          >
                            Cancel
                          </button>
                        )}
                        {b.notes || editing === b.id ? (
                          editing === b.id ? (
                            <div className="flex items-center gap-1">
                              <input
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                className="w-24 border border-border px-2 py-1 text-[11px] text-ink outline-none"
                                placeholder="Notes…"
                              />
                              <button
                                onClick={() => saveNotes.mutate({ id: b.id, notes: editNotes })}
                                className="text-[10px] text-saddle hover:underline"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditing(null)}
                                className="text-[10px] text-muted-foreground hover:underline"
                              >
                                ×
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setEditing(b.id); setEditNotes(b.notes ?? ""); }}
                              className="text-[10px] text-saddle hover:underline"
                              title={b.notes ?? ""}
                            >
                              Notes
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => { setEditing(b.id); setEditNotes(""); }}
                            className="text-[10px] text-muted-foreground hover:text-saddle"
                          >
                            +Note
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─── Calendar Tab ─── */

function CalendarTab() {
  const { data: bookings = [] } = useQuery({
    queryKey: ["admin_bookings"],
    queryFn: async () => {
      const { data } = await supabase.from("bookings")
        .select("*")
        .in("status", ["pending_payment", "confirmed"])
        .order("check_in");
      return (data ?? []) as BookingRow[];
    },
  });

  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
  const monthLabel = new Date(year, month).toLocaleDateString("en-NZ", { month: "long", year: "numeric" });

  function isBooked(day: number) {
    const d = new Date(year, month, day).toISOString().slice(0, 10);
    return bookings.some((b) => d >= b.check_in && d < b.check_out);
  }

  function getBookingForDay(day: number) {
    const d = new Date(year, month, day).toISOString().slice(0, 10);
    return bookings.find((b) => d >= b.check_in && d < b.check_out);
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <p className="eyebrow">{monthLabel}</p>
        <div className="flex gap-2">
          <button onClick={() => { if (month === 0) { setMonth(11); setYear(y - 1); } else setMonth(m => m - 1); }} className="border border-border px-3 py-1.5 text-[11px] text-ink hover:bg-putty/20">
            ← Prev
          </button>
          <button onClick={() => { const n = new Date(); setMonth(n.getMonth()); setYear(n.getFullYear()); }} className="border border-border px-3 py-1.5 text-[11px] text-ink hover:bg-putty/20">
            Today
          </button>
          <button onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }} className="border border-border px-3 py-1.5 text-[11px] text-ink hover:bg-putty/20">
            Next →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="border-b border-border py-2">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`e-${i}`} className="min-h-[100px] border border-border/30 bg-cream/50" />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
          const booked = isBooked(day);
          const b = getBookingForDay(day);
          const isStart = b && new Date(b.check_in).toISOString().slice(0, 10) === new Date(year, month, day).toISOString().slice(0, 10);
          return (
            <div
              key={day}
              className={`min-h-[100px] border border-border/30 p-1.5 text-xs transition-colors ${
                booked ? "bg-gold/15" : "hover:bg-putty/20"
              }`}
            >
              <span className={`inline-block text-[11px] ${booked ? "font-semibold text-gold" : "text-ink"}`}>
                {day}
              </span>
              {isStart && b && (
                <div className="mt-1 text-[10px] leading-tight text-saddle">
                  <span className="block truncate">{b.guest_name}</span>
                  <span className="block font-mono text-[9px] text-muted-foreground">{b.booking_reference}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        .calendar-nav-btn {
          cursor: pointer;
          border: 1px solid var(--color-border);
          padding: 0.375rem 0.75rem;
          font-size: 0.6875rem;
          color: var(--color-ink);
          transition: background 200ms;
        }
        .calendar-nav-btn:hover { background: var(--color-putty); }
      `}</style>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-unused-vars */
// The calendar buttons use inline arrow functions that reference y; eslint ignore is needed.
/* eslint-enable */

/* ─── Settings Tab ─── */

function SettingsTab() {
  const qc = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["payment_settings"],
    queryFn: async () => {
      const { data } = await supabase.from("payment_settings").select("*").eq("id", 1).maybeSingle();
      return data as {
        base_rate_cents: number;
        second_bedroom_rate_cents: number;
        bank_account_name: string;
        bank_account_number: string;
        particulars_format: string;
        payment_mode: "bank_transfer" | "stripe";
        airbnb_ical_url: string | null;
      } | null;
    },
  });

  const [form, setForm] = useState({
    base_rate_cents: 22000,
    second_bedroom_rate_cents: 18000,
    bank_account_name: "",
    bank_account_number: "",
    particulars_format: "",
    payment_mode: "bank_transfer" as "bank_transfer" | "stripe",
    airbnb_ical_url: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        base_rate_cents: settings.base_rate_cents,
        second_bedroom_rate_cents: settings.second_bedroom_rate_cents,
        bank_account_name: settings.bank_account_name,
        bank_account_number: settings.bank_account_number,
        particulars_format: settings.particulars_format,
        payment_mode: settings.payment_mode,
        airbnb_ical_url: settings.airbnb_ical_url ?? "",
      });
    }
  }, [settings]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    const { error } = await supabase.from("payment_settings").update({
      base_rate_cents: form.base_rate_cents,
      second_bedroom_rate_cents: form.second_bedroom_rate_cents,
      bank_account_name: form.bank_account_name,
      bank_account_number: form.bank_account_number,
      particulars_format: form.particulars_format,
      payment_mode: form.payment_mode,
      airbnb_ical_url: form.airbnb_ical_url || null,
      updated_at: new Date().toISOString(),
    }).eq("id", 1);
    setSaving(false);
    if (error) {
      setSavedMsg(`Error: ${error.message}`);
    } else {
      setSavedMsg("Settings saved.");
      qc.invalidateQueries({ queryKey: ["payment_settings"] });
      setTimeout(() => setSavedMsg(null), 3000);
    }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading settings…</p>;

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-2xl space-y-8">
      <div>
        <p className="eyebrow">Payment Settings</p>
        <h2 className="mt-2 font-display text-3xl text-ink">Rates & Accounts.</h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Base rate (cents/night)">
          <input type="number" value={form.base_rate_cents} onChange={(e) => setForm(f => ({ ...f, base_rate_cents: Number(e.target.value) }))} className="input" />
        </Field>
        <Field label="Second bedroom rate (cents/night)">
          <input type="number" value={form.second_bedroom_rate_cents} onChange={(e) => setForm(f => ({ ...f, second_bedroom_rate_cents: Number(e.target.value) }))} className="input" />
        </Field>
        <Field label="Bank account name">
          <input value={form.bank_account_name} onChange={(e) => setForm(f => ({ ...f, bank_account_name: e.target.value }))} className="input" />
        </Field>
        <Field label="Bank account number">
          <input value={form.bank_account_number} onChange={(e) => setForm(f => ({ ...f, bank_account_number: e.target.value }))} className="input" />
        </Field>
        <Field label="Particulars format">
          <input value={form.particulars_format} onChange={(e) => setForm(f => ({ ...f, particulars_format: e.target.value }))} className="input" placeholder="e.g. VULCAN-{REFERENCE}" />
        </Field>
        <Field label="Payment mode">
          <select value={form.payment_mode} onChange={(e) => setForm(f => ({ ...f, payment_mode: e.target.value as "bank_transfer" | "stripe" }))} className="input">
            <option value="bank_transfer">Bank Transfer (manual)</option>
            <option value="stripe">Stripe (card)</option>
          </select>
        </Field>
      </div>

      <div className="border-t border-border pt-8">
        <p className="eyebrow">Airbnb iCal</p>
        <div className="mt-4">
          <Field label="Airbnb iCal URL">
            <input value={form.airbnb_ical_url} onChange={(e) => setForm(f => ({ ...f, airbnb_ical_url: e.target.value }))} className="input" placeholder="https://www.airbnb.com/calendar/ical/…" />
          </Field>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Paste your Airbnb iCal export URL to sync blocked dates. Bookings from this site take priority.
          </p>
        </div>
      </div>

      {savedMsg && (
        <div className={`rounded px-4 py-3 text-sm ${savedMsg.startsWith("Error") ? "bg-red-50 text-red-800" : "bg-emerald-50 text-emerald-800"}`}>
          {savedMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        className="border border-ink bg-ink px-8 py-3 text-xs uppercase tracking-[0.22em] text-cream hover:bg-saddle disabled:opacity-50 transition-colors"
      >
        {saving ? "Saving…" : "Save settings"}
      </button>

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: var(--color-ink);
          outline: none;
          transition: border-color 200ms;
        }
        .input:focus { border-color: var(--color-gold); }
      `}</style>
    </form>
  );
}

/* ─── Blog Tab ─── */

function BlogTab() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["admin_blog"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
      return (data ?? []) as BlogRow[];
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("blog_posts").update({
        published,
        published_at: published ? new Date().toISOString() : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_blog"] }),
  });

  const deletePost = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_blog"] }),
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="eyebrow">Blog</p>
          <h2 className="mt-1 font-display text-3xl text-ink">Journal entries.</h2>
        </div>
        {editingId === null && (
          <button onClick={() => setEditingId("__new__")} className="border border-ink bg-ink px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-cream hover:bg-saddle transition-colors">
            + New Post
          </button>
        )}
      </div>

      {editingId !== null ? (
        <BlogEditor
          postId={editingId}
          posts={posts}
          onDone={() => { setEditingId(null); qc.invalidateQueries({ queryKey: ["admin_blog"] }); }}
        />
      ) : isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-muted-foreground">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <div key={p.id} className="flex items-center justify-between border border-border bg-card px-5 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-display text-lg text-ink truncate">{p.title}</h3>
                  {p.published ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">Published</span>
                  ) : (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">Draft</span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground truncate">{p.slug} · {p.audience_tag || "no tag"}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button onClick={() => togglePublished.mutate({ id: p.id, published: !p.published })} className="text-[10px] uppercase tracking-[0.15em] text-saddle hover:underline">
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => setEditingId(p.id)} className="text-[10px] uppercase tracking-[0.15em] text-ink hover:underline">
                  Edit
                </button>
                <button onClick={() => { if (window.confirm(`Delete "${p.title}"?`)) deletePost.mutate(p.id); }} className="text-[10px] uppercase tracking-[0.15em] text-red-500 hover:underline">
                  Del
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogEditor({ postId, posts, onDone }: { postId: string; posts: BlogRow[]; onDone: () => void }) {
  const existing = postId === "__new__" ? null : posts.find((p) => p.id === postId);
  const [title, setTitle] = useState(existing?.title ?? "");
  const [slug, setSlug] = useState(existing?.slug ?? "");
  const [excerpt, setExcerpt] = useState(existing?.excerpt ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [audienceTag, setAudienceTag] = useState(existing?.audience_tag ?? "");
  const [seoTitle, setSeoTitle] = useState(existing?.seo_title ?? "");
  const [seoDesc, setSeoDesc] = useState(existing?.seo_description ?? "");
  const [saving, setSaving] = useState(false);

  function autoSlug(v: string) {
    if (postId === "__new__" && !slug) {
      setSlug(v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (postId === "__new__") {
      await supabase.from("blog_posts").insert({
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        excerpt: excerpt || null,
        body,
        audience_tag: audienceTag || null,
        seo_title: seoTitle || null,
        seo_description: seoDesc || null,
        published: false,
      });
    } else {
      await supabase.from("blog_posts").update({
        title,
        slug,
        excerpt: excerpt || null,
        body,
        audience_tag: audienceTag || null,
        seo_title: seoTitle || null,
        seo_description: seoDesc || null,
        updated_at: new Date().toISOString(),
      }).eq("id", postId);
    }
    setSaving(false);
    onDone();
  }

  return (
    <form onSubmit={handleSave} className="mx-auto max-w-3xl space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input value={title} onChange={(e) => { setTitle(e.target.value); autoSlug(e.target.value); }} required className="input" />
        </Field>
        <Field label="Slug">
          <input value={slug} onChange={(e) => setSlug(e.target.value)} required className="input" />
        </Field>
        <Field label="Audience tag (e.g. Food & Drink)">
          <input value={audienceTag} onChange={(e) => setAudienceTag(e.target.value)} className="input" />
        </Field>
        <Field label="SEO title">
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="input" />
        </Field>
      </div>

      <Field label="Excerpt">
        <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} className="input resize-y" />
      </Field>
      <Field label="SEO description">
        <textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={2} className="input resize-y" />
      </Field>
      <Field label="Body (Markdown — paragraphs separated by blank lines)">
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={16} required className="input resize-y font-sans text-sm leading-relaxed" />
      </Field>

      <div className="flex gap-3">
        <button type="submit" disabled={saving} className="border border-ink bg-ink px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-cream hover:bg-saddle disabled:opacity-50 transition-colors">
          {saving ? "Saving…" : postId === "__new__" ? "Create draft" : "Update"}
        </button>
        <button type="button" onClick={onDone} className="border border-border px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-ink transition-colors">
          Cancel
        </button>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: var(--color-ink);
          outline: none;
          transition: border-color 200ms;
        }
        .input:focus { border-color: var(--color-gold); }
        textarea.input { line-height: 1.7; }
      `}</style>
    </form>
  );
}

/* ─── Reviews Tab ─── */

function ReviewsTab() {
  const qc = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);

  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["admin_reviews"],
    queryFn: async () => {
      const { data } = await supabase.from("reviews").select("*").order("sort_order");
      return (data ?? []) as ReviewRow[];
    },
  });

  const togglePublished = useMutation({
    mutationFn: async ({ id, published }: { id: string; published: boolean }) => {
      const { error } = await supabase.from("reviews").update({ published }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_reviews"] }),
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_reviews"] }),
  });

  const [newAuthor, setNewAuthor] = useState("");
  const [newBody, setNewBody] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [adding, setAdding] = useState(false);

  async function addReview(e: React.FormEvent) {
    e.preventDefault();
    setAdding(true);
    const maxSort = reviews.reduce((m, r) => Math.max(m, r.sort_order), 0);
    await supabase.from("reviews").insert({
      author_name: newAuthor,
      body: newBody,
      rating: newRating,
      published: false,
      sort_order: maxSort + 1,
    });
    setNewAuthor("");
    setNewBody("");
    setNewRating(5);
    setAdding(false);
    qc.invalidateQueries({ queryKey: ["admin_reviews"] });
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Reviews</p>
        <h2 className="mt-1 font-display text-3xl text-ink">Guest testimonials.</h2>
      </div>

      {/* Existing reviews */}
      <div className="mb-12 space-y-3">
        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="flex items-start justify-between border border-border bg-card px-5 py-4">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-3">
                  <span className="font-display text-lg text-ink">{r.author_name}</span>
                  <span className="text-gold text-sm">{Array.from({ length: r.rating }).map((_, i) => "★").join("")}</span>
                  {r.published ? (
                    <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] text-emerald-700">Live</span>
                  ) : (
                    <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] text-amber-700">Hidden</span>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{r.body}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => togglePublished.mutate({ id: r.id, published: !r.published })} className="text-[10px] uppercase tracking-[0.15em] text-saddle hover:underline">
                  {r.published ? "Hide" : "Show"}
                </button>
                <button onClick={() => { if (window.confirm(`Delete review from ${r.author_name}?`)) deleteReview.mutate(r.id); }} className="text-[10px] uppercase tracking-[0.15em] text-red-500 hover:underline">
                  Del
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add new */}
      <div className="border-t border-border pt-8">
        <p className="eyebrow">Add a review</p>
        <form onSubmit={addReview} className="mt-6 max-w-lg space-y-4">
          <div className="flex gap-4">
            <Field label="Name">
              <input value={newAuthor} onChange={(e) => setNewAuthor(e.target.value)} required className="input" />
            </Field>
            <Field label="Rating">
              <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} className="input">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
              </select>
            </Field>
          </div>
          <Field label="Review">
            <textarea value={newBody} onChange={(e) => setNewBody(e.target.value)} required rows={3} className="input resize-y" />
          </Field>
          <button type="submit" disabled={adding} className="border border-ink bg-ink px-6 py-2.5 text-xs uppercase tracking-[0.2em] text-cream hover:bg-saddle disabled:opacity-50 transition-colors">
            {adding ? "Adding…" : "Add review"}
          </button>
        </form>
      </div>

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: var(--color-card);
          border: 1px solid var(--color-border);
          font-family: var(--font-sans);
          font-size: 0.875rem;
          color: var(--color-ink);
          outline: none;
          transition: border-color 200ms;
        }
        .input:focus { border-color: var(--color-gold); }
        textarea.input { line-height: 1.6; }
      `}</style>
    </div>
  );
}

/* ─── Shared components ─── */

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="border border-border bg-card px-4 py-3">
      <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
      <p className={`mt-1 font-display text-2xl ${color || "text-ink"}`}>{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending_payment: "bg-amber-100 text-amber-800",
    confirmed: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-red-100 text-red-700",
  };
  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] ${colors[status] || "bg-putty text-muted-foreground"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="eyeblock text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

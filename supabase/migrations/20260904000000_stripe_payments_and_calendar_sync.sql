-- ============================================================================
-- Stripe Payments & Google Calendar Sync
-- ============================================================================
-- Adds Stripe Checkout fields to bookings, Google Calendar settings to
-- payment_settings, and the calendar-sync tables used by the google-calendar
-- and ical-export edge functions.
-- ============================================================================

-- ── bookings: Stripe + calendar-sync columns ────────────────────────────────
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_checkout_url TEXT,
  ADD COLUMN IF NOT EXISTS stripe_payment_status TEXT,
  ADD COLUMN IF NOT EXISTS google_calendar_event_id TEXT,
  ADD COLUMN IF NOT EXISTS sync_status TEXT;

-- ── payment_settings: Google Calendar + combined iCal export ────────────────
ALTER TABLE public.payment_settings
  ADD COLUMN IF NOT EXISTS google_calendar_ical_url TEXT,
  ADD COLUMN IF NOT EXISTS google_calendar_id TEXT,
  ADD COLUMN IF NOT EXISTS combined_ical_export_enabled BOOLEAN NOT NULL DEFAULT false;

-- ── google_calendar_events (mirror of airbnb_blocked_dates) ─────────────────
CREATE TABLE IF NOT EXISTS public.google_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'google_calendar',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  summary TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.google_calendar_events TO anon, authenticated;
GRANT ALL ON public.google_calendar_events TO service_role;
ALTER TABLE public.google_calendar_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view Google Calendar events" ON public.google_calendar_events FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage Google Calendar events" ON public.google_calendar_events FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ── calendar_sync_log ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.calendar_sync_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('read', 'write', 'export')),
  status TEXT NOT NULL,
  event_count INT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.calendar_sync_log TO authenticated;
GRANT ALL ON public.calendar_sync_log TO service_role;
ALTER TABLE public.calendar_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view sync log" ON public.calendar_sync_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

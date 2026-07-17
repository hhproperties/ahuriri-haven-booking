-- ============================================================================
-- Email Triggers & Cron Jobs for The Vulcan, Ahuriri Booking Site
-- ============================================================================
-- This migration sets up:
-- 1. Database triggers → Edge Functions (email on booking events)
-- 2. Cron schedules for periodic tasks (hold-expiry, pre-arrival, post-stay, iCal)
-- ============================================================================
-- After running this, deploy the edge functions:
--   npx supabase functions deploy booking-received payment-confirmed pre-arrival post-stay hold-expiry ical-fetch
-- Then set the Resend secret:
--   npx supabase secrets set RESEND_API_KEY=re_xxxx
-- ============================================================================

-- Ensure pg_net extension is available (required for HTTP requests from triggers)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- ── Config ────────────────────────────────────────────────────────────────

-- Store the functions base URL so triggers can call edge functions
-- (Supabase provides SUPABASE_FUNCTIONS_URL via supabase_functions schema)
-- We use a custom PostgreSQL setting passed via context.

DO $$
BEGIN
  PERFORM set_config('app.settings.functions_url',
    'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1',
    false
  );
END $$;

-- ── Helper: Async HTTP POST to an edge function ───────────────────────────

CREATE OR REPLACE FUNCTION public.invoke_edge_function(
  function_name TEXT,
  body_json JSONB
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, net
AS $$
DECLARE
  url TEXT;
  request_id BIGINT;
BEGIN
  url := current_setting('app.settings.functions_url') || '/' || function_name;

  SELECT net.http_post(
    url := url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := body_json::text
  ) INTO request_id;

  RETURN request_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.invoke_edge_function FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.invoke_edge_function TO service_role;

-- ── Trigger: Booking Received ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.on_booking_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Fire-and-forget: call the edge function (no await — runs asynchronously)
  PERFORM public.invoke_edge_function('booking-received', jsonb_build_object('bookingId', NEW.id));
  RETURN NEW;
END;
$$;

CREATE TRIGGER booking_received_trigger
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  WHEN (NEW.status = 'pending_payment')
  EXECUTE FUNCTION public.on_booking_created();

-- ── Trigger: Payment Confirmed ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.on_booking_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    PERFORM public.invoke_edge_function('payment-confirmed', jsonb_build_object('bookingId', NEW.id));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER booking_confirmed_trigger
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed' AND OLD.status != 'confirmed')
  EXECUTE FUNCTION public.on_booking_confirmed();

-- ── Cron: Hold Expiry ─────────────────────────────────────────────────────

-- Every 10 minutes, cancel bookings with expired payment holds

SELECT cron.schedule(
  'hold-expiry',
  '*/10 * * * *',  -- every 10 minutes
  $$
  SELECT extensions.http_post(
    'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/hold-expiry',
    '{}'::text,
    'application/json'
  );
  $$
);

-- ── Cron: Pre-Arrival Email ───────────────────────────────────────────────

-- Every day at 9 AM NZT, send pre-arrival emails to guests checking in tomorrow

SELECT cron.schedule(
  'pre-arrival-email',
  '0 9 * * *',  -- 9 AM daily
  $$
  SELECT extensions.http_post(
    'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/pre-arrival',
    '{}'::text,
    'application/json'
  );
  $$
);

-- ── Cron: Post-Stay Email ─────────────────────────────────────────────────

-- Every day at 10 AM NZT, send post-stay thank-you + review request

SELECT cron.schedule(
  'post-stay-email',
  '0 10 * * *',  -- 10 AM daily
  $$
  SELECT extensions.http_post(
    'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/post-stay',
    '{}'::text,
    'application/json'
  );
  $$
);

-- ── Cron: iCal Sync ───────────────────────────────────────────────────────

-- Every 4 hours, fetch Airbnb iCal and update blocked dates

SELECT cron.schedule(
  'ical-fetch',
  '0 */4 * * *',  -- every 4 hours
  $$
  SELECT extensions.http_post(
    'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/ical-fetch',
    '{}'::text,
    'application/json'
  );
  $$
);

-- ── Status helper: Check schedule ─────────────────────────────────────────

-- Run this to see all scheduled cron jobs:
-- SELECT * FROM cron.job ORDER BY jobid;

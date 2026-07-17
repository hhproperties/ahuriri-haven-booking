-- ============================================================================
-- Email Triggers & Cron Jobs for The Vulcan, Ahuriri Booking Site
-- ============================================================================
-- Run this AFTER enabling pg_cron in Supabase Dashboard:
--   1. Go to Database → Extensions
--   2. Enable "pg_cron" (schema: extensions)
--   3. Also ensure "pg_net" is enabled (schema: extensions)
-- ============================================================================

-- Ensure pg_net extension is available (required for HTTP requests from triggers)
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Ensure pg_cron extension is available (required for cron scheduling)
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- ── Functions Base URL ────────────────────────────────────────────────────

-- Store via a custom setting so triggers can call edge functions
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
  -- Fire-and-forget: call the edge function (runs asynchronously via pg_net)
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
  '*/10 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/hold-expiry',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'
  );
  $$
);

-- ── Cron: Pre-Arrival Email ───────────────────────────────────────────────

-- Every day at 9 AM NZT, send pre-arrival email to guests checking in that day
SELECT cron.schedule(
  'pre-arrival-email',
  '0 9 * * *',
  $$
  SELECT net.http_post(
    url := 'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/pre-arrival',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'
  );
  $$
);

-- ── Cron: Post-Stay Email ─────────────────────────────────────────────────

-- Every day at 10 AM NZT, send post-stay review request
SELECT cron.schedule(
  'post-stay-email',
  '0 10 * * *',
  $$
  SELECT net.http_post(
    url := 'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/post-stay',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'
  );
  $$
);

-- ── Cron: iCal Sync ───────────────────────────────────────────────────────

-- Every 4 hours, fetch Airbnb iCal and update blocked dates
SELECT cron.schedule(
  'ical-fetch',
  '0 */4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/ical-fetch',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'
  );
  $$
);

-- ── Check scheduled jobs (run after migration) ────────────────────────────
-- SELECT jobid, schedule, command, database, username FROM cron.job ORDER BY jobid;

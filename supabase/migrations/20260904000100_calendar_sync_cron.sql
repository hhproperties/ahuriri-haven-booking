-- ============================================================================
-- Calendar Sync Cron + Google Calendar write on confirm
-- ============================================================================
-- Requires pg_cron + pg_net (enabled by email_triggers_and_cron.sql).
-- ============================================================================

-- ── Extend the confirm trigger to also write to Google Calendar ─────────────
-- (The payment-confirmed email is still fired first; google-calendar-write
--  is a best-effort follow-up — it no-ops if no Service Account is configured.)
CREATE OR REPLACE FUNCTION public.on_booking_confirmed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
    PERFORM public.invoke_edge_function('payment-confirmed', jsonb_build_object('bookingId', NEW.id));
    PERFORM public.invoke_edge_function('google-calendar-write', jsonb_build_object('bookingId', NEW.id));
  END IF;
  RETURN NEW;
END;
$$;

-- ── Cron: Google Calendar read (every 4 hours) ─────────────────────────────
SELECT cron.schedule(
  'google-calendar-read',
  '0 */4 * * *',
  $$
  SELECT net.http_post(
    url := 'https://izqfnrqyggahqmfhbmye.supabase.co/functions/v1/google-calendar-read',
    headers := jsonb_build_object('Content-Type', 'application/json'),
    body := '{}'
  );
  $$
);

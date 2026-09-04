-- ============================================================================
-- Cancellation email + review URL config for The Vulcan, Ahuriri
-- Depends on public.invoke_edge_function() from
-- 20260717051700_email_triggers_and_cron.sql (must run after it).
-- ============================================================================

-- Review link for the post-stay email (Google Reviews URL, admin-editable).
ALTER TABLE public.payment_settings
  ADD COLUMN IF NOT EXISTS review_url TEXT;

-- ── Trigger: Booking Cancelled ──────────────────────────────────────────
-- Emails the guest (with refund eligibility) when a booking is manually or
-- admin-cancelled. Automatic hold-expiry is skipped inside the edge function
-- (the guest is already emailed by hold-expiry).

CREATE OR REPLACE FUNCTION public.on_booking_cancelled()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
    PERFORM public.invoke_edge_function('cancellation', jsonb_build_object('bookingId', NEW.id));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER booking_cancelled_trigger
  AFTER UPDATE OF status ON public.bookings
  FOR EACH ROW
  WHEN (NEW.status = 'cancelled' AND OLD.status != 'cancelled')
  EXECUTE FUNCTION public.on_booking_cancelled();

-- Phase 3 follow-up: backfill and keep legacy newsletter activity and the new
-- audience status field synchronized in both directions.
UPDATE public.newsletter_subscribers
SET status = CASE WHEN COALESCE(is_active, true) THEN 'active' ELSE 'inactive' END;

CREATE OR REPLACE FUNCTION public.sync_newsletter_status_compatibility()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.status := CASE WHEN COALESCE(NEW.is_active, true) THEN 'active' ELSE 'inactive' END;
  ELSIF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.is_active := NEW.status = 'active';
  ELSIF NEW.is_active IS DISTINCT FROM OLD.is_active THEN
    NEW.status := CASE WHEN NEW.is_active THEN 'active' ELSE 'inactive' END;
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_newsletter_status_compatibility ON public.newsletter_subscribers;
CREATE TRIGGER trg_newsletter_status_compatibility
BEFORE INSERT OR UPDATE ON public.newsletter_subscribers
FOR EACH ROW EXECUTE FUNCTION public.sync_newsletter_status_compatibility();
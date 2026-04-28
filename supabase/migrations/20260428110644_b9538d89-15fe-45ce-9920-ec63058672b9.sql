-- Tighten storage SELECT: allow read by exact name only (no listing across bucket)
DROP POLICY IF EXISTS "Public read designs" ON storage.objects;
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;

CREATE POLICY "Read designs by name"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'designs' AND name IS NOT NULL AND length(name) > 0);

CREATE POLICY "Read product images by name"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images' AND name IS NOT NULL AND length(name) > 0);

-- Fix mutable search_path on touch_updated_at
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Lock down EXECUTE on SECURITY DEFINER functions; only triggers/RLS need them
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;
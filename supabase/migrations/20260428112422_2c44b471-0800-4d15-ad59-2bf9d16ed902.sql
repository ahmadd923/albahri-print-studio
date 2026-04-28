-- Ensure the known Al Bahri owner email is always recognized as admin by backend rules.
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    EXISTS (
      SELECT 1
      FROM public.user_roles
      WHERE user_id = _user_id
        AND role = _role
    )
    OR (
      _role = 'admin'::app_role
      AND EXISTS (
        SELECT 1
        FROM auth.users u
        WHERE u.id = _user_id
          AND lower(u.email) = 'bahriabed16@gmail.com'
      )
    )
$$;

-- Create the right profile and role automatically for future signups.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(public.profiles.full_name, ''), EXCLUDED.full_name),
    phone = COALESCE(NULLIF(public.profiles.phone, ''), EXCLUDED.phone),
    updated_at = now();

  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    CASE
      WHEN lower(NEW.email) = 'bahriabed16@gmail.com' THEN 'admin'::app_role
      ELSE 'customer'::app_role
    END
  )
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Repair the existing admin account if it already exists.
INSERT INTO public.profiles (id, email, full_name, phone)
SELECT u.id, u.email, COALESCE(u.raw_user_meta_data->>'full_name', ''), COALESCE(u.raw_user_meta_data->>'phone', '')
FROM auth.users u
WHERE lower(u.email) = 'bahriabed16@gmail.com'
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  updated_at = now();

INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
WHERE lower(u.email) = 'bahriabed16@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- RLS policies and clients need to be able to evaluate/read the role safely.
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
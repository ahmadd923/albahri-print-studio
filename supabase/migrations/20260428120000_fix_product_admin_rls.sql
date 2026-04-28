-- Fix admin role helper function
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
    AND role = _role
  )
  OR (
    _role = 'admin'::public.app_role
    AND EXISTS (
      SELECT 1
      FROM auth.users u
      WHERE u.id = _user_id
      AND lower(u.email) = 'bahriabed16@gmail.com'
    )
  );
$$;

-- Make sure authenticated users can use the role check inside RLS policies
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- Make sure the admin account has the admin role
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE lower(email) = 'bahriabed16@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Recreate product admin policy safely
DROP POLICY IF EXISTS "Admins manage products" ON public.products;

CREATE POLICY "Admins manage products"
ON public.products
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Refresh Supabase/PostgREST schema cache
NOTIFY pgrst, 'reload schema';
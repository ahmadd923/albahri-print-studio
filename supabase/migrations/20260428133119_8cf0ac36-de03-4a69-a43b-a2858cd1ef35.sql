-- Force PostgREST to reload schema cache (clears PGRST002 errors)
NOTIFY pgrst, 'reload schema';

-- Re-assert admin role for the designated admin email (idempotent safety net)
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::public.app_role
FROM auth.users u
WHERE lower(u.email) = 'bahriabed16@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

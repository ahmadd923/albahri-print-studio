-- Keep admin checking usable by access rules while preventing direct calls from app users.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
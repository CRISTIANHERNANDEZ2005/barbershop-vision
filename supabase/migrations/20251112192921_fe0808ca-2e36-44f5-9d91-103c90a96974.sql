-- Recreate the view with SECURITY INVOKER to respect RLS of the querying user
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles 
WITH (security_invoker=true) AS
SELECT 
  id,
  first_name,
  last_name,
  avatar_url
FROM public.profiles;

-- Grant access to the public view
GRANT SELECT ON public.public_profiles TO authenticated, anon;
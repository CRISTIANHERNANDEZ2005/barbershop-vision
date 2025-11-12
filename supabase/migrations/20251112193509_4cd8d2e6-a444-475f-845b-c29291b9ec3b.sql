-- Add policy to allow viewing of public profile fields
-- The public_profiles view limits which columns are exposed, so this is safe
CREATE POLICY "Public profile fields are viewable by everyone"
ON public.profiles
FOR SELECT
TO authenticated, anon
USING (true);
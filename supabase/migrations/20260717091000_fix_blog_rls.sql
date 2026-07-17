-- Fix blog_posts RLS: grant EXECUTE on has_role so anon users
-- can read published posts via the "Anyone can view published posts" policy.
-- Without this grant, PostgreSQL throws "permission denied for function has_role"
-- when evaluating the RLS expression even for anonymous visitors.

GRANT EXECUTE ON FUNCTION public.has_role TO anon, authenticated;

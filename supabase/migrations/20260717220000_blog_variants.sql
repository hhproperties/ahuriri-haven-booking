-- Clean up blog post slugs that have no matching hero image mapping.
-- The seed migration ran twice with slightly different slugs.
-- Keep the versions that match the static image maps in the React code.

DELETE FROM public.blog_posts
WHERE slug IN (
  'where-to-eat-ahuriri',
  'best-coffee-ahuriri'
);

-- Add a variant column (1-9) for deterministic layout assignment

ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS variant INT CHECK (variant BETWEEN 1 AND 9);

-- Assign variants deterministically by published_at order
UPDATE public.blog_posts SET variant = sub.v
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY published_at ASC, slug ASC)::INT AS v
  FROM public.blog_posts
  WHERE published = true
) sub
WHERE blog_posts.id = sub.id;

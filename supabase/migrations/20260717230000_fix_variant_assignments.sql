-- Fix variant assignments — all posts share the same published_at
-- so the previous ORDER BY was non-deterministic

UPDATE public.blog_posts SET variant = CASE slug
  WHEN 'cycling-hawkes-bay-trails'     THEN 1  -- Classic Editorial
  WHEN 'weekend-in-hawkes-bay'         THEN 2  -- Split Hero
  WHEN 'family-friendly-hawkes-bay'    THEN 3  -- Framed Portrait
  WHEN 'girls-getaway-ahuriri'         THEN 4  -- Overline Slab
  WHEN 'art-deco-napier-walking-tour'  THEN 5  -- Magazine Two-Column
  WHEN 'best-coffee-in-ahuriri'        THEN 6  -- Field Notes
  WHEN 'where-to-eat-in-ahuriri'       THEN 7  -- Long-form Scroll
  WHEN 'what-to-do-with-kids-hawkes-bay' THEN 8  -- Postcard
  WHEN 'hawkes-bay-wine-country-guide' THEN 9  -- Statement Opener
END;

SELECT slug, variant FROM public.blog_posts ORDER BY variant;

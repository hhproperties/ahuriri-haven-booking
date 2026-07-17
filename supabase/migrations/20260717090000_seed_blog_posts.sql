-- Seed all 9 blog posts with full body content
-- Uses ON CONFLICT to safely update if slug already exists

INSERT INTO public.blog_posts (slug, title, excerpt, body, audience_tag, published, published_at, seo_title, seo_description)
VALUES

-- Post 1: Where to Eat in Ahuriri
(
  'where-to-eat-in-ahuriri',
  'Where to Eat in Ahuriri — Our Restaurant Picks',
  'Our hosts'' picks for the best cafés and restaurants within walking distance of The Vulcan, Ahuriri — Napier''s favourite waterfront village.',
  E'One of the best things about staying at The Vulcan is that you barely need the car. Ahuriri''s waterfront strip is one of Napier''s best-kept dining secrets, and it''s all an easy walk from our door.\n\n## For breakfast\nStart slow at one of the waterfront cafés along the marina — good coffee, big windows, and the kind of morning light that makes even a Tuesday feel like a holiday.\n\n## For a long lunch\nAhuriri''s village strip has a handful of relaxed spots perfect for sharing plates and a glass of Hawke''s Bay wine — this region is one of New Zealand''s great wine-growing areas, so take advantage while you''re here.\n\n## For dinner\nWhether you''re after fresh seafood looking out over the water or something more casual, the restaurants along the Ahuriri waterfront cover it all — and most are a five-to-ten-minute stroll from The Vulcan.\n\nOur tip: Book ahead in summer (December–February) and during the Art Deco Festival — Ahuriri gets busy, and the best tables go quickly.\n\n## Leah''s picks\n\n### Thirsty Whale\nA relaxed, waterfront favourite right on the Ahuriri strip. Great for a laid-back lunch or an easy evening drink watching the boats come in. A five-minute stroll from The Vulcan.\n\n### Madam Social\nOur go-to for a proper night out. Good food, good wine, good energy — book ahead on weekends as tables fill fast.',
  'Food & Drink',
  true,
  now(),
  'Best Restaurants in Ahuriri, Napier | The Vulcan, Ahuriri',
  'Our hosts'' picks for the best cafés and restaurants within walking distance of The Vulcan, Ahuriri — Napier''s favourite waterfront village.'
),

-- Post 2: A Weekend in Hawke's Bay
(
  'weekend-in-hawkes-bay',
  'A Weekend in Hawke''s Bay — Things to Do Near The Vulcan',
  'A local''s guide to spending a weekend in Hawke''s Bay — beaches, wineries, Art Deco architecture, and cycle trails, all close to The Vulcan, Ahuriri.',
  E'Hawke''s Bay is one of New Zealand''s most underrated long weekends, and Ahuriri puts you right in the middle of it.\n\n## Morning: the beach and cycleway\nAhuriri Beach is a short walk from The Vulcan — grab a coffee and take the coastal cycle trail along the waterfront. Bikes can be hired locally if you didn''t bring your own.\n\n## Midday: Art Deco Napier\nA five-minute drive (or a longer scenic walk) takes you into central Napier, famous for its 1930s Art Deco architecture — one of the best-preserved collections in the world after the city was rebuilt following the 1931 earthquake.\n\n## Afternoon: wine country\nHawke''s Bay is one of New Zealand''s oldest and most respected wine regions. Spend an afternoon touring vineyards in Havelock North or the Tuki Tuki Valley — most are a 20–30 minute drive from Ahuriri.\n\n## Evening: back to the water\nWind down with dinner back in Ahuriri, watching the boats come in at the marina.\n\nOur tip: If you''re visiting with family, the National Aquarium of New Zealand and Marineland are both close by and make for an easy half-day.',
  'Active',
  true,
  now(),
  'Things to Do in Hawke''s Bay & Napier | The Vulcan, Ahuriri',
  'A local''s guide to spending a weekend in Hawke''s Bay — beaches, wineries, Art Deco architecture, and cycle trails, all close to The Vulcan, Ahuriri.'
),

-- Post 3: Family-Friendly Hawke's Bay
(
  'family-friendly-hawkes-bay',
  'Family-Friendly Hawke''s Bay — A Guide for Your Next Trip',
  'Planning a family trip to Napier and Hawke''s Bay? Here''s our hosts'' guide to the best kid-friendly beaches, attractions, and easy days out near The Vulcan, Ahuriri.',
  E'The Vulcan is set up with families in mind — two queen bedrooms mean plenty of room to spread out, and everything you need for a relaxed family stay is an easy walk from the door.\n\n## The beach, right on your doorstep\nAhuriri Beach is calm, safe, and a short stroll from the apartment — perfect for sandcastles in the morning and an ice cream on the way home.\n\n## Rainy day (or any day) fun\nNapier''s National Aquarium and Marineland are both close by and make an easy half-day out, whatever the weather is doing.\n\n## Bikes and scooters\nThe Ahuriri waterfront cycleway is flat, safe, and scenic — hire bikes locally or bring your own, and let the kids lead the way along the harbour.\n\n## Easy family dinners\nNo need to overthink meals — the apartment''s kitchen has a microwave and two-hob cooktop for quick family dinners in, or you can walk to one of Ahuriri''s relaxed, family-friendly restaurants for a low-stress night out.\n\n## Space to breathe\nBeing fully self-contained means nap times, early bedtimes, and toddler meltdowns don''t need to disrupt anyone else''s holiday — you''ve got the whole apartment to yourselves.\n\nOur tip: Pack light on toys — between the beach, the cycleway, and the aquarium, the kids will have plenty to keep them busy without you needing to bring the whole playroom.',
  'Family',
  true,
  now(),
  'Family-Friendly Things to Do in Hawke''s Bay | The Vulcan, Ahuriri',
  'Planning a family trip to Napier and Hawke''s Bay? Here''s our hosts'' guide to the best kid-friendly beaches, attractions, and easy days out near The Vulcan, Ahuriri.'
),

-- Post 4: The Ultimate Girls' Getaway in Ahuriri
(
  'girls-getaway-ahuriri',
  'The Ultimate Girls'' Getaway in Ahuriri',
  'Planning a girls'' trip to Hawke''s Bay? Here''s how to make the most of a weekend at The Vulcan, Ahuriri — wine, waterfront dining, and downtime with your best mates.',
  E'Hawke''s Bay was practically made for a girls'' weekend, and Ahuriri is the perfect home base — two queen bedrooms means everyone gets a proper bed, no air mattresses required.\n\n## Morning: slow starts\nCoffee on the waterfront, a wander along the Ahuriri cycleway, or simply staying in your robes a little longer than you should — the apartment is set up for a relaxed pace.\n\n## Afternoon: wine country\nHawke''s Bay is one of New Zealand''s great wine regions — book a tour through Havelock North or the Tuki Tuki Valley, or design your own long lunch through a few favourite cellar doors, all a short drive from Ahuriri.\n\n## Evening: dinner and drinks, no car needed\nThis is where staying in Ahuriri really pays off. Walk to Madam Social for a proper night out with good food and better wine, or keep it low-key at Thirsty Whale with drinks looking out over the water — both are an easy stroll from The Vulcan, so nobody has to be the designated driver.\n\n## Downtime\nWith the whole apartment to yourselves, there''s room to actually relax between plans — no shared hallways, no other guests, just your group and the kitchen table for a debrief over the day''s wine purchases.\n\nOur tip: Book Madam Social ahead for a weekend table — it''s popular for good reason, and you''ll want it locked in before you arrive.',
  'Girls'' Getaway',
  true,
  now(),
  'Girls'' Weekend Away in Ahuriri, Napier | The Vulcan',
  'Planning a girls'' trip to Hawke''s Bay? Here''s how to make the most of a weekend at The Vulcan, Ahuriri — wine, waterfront dining, and downtime with your best mates.'
),

-- Post 5: Art Deco Napier Walking Tour
(
  'art-deco-napier-walking-tour',
  'Art Deco Napier — A Self-Guided Walking Tour',
  'A self-guided walking tour of Napier''s world-famous Art Deco architecture, an easy trip from The Vulcan, Ahuriri.',
  E'Napier''s Art Deco streetscape exists because of tragedy: a 1931 earthquake levelled much of the city, and it was rebuilt almost entirely in the architectural style of the era. The result is one of the most complete collections of Art Deco buildings anywhere in the world — and it''s a five-to-ten-minute drive (or a longer scenic walk) from The Vulcan.\n\n### Start at the Daily Telegraph Building\nOne of the city''s most photographed Art Deco facades, with its stepped geometric detailing.\n\n### Wander Emerson Street\nNapier''s main pedestrian strip is lined with period shopfronts, pastel colour schemes, and decorative motifs — sunbursts, zigzags, and stylised Maaori patterns unique to Napier''s rebuild.\n\n### Visit MTG Hawke''s Bay\nThe regional museum has a permanent exhibition on the 1931 earthquake and the city''s rebuild — genuinely worth an hour if you want the full story behind what you''re walking past.\n\n### Look up at the National Tobacco Company Building\nA short taxi or drive from the centre, this is considered one of the finest Art Deco buildings in the country — rose and vine motifs, decorative ironwork, and a genuinely striking facade.\n\n### Finish at Tom Parker Fountain, Marine Parade\nA classic Napier photo spot, especially lit up at dusk.\n\nOur tip: Self-guided is easy and free — but if you want the full history, Napier runs guided Art Deco walking tours departing from the i-SITE visitor centre most days; check current times when you arrive.',
  'Active',
  true,
  now(),
  'Art Deco Napier Walking Tour | The Vulcan, Ahuriri',
  'A self-guided walking tour of Napier''s world-famous Art Deco architecture, an easy trip from The Vulcan, Ahuriri.'
),

-- Post 6: What to Do With Kids in Hawke's Bay
(
  'what-to-do-with-kids-hawkes-bay',
  'Family-Friendly Hawke''s Bay — What to Do With Kids',
  'A practical, age-by-age guide to keeping kids entertained in Hawke''s Bay — beaches, animals, bikes, and easy days out near The Vulcan, Ahuriri.',
  E'Different ages, different needs — here''s a quick-reference list for keeping kids happy in Hawke''s Bay, sorted by what they actually want to do rather than a single itinerary.\n\n### Toddlers and preschoolers\n- Ahuriri Beach — calm, shallow, and close enough for an easy nap-time exit strategy.\n- The National Aquarium of New Zealand — indoor, air-conditioned, and endlessly fascinating for little ones.\n- Ahuriri''s waterfront playground area — a good stretch-the-legs stop after a car trip.\n\n### Primary school age\n- Bike or scooter the Ahuriri waterfront cycleway — flat, safe, and scenic.\n- Marineland — animal encounters that hold attention for hours.\n- Hawke''s Bay''s public swimming and hot pools for a rainy-day plan.\n\n### Tweens and teens\n- Hire bikes and tackle a longer stretch of the Hawke''s Bay Trails network.\n- Napier''s Art Deco quarter has enough shops and cafés to keep older kids entertained while you look at architecture.\n- Beach days with a bit more independence — Ahuriri''s waterfront is safe enough to let older kids range a little further.\n\n### Whatever the age\nThe Vulcan''s kitchen (microwave + two-hob cooktop) makes it easy to do quick, low-stress family meals in rather than a nightly restaurant negotiation. Being fully self-contained means early bedtimes and toddler meltdowns don''t need to affect anyone else''s holiday.\n\nOur tip: Hawke''s Bay is very manageable with kids in tow — most of what''s listed here is within a 10–15 minute drive (or a walk, for the beach and cycleway) of The Vulcan.',
  'Family',
  true,
  now(),
  'What to Do With Kids in Hawke''s Bay | The Vulcan, Ahuriri',
  'A practical, age-by-age guide to keeping kids entertained in Hawke''s Bay — beaches, animals, bikes, and easy days out near The Vulcan, Ahuriri.'
),

-- Post 7: The Best Coffee in Ahuriri
(
  'best-coffee-in-ahuriri',
  'The Best Coffee in Ahuriri',
  'Where to get a proper coffee in Ahuriri, Napier — our hosts'' quick list of local favourites, all walking distance from The Vulcan.',
  E'Short and sweet — because when you want good coffee, you don''t want to read an essay first.\n\n### Milk & Honey\nWaterfront views, a good flat white, an easy walk from The Vulcan.\n\n### Hawthorne Coffee Roasters\nGreat for a slower sit-down morning, good for groups. Serious beans for serious coffee drinkers.\n\n### Adoro Cafe\nQuick and casual, good if you''re heading straight to the beach or cycleway after.\n\nAll within a 5–10 minute walk of the apartment — no car required for your morning coffee run.\n\nOur tip: Ahuriri gets busy on weekend mornings in summer, so if you''re particular about a table with a view, go earlier rather than later.',
  'Food & Drink',
  true,
  now(),
  'Best Coffee in Ahuriri, Napier | The Vulcan, Ahuriri',
  'Where to get a proper coffee in Ahuriri, Napier — our hosts'' quick list of local favourites, all walking distance from The Vulcan.'
),

-- Post 8: Cycling the Hawke's Bay Trails
(
  'cycling-hawkes-bay-trails',
  'Cycling the Hawke''s Bay Trails from Ahuriri',
  'A guide to cycling Hawke''s Bay''s famous trail network from The Vulcan, Ahuriri — routes, hire options, and tips for all fitness levels.',
  E'Hawke''s Bay Trails is one of New Zealand''s best-known cycling networks — over 200km of largely flat, well-marked paths connecting the coast, rivers, and wine country. Ahuriri is a genuinely excellent base for it.\n\n### Right from your door\nThe Ahuriri waterfront cycleway connects directly into the wider network, so you can start riding without loading a bike onto a car.\n\n### For an easy morning ride\nFollow the coastal path along Marine Parade towards central Napier — flat, scenic, and an easy round trip before lunch.\n\n### For a longer day out\nThe Water Ride and Landscapes Trail sections of the Hawke''s Bay Trails network head further afield through rural Hawke''s Bay — a good option if you want a proper half-day ride.\n\n### For wine-lovers\nSeveral trail sections link toward Hawke''s Bay''s wine country (see our wine guide) — a popular, if occasionally wobbly, way to visit a few cellar doors.\n\n### Bike hire\nSeveral local operators in Napier and Ahuriri hire bikes and e-bikes by the day — worth booking ahead in peak summer.\n\nOur tip: The trails are well-signposted and mostly flat, making them genuinely approachable for casual riders and families, not just serious cyclists.',
  'Active',
  true,
  now(),
  'Cycling the Hawke''s Bay Trails from Ahuriri | The Vulcan',
  'A guide to cycling Hawke''s Bay''s famous trail network from The Vulcan, Ahuriri — routes, hire options, and tips for all fitness levels.'
),

-- Post 9: Hawke's Bay Wine Country Guide for First-Timers
(
  'hawkes-bay-wine-country-guide',
  'A Guide to Hawke''s Bay Wine Country for First-Timers',
  'New to Hawke''s Bay wine country? Here''s a first-timer''s guide to the region, its wine styles, and how to explore it from The Vulcan, Ahuriri.',
  E'Hawke''s Bay is New Zealand''s oldest wine region and its second-largest by production — and it''s right on your doorstep from Ahuriri.\n\n## What makes it distinctive\nHawke''s Bay is best known for Bordeaux-style reds (particularly from the Gimblett Gravels sub-region), along with excellent Chardonnay and Syrah. If you''re used to New Zealand being all about Marlborough Sauvignon Blanc, this region is a genuinely different (and for many, more interesting) story.\n\n## Where to base your day\nHavelock North and the surrounding Tuki Tuki Valley are the heart of the region''s cellar doors, roughly a 20–30 minute drive from Ahuriri.\n\n## How to do it without driving\nSeveral local operators run guided wine tours from Napier and Ahuriri with tastings included — a sensible option if you want to actually enjoy the wine rather than spit and drive. Cycling between a couple of nearby cellar doors is another popular (and more active) option — see our cycling guide.\n\n## For first-timers\nDon''t feel you need to hit five wineries in a day. Two or three unhurried stops, with a proper lunch somewhere in between, is the better version of a Hawke''s Bay wine day.\n\nOur tip: Book tours or tastings ahead in summer and during harvest season (March–April) — this is peak season for the region and popular cellar doors fill up.',
  'Wine',
  true,
  now(),
  'Hawke''s Bay Wine Country Guide for First-Timers | The Vulcan',
  'New to Hawke''s Bay wine country? Here''s a first-timer''s guide to the region, its wine styles, and how to explore it from The Vulcan, Ahuriri.'
)

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  body = EXCLUDED.body,
  audience_tag = EXCLUDED.audience_tag,
  published = EXCLUDED.published,
  published_at = EXCLUDED.published_at,
  seo_title = EXCLUDED.seo_title,
  seo_description = EXCLUDED.seo_description,
  updated_at = now();

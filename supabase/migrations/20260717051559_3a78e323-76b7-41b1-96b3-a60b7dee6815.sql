
-- Enums
CREATE TYPE public.booking_status AS ENUM ('pending_payment', 'confirmed', 'cancelled', 'refunded');
CREATE TYPE public.payment_method AS ENUM ('bank_transfer', 'stripe');
CREATE TYPE public.app_role AS ENUM ('admin');

-- updated_at trigger fn
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

-- user_roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users see their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_reference TEXT NOT NULL UNIQUE,
  guest_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests_count INT NOT NULL CHECK (guests_count BETWEEN 1 AND 4),
  bedrooms_booked INT NOT NULL CHECK (bedrooms_booked IN (1, 2)),
  total_amount_cents INT NOT NULL,
  payment_method payment_method NOT NULL DEFAULT 'bank_transfer',
  payment_reference TEXT,
  stripe_payment_intent_id TEXT,
  status booking_status NOT NULL DEFAULT 'pending_payment',
  payment_hold_expires_at TIMESTAMPTZ,
  confirmed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  refund_amount_cents INT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (check_out > check_in)
);
GRANT INSERT ON public.bookings TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "Anyone can create a booking" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (status = 'pending_payment');
CREATE POLICY "Admins full access to bookings" ON public.bookings FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Public availability view (only date ranges + status of active holds/confirmed)
CREATE OR REPLACE VIEW public.booking_availability AS
  SELECT check_in, check_out, status
  FROM public.bookings
  WHERE status IN ('pending_payment', 'confirmed')
    AND (status = 'confirmed' OR payment_hold_expires_at > now());
GRANT SELECT ON public.booking_availability TO anon, authenticated;

-- airbnb_blocked_dates
CREATE TABLE public.airbnb_blocked_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL DEFAULT 'airbnb',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  summary TEXT,
  fetched_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.airbnb_blocked_dates TO anon, authenticated;
GRANT ALL ON public.airbnb_blocked_dates TO service_role;
ALTER TABLE public.airbnb_blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view blocked dates" ON public.airbnb_blocked_dates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage blocked dates" ON public.airbnb_blocked_dates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- blog_posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  excerpt TEXT,
  body TEXT NOT NULL,
  hero_image TEXT,
  audience_tag TEXT,
  seo_title TEXT,
  seo_description TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Anyone can view published posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage posts" ON public.blog_posts FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- reviews
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  body TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Anyone can view published reviews" ON public.reviews FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage reviews" ON public.reviews FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- payment_settings (singleton)
CREATE TABLE public.payment_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  bank_account_name TEXT NOT NULL DEFAULT 'H&H Property Group Limited',
  bank_account_number TEXT NOT NULL DEFAULT '',
  particulars_format TEXT NOT NULL DEFAULT 'VULCAN-{ref}',
  payment_mode payment_method NOT NULL DEFAULT 'bank_transfer',
  base_rate_cents INT NOT NULL DEFAULT 22000,
  second_bedroom_rate_cents INT NOT NULL DEFAULT 18000,
  airbnb_ical_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.payment_settings TO anon, authenticated;
GRANT ALL ON public.payment_settings TO service_role;
GRANT UPDATE ON public.payment_settings TO authenticated;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER payment_settings_updated_at BEFORE UPDATE ON public.payment_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE POLICY "Anyone can read settings" ON public.payment_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins update settings" ON public.payment_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.payment_settings (id) VALUES (1);

-- email_log
CREATE TABLE public.email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  template TEXT NOT NULL,
  recipient TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(booking_id, template)
);
GRANT ALL ON public.email_log TO service_role;
GRANT SELECT ON public.email_log TO authenticated;
ALTER TABLE public.email_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view email log" ON public.email_log FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Seed reviews
INSERT INTO public.reviews (author_name, rating, body, sort_order) VALUES
('Sarah M.', 5, 'Right in the middle of everything — five minutes to the beach and an easy walk to dinner. Immaculately clean when we arrived.', 1),
('Aroha T.', 5, 'Leah sorted us an early check-in with barely any notice. Couldn''t fault the place.', 2),
('Daniel P.', 5, 'Walked to three different restaurants over our stay without needing the car once. Spotless apartment, comfy beds.', 3),
('Michelle R.', 5, 'Wayne let us drop bags off hours before check-in when our flight got in early — such an easy, well-run stay.', 4),
('Grant H.', 5, 'Best located self-contained unit we''ve stayed in on the East Coast — and cleaner than most hotels.', 5),
('Priya K.', 5, 'The apartment is beautifully finished — warm, considered, and quiet. Felt like a boutique lodge rather than a rental.', 6),
('Tom W.', 5, 'Booked last minute for the Art Deco weekend and had zero regrets. Perfect base for exploring Napier on foot.', 7),
('Emma L.', 5, 'Leah and Wayne are wonderful hosts. The garden setting is such a lovely surprise this close to town.', 8);

-- Seed blog posts (excerpt only; full body can be edited in admin)
INSERT INTO public.blog_posts (slug, title, excerpt, body, audience_tag, published, published_at, seo_title, seo_description) VALUES
('where-to-eat-ahuriri', 'Where to Eat in Ahuriri: Our Restaurant Picks', 'A short walk from The Vulcan takes you to some of Hawke''s Bay''s best waterfront dining — here''s where we send our guests.', E'Ahuriri''s waterfront village is one of the best-kept dining secrets on the East Coast. From The Vulcan you can walk to almost all of it.\n\n## The Thirsty Whale\nHarbourside pub classics with a serious wine list. Book ahead on weekends.\n\n## Madam Social\nMediterranean-inspired plates in a beautifully lit room — our pick for a long lunch.\n\n## Milk & Honey\nThe Ahuriri brunch institution. Coffee, eggs benedict, and a view of the boats.', 'Food & Drink', true, now(), 'Where to Eat in Ahuriri | The Vulcan', 'A local''s guide to the best restaurants and cafés within walking distance of The Vulcan, Ahuriri.'),
('weekend-in-hawkes-bay', 'A Weekend in Hawke''s Bay: Things to Do Near The Vulcan', 'Two nights, one apartment, and more good food and scenery than you''ll know what to do with.', E'Hawke''s Bay packs a huge amount into a small area. Here''s how to spend a weekend using The Vulcan as your base.\n\n### Saturday\nCoffee at Milk & Honey, cycle the Rotary Pathway, lunch at the winery, sunset drinks at The Thirsty Whale.\n\n### Sunday\nMarine Parade walk, Art Deco tour, brunch in the CBD.', 'Active', true, now(), 'A Weekend in Hawke''s Bay | The Vulcan', 'Plan a weekend in Napier and Ahuriri with our local itinerary — food, cycling, wine, and Art Deco.'),
('family-friendly-hawkes-bay', 'Family-Friendly Hawke''s Bay: A Guide for Your Next Trip', 'Hawke''s Bay with kids in tow — where to go, what to do, and how to keep everyone happy.', E'Travelling with kids? Hawke''s Bay is one of New Zealand''s most family-friendly regions.\n\n- Marineland playground and beach\n- National Aquarium of New Zealand\n- Splash Planet in Hastings\n- The Rotary Pathway (flat, safe, scenic)', 'Family', true, now(), 'Family-Friendly Hawke''s Bay | The Vulcan', 'A parent''s guide to Hawke''s Bay — kid-friendly activities, beaches, and playgrounds near Ahuriri.'),
('girls-getaway-ahuriri', 'The Ultimate Girls'' Getaway in Ahuriri', 'Wine, waterfront dinners, and a beautiful apartment to come home to.', E'A girls'' weekend in Ahuriri writes itself.\n\n- Cellar door tastings in Havelock North\n- Long lunch at Craggy Range\n- Sunset cocktails on the harbour\n- Beach walks and brunch on the way home', 'Girls'' Getaway', true, now(), 'Girls'' Getaway in Ahuriri | The Vulcan', 'Plan the perfect girls'' weekend in Ahuriri — wine, food, and a boutique apartment as your base.'),
('art-deco-napier-walking-tour', 'Art Deco Napier: A Self-Guided Walking Tour', 'The world''s most complete Art Deco city, on foot, at your own pace.', E'Napier''s CBD is a 20-minute walk or five-minute drive from The Vulcan.\n\n1. Start at the Art Deco Trust\n2. Emerson Street\n3. The Daily Telegraph Building\n4. Marine Parade and the Soundshell\n5. Coffee at Six Sisters', 'Active', true, now(), 'Art Deco Napier Walking Tour | The Vulcan', 'A self-guided walking tour of Napier''s Art Deco quarter, starting from Ahuriri.'),
('best-coffee-ahuriri', 'The Best Coffee in Ahuriri', 'Four cafés, four flat whites — where we send guests on their first morning.', E'Ahuriri does coffee properly.\n\n- **Milk & Honey** — the all-rounder\n- **Hawthorne Coffee Roasters** — for serious beans\n- **Six Sisters** — brunch and a flat white\n- **Adoro Cafe** — quiet mornings', 'Food & Drink', true, now(), 'Best Coffee in Ahuriri | The Vulcan', 'The four best cafés in Ahuriri for morning coffee — a local''s guide from The Vulcan.'),
('cycling-hawkes-bay-trails', 'Cycling the Hawke''s Bay Trails from Ahuriri', 'Flat, scenic, and easy to do straight from the front door.', E'The Hawke''s Bay Trails network runs right past Ahuriri — you can be on a bike path within five minutes of leaving The Vulcan.\n\nHire e-bikes from Bike D''Vine or Fishbike, and pick from the Landscapes, Water, or Wineries rides.', 'Active', true, now(), 'Cycling Hawke''s Bay Trails | The Vulcan', 'How to hire a bike and ride the Hawke''s Bay Trails from Ahuriri.'),
('hawkes-bay-wine-country-guide', 'A Guide to Hawke''s Bay Wine Country for First-Timers', 'The oldest wine region in New Zealand, on your doorstep.', E'Hawke''s Bay is New Zealand''s oldest wine region and, for many, its best.\n\n### Where to start\n- Craggy Range\n- Elephant Hill\n- Church Road\n- Mission Estate\n\nA tour company can drive you all day, or hire a bike for a slower version.', 'Wine', true, now(), 'Hawke''s Bay Wine Country Guide | The Vulcan', 'A beginner''s guide to Hawke''s Bay wineries — where to taste, and how to plan a day out.');

export interface JournalPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  hero_image: string | null;
  audience_tag: string | null;
  seo_title: string | null;
  seo_description: string | null;
  published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  variant: number;
}

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  category: string | null;
  published_at: string;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  description: string | null;
  drive_file_id: string;
  thumb_url: string | null;
  album: string | null;
  taken_at: string | null;
  created_at: string;
};

export type Teacher = {
  id: string;
  full_name: string;
  position: string | null;
  department: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  display_order: number;
};

export type SchoolAsset = {
  id: string;
  key: string; // 'logo', 'banner', etc.
  bucket: string;
  path: string;
  public_url: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  school_name: string;
  motto: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  facebook: string | null;
  map_embed: string | null;
  hero_subtitle: string | null;
};

import { getSupabase } from "./supabase";
import type {
  GalleryItem,
  NewsItem,
  SiteSettings,
  Teacher,
} from "./types";

/* -------- Fallback content (used when Supabase env is missing) -------- */

const FALLBACK_SETTINGS: SiteSettings = {
  id: 1,
  school_name: "โรงเรียนวัดบางขุด(อุ่นพิทยาคาร)",
  motto: "ความรู้คู่คุณธรรม นำสู่ความเป็นเลิศ",
  address: "ตำบลบางขุด อำเภอเมือง จังหวัด...",
  phone: "0-0000-0000",
  email: "contact@watbangkhud.ac.th",
  facebook: "https://facebook.com/",
  map_embed: "",
  hero_subtitle:
    "บ่มเพาะปัญญา สร้างคนดี ด้วยจิตวิญญาณแห่งการเรียนรู้ตลอดชีวิต",
};

const FALLBACK_NEWS: NewsItem[] = [
  {
    id: "n1",
    slug: "welcome-2026",
    title: "เปิดภาคเรียนปีการศึกษา 2569",
    excerpt:
      "ยินดีต้อนรับนักเรียนทุกคนสู่ปีการศึกษาใหม่ พร้อมกิจกรรมและหลักสูตรที่พัฒนาขึ้นอีกขั้น",
    content: null,
    cover_url: null,
    category: "ประกาศ",
    published_at: "2026-04-22",
    created_at: "2026-04-22",
  },
  {
    id: "n2",
    slug: "sports-day",
    title: "กีฬาสีภายใน ประจำปี",
    excerpt:
      "บรรยากาศการแข่งขันกีฬาสี ที่สะท้อนพลังสามัคคีของพี่น้องชาวอุ่นพิทยาคาร",
    content: null,
    cover_url: null,
    category: "กิจกรรม",
    published_at: "2026-04-10",
    created_at: "2026-04-10",
  },
  {
    id: "n3",
    slug: "academic-award",
    title: "นักเรียนคว้ารางวัลระดับเขตพื้นที่",
    excerpt:
      "ขอแสดงความยินดีกับนักเรียนที่ได้รับรางวัลในการแข่งขันทักษะวิชาการ",
    content: null,
    cover_url: null,
    category: "รางวัล",
    published_at: "2026-03-28",
    created_at: "2026-03-28",
  },
];

const FALLBACK_GALLERY: GalleryItem[] = [];

const FALLBACK_TEACHERS: Teacher[] = [
  {
    id: "t1",
    full_name: "นาย ก. ตัวอย่าง",
    position: "ผู้อำนวยการโรงเรียน",
    department: "ฝ่ายบริหาร",
    email: null,
    phone: null,
    photo_url: null,
    display_order: 1,
  },
  {
    id: "t2",
    full_name: "นาง ข. ตัวอย่าง",
    position: "รองผู้อำนวยการ",
    department: "ฝ่ายวิชาการ",
    email: null,
    phone: null,
    photo_url: null,
    display_order: 2,
  },
  {
    id: "t3",
    full_name: "นางสาว ค. ตัวอย่าง",
    position: "ครูชำนาญการพิเศษ",
    department: "กลุ่มสาระภาษาไทย",
    email: null,
    phone: null,
    photo_url: null,
    display_order: 3,
  },
];

/* ----------------------------- Queries ----------------------------- */

export async function getSettings(): Promise<SiteSettings> {
  const sb = getSupabase();
  if (!sb) return FALLBACK_SETTINGS;
  const { data } = await sb
    .from("site_settings")
    .select("*")
    .limit(1)
    .maybeSingle();
  return (data as SiteSettings) ?? FALLBACK_SETTINGS;
}

export async function getNews(limit = 9): Promise<NewsItem[]> {
  const sb = getSupabase();
  if (!sb) return FALLBACK_NEWS.slice(0, limit);
  const { data } = await sb
    .from("news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data as NewsItem[]) ?? FALLBACK_NEWS;
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const sb = getSupabase();
  if (!sb) return FALLBACK_NEWS.find((n) => n.slug === slug) ?? null;
  const { data } = await sb
    .from("news")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  return (data as NewsItem) ?? null;
}

export async function getGallery(limit = 24): Promise<GalleryItem[]> {
  const sb = getSupabase();
  if (!sb) return FALLBACK_GALLERY;
  const { data } = await sb
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as GalleryItem[]) ?? [];
}

export async function getTeachers(): Promise<Teacher[]> {
  const sb = getSupabase();
  if (!sb) return FALLBACK_TEACHERS;
  const { data } = await sb
    .from("teachers")
    .select("*")
    .order("display_order", { ascending: true });
  return (data as Teacher[]) ?? FALLBACK_TEACHERS;
}

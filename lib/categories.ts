/**
 * หมวดหมู่ข่าวสาร — ใช้ทั้งใน admin form (dropdown) และหน้า /news (filter chips)
 * เพิ่ม/ลบ/แก้ลำดับได้ที่นี่ที่เดียว
 */
export const NEWS_CATEGORIES = [
  "ประกาศ",
  "กิจกรรม",
  "รางวัล",
  "วิชาการ",
  "ข่าวทั่วไป",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/** สีของแต่ละหมวด (ใช้แต้มสีเล็ก ๆ บน chip) */
export const CATEGORY_COLOR: Record<string, string> = {
  ประกาศ: "from-rose-500 to-rose-700",
  กิจกรรม: "from-blue-500 to-blue-700",
  รางวัล: "from-amber-500 to-amber-700",
  วิชาการ: "from-emerald-500 to-emerald-700",
  ข่าวทั่วไป: "from-slate-500 to-slate-700",
};

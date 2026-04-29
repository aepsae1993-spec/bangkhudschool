"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  GalleryHorizontalEnd,
  GraduationCap,
  Settings,
  Users,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { AdminCard, AdminPageTitle } from "@/components/admin/AdminCard";

type Counts = {
  news: number;
  gallery: number;
  teachers: number;
  students: number;
  rooms: number;
};

export default function DashboardPage() {
  const [counts, setCounts] = useState<Counts>({
    news: 0,
    gallery: 0,
    teachers: 0,
    students: 0,
    rooms: 0,
  });

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    Promise.all([
      sb.from("news").select("*", { count: "exact", head: true }),
      sb.from("gallery").select("*", { count: "exact", head: true }),
      sb.from("teachers").select("*", { count: "exact", head: true }),
      sb.from("classrooms").select("male_count,female_count"),
    ]).then(([n, g, t, c]) => {
      const rows = (c.data as { male_count: number; female_count: number }[]) ?? [];
      const students = rows.reduce((s, r) => s + r.male_count + r.female_count, 0);
      setCounts({
        news: n.count ?? 0,
        gallery: g.count ?? 0,
        teachers: t.count ?? 0,
        students,
        rooms: rows.length,
      });
    });
  }, []);

  const SHORTCUTS = [
    {
      href: "/admin/students",
      icon: GraduationCap,
      label: `นักเรียน (${counts.rooms} ห้อง)`,
      count: counts.students,
      unit: "คน",
      color: "from-amber-500 to-amber-700",
    },
    {
      href: "/admin/news",
      icon: BookOpen,
      label: "ข่าวสาร",
      count: counts.news,
      unit: "รายการ",
      color: "from-blue-500 to-blue-700",
    },
    {
      href: "/admin/gallery",
      icon: GalleryHorizontalEnd,
      label: "ภาพกิจกรรม",
      count: counts.gallery,
      unit: "รูป",
      color: "from-purple-500 to-purple-700",
    },
    {
      href: "/admin/teachers",
      icon: Users,
      label: "บุคลากร",
      count: counts.teachers,
      unit: "คน",
      color: "from-emerald-500 to-emerald-700",
    },
    {
      href: "/admin/settings",
      icon: Settings,
      label: "ตั้งค่าเว็บ",
      count: null,
      unit: "",
      color: "from-gold-500 to-gold-700",
    },
  ];

  return (
    <>
      <AdminPageTitle title="ภาพรวม" sub="ยินดีต้อนรับสู่ Admin Panel โรงเรียนวัดบางขุด(อุ่นพิทยาคาร)" />
      <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-5">
        {SHORTCUTS.map(({ href, icon: Icon, label, count, unit, color }) => (
          <Link key={href} href={href}>
            <AdminCard className="hover:border-gold-300/40 hover:-translate-y-1 hover:shadow-soft transition-all cursor-pointer">
              <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="text-cream-100/70 text-sm">{label}</div>
              {count !== null ? (
                <div className="mt-1 text-3xl font-display gold-text">
                  {count} <span className="text-base text-cream-100/50">{unit}</span>
                </div>
              ) : (
                <div className="mt-1 text-sm text-gold-300">แก้ไขตั้งค่า →</div>
              )}
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <AdminCard>
          <h2 className="font-semibold mb-4">ลิงก์ด่วน</h2>
          <div className="flex flex-wrap gap-3">
            <Link href="/" target="_blank" className="btn-ghost text-sm">ดูเว็บหน้าบ้าน ↗</Link>
            <Link href="/admin/news" className="btn-ghost text-sm">+ เพิ่มข่าวใหม่</Link>
            <Link href="/admin/gallery" className="btn-ghost text-sm">+ เพิ่มรูปกิจกรรม</Link>
            <Link href="/admin/teachers" className="btn-ghost text-sm">+ เพิ่มบุคลากร</Link>
          </div>
        </AdminCard>
      </div>
    </>
  );
}

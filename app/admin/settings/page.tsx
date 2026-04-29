"use client";

import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";
import type { SiteSettings } from "@/lib/types";
import {
  AdminCard,
  AdminPageTitle,
  BtnPrimary,
  FormInput,
  FormTextarea,
  Toast,
} from "@/components/admin/AdminCard";

const EMPTY: Omit<SiteSettings, "id"> = {
  school_name: "",
  motto: "",
  hero_subtitle: "",
  address: "",
  phone: "",
  email: "",
  facebook: "",
  map_embed: "",
};

export default function SettingsPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    sb.from("site_settings").select("*").limit(1).maybeSingle().then(({ data }) => {
      if (data) setForm({ ...EMPTY, ...data });
    });
  }, []);

  function set(k: keyof typeof EMPTY, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const sb = getSupabase();
    if (!sb) return;
    const { error } = await sb.from("site_settings").upsert({ id: 1, ...form });
    setToast(error ? { msg: "บันทึกไม่สำเร็จ: " + error.message, type: "err" } : { msg: "บันทึกสำเร็จแล้ว ✓", type: "ok" });
    setTimeout(() => setToast(null), 3000);
    setLoading(false);
  }

  return (
    <>
      <AdminPageTitle title="ตั้งค่าเว็บไซต์" sub="ข้อมูลพื้นฐานที่แสดงทั่วทั้งเว็บ" />
      <form onSubmit={save}>
        <div className="grid lg:grid-cols-2 gap-6">
          <AdminCard>
            <h2 className="font-semibold mb-5">ข้อมูลโรงเรียน</h2>
            <div className="space-y-4">
              <FormInput
                label="ชื่อโรงเรียน"
                value={form.school_name}
                onChange={(e) => set("school_name", e.target.value)}
                required
              />
              <FormInput
                label="ปรัชญา / คติพจน์"
                value={form.motto ?? ""}
                onChange={(e) => set("motto", e.target.value)}
                placeholder="ความรู้คู่คุณธรรม..."
              />
              <FormTextarea
                label="คำอธิบายใต้ชื่อโรงเรียน (Hero subtitle)"
                value={form.hero_subtitle ?? ""}
                onChange={(e) => set("hero_subtitle", e.target.value)}
                rows={3}
                placeholder="บ่มเพาะปัญญา สร้างคนดี..."
              />
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="font-semibold mb-5">ข้อมูลติดต่อ</h2>
            <div className="space-y-4">
              <FormTextarea
                label="ที่อยู่"
                value={form.address ?? ""}
                onChange={(e) => set("address", e.target.value)}
                rows={3}
              />
              <FormInput
                label="โทรศัพท์"
                value={form.phone ?? ""}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="0-0000-0000"
              />
              <FormInput
                label="อีเมล"
                type="email"
                value={form.email ?? ""}
                onChange={(e) => set("email", e.target.value)}
              />
              <FormInput
                label="Facebook URL"
                value={form.facebook ?? ""}
                onChange={(e) => set("facebook", e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>
          </AdminCard>

          <AdminCard className="lg:col-span-2">
            <h2 className="font-semibold mb-5">Google Maps Embed</h2>
            <FormTextarea
              label="Embed URL (ได้จาก Google Maps → Share → Embed a map → copy src=&quot;...&quot;)"
              value={form.map_embed ?? ""}
              onChange={(e) => set("map_embed", e.target.value)}
              rows={3}
              placeholder="https://www.google.com/maps/embed?pb=..."
            />
          </AdminCard>
        </div>

        <div className="mt-6 flex justify-end">
          <BtnPrimary type="submit" loading={loading}>
            บันทึกการตั้งค่า
          </BtnPrimary>
        </div>
      </form>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

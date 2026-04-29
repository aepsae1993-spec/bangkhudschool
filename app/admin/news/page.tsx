"use client";

import { useEffect, useRef, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { NewsItem } from "@/lib/types";
import {
  AdminCard,
  AdminPageTitle,
  BtnDanger,
  BtnGhost,
  BtnPrimary,
  FormInput,
  FormTextarea,
  Toast,
} from "@/components/admin/AdminCard";

const EMPTY_FORM = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_url: "",
  category: "",
  published_at: new Date().toISOString().split("T")[0],
};

type Form = typeof EMPTY_FORM;

function makeSlug(title: string) {
  return (
    title
      .replace(/[^฀-๿a-zA-Z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 60) +
    "-" +
    Date.now()
  );
}

export default function AdminNewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [editing, setEditing] = useState<string | null>(null); // null = closed, 'new' or id
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  async function load() {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb.from("news").select("*").order("published_at", { ascending: false });
    setItems((data as NewsItem[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  function set(k: keyof Form, v: string) {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "title" && (editing === "new" || !next.slug)) {
        next.slug = makeSlug(v);
      }
      return next;
    });
  }

  function openNew() {
    setForm({ ...EMPTY_FORM, published_at: new Date().toISOString().split("T")[0] });
    setEditing("new");
  }

  function openEdit(item: NewsItem) {
    setForm({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt ?? "",
      content: item.content ?? "",
      cover_url: item.cover_url ?? "",
      category: item.category ?? "",
      published_at: item.published_at.slice(0, 10),
    });
    setEditing(item.id);
  }

  async function uploadCover(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("album", "news-covers");

      const res = await fetch("/api/drive-upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "อัปโหลดไม่สำเร็จ");
      }
      setForm((f) => ({ ...f, cover_url: data.url }));
      showToast("อัปโหลดรูปปกขึ้น Drive สำเร็จ ✓", "ok");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "อัปโหลดไม่สำเร็จ";
      showToast(msg, "err");
    }
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setSaving(true);
    const payload = { ...form, slug: form.slug || makeSlug(form.title) };
    let error;
    if (editing === "new") {
      ({ error } = await sb.from("news").insert(payload));
    } else {
      ({ error } = await sb.from("news").update(payload).eq("id", editing));
    }
    if (error) {
      showToast("บันทึกไม่สำเร็จ: " + error.message, "err");
    } else {
      showToast(editing === "new" ? "เพิ่มข่าวสำเร็จ ✓" : "แก้ไขข่าวสำเร็จ ✓", "ok");
      setEditing(null);
      load();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบข่าวนี้?")) return;
    const sb = getSupabase();
    if (!sb) return;
    setDeleting(id);
    const { error } = await sb.from("news").delete().eq("id", id);
    if (error) showToast("ลบไม่สำเร็จ: " + error.message, "err");
    else { showToast("ลบข่าวสำเร็จ ✓", "ok"); load(); }
    setDeleting(null);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <AdminPageTitle title="จัดการข่าวสาร" sub={`ทั้งหมด ${items.length} รายการ`} />
        <BtnPrimary onClick={openNew}>
          <Plus size={16} /> เพิ่มข่าวใหม่
        </BtnPrimary>
      </div>

      {/* Form Panel */}
      {editing && (
        <AdminCard className="mb-8 border-gold-300/30">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">{editing === "new" ? "เพิ่มข่าวใหม่" : "แก้ไขข่าว"}</h2>
            <button onClick={() => setEditing(null)} className="text-cream-100/50 hover:text-cream-100">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput label="หัวข่าว *" value={form.title} onChange={(e) => set("title", e.target.value)} required />
              <FormInput label="Slug (URL)" value={form.slug} onChange={(e) => set("slug", e.target.value)} required hint="ใช้ตัวเล็ก ไม่มีเว้นวรรค เช่น sports-day-2569" />
              <FormInput label="หมวดหมู่" value={form.category} onChange={(e) => set("category", e.target.value)} placeholder="ประกาศ / กิจกรรม / รางวัล" />
              <FormInput label="วันที่เผยแพร่" type="date" value={form.published_at} onChange={(e) => set("published_at", e.target.value)} />
            </div>
            <FormTextarea label="ข้อความย่อ (excerpt)" value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} placeholder="สรุปสั้น ๆ ของข่าว..." />
            <FormTextarea label="เนื้อหาข่าว (content)" value={form.content} onChange={(e) => set("content", e.target.value)} rows={8} placeholder="เนื้อหาข่าวทั้งหมด..." />

            {/* Cover image */}
            <div>
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <span className="text-sm text-cream-100/80">รูปปกข่าว</span>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-xs text-gold-300 underline underline-offset-2 hover:text-gold-200 disabled:opacity-50"
                  disabled={uploading}
                >
                  {uploading ? "กำลังอัปโหลดขึ้น Drive..." : "อัปโหลดขึ้น Google Drive"}
                </button>
                <span className="text-[11px] text-cream-100/40">
                  (ไฟล์เก็บที่ Drive โฟลเดอร์ <code className="text-gold-200/70">news-covers</code>)
                </span>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { if (e.target.files?.[0]) uploadCover(e.target.files[0]); }} />
              </div>
              <input
                type="url"
                value={form.cover_url}
                onChange={(e) => set("cover_url", e.target.value)}
                placeholder="https://... หรือกดอัปโหลดด้านบน"
                className="w-full rounded-xl bg-ink-800/60 border border-white/10 px-4 py-2.5 text-sm text-cream-100 placeholder-cream-100/30 focus:outline-none focus:border-gold-300/60 transition"
              />
              {form.cover_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.cover_url} alt="preview" className="mt-2 h-32 rounded-xl object-cover" />
              )}
            </div>

            <div className="flex gap-3 justify-end">
              <BtnGhost type="button" onClick={() => setEditing(null)}>ยกเลิก</BtnGhost>
              <BtnPrimary type="submit" loading={saving}>บันทึก</BtnPrimary>
            </div>
          </form>
        </AdminCard>
      )}

      {/* Table */}
      <AdminCard>
        {items.length === 0 ? (
          <div className="text-center py-12 text-cream-100/50">ยังไม่มีข่าว — กด "เพิ่มข่าวใหม่" ด้านบน</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-cream-100/50 text-left">
                  <th className="pb-3 font-medium">หัวข่าว</th>
                  <th className="pb-3 font-medium">หมวด</th>
                  <th className="pb-3 font-medium">วันที่</th>
                  <th className="pb-3 font-medium text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {items.map((n) => (
                  <tr key={n.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-medium max-w-xs truncate">{n.title}</td>
                    <td className="py-3 pr-4 text-cream-100/60">{n.category ?? "—"}</td>
                    <td className="py-3 pr-4 text-cream-100/60 whitespace-nowrap">{n.published_at.slice(0, 10)}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(n)}
                          className="p-1.5 rounded-lg hover:bg-white/10 text-cream-100/60 hover:text-gold-300 transition"
                          title="แก้ไข"
                        >
                          <Edit2 size={15} />
                        </button>
                        <BtnDanger onClick={() => handleDelete(n.id)} loading={deleting === n.id}>
                          <Trash2 size={14} />
                        </BtnDanger>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

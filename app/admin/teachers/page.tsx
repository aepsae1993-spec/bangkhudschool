"use client";

import { useEffect, useRef, useState } from "react";
import { Edit2, Plus, Trash2, Upload, User, X } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import type { Teacher } from "@/lib/types";
import {
  AdminCard,
  AdminPageTitle,
  BtnDanger,
  BtnGhost,
  BtnPrimary,
  FormInput,
  Toast,
} from "@/components/admin/AdminCard";

const EMPTY: Omit<Teacher, "id" | "created_at"> = {
  full_name: "",
  position: "",
  department: "",
  email: "",
  phone: "",
  photo_url: "",
  display_order: 100,
};
type Form = typeof EMPTY;

const DEPTS = [
  "ฝ่ายบริหาร",
  "ฝ่ายวิชาการ",
  "ฝ่ายกิจการนักเรียน",
  "ฝ่ายบริหารงานบุคคล",
  "ฝ่ายงบประมาณ",
  "กลุ่มสาระภาษาไทย",
  "กลุ่มสาระคณิตศาสตร์",
  "กลุ่มสาระวิทยาศาสตร์",
  "กลุ่มสาระสังคมศึกษา",
  "กลุ่มสาระภาษาต่างประเทศ",
  "กลุ่มสาระสุขศึกษา",
  "กลุ่มสาระศิลปะ",
  "กลุ่มสาระการงานอาชีพ",
  "บุคลากรสนับสนุน",
];

export default function AdminTeachersPage() {
  const [items, setItems] = useState<Teacher[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function load() {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb
      .from("teachers")
      .select("*")
      .order("display_order", { ascending: true });
    setItems((data as Teacher[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function openNew() {
    setForm({ ...EMPTY });
    setEditing("new");
    setTimeout(() => document.getElementById("teacher-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function openEdit(item: Teacher) {
    setForm({
      full_name: item.full_name,
      position: item.position ?? "",
      department: item.department ?? "",
      email: item.email ?? "",
      phone: item.phone ?? "",
      photo_url: item.photo_url ?? "",
      display_order: item.display_order,
    });
    setEditing(item.id);
    setTimeout(() => document.getElementById("teacher-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function uploadPhoto(file: File) {
    const sb = getSupabase();
    if (!sb) return;
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `teachers/${Date.now()}.${ext}`;
    const { error } = await sb.storage
      .from("public-assets")
      .upload(path, file, { upsert: true });
    if (error) {
      showToast("อัปโหลดรูปไม่สำเร็จ: " + error.message, "err");
    } else {
      const { data } = sb.storage.from("public-assets").getPublicUrl(path);
      setForm((f) => ({ ...f, photo_url: data.publicUrl }));
      showToast("อัปโหลดรูปสำเร็จ ✓", "ok");
    }
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setSaving(true);
    let error;
    if (editing === "new") {
      ({ error } = await sb.from("teachers").insert(form));
    } else {
      ({ error } = await sb.from("teachers").update(form).eq("id", editing));
    }
    if (error) showToast("บันทึกไม่สำเร็จ: " + error.message, "err");
    else {
      showToast(editing === "new" ? "เพิ่มบุคลากรสำเร็จ ✓" : "แก้ไขสำเร็จ ✓", "ok");
      setEditing(null);
      load();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบบุคลากรนี้?")) return;
    const sb = getSupabase();
    if (!sb) return;
    setDeleting(id);
    const { error } = await sb.from("teachers").delete().eq("id", id);
    if (error) showToast("ลบไม่สำเร็จ: " + error.message, "err");
    else { showToast("ลบสำเร็จ ✓", "ok"); load(); }
    setDeleting(null);
  }

  // group by department for display
  const grouped = items.reduce<Record<string, Teacher[]>>((acc, t) => {
    const k = t.department || "ไม่ระบุฝ่าย";
    (acc[k] ||= []).push(t);
    return acc;
  }, {});

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <AdminPageTitle title="จัดการบุคลากร" sub={`ทั้งหมด ${items.length} คน`} />
        <BtnPrimary onClick={openNew}>
          <Plus size={16} /> เพิ่มบุคลากร
        </BtnPrimary>
      </div>

      {/* Form Panel */}
      {editing && (
        <AdminCard className="mb-8 border-gold-300/30" id="teacher-form">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">{editing === "new" ? "เพิ่มบุคลากรใหม่" : "แก้ไขข้อมูลบุคลากร"}</h2>
            <button onClick={() => setEditing(null)} className="text-cream-100/50 hover:text-cream-100">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo upload */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="h-32 w-32 rounded-2xl overflow-hidden bg-ink-800 border border-white/10 flex items-center justify-center">
                  {form.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.photo_url} alt="photo" className="h-full w-full object-cover" />
                  ) : (
                    <User size={44} className="text-cream-100/30" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="inline-flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-white/15 hover:border-gold-300/50 hover:bg-white/[0.04] text-cream-100/70 transition disabled:opacity-50"
                >
                  {uploading ? (
                    <span className="h-3 w-3 border border-cream-100/30 border-t-cream-100 rounded-full animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {uploading ? "กำลังอัปโหลด..." : "อัปโหลดรูป"}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { if (e.target.files?.[0]) uploadPhoto(e.target.files[0]); }}
                />
                <p className="text-[10px] text-cream-100/40 text-center">หรือวาง URL ด้านขวา</p>
              </div>

              {/* Fields */}
              <div className="flex-1 grid sm:grid-cols-2 gap-4">
                <FormInput
                  label="ชื่อ-นามสกุล *"
                  value={form.full_name}
                  onChange={(e) => set("full_name", e.target.value)}
                  required
                  placeholder="นาย / นาง / นางสาว..."
                />
                <FormInput
                  label="ตำแหน่ง"
                  value={form.position}
                  onChange={(e) => set("position", e.target.value)}
                  placeholder="ครูชำนาญการ / ผู้อำนวยการ..."
                />
                <div>
                  <label className="block text-sm text-cream-100/80 mb-1.5">ฝ่าย/กลุ่มสาระ</label>
                  <input
                    list="dept-list"
                    value={form.department}
                    onChange={(e) => set("department", e.target.value)}
                    placeholder="เลือกหรือพิมพ์เอง..."
                    className="w-full rounded-xl bg-ink-800/60 border border-white/10 px-4 py-2.5 text-sm text-cream-100 placeholder-cream-100/30 focus:outline-none focus:border-gold-300/60 transition"
                  />
                  <datalist id="dept-list">
                    {DEPTS.map((d) => <option key={d} value={d} />)}
                  </datalist>
                </div>
                <FormInput
                  label="ลำดับการแสดง"
                  type="number"
                  value={String(form.display_order)}
                  onChange={(e) => set("display_order", Number(e.target.value))}
                  hint="ตัวเลขน้อย = แสดงก่อน"
                />
                <FormInput
                  label="อีเมล"
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <FormInput
                  label="โทรศัพท์"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <FormInput
                  label="URL รูปภาพ (ถ้าไม่อัปโหลด)"
                  value={form.photo_url}
                  onChange={(e) => set("photo_url", e.target.value)}
                  placeholder="https://..."
                  className="sm:col-span-2"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <BtnGhost type="button" onClick={() => setEditing(null)}>ยกเลิก</BtnGhost>
              <BtnPrimary type="submit" loading={saving}>บันทึก</BtnPrimary>
            </div>
          </form>
        </AdminCard>
      )}

      {/* List grouped by dept */}
      {items.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12 text-cream-100/50">
            ยังไม่มีบุคลากร — กด "เพิ่มบุคลากร" ด้านบน
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([dept, list]) => (
            <div key={dept}>
              <div className="text-sm tracking-widest uppercase text-gold-300/70 mb-3">{dept}</div>
              <AdminCard className="p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-cream-100/50 text-left">
                      <th className="px-5 py-3 font-medium">บุคลากร</th>
                      <th className="px-5 py-3 font-medium hidden md:table-cell">ตำแหน่ง</th>
                      <th className="px-5 py-3 font-medium hidden lg:table-cell">ติดต่อ</th>
                      <th className="px-5 py-3 font-medium text-right">ลำดับ / จัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {list.map((t) => (
                      <tr key={t.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-ink-800 border border-white/10 shrink-0 flex items-center justify-center">
                              {t.photo_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={t.photo_url} alt={t.full_name} className="h-full w-full object-cover" />
                              ) : (
                                <User size={18} className="text-cream-100/30" />
                              )}
                            </div>
                            <span className="font-medium">{t.full_name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-cream-100/60 hidden md:table-cell">
                          {t.position ?? "—"}
                        </td>
                        <td className="px-5 py-3 text-cream-100/50 text-xs hidden lg:table-cell">
                          {t.email || t.phone ? (
                            <div>{t.email && <div>{t.email}</div>}{t.phone && <div>{t.phone}</div>}</div>
                          ) : "—"}
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xs text-cream-100/40 mr-1">#{t.display_order}</span>
                            <button
                              onClick={() => openEdit(t)}
                              className="p-1.5 rounded-lg hover:bg-white/10 text-cream-100/60 hover:text-gold-300 transition"
                              title="แก้ไข"
                            >
                              <Edit2 size={15} />
                            </button>
                            <BtnDanger onClick={() => handleDelete(t.id)} loading={deleting === t.id}>
                              <Trash2 size={14} />
                            </BtnDanger>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </AdminCard>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Edit2, Plus, Trash2, X } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { GRADE_ORDER, gradeIndex } from "@/lib/data";
import type { Classroom } from "@/lib/types";
import {
  AdminCard,
  AdminPageTitle,
  BtnDanger,
  BtnGhost,
  BtnPrimary,
  FormInput,
  Toast,
} from "@/components/admin/AdminCard";

type Form = {
  grade: string;
  room: string;
  male_count: number;
  female_count: number;
  teacher_name: string;
  display_order: number;
};

const EMPTY: Form = {
  grade: "ป.1",
  room: "1",
  male_count: 0,
  female_count: 0,
  teacher_name: "",
  display_order: 100,
};

function autoOrder(grade: string, room: string): number {
  const idx = gradeIndex(grade);
  const r = parseInt(room, 10) || 0;
  return (idx + 1) * 100 + r;
}

export default function AdminStudentsPage() {
  const [items, setItems] = useState<Classroom[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function load() {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb
      .from("classrooms")
      .select("*")
      .order("display_order", { ascending: true });
    setItems((data as Classroom[]) ?? []);
  }

  useEffect(() => { load(); }, []);

  function set<K extends keyof Form>(k: K, v: Form[K]) {
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === "grade" || k === "room") {
        next.display_order = autoOrder(next.grade, next.room);
      }
      return next;
    });
  }

  function openNew() {
    setForm({ ...EMPTY, display_order: autoOrder(EMPTY.grade, EMPTY.room) });
    setEditing("new");
    setTimeout(() => document.getElementById("st-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function openEdit(c: Classroom) {
    setForm({
      grade: c.grade,
      room: c.room,
      male_count: c.male_count,
      female_count: c.female_count,
      teacher_name: c.teacher_name ?? "",
      display_order: c.display_order,
    });
    setEditing(c.id);
    setTimeout(() => document.getElementById("st-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const sb = getSupabase();
    if (!sb) return;
    setSaving(true);
    let error;
    if (editing === "new") {
      ({ error } = await sb.from("classrooms").insert(form));
    } else {
      ({ error } = await sb.from("classrooms").update(form).eq("id", editing));
    }
    if (error) showToast("บันทึกไม่สำเร็จ: " + error.message, "err");
    else {
      showToast(editing === "new" ? "เพิ่มห้องเรียนสำเร็จ ✓" : "แก้ไขสำเร็จ ✓", "ok");
      setEditing(null);
      load();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบห้องเรียนนี้?")) return;
    const sb = getSupabase();
    if (!sb) return;
    setDeleting(id);
    const { error } = await sb.from("classrooms").delete().eq("id", id);
    if (error) showToast("ลบไม่สำเร็จ: " + error.message, "err");
    else { showToast("ลบสำเร็จ ✓", "ok"); load(); }
    setDeleting(null);
  }

  // sorted
  const sorted = [...items].sort((a, b) => {
    const ga = gradeIndex(a.grade);
    const gb = gradeIndex(b.grade);
    if (ga !== gb) return ga - gb;
    return a.room.localeCompare(b.room, "th", { numeric: true });
  });

  // group by grade for nicer display
  const byGrade = sorted.reduce<Record<string, Classroom[]>>((acc, r) => {
    (acc[r.grade] ||= []).push(r);
    return acc;
  }, {});

  // overall totals
  const totals = sorted.reduce(
    (s, r) => {
      s.m += r.male_count;
      s.f += r.female_count;
      return s;
    },
    { m: 0, f: 0 }
  );

  return (
    <>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <AdminPageTitle
          title="จัดการข้อมูลนักเรียน"
          sub={`${sorted.length} ห้องเรียน · ชาย ${totals.m} · หญิง ${totals.f} · รวม ${totals.m + totals.f} คน`}
        />
        <BtnPrimary onClick={openNew}>
          <Plus size={16} /> เพิ่มห้องเรียน
        </BtnPrimary>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <AdminCard className="text-center py-4">
          <div className="text-xs text-cream-100/50 uppercase tracking-wider">รวม</div>
          <div className="font-display text-2xl gold-text mt-1">{totals.m + totals.f}</div>
        </AdminCard>
        <AdminCard className="text-center py-4">
          <div className="text-xs text-blue-300/70 uppercase tracking-wider">ชาย</div>
          <div className="font-display text-2xl text-blue-300 mt-1">{totals.m}</div>
        </AdminCard>
        <AdminCard className="text-center py-4">
          <div className="text-xs text-pink-300/70 uppercase tracking-wider">หญิง</div>
          <div className="font-display text-2xl text-pink-300 mt-1">{totals.f}</div>
        </AdminCard>
      </div>

      {/* Form */}
      {editing && (
        <AdminCard className="mb-8 border-gold-300/30" id="st-form">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">{editing === "new" ? "เพิ่มห้องเรียนใหม่" : "แก้ไขห้องเรียน"}</h2>
            <button onClick={() => setEditing(null)} className="text-cream-100/50 hover:text-cream-100">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm text-cream-100/80 mb-1.5">ระดับชั้น *</label>
                <select
                  value={form.grade}
                  onChange={(e) => set("grade", e.target.value)}
                  className="w-full rounded-xl bg-ink-800/60 border border-white/10 px-4 py-2.5 text-sm text-cream-100 focus:outline-none focus:border-gold-300/60 transition"
                >
                  {GRADE_ORDER.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <FormInput
                label="ห้อง *"
                value={form.room}
                onChange={(e) => set("room", e.target.value)}
                placeholder="1, 2, 3..."
                required
              />
              <FormInput
                label="ชาย"
                type="number"
                min={0}
                value={String(form.male_count)}
                onChange={(e) => set("male_count", Number(e.target.value) || 0)}
              />
              <FormInput
                label="หญิง"
                type="number"
                min={0}
                value={String(form.female_count)}
                onChange={(e) => set("female_count", Number(e.target.value) || 0)}
              />
              <FormInput
                label="ครูประจำชั้น"
                value={form.teacher_name}
                onChange={(e) => set("teacher_name", e.target.value)}
                placeholder="ชื่อครู (ไม่บังคับ)"
                className="sm:col-span-2"
              />
              <FormInput
                label="ลำดับการแสดง"
                type="number"
                value={String(form.display_order)}
                onChange={(e) => set("display_order", Number(e.target.value) || 0)}
                hint="ระบบกำหนดอัตโนมัติจากระดับชั้น/ห้อง"
              />
              <div className="flex items-end">
                <div className="text-xs text-cream-100/60 px-3 py-2.5 rounded-xl bg-ink-800/40 border border-white/10 w-full">
                  รวม: <span className="text-gold-200 font-semibold">{form.male_count + form.female_count}</span> คน
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <BtnGhost type="button" onClick={() => setEditing(null)}>ยกเลิก</BtnGhost>
              <BtnPrimary type="submit" loading={saving}>บันทึก</BtnPrimary>
            </div>
          </form>
        </AdminCard>
      )}

      {/* List grouped by grade */}
      {sorted.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12 text-cream-100/50">
            ยังไม่มีห้องเรียน — กด "เพิ่มห้องเรียน" ด้านบน
          </div>
        </AdminCard>
      ) : (
        <div className="space-y-6">
          {Object.entries(byGrade).map(([grade, list]) => {
            const t = list.reduce((s, r) => ({ m: s.m + r.male_count, f: s.f + r.female_count }), { m: 0, f: 0 });
            return (
              <div key={grade}>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="text-sm tracking-widest uppercase text-gold-300/80">
                    {grade} ({list.length} ห้อง)
                  </div>
                  <div className="text-xs text-cream-100/50">
                    <span className="text-blue-300">ช {t.m}</span>
                    {" / "}
                    <span className="text-pink-300">ญ {t.f}</span>
                    {" / "}
                    <span className="text-gold-200">รวม {t.m + t.f}</span>
                  </div>
                </div>
                <AdminCard className="p-0 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 text-cream-100/50 text-left">
                        <th className="px-5 py-3 font-medium">ห้อง</th>
                        <th className="px-5 py-3 font-medium hidden md:table-cell">ครูประจำชั้น</th>
                        <th className="px-5 py-3 font-medium text-right">ชาย</th>
                        <th className="px-5 py-3 font-medium text-right">หญิง</th>
                        <th className="px-5 py-3 font-medium text-right">รวม</th>
                        <th className="px-5 py-3 font-medium text-right">จัดการ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {list.map((c) => (
                        <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="px-5 py-3 font-medium text-gold-200">
                            {c.grade}/{c.room}
                          </td>
                          <td className="px-5 py-3 text-cream-100/70 hidden md:table-cell">
                            {c.teacher_name ?? "—"}
                          </td>
                          <td className="px-5 py-3 text-right text-blue-300">{c.male_count}</td>
                          <td className="px-5 py-3 text-right text-pink-300">{c.female_count}</td>
                          <td className="px-5 py-3 text-right font-semibold">
                            {c.male_count + c.female_count}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openEdit(c)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-cream-100/60 hover:text-gold-300 transition"
                                title="แก้ไข"
                              >
                                <Edit2 size={15} />
                              </button>
                              <BtnDanger onClick={() => handleDelete(c.id)} loading={deleting === c.id}>
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
            );
          })}
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

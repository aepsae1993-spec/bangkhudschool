"use client";

import { useEffect, useState } from "react";
import { Edit2, ExternalLink, ImageOff, Plus, Trash2, X } from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { driveThumbUrl } from "@/lib/gdrive";
import type { GalleryItem } from "@/lib/types";
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

const EMPTY: Omit<GalleryItem, "id" | "created_at"> = {
  title: "",
  description: "",
  drive_file_id: "",
  thumb_url: "",
  album: "",
  taken_at: "",
};
type Form = typeof EMPTY;

function DrivePreview({ fileId }: { fileId: string }) {
  const [err, setErr] = useState(false);
  if (!fileId || err)
    return (
      <div className="h-24 w-24 rounded-xl bg-ink-800 flex items-center justify-center text-cream-100/30 border border-white/10">
        <ImageOff size={22} />
      </div>
    );
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={driveThumbUrl(fileId, 400)}
      alt="preview"
      className="h-24 w-24 rounded-xl object-cover border border-white/10"
      onError={() => setErr(true)}
    />
  );
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [form, setForm] = useState<Form>(EMPTY);
  const [editing, setEditing] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "ok" | "err" } | null>(null);
  const [albums, setAlbums] = useState<string[]>([]);
  const [filterAlbum, setFilterAlbum] = useState("");

  function showToast(msg: string, type: "ok" | "err") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function load() {
    const sb = getSupabase();
    if (!sb) return;
    const { data } = await sb
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    const rows = (data as GalleryItem[]) ?? [];
    setItems(rows);
    const unique = [...new Set(rows.map((r) => r.album).filter(Boolean))] as string[];
    setAlbums(unique);
  }

  useEffect(() => { load(); }, []);

  function set(k: keyof Form, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function openNew() {
    setForm({ ...EMPTY, taken_at: new Date().toISOString().split("T")[0] });
    setEditing("new");
    setTimeout(() => document.getElementById("gallery-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  function openEdit(item: GalleryItem) {
    setForm({
      title: item.title,
      description: item.description ?? "",
      drive_file_id: item.drive_file_id,
      thumb_url: item.thumb_url ?? "",
      album: item.album ?? "",
      taken_at: item.taken_at ?? "",
    });
    setEditing(item.id);
    setTimeout(() => document.getElementById("gallery-form")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.drive_file_id.trim()) {
      showToast("กรุณาใส่ Drive File ID", "err");
      return;
    }
    const sb = getSupabase();
    if (!sb) return;
    setSaving(true);
    const payload = { ...form };
    let error;
    if (editing === "new") {
      ({ error } = await sb.from("gallery").insert(payload));
    } else {
      ({ error } = await sb.from("gallery").update(payload).eq("id", editing));
    }
    if (error) showToast("บันทึกไม่สำเร็จ: " + error.message, "err");
    else {
      showToast(editing === "new" ? "เพิ่มรูปสำเร็จ ✓" : "แก้ไขสำเร็จ ✓", "ok");
      setEditing(null);
      load();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("ลบรายการนี้?")) return;
    const sb = getSupabase();
    if (!sb) return;
    setDeleting(id);
    const { error } = await sb.from("gallery").delete().eq("id", id);
    if (error) showToast("ลบไม่สำเร็จ: " + error.message, "err");
    else { showToast("ลบสำเร็จ ✓", "ok"); load(); }
    setDeleting(null);
  }

  const filtered = filterAlbum ? items.filter((i) => i.album === filterAlbum) : items;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <AdminPageTitle title="จัดการภาพกิจกรรม" sub={`ทั้งหมด ${items.length} รูป`} />
        <BtnPrimary onClick={openNew}>
          <Plus size={16} /> เพิ่มรูปใหม่
        </BtnPrimary>
      </div>

      {/* How to get Drive File ID */}
      <AdminCard className="mb-6 border-gold-300/20">
        <p className="text-sm text-cream-100/70">
          <span className="text-gold-300 font-medium">วิธีหา Drive File ID:</span>{" "}
          เปิดไฟล์รูปใน Google Drive → คลิกขวา → <em>Get link</em> →
          URL จะมีรูปแบบ{" "}
          <code className="text-gold-200 bg-ink-800 px-1.5 py-0.5 rounded">
            https://drive.google.com/file/d/<strong>FILE_ID</strong>/view
          </code>{" "}
          คัดลอกเฉพาะ <strong>FILE_ID</strong> มาใส่
        </p>
      </AdminCard>

      {/* Form panel */}
      {editing && (
        <AdminCard className="mb-8 border-gold-300/30" id="gallery-form">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold">{editing === "new" ? "เพิ่มรูปใหม่" : "แก้ไขรูป"}</h2>
            <button onClick={() => setEditing(null)} className="text-cream-100/50 hover:text-cream-100">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FormInput
                label="ชื่อรูป / หัวเรื่อง *"
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                required
              />
              <div>
                <label className="block text-sm text-cream-100/80 mb-1.5">
                  Drive File ID *{" "}
                  {form.drive_file_id && (
                    <a
                      href={`https://drive.google.com/file/d/${form.drive_file_id}/view`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-gold-300 text-xs ml-2 inline-flex items-center gap-1"
                    >
                      ดูไฟล์ <ExternalLink size={11} />
                    </a>
                  )}
                </label>
                <div className="flex gap-2">
                  <input
                    value={form.drive_file_id}
                    onChange={(e) => set("drive_file_id", e.target.value.trim())}
                    placeholder="1aBcDeFgHiJ..."
                    required
                    className="flex-1 rounded-xl bg-ink-800/60 border border-white/10 px-4 py-2.5 text-sm text-cream-100 placeholder-cream-100/30 focus:outline-none focus:border-gold-300/60 transition"
                  />
                  <DrivePreview fileId={form.drive_file_id} />
                </div>
              </div>
              <FormInput
                label="อัลบั้ม"
                value={form.album}
                onChange={(e) => set("album", e.target.value)}
                placeholder="เช่น กีฬาสี-2569"
                list="album-list"
              />
              <datalist id="album-list">
                {albums.map((a) => <option key={a} value={a} />)}
              </datalist>
              <FormInput
                label="วันที่ถ่าย"
                type="date"
                value={form.taken_at}
                onChange={(e) => set("taken_at", e.target.value)}
              />
            </div>
            <FormTextarea
              label="คำบรรยาย"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              rows={2}
              placeholder="รายละเอียดเพิ่มเติม..."
            />
            <div className="flex gap-3 justify-end">
              <BtnGhost type="button" onClick={() => setEditing(null)}>ยกเลิก</BtnGhost>
              <BtnPrimary type="submit" loading={saving}>บันทึก</BtnPrimary>
            </div>
          </form>
        </AdminCard>
      )}

      {/* Filter by album */}
      {albums.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-5">
          <button
            onClick={() => setFilterAlbum("")}
            className={`chip cursor-pointer transition ${!filterAlbum ? "bg-gold-400/20 border-gold-300/60 text-gold-200" : ""}`}
          >
            ทั้งหมด ({items.length})
          </button>
          {albums.map((a) => (
            <button
              key={a}
              onClick={() => setFilterAlbum(a)}
              className={`chip cursor-pointer transition ${filterAlbum === a ? "bg-gold-400/20 border-gold-300/60 text-gold-200" : ""}`}
            >
              {a} ({items.filter((i) => i.album === a).length})
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <AdminCard>
          <div className="text-center py-12 text-cream-100/50">
            ยังไม่มีรูปภาพ — กด "เพิ่มรูปใหม่" ด้านบน
          </div>
        </AdminCard>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="glass rounded-2xl overflow-hidden group">
              <div className="relative aspect-square">
                <DrivePreview fileId={item.drive_file_id} />
                {/* overlay actions */}
                <div className="absolute inset-0 bg-ink-950/70 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                  <button
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-cream-100 transition"
                    title="แก้ไข"
                  >
                    <Edit2 size={16} />
                  </button>
                  <BtnDanger onClick={() => handleDelete(item.id)} loading={deleting === item.id}>
                    <Trash2 size={14} />
                  </BtnDanger>
                </div>
                {/* full-size preview on same DrivePreview - we need to override */}
                <div className="absolute inset-0 pointer-events-none">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={driveThumbUrl(item.drive_file_id, 600)}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              <div className="p-3">
                <div className="text-sm font-medium truncate">{item.title}</div>
                {item.album && (
                  <div className="text-[11px] text-gold-300/70 mt-0.5">{item.album}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast msg={toast.msg} type={toast.type} />}
    </>
  );
}

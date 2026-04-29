import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * อัปโหลดไฟล์ไป Google Drive ผ่าน Apps Script bridge (server-side relay)
 *
 * Body: multipart/form-data
 *   file:  File
 *   album: string  (โฟลเดอร์ใน Drive — default "uploads")
 *
 * Response: { id, url, thumb, view }
 *   url  = lh3.googleusercontent.com/d/<id>=w1600  (ใช้ใน <img> ได้เลย)
 */
export async function POST(req: NextRequest) {
  try {
    const fd = await req.formData();
    const file = fd.get("file") as File | null;
    const album = ((fd.get("album") as string) || "uploads").trim();

    if (!file) {
      return NextResponse.json({ error: "no file" }, { status: 400 });
    }

    const gasUrl = process.env.NEXT_PUBLIC_GAS_DRIVE_URL;
    const secret = process.env.GAS_DRIVE_SECRET;
    if (!gasUrl || !secret) {
      return NextResponse.json(
        {
          error:
            "ยังไม่ได้ตั้งค่า NEXT_PUBLIC_GAS_DRIVE_URL หรือ GAS_DRIVE_SECRET ใน Vercel/.env",
        },
        { status: 500 }
      );
    }

    const buf = await file.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");

    const res = await fetch(gasUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "upload",
        secret,
        album,
        filename: file.name || `upload-${Date.now()}`,
        mimeType: file.type || "application/octet-stream",
        base64,
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Apps Script returned ${res.status}` },
        { status: 502 }
      );
    }
    const data = await res.json();
    if (!data.ok || !data.file?.id) {
      return NextResponse.json(
        { error: data.error || "Apps Script upload failed" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      id: data.file.id,
      url: `https://lh3.googleusercontent.com/d/${data.file.id}=w1600`,
      thumb: data.file.thumb,
      view: data.file.view,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

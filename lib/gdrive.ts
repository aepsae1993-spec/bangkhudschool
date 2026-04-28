/**
 * Helpers for interacting with the Google Apps Script "Drive bridge".
 *
 * The Apps Script web app (apps-script/Code.gs) exposes:
 *   GET  ?action=list&album=xxx        -> list files in an album (folder)
 *   GET  ?action=thumb&id=FILE_ID      -> 302 redirect to a thumbnail
 *   POST  { action:"upload", ... }     -> upload base64 file (admin only)
 *
 * For public viewing we only need a stable URL that resolves to a thumbnail
 * or a viewable image. Google Drive's `lh3.googleusercontent.com` endpoint
 * works for files that are shared "Anyone with the link".
 */

export const GAS_URL = process.env.NEXT_PUBLIC_GAS_DRIVE_URL ?? "";

/** Direct image URL that works in <img>/<Image> for public Drive files. */
export function driveImageUrl(fileId: string, size = 1600): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${size}`;
}

/** Thumbnail (smaller, for grid views). */
export function driveThumbUrl(fileId: string, size = 600): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${size}-h${size}-c`;
}

/** List files in an album via the Apps Script bridge. */
export async function listAlbum(album: string): Promise<
  Array<{ id: string; name: string; mimeType: string }>
> {
  if (!GAS_URL) return [];
  const u = new URL(GAS_URL);
  u.searchParams.set("action", "list");
  u.searchParams.set("album", album);
  try {
    const res = await fetch(u.toString(), { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.files) ? data.files : [];
  } catch {
    return [];
  }
}

/** Upload a base64 file to a Drive album via Apps Script (server-side admin). */
export async function uploadToDrive(args: {
  album: string;
  filename: string;
  mimeType: string;
  base64: string;
}) {
  if (!GAS_URL) throw new Error("NEXT_PUBLIC_GAS_DRIVE_URL not set");
  const secret = process.env.GAS_DRIVE_SECRET;
  if (!secret) throw new Error("GAS_DRIVE_SECRET not set on server");
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...args, action: "upload", secret }),
  });
  if (!res.ok) throw new Error(`Drive upload failed: ${res.status}`);
  return res.json() as Promise<{ id: string; url: string }>;
}

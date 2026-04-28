/**
 * Google Apps Script — Drive bridge สำหรับเว็บไซต์โรงเรียน
 *
 * วิธีตั้งค่า:
 *  1) เปิด https://script.google.com → New project แล้วคัดลอกไฟล์นี้ลงไป
 *  2) แก้ค่า ROOT_FOLDER_ID ให้เป็น Folder ID ของ Drive ที่จะเก็บรูปหลัก
 *     (สร้างโฟลเดอร์ใหม่ใน Google Drive แล้ว copy ID จาก URL)
 *  3) แก้ค่า SHARED_SECRET ให้เป็นข้อความสุ่ม ๆ และเอาค่าเดียวกันไปใส่ใน
 *     environment variable ของเว็บชื่อ GAS_DRIVE_SECRET
 *  4) Deploy → New deployment → type = Web app
 *     - Execute as: Me
 *     - Who has access: Anyone (เพื่อให้เว็บเรียกได้)
 *  5) คัดลอก URL /exec มาใส่ NEXT_PUBLIC_GAS_DRIVE_URL ในเว็บ
 *
 * Endpoints:
 *  GET  ?action=list&album=ชื่ออัลบั้ม
 *       -> { files: [{id, name, mimeType, thumb, view}] }
 *  GET  ?action=thumb&id=FILE_ID
 *       -> 302 redirect ไปยัง thumbnail
 *  POST  body JSON {
 *           action:"upload", secret, album, filename, mimeType, base64
 *        }
 *       -> { id, url, thumb }
 */

const ROOT_FOLDER_ID = "PUT_YOUR_DRIVE_FOLDER_ID_HERE";
const SHARED_SECRET  = "PUT_THE_SAME_SECRET_AS_GAS_DRIVE_SECRET_HERE";

/* --------------------------- Helpers --------------------------- */

function _getOrCreateAlbum(album) {
  const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  if (!album) return root;
  const it = root.getFoldersByName(album);
  if (it.hasNext()) return it.next();
  return root.createFolder(album);
}

function _fileToJson(f) {
  const id = f.getId();
  return {
    id: id,
    name: f.getName(),
    mimeType: f.getMimeType(),
    size: f.getSize(),
    thumb: "https://lh3.googleusercontent.com/d/" + id + "=w800-h800-c",
    view: "https://drive.google.com/uc?export=view&id=" + id,
  };
}

function _json(obj, status) {
  const out = ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  return out;
}

/* --------------------------- HTTP entry --------------------------- */

function doGet(e) {
  try {
    const action = (e.parameter.action || "").toLowerCase();

    if (action === "list") {
      const folder = _getOrCreateAlbum(e.parameter.album || "");
      // ให้แชร์ทั้งโฟลเดอร์ "Anyone with the link can view"
      try { folder.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW); } catch (_) {}
      const it = folder.getFiles();
      const files = [];
      while (it.hasNext()) {
        const f = it.next();
        if (f.getMimeType().indexOf("image/") === 0) files.push(_fileToJson(f));
      }
      // ใหม่ -> เก่า
      files.sort(function (a, b) { return b.id < a.id ? -1 : 1; });
      return _json({ ok: true, album: e.parameter.album || "", files: files });
    }

    if (action === "thumb" && e.parameter.id) {
      const url = "https://lh3.googleusercontent.com/d/" + e.parameter.id + "=w1200";
      return HtmlService.createHtmlOutput(
        "<script>location.replace(" + JSON.stringify(url) + ")</script>"
      );
    }

    return _json({ ok: false, error: "unknown action" });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents || "{}");
    if (!body.secret || body.secret !== SHARED_SECRET) {
      return _json({ ok: false, error: "unauthorized" });
    }
    const action = (body.action || "").toLowerCase();

    if (action === "upload") {
      const folder = _getOrCreateAlbum(body.album || "");
      const blob = Utilities.newBlob(
        Utilities.base64Decode(body.base64),
        body.mimeType || "image/jpeg",
        body.filename || ("upload-" + new Date().getTime())
      );
      const file = folder.createFile(blob);
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      return _json({ ok: true, file: _fileToJson(file) });
    }

    if (action === "delete" && body.id) {
      const file = DriveApp.getFileById(body.id);
      file.setTrashed(true);
      return _json({ ok: true });
    }

    return _json({ ok: false, error: "unknown action" });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

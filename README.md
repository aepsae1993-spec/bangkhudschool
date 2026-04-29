# เว็บไซต์โรงเรียนวัดบางขุด(อุ่นพิทยาคาร)

เว็บไซต์ทางการของโรงเรียน — ออกแบบให้ดูหรู สมูท ลื่นไหล
สร้างด้วย **Next.js 14 + TypeScript + Tailwind + Framer Motion**
- ฐานข้อมูล: **Supabase** (Postgres + Storage เฉพาะโลโก้กับรูปครู)
- รูปข่าว / รูปกิจกรรม: **Google Drive** ผ่าน **Google Apps Script**
- Deploy: **GitHub → Vercel**

### นโยบายการเก็บไฟล์
| ประเภท | เก็บที่ | path / album |
|---|---|---|
| โลโก้โรงเรียน | Supabase Storage | `public-assets/logo/school-logo.png` |
| รูปครู / บุคลากร | Supabase Storage | `public-assets/teachers/<timestamp>.<ext>` |
| รูปปกข่าวสาร | Google Drive | โฟลเดอร์ `news-covers` |
| รูปกิจกรรม (gallery) | Google Drive | โฟลเดอร์ตามอัลบั้ม |

---

## 1) ติดตั้ง

```bash
npm install
cp .env.local.example .env.local   # แล้วแก้ค่าใน .env.local
npm run dev                         # เปิด http://localhost:3000
```

> ถ้ายังไม่ได้ตั้งค่า Supabase/Apps Script เว็บก็จะรันได้
> และโชว์ข้อมูลตัวอย่างให้เห็นโครงสร้างก่อน

---

## 2) ตั้งค่า Supabase

1. สร้างโปรเจกต์ใหม่ที่ https://supabase.com → ไปที่ **SQL Editor**
2. คัดลอกเนื้อหาทั้งไฟล์ `supabase/schema.sql` มาวางและกด **Run**
   - จะสร้าง bucket `public-assets`, ตาราง `site_settings / news / gallery / teachers`
   - พร้อม Row Level Security (อ่านสาธารณะ / เขียนเฉพาะผู้ login)
3. ที่ Supabase → **Storage → public-assets → Upload**
   - อัปโหลดไฟล์โลโก้ตั้งชื่อ `logo/school-logo.png`
   - URL จะเป็น
     `https://YOUR-PROJECT.supabase.co/storage/v1/object/public/public-assets/logo/school-logo.png`
4. คัดลอกค่าจาก **Project Settings → API**
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → `SUPABASE_SERVICE_ROLE_KEY` (เก็บลับ)

---

## 3) ตั้งค่า Google Apps Script (Drive Bridge)

1. สร้างโฟลเดอร์ใน Google Drive เช่น `WatBangKhud-Photos` แล้วคัดลอก **Folder ID** จาก URL
   (`https://drive.google.com/drive/folders/<FOLDER_ID>`)
2. ไปที่ https://script.google.com → **New project**
3. คัดลอกเนื้อหา `apps-script/Code.gs` ไปวางทั้งหมด แล้วแก้
   ```js
   const ROOT_FOLDER_ID = "FOLDER_ID_ของคุณ";
   const SHARED_SECRET  = "ความลับยาว ๆ ของคุณ";
   ```
4. **Deploy → New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
5. คัดลอก URL ที่ลงท้ายด้วย `/exec` →
   - `NEXT_PUBLIC_GAS_DRIVE_URL` ในเว็บ
   - และ `GAS_DRIVE_SECRET` ตรงกับใน `Code.gs`

> วิธีเพิ่มรูปกิจกรรม: เอารูปลงในโฟลเดอร์ย่อยของ Drive เช่น `กีฬาสี-2569`
> แล้วเพิ่ม row ใน `gallery` ของ Supabase: `drive_file_id` = ID ไฟล์ Drive,
> `album` = "กีฬาสี-2569" — เว็บจะดึงรูปขึ้นมาให้ทันที

---

## 4) ดีพลอยขึ้น Vercel ผ่าน GitHub

1. push โปรเจกต์ขึ้น GitHub
   ```bash
   git init
   git add .
   git commit -m "feat: initial school site"
   git branch -M main
   git remote add origin git@github.com:YOUR/REPO.git
   git push -u origin main
   ```
2. ที่ https://vercel.com → **Add New… → Project** → เลือก repo
3. ใส่ **Environment Variables** ให้ครบ (เหมือนใน `.env.local.example`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_GAS_DRIVE_URL`
   - `GAS_DRIVE_SECRET`
4. Deploy — เสร็จ 🎉

---

## 5) ระบบ Admin Panel

เข้าใช้งานที่ `/admin` (หรือ `/admin/login`)

### วิธีสร้างบัญชี Admin
1. ไปที่ Supabase → **Authentication → Users → Add user**
2. ใส่ Email + Password แล้วกด **Create user**
3. เข้าเว็บ `/admin/login` แล้ว login ด้วย email/password นั้น

### ฟีเจอร์ Admin
| หน้า | ทำอะไรได้ |
|------|-----------|
| `/admin/dashboard` | ดูสถิติภาพรวม |
| `/admin/settings` | แก้ชื่อโรงเรียน, ปรัชญา, ที่อยู่, เบอร์, อีเมล, Facebook, Maps |
| `/admin/news` | เพิ่ม/แก้ไข/ลบข่าวสาร + อัปโหลดรูปปก |
| `/admin/gallery` | เพิ่ม/แก้ไข/ลบภาพกิจกรรม (ใช้ Google Drive File ID) |
| `/admin/teachers` | เพิ่ม/แก้ไข/ลบบุคลากร + อัปโหลดรูปถ่าย |

### วิธีเพิ่มรูปใน Gallery
1. อัปโหลดรูปขึ้น Google Drive (โฟลเดอร์ที่ตั้งใน Apps Script)
2. คลิกขวาที่ไฟล์ → **Get link** → คัดลอก File ID จาก URL
   `https://drive.google.com/file/d/**FILE_ID**/view`
3. ไปที่ `/admin/gallery` → กด "เพิ่มรูปใหม่" → วาง File ID
4. เว็บจะโชว์ preview อัตโนมัติ

---

## 6) โครงสร้างโปรเจกต์

```
app/
  page.tsx                  หน้าแรก (Hero, สถิติ, จุดเด่น, ข่าว, CTA)
  about/page.tsx            เกี่ยวกับโรงเรียน + Timeline
  news/page.tsx             รายการข่าว
  news/[slug]/page.tsx      รายละเอียดข่าว
  gallery/page.tsx          ภาพกิจกรรม (lightbox, Google Drive)
  teachers/page.tsx         บุคลากร แยกตามฝ่าย
  contact/page.tsx          ติดต่อ + Google Maps embed
  admin/
    layout.tsx              Admin shell (auth guard + sidebar)
    login/page.tsx          หน้า login
    dashboard/page.tsx      ภาพรวม + สถิติ
    settings/page.tsx       ตั้งค่าเว็บไซต์
    news/page.tsx           CRUD ข่าวสาร + อัปโหลดรูปปก
    gallery/page.tsx        CRUD ภาพกิจกรรม (Drive File ID)
    teachers/page.tsx       CRUD บุคลากร + อัปโหลดรูปถ่าย
components/
  Navbar, Footer, Hero, NewsCard, GalleryGrid, ...
  admin/
    AdminShell.tsx          Sidebar + layout สำหรับ admin
    AdminCard.tsx           UI components (form inputs, buttons, toast)
hooks/
  useAdminAuth.ts           ตรวจสอบ Supabase session + redirect
lib/
  supabase.ts               Supabase client + logo URL helper
  gdrive.ts                 Google Drive / Apps Script helpers
  data.ts                   query functions + fallback content
  types.ts                  TypeScript types
supabase/schema.sql         สร้างตาราง, RLS policies, Storage bucket
apps-script/Code.gs         Drive bridge (list/upload/thumb)
```

## 6) ทำไมถึง “ดูไฮโซ”

- โทนสี Midnight ink × ทอง shimmer
- ฟอนต์ Playfair Display + Prompt
- เอฟเฟกต์ aurora blob, glass-morphism, gold-text gradient
- Reveal animation ด้วย Framer Motion ทุก section
- การ์ดมี hover lift + shadow glow
- Gallery เป็น lightbox ดู transition นุ่ม ๆ
- Smooth scroll + scrollbar สีทอง

---

ขอให้สนุกกับการพัฒนาต่อยอดครับ ✨

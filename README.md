# เว็บไซต์โรงเรียนวัดบางขุด(อุ่นพิทยาคาร)

เว็บไซต์ทางการของโรงเรียน — ออกแบบให้ดูหรู สมูท ลื่นไหล
สร้างด้วย **Next.js 14 + TypeScript + Tailwind + Framer Motion**
- ฐานข้อมูล: **Supabase** (Postgres + Storage)
- ไฟล์/รูปกิจกรรม: **Google Drive** ผ่าน **Google Apps Script**
- โลโก้โรงเรียน: เก็บใน **Supabase Storage** โดยตรง
- Deploy: **GitHub → Vercel**

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

## 5) โครงสร้างโปรเจกต์

```
app/
  page.tsx              หน้าแรก (Hero, สถิติ, จุดเด่น, ข่าว, CTA)
  about/page.tsx        เกี่ยวกับโรงเรียน + Timeline
  news/page.tsx         รายการข่าว
  news/[slug]/page.tsx  รายละเอียดข่าว
  gallery/page.tsx      ภาพกิจกรรม (ดึงจาก Supabase + Google Drive)
  teachers/page.tsx     บุคลากร แยกตามฝ่าย
  contact/page.tsx      ติดต่อ + Google Maps embed
components/             Navbar, Footer, Hero, NewsCard, GalleryGrid, ฯลฯ
lib/
  supabase.ts           สร้าง Supabase client + helper URL ของโลโก้
  gdrive.ts             helper สำหรับเรียก Apps Script
  data.ts               query ทั้งหมด + fallback content
supabase/schema.sql     สคริปต์สร้างตารางและ RLS
apps-script/Code.gs     Drive bridge (list/upload/thumb)
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

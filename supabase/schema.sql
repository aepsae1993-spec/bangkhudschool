-- ============================================================
-- โรงเรียนวัดบางขุด(อุ่นพิทยาคาร) — Supabase schema
-- รันสคริปต์นี้ใน Supabase SQL Editor (ทั้งไฟล์)
-- ============================================================

-- 1) Storage bucket สำหรับโลโก้โรงเรียน และรูปครู
--    (รูปข่าว/รูปกิจกรรม เก็บที่ Google Drive ผ่าน Apps Script)
--    โครงสร้างที่ใช้:
--      public-assets/logo/school-logo.png
--      public-assets/teachers/<timestamp>.<ext>
insert into storage.buckets (id, name, public)
values ('public-assets', 'public-assets', true)
on conflict (id) do nothing;

-- อนุญาตให้ทุกคน "อ่าน" ไฟล์ใน bucket นี้
drop policy if exists "public read on public-assets" on storage.objects;
create policy "public read on public-assets"
on storage.objects for select
to public
using (bucket_id = 'public-assets');

-- เฉพาะผู้ที่ login (admin) จึงอัปโหลดได้ (ใช้ Supabase Auth)
drop policy if exists "auth upload on public-assets" on storage.objects;
create policy "auth upload on public-assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'public-assets');

-- อนุญาตให้ admin อัปเดต / ลบไฟล์ใน bucket
drop policy if exists "auth update on public-assets" on storage.objects;
create policy "auth update on public-assets"
on storage.objects for update
to authenticated
using (bucket_id = 'public-assets');

drop policy if exists "auth delete on public-assets" on storage.objects;
create policy "auth delete on public-assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'public-assets');

-- ============================================================
-- 2) ตารางการตั้งค่าเว็บไซต์ (มีแถวเดียว)
-- ============================================================
create table if not exists public.site_settings (
  id            int primary key default 1,
  school_name   text not null default 'โรงเรียนวัดบางขุด(อุ่นพิทยาคาร)',
  motto         text,
  hero_subtitle text,
  address       text,
  phone         text,
  email         text,
  facebook      text,
  map_embed     text,
  updated_at    timestamptz not null default now()
);

insert into public.site_settings (id, motto, hero_subtitle, address, phone, email)
values (
  1,
  'ความรู้คู่คุณธรรม นำสู่ความเป็นเลิศ',
  'บ่มเพาะปัญญา สร้างคนดี ด้วยจิตวิญญาณแห่งการเรียนรู้ตลอดชีวิต',
  'ตำบลบางขุด อำเภอ.. จังหวัด..',
  '0-0000-0000',
  'contact@watbangkhud.ac.th'
)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;

drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings
for select to anon, authenticated using (true);

drop policy if exists "settings admin write" on public.site_settings;
create policy "settings admin write" on public.site_settings
for all to authenticated using (true) with check (true);

-- ============================================================
-- 3) ตารางข่าวสาร
-- ============================================================
create table if not exists public.news (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  excerpt       text,
  content       text,
  cover_url     text,           -- ใช้ Drive URL หรือ Supabase Storage
  category      text,
  published_at  date not null default current_date,
  created_at    timestamptz not null default now()
);
create index if not exists news_published_idx on public.news (published_at desc);

alter table public.news enable row level security;

drop policy if exists "news public read" on public.news;
create policy "news public read" on public.news
for select to anon, authenticated using (true);

drop policy if exists "news admin write" on public.news;
create policy "news admin write" on public.news
for all to authenticated using (true) with check (true);

-- ============================================================
-- 4) ตาราง gallery (อ้างอิง file ใน Google Drive ผ่าน Apps Script)
-- ============================================================
create table if not exists public.gallery (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  description     text,
  drive_file_id   text not null,
  thumb_url       text,
  album           text,
  taken_at        date,
  created_at      timestamptz not null default now()
);
create index if not exists gallery_album_idx on public.gallery (album);
create index if not exists gallery_created_idx on public.gallery (created_at desc);

alter table public.gallery enable row level security;

drop policy if exists "gallery public read" on public.gallery;
create policy "gallery public read" on public.gallery
for select to anon, authenticated using (true);

drop policy if exists "gallery admin write" on public.gallery;
create policy "gallery admin write" on public.gallery
for all to authenticated using (true) with check (true);

-- ============================================================
-- 5) ตารางบุคลากร
-- ============================================================
create table if not exists public.teachers (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  position      text,
  department    text,
  email         text,
  phone         text,
  photo_url     text,
  display_order int not null default 100,
  created_at    timestamptz not null default now()
);
create index if not exists teachers_dept_idx on public.teachers (department, display_order);

alter table public.teachers enable row level security;

drop policy if exists "teachers public read" on public.teachers;
create policy "teachers public read" on public.teachers
for select to anon, authenticated using (true);

drop policy if exists "teachers admin write" on public.teachers;
create policy "teachers admin write" on public.teachers
for all to authenticated using (true) with check (true);

-- ============================================================
-- 6) ตารางห้องเรียน / ข้อมูลนักเรียน (แต่ละห้อง)
-- ============================================================
create table if not exists public.classrooms (
  id            uuid primary key default gen_random_uuid(),
  grade         text not null,        -- 'อ.2','อ.3','ป.1','ป.2','ป.3','ป.4','ป.5','ป.6'
  room          text not null,        -- '1','2','3'...
  male_count    int  not null default 0,
  female_count  int  not null default 0,
  teacher_name  text,
  display_order int  not null default 100,
  created_at    timestamptz not null default now(),
  unique (grade, room)
);
create index if not exists classrooms_order_idx on public.classrooms (display_order);

alter table public.classrooms enable row level security;

drop policy if exists "classrooms public read" on public.classrooms;
create policy "classrooms public read" on public.classrooms
for select to anon, authenticated using (true);

drop policy if exists "classrooms admin write" on public.classrooms;
create policy "classrooms admin write" on public.classrooms
for all to authenticated using (true) with check (true);

-- ตัวอย่างข้อมูลห้องเรียน (ลบ/แก้ได้)
insert into public.classrooms (grade, room, male_count, female_count, teacher_name, display_order) values
  ('อ.2','1', 12, 13, 'นางสาว ก. ตัวอย่าง', 21),
  ('อ.2','2', 11, 14, 'นาง ข. ตัวอย่าง', 22),
  ('อ.3','1', 13, 12, 'นางสาว ค. ตัวอย่าง', 31),
  ('อ.3','2', 12, 13, 'นาง ง. ตัวอย่าง', 32),
  ('ป.1','1', 15, 14, 'นางสาว จ. ตัวอย่าง', 101),
  ('ป.1','2', 14, 15, 'นาง ฉ. ตัวอย่าง', 102),
  ('ป.2','1', 13, 14, 'นาง ช. ตัวอย่าง', 201),
  ('ป.2','2', 14, 13, 'นางสาว ซ. ตัวอย่าง', 202),
  ('ป.3','1', 14, 13, 'นาง ฌ. ตัวอย่าง', 301),
  ('ป.4','1', 15, 14, 'นาย ญ. ตัวอย่าง', 401),
  ('ป.5','1', 14, 14, 'นางสาว ฎ. ตัวอย่าง', 501),
  ('ป.6','1', 15, 15, 'นาง ฏ. ตัวอย่าง', 601)
on conflict (grade, room) do nothing;

-- ============================================================
-- 7) ตัวอย่างข้อมูล (ลบได้ภายหลัง)
-- ============================================================
insert into public.news (slug, title, excerpt, category, published_at) values
  ('welcome-2026', 'เปิดภาคเรียนปีการศึกษา 2569',
   'ยินดีต้อนรับนักเรียนทุกคนสู่ปีการศึกษาใหม่', 'ประกาศ', '2026-04-22'),
  ('sports-day', 'กีฬาสีภายในประจำปี',
   'ภาพบรรยากาศการแข่งขันกีฬาสี', 'กิจกรรม', '2026-04-10'),
  ('academic-award', 'นักเรียนคว้ารางวัลระดับเขต',
   'ขอแสดงความยินดีกับนักเรียนทุกคน', 'รางวัล', '2026-03-28')
on conflict (slug) do nothing;

insert into public.teachers (full_name, position, department, display_order) values
  ('นาย ก. ตัวอย่าง', 'ผู้อำนวยการโรงเรียน', 'ฝ่ายบริหาร', 1),
  ('นาง ข. ตัวอย่าง', 'รองผู้อำนวยการ', 'ฝ่ายวิชาการ', 2),
  ('นางสาว ค. ตัวอย่าง', 'ครูชำนาญการพิเศษ', 'กลุ่มสาระภาษาไทย', 10)
on conflict do nothing;

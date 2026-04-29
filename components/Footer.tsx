import Link from "next/link";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";
import SchoolLogo from "./SchoolLogo";
import type { SiteSettings } from "@/lib/types";

export default function Footer({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="relative mt-32 border-t border-white/10">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold-300/60 to-transparent" />
      <div className="container-x py-16 grid gap-12 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <SchoolLogo size={56} />
            <div>
              <div className="text-[11px] tracking-[0.3em] text-gold-300/80 uppercase">
                Wat Bang Khud School
              </div>
              <div className="font-display text-2xl font-semibold gold-text">
                {settings.school_name}
              </div>
            </div>
          </div>
          {settings.motto && (
            <p className="mt-5 max-w-md text-cream-100/70 leading-relaxed">
              ปรัชญา: {settings.motto}
            </p>
          )}
        </div>

        <div>
          <h4 className="text-sm tracking-[0.25em] uppercase text-gold-300/80 mb-4">
            ลิงก์
          </h4>
          <ul className="space-y-2 text-cream-100/80">
            <li><Link href="/about" className="hover:text-gold-200">เกี่ยวกับโรงเรียน</Link></li>
            <li><Link href="/news" className="hover:text-gold-200">ข่าวสาร</Link></li>
            <li><Link href="/gallery" className="hover:text-gold-200">ภาพกิจกรรม</Link></li>
            <li><Link href="/students" className="hover:text-gold-200">ข้อมูลนักเรียน</Link></li>
            <li><Link href="/teachers" className="hover:text-gold-200">บุคลากร</Link></li>
            <li><Link href="/contact" className="hover:text-gold-200">ติดต่อ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm tracking-[0.25em] uppercase text-gold-300/80 mb-4">
            ติดต่อ
          </h4>
          <ul className="space-y-3 text-cream-100/80 text-sm">
            {settings.address && (
              <li className="flex gap-3">
                <MapPin size={18} className="text-gold-300 mt-0.5 shrink-0" />
                <span>{settings.address}</span>
              </li>
            )}
            {settings.phone && (
              <li className="flex gap-3">
                <Phone size={18} className="text-gold-300 mt-0.5 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-gold-200">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex gap-3">
                <Mail size={18} className="text-gold-300 mt-0.5 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-gold-200">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.facebook && (
              <li className="flex gap-3">
                <Facebook size={18} className="text-gold-300 mt-0.5 shrink-0" />
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-gold-200"
                >
                  Facebook โรงเรียน
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x py-6 flex flex-col sm:flex-row gap-2 items-center justify-between text-xs text-cream-100/50">
          <div>
            © {new Date().getFullYear()} {settings.school_name}. สงวนลิขสิทธิ์.
          </div>
          <div>
            พัฒนาด้วย Next.js · Supabase · Google Drive
          </div>
        </div>
      </div>
    </footer>
  );
}

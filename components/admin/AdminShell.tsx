"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BookOpen,
  GalleryHorizontalEnd,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import SchoolLogo from "@/components/SchoolLogo";

const NAV = [
  { href: "/admin/dashboard", label: "ภาพรวม", icon: LayoutDashboard },
  { href: "/admin/news", label: "ข่าวสาร", icon: BookOpen },
  { href: "/admin/gallery", label: "ภาพกิจกรรม", icon: GalleryHorizontalEnd },
  { href: "/admin/students", label: "ข้อมูลนักเรียน", icon: GraduationCap },
  { href: "/admin/teachers", label: "บุคลากร", icon: Users },
  { href: "/admin/settings", label: "ตั้งค่าเว็บ", icon: Settings },
];

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950">
      <div className="h-10 w-10 rounded-full border-2 border-gold-400/30 border-t-gold-400 animate-spin" />
    </div>
  );
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAdminAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (loading) return <Spinner />;
  if (!user) return <Spinner />;

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-3 p-6 border-b border-white/10">
        <SchoolLogo size={40} glow={false} />
        <div>
          <div className="text-[10px] tracking-[0.3em] text-gold-300/70 uppercase">Admin Panel</div>
          <div className="text-sm font-semibold text-cream-100 leading-tight">
            จัดการเว็บไซต์
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all ${
                active
                  ? "bg-gold-400/10 text-gold-200 border border-gold-300/25"
                  : "text-cream-100/70 hover:bg-white/[0.04] hover:text-cream-100"
              }`}
            >
              <Icon size={18} className={active ? "text-gold-300" : ""} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="mb-3 px-4 text-[11px] text-cream-100/50 truncate">{user?.email}</div>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm text-cream-100/70 hover:bg-white/[0.04] hover:text-red-400 transition-all"
        >
          <LogOut size={18} /> ออกจากระบบ
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex bg-ink-950">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-ink-900/40 backdrop-blur-xl sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 border-r border-white/10 bg-ink-900 transform transition-transform duration-300 lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4 text-cream-100/60 hover:text-cream-100"
          onClick={() => setMobileOpen(false)}
        >
          <X size={20} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 bg-ink-900/70 backdrop-blur-xl border-b border-white/10">
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-xl glass"
            aria-label="เปิดเมนู"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold text-cream-100">Admin Panel</span>
        </div>

        <main className="flex-1 p-5 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

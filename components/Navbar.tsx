"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import SchoolLogo from "./SchoolLogo";

const NAV = [
  { href: "/", label: "หน้าแรก" },
  { href: "/about", label: "เกี่ยวกับโรงเรียน" },
  { href: "/news", label: "ข่าวสาร" },
  { href: "/gallery", label: "ภาพกิจกรรม" },
  { href: "/teachers", label: "บุคลากร" },
  { href: "/contact", label: "ติดต่อ" },
];

export default function Navbar({ schoolName }: { schoolName: string }) {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ink-950/70 backdrop-blur-2xl border-b border-white/10 shadow-soft"
          : "bg-transparent"
      }`}
    >
      <div className="container-x flex h-20 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3">
          <SchoolLogo size={48} />
          <div className="hidden sm:block leading-tight">
            <div className="text-[11px] tracking-[0.25em] text-gold-300/80 uppercase">
              School
            </div>
            <div className="font-display text-lg font-semibold gold-text">
              {schoolName}
            </div>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((n) => {
            const active =
              n.href === "/" ? path === "/" : path?.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`relative px-4 py-2 rounded-full text-sm transition-colors ${
                  active
                    ? "text-gold-200"
                    : "text-cream-100/80 hover:text-cream-50"
                }`}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-white/[0.06] border border-gold-300/30"
                  />
                )}
                <span className="relative">{n.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Link href="/contact" className="btn-primary text-sm">
            ติดต่อโรงเรียน
          </Link>
        </div>

        <button
          aria-label="เปิดเมนู"
          className="lg:hidden p-2 rounded-full glass"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height,opacity] duration-500 ${
          open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="container-x pb-6">
          <div className="glass rounded-3xl p-3 flex flex-col">
            {NAV.map((n) => {
              const active =
                n.href === "/" ? path === "/" : path?.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-4 py-3 rounded-2xl text-sm transition-colors ${
                    active
                      ? "bg-white/[0.06] text-gold-200 border border-gold-300/30"
                      : "text-cream-100/80 hover:bg-white/[0.04]"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

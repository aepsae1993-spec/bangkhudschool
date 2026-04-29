"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import SchoolLogo from "@/components/SchoolLogo";
import { Eye, EyeOff, LogIn } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const sb = getSupabase();
    if (!sb) {
      setError("ยังไม่ได้ตั้งค่า Supabase URL กรุณาตรวจสอบ .env.local");
      setLoading(false);
      return;
    }
    const { error: err } = await sb.auth.signInWithPassword({ email, password });
    if (err) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
    } else {
      router.replace("/admin/dashboard");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-950 relative overflow-hidden">
      <div className="aurora opacity-60" />
      <div className="relative z-10 w-full max-w-sm px-4">
        <div className="glass-strong rounded-3xl p-8">
          <div className="flex flex-col items-center mb-8">
            <SchoolLogo size={72} />
            <h1 className="mt-4 font-display text-2xl font-semibold gold-text">
              Admin Panel
            </h1>
            <p className="text-sm text-cream-100/60 mt-1">เข้าสู่ระบบจัดการเว็บไซต์</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <label className="block">
              <span className="text-sm text-cream-100/80 mb-1.5 block">อีเมล</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@school.ac.th"
                className="w-full rounded-xl bg-ink-800/60 border border-white/10 px-4 py-3 text-sm
                  text-cream-100 placeholder-cream-100/30 focus:outline-none focus:border-gold-300/60
                  focus:bg-ink-800 transition"
              />
            </label>

            <label className="block">
              <span className="text-sm text-cream-100/80 mb-1.5 block">รหัสผ่าน</span>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-ink-800/60 border border-white/10 px-4 py-3 pr-11 text-sm
                    text-cream-100 placeholder-cream-100/30 focus:outline-none focus:border-gold-300/60
                    focus:bg-ink-800 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-cream-100/50 hover:text-cream-100"
                  tabIndex={-1}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3 font-medium
                text-ink-950 bg-gradient-to-r from-gold-200 via-gold-400 to-gold-300
                hover:opacity-90 active:scale-[.98] transition-all disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="h-4 w-4 border-2 border-ink-950/30 border-t-ink-950 rounded-full animate-spin" />
              ) : (
                <LogIn size={18} />
              )}
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-cream-100/40">
            สร้างบัญชีผ่าน Supabase Authentication → Users
          </p>
        </div>
      </div>
    </div>
  );
}

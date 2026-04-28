"use client";

import { getLogoUrl } from "@/lib/supabase";
import { useState } from "react";

type Props = {
  size?: number;
  className?: string;
  glow?: boolean;
};

/**
 * โลโก้โรงเรียน — โหลดจาก Supabase Storage โดยตรง
 * Fallback เป็นตราตกแต่ง SVG ถ้ายังไม่มีไฟล์โลโก้
 */
export default function SchoolLogo({
  size = 56,
  className = "",
  glow = true,
}: Props) {
  const url = getLogoUrl();
  const [errored, setErrored] = useState(false);

  if (!url || errored) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-gold-300 via-gold-500 to-gold-700 ${
          glow ? "shadow-glow" : ""
        } ${className}`}
        style={{ width: size, height: size }}
        aria-label="ตราโรงเรียน"
      >
        <svg
          viewBox="0 0 64 64"
          className="h-[70%] w-[70%] text-ink-950"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M32 8 L54 20 V40 C54 50 44 56 32 58 C20 56 10 50 10 40 V20 Z" />
          <path d="M22 30 L32 24 L42 30 V42 H22 Z" />
          <path d="M32 24 V42" />
          <path d="M16 44 H48" />
        </svg>
      </div>
    );
  }

  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gold-400/30 blur-xl"
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt="ตราโรงเรียนวัดบางขุด(อุ่นพิทยาคาร)"
        width={size}
        height={size}
        className="relative z-10 h-full w-full object-contain drop-shadow-[0_8px_24px_rgba(239,188,44,0.35)]"
        onError={() => setErrored(true)}
      />
    </span>
  );
}

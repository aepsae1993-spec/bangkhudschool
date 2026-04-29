"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import SchoolLogo from "./SchoolLogo";

export default function Hero({
  schoolName,
  motto,
  subtitle,
}: {
  schoolName: string;
  motto?: string | null;
  subtitle?: string | null;
}) {
  const reduce = useReducedMotion();
  return (
    <section className="relative overflow-hidden">
      <div className="aurora" />
      {/* Decorative grid */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      <div className="container-x relative z-10 pt-16 pb-24 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        <motion.div
          initial={reduce ? {} : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 blur-3xl opacity-70 bg-gold-400/30 rounded-full animate-spin-slow" />
          <SchoolLogo size={140} />
        </motion.div>

        <motion.span
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="chip mt-8"
        >
          <Sparkles size={14} /> ยินดีต้อนรับสู่บ้านแห่งการเรียนรู้
        </motion.span>

        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 font-sans text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.5] max-w-4xl py-2"
        >
          {(() => {
            const idx = schoolName.indexOf("(");
            if (idx === -1) return <span className="gold-text">{schoolName}</span>;
            return (
              <>
                <span className="gold-text block">{schoolName.slice(0, idx).trim()}</span>
                <span className="gold-text block">{schoolName.slice(idx)}</span>
              </>
            );
          })()}
        </motion.h1>

        {motto && (
          <motion.p
            initial={reduce ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5 }}
            className="mt-5 text-lg md:text-xl text-cream-100/85 italic"
          >
            “{motto}”
          </motion.p>
        )}

        {subtitle && (
          <motion.p
            initial={reduce ? {} : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.65 }}
            className="mt-6 max-w-2xl text-cream-100/70 leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.8 }}
          className="mt-10 flex flex-col sm:flex-row gap-3"
        >
          <Link href="/about" className="btn-primary">
            รู้จักโรงเรียน
            <ArrowRight size={18} />
          </Link>
          <Link href="/news" className="btn-ghost">
            ดูข่าวสารล่าสุด
          </Link>
        </motion.div>

        {/* Floating accent */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 left-1/2 h-40 w-[80%] -translate-x-1/2 rounded-full bg-gold-400/20 blur-3xl"
          animate={reduce ? {} : { opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import type { NewsItem } from "@/lib/types";

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default function NewsCard({
  item,
  index = 0,
}: {
  item: NewsItem;
  index?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative card overflow-hidden flex flex-col"
    >
      <div className="relative h-44 -mx-6 -mt-6 mb-5 overflow-hidden rounded-t-3xl">
        {item.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover_url}
            alt={item.title}
            style={{ objectPosition: item.cover_position || "top" }}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-ink-700 via-ink-800 to-ink-900 relative overflow-hidden">
            <div className="absolute inset-0 bg-gold-400/10" />
            <div className="absolute -inset-1 bg-shimmer animate-shimmer opacity-30 [background-size:200%_100%]" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/20 to-transparent" />
        {item.category && (
          <span className="absolute top-3 left-3 chip">{item.category}</span>
        )}
      </div>

      <div className="flex items-center gap-2 text-xs text-cream-100/60">
        <CalendarDays size={14} />
        <time>{fmt(item.published_at)}</time>
      </div>

      <h3 className="mt-3 text-lg font-semibold leading-snug group-hover:text-gold-200 transition-colors">
        {item.title}
      </h3>
      {item.excerpt && (
        <p className="mt-2 text-sm text-cream-100/70 line-clamp-3">
          {item.excerpt}
        </p>
      )}

      <Link
        href={`/news/${item.slug}`}
        className="mt-5 inline-flex items-center gap-1.5 text-gold-300 text-sm hover:gap-3 transition-all"
        aria-label={`อ่านต่อ: ${item.title}`}
      >
        อ่านต่อ <ArrowUpRight size={16} />
      </Link>
    </motion.article>
  );
}

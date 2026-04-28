"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { driveImageUrl, driveThumbUrl } from "@/lib/gdrive";
import type { GalleryItem } from "@/lib/types";
import { X } from "lucide-react";

export default function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [active, setActive] = useState<GalleryItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="card text-center py-20 text-cream-100/70">
        ยังไม่มีรูปกิจกรรมในอัลบั้มนี้
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((g, i) => {
          const thumb = g.thumb_url || driveThumbUrl(g.drive_file_id, 800);
          return (
            <motion.button
              key={g.id}
              onClick={() => setActive(g)}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.6,
                delay: (i % 8) * 0.04,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -4 }}
              className="group relative aspect-square overflow-hidden rounded-2xl glass focus:outline-none focus:ring-2 focus:ring-gold-300/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumb}
                alt={g.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-transparent to-transparent opacity-90" />
              <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                <div className="text-sm text-cream-50 line-clamp-2 font-medium">
                  {g.title}
                </div>
                {g.album && (
                  <div className="text-[11px] text-gold-200/80 mt-0.5">
                    {g.album}
                  </div>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-ink-950/85 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActive(null)}
                className="absolute -top-4 -right-4 z-10 h-10 w-10 rounded-full glass-strong flex items-center justify-center hover:bg-white/20"
                aria-label="ปิด"
              >
                <X size={18} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={driveImageUrl(active.drive_file_id, 1800)}
                alt={active.title}
                className="w-full max-h-[85vh] object-contain rounded-2xl ring-gold"
              />
              <div className="mt-3 text-center text-cream-100/85">
                <div className="font-medium">{active.title}</div>
                {active.description && (
                  <div className="text-sm text-cream-100/60 mt-1">
                    {active.description}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

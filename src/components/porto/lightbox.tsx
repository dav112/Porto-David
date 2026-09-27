"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export type PortoItem = { src: string; thumb?: string; alt: string; type: "image" | "video" };
export type PortoGroup = { title: string; slug: string; count: number; items: PortoItem[] };

/* Fullscreen viewer — keyboard: Esc tutup, ← → pindah karya */
export default function Lightbox({
  group,
  index,
  onClose,
  onStep,
}: {
  group: PortoGroup;
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const item = group.items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onStep]);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-[var(--gutter)] py-4">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-pearl/60">
          {group.title} — {index + 1} / {group.items.length}
        </p>
        <button
          onClick={onClose}
          className="rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-pearl/80 transition hover:border-cool-blue/60 hover:text-white"
        >
          Tutup ✕
        </button>
      </div>

      <div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "video" ? (
          <video
            key={item.src}
            src={item.src}
            controls
            autoPlay
            playsInline
            preload="metadata"
            className="max-h-full max-w-full rounded-xl"
          />
        ) : (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            className="max-h-full max-w-full rounded-xl object-contain"
          />
        )}

        {group.items.length > 1 && (
          <>
            <button
              aria-label="Sebelumnya"
              onClick={() => onStep(-1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/60 px-4 py-3 text-xl text-pearl transition hover:border-cool-blue/60 hover:text-white"
            >
              ‹
            </button>
            <button
              aria-label="Berikutnya"
              onClick={() => onStep(1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/15 bg-black/60 px-4 py-3 text-xl text-pearl transition hover:border-cool-blue/60 hover:text-white"
            >
              ›
            </button>
          </>
        )}
      </div>

      <p className="px-[var(--gutter)] pb-5 text-center text-sm text-pearl/70">
        {item.alt}
      </p>
    </motion.div>
  );
}

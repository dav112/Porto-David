"use client";

import { useCallback, useMemo, useState } from "react";
import Button from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import Lightbox, { type PortoGroup } from "@/components/porto/lightbox";
import rawItems from "@/data/porto-video.json";

type VideoItem = { src: string; poster: string; alt: string; duration: string };
const items = rawItems as VideoItem[];

export default function PortoVideoPage() {
  const [index, setIndex] = useState<number | null>(null);

  const group = useMemo<PortoGroup>(
    () => ({
      title: "Porto Video",
      slug: "video",
      count: items.length,
      items: items.map((v) => ({ src: v.src, thumb: v.poster, alt: v.alt, type: "video" as const })),
    }),
    []
  );

  const totalSec = useMemo(
    () =>
      items.reduce((n, v) => {
        const [m, s] = v.duration.split(":").map(Number);
        return n + (m || 0) * 60 + (s || 0);
      }, 0),
    []
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      setIndex((cur) => (cur === null ? cur : (cur + dir + items.length) % items.length));
    },
    []
  );

  return (
    <main className="relative min-h-svh overflow-hidden bg-background pb-24">
      <style>{`@keyframes porto-video-float { 0%,100% { transform: translate3d(0,-18px,0); } 50% { transform: translate3d(0,18px,0); } }`}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(216,235,243,0.07),transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-64 h-96 w-96 rounded-full opacity-15 blur-[100px]"
        style={{ background: "#3D6B8C", animation: "porto-video-float 12s ease-in-out infinite" }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-[var(--gutter)] pt-28">
        <Reveal>
          <p className="overline">PORTOFOLIO — VIDEO</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="chrome-text mt-4 max-w-3xl text-[clamp(2.4rem,8vw,5rem)] font-bold uppercase leading-[0.95]">
            Porto Video
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mt-5 max-w-xl leading-relaxed text-pearl/70">
            Konten reels & video promosi — Diva Linen, Kopitiam Serasa dan
            lainnya. Klik untuk putar.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 flex max-w-md items-stretch gap-3">
            <div className="glass-panel flex-1 px-4 py-4 text-center">
              <p className="text-h3 font-medium text-pearl">{items.length}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cool-blue">
                Video
              </p>
            </div>
            <div className="glass-panel flex-1 px-4 py-4 text-center">
              <p className="text-h3 font-medium text-pearl">{Math.round(totalSec / 60)} mnt</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cool-blue">
                Durasi
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((v, i) => (
            <Reveal key={v.src} delay={(i % 4) * 0.06}>
              <button
                onClick={() => setIndex(i)}
                className="glass-panel group relative aspect-[9/13] overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1"
              >
                <img
                  src={v.poster}
                  alt={v.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/55 text-lg text-white backdrop-blur-sm transition group-hover:scale-110">
                  ▶
                </span>
                {v.duration && (
                  <span className="absolute right-2 top-2 rounded bg-black/70 px-2 py-0.5 font-mono text-[11px] text-white">
                    {v.duration}
                  </span>
                )}
                <span className="absolute inset-x-0 bottom-0 p-3">
                  <span className="line-clamp-2 text-xs leading-snug text-pearl">{v.alt}</span>
                </span>
              </button>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-12 text-center">
            <Button variant="ghost" onClick={() => (window.location.href = "/projects")}>
              ← Pilih Portfolio
            </Button>
          </div>
        </Reveal>
      </div>

      {index !== null && (
        <Lightbox group={group} index={index} onClose={() => setIndex(null)} onStep={step} />
      )}
    </main>
  );
}

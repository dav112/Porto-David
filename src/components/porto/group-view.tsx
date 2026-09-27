"use client";

import { useCallback, useState } from "react";
import Button from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import Lightbox, { type PortoGroup } from "@/components/porto/lightbox";

/* Isi halaman tiap kelompok — dark glass selaras tema utama */
export default function GroupView({
  group,
  allGroups,
}: {
  group: PortoGroup;
  allGroups: { title: string; slug: string; count: number }[];
}) {
  const [index, setIndex] = useState<number | null>(null);

  const step = useCallback(
    (dir: 1 | -1) => {
      setIndex((cur) => {
        if (cur === null) return cur;
        const n = group.items.length;
        return (cur + dir + n) % n;
      });
    },
    [group.items.length]
  );

  return (
    <main className="relative min-h-svh bg-background pb-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(216,235,243,0.06),transparent_70%)]"
      />

      {/* top bar: pindah-pindah kelompok */}
      <div className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center gap-2 overflow-x-auto px-[var(--gutter)] py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <a
            href="/projects"
            className="shrink-0 rounded-full border border-white/15 px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-pearl/80 transition hover:border-cool-blue/60 hover:text-white"
          >
            ← Desain / Video
          </a>
          <span className="h-5 w-px shrink-0 bg-white/10" />
          {allGroups.map((g) => (
            <a
              key={g.slug}
              href={`/projects/desain/${g.slug}`}
              className={`shrink-0 rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] transition ${
                g.slug === group.slug
                  ? "border-cool-blue/70 bg-cool-blue/10 text-white"
                  : "border-white/12 text-pearl/70 hover:border-cool-blue/60 hover:text-white"
              }`}
            >
              {g.title} · {g.count}
            </a>
          ))}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-[var(--gutter)] pt-12">
        <Reveal>
          <p className="overline">PORTOFOLIO — DESAIN / {group.title.toUpperCase()}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-h1 font-medium uppercase text-pearl">{group.title}</h1>
            <p className="font-mono text-xs tracking-[0.2em] text-pearl/40">
              {group.count} KARYA
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-6">
            <Button variant="ghost" onClick={() => (window.location.href = "/projects/desain")}>
              ← Semua Kelompok
            </Button>
          </div>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {group.items.map((item, i) => (
            <button
              key={item.src}
              onClick={() => setIndex(i)}
              className="glass-panel group relative aspect-[3/4] overflow-hidden text-left transition-transform duration-300 hover:-translate-y-1"
            >
              <img
                src={item.thumb ?? item.src}
                alt={item.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />
              {item.type === "video" && (
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/70 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-white">
                  ▶ Video
                </span>
              )}
              <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="line-clamp-1 text-xs text-pearl">{item.alt}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {index !== null && (
        <Lightbox group={group} index={index} onClose={() => setIndex(null)} onStep={step} />
      )}
    </main>
  );
}

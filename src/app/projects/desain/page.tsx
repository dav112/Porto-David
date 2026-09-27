"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import Button from "@/components/ui/button";
import Reveal from "@/components/ui/reveal";
import rawGroups from "@/data/porto-desain.json";
import type { PortoGroup } from "@/components/porto/lightbox";

const groups = rawGroups as PortoGroup[];

function coverOf(g: PortoGroup): string {
  const img = g.items.find((i) => i.type === "image");
  const pick = img ?? g.items[0];
  return pick.thumb ?? pick.src;
}

/* Pita foto berjalan — dua baris berlawanan arah */
function Marquee({ images, reverse }: { images: string[]; reverse?: boolean }) {
  const row = [...images, ...images];
  return (
    <div className="porto-marquee relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      <div
        className="flex w-max gap-3"
        style={{ animation: `porto-marquee 45s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {row.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-36 w-28 shrink-0 rounded-xl object-cover ring-1 ring-white/10 sm:h-44 sm:w-36"
          />
        ))}
      </div>
    </div>
  );
}

/* Angka statistik count-up pas masuk layar */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1300;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);

  return <span ref={ref}>{val}</span>;
}

/* Kartu miring 3D ngikutin mouse */
function TiltLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 8);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const reset = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <motion.a
      href={href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function PortoDesainIndexPage() {
  const total = useMemo(() => groups.reduce((n, g) => n + g.items.length, 0), []);
  const videos = useMemo(
    () => groups.reduce((n, g) => n + g.items.filter((i) => i.type === "video").length, 0),
    []
  );
  const covers = useMemo(() => groups.map(coverOf), []);
  const mid = Math.ceil(covers.length / 2);
  const featured = useMemo(() => [...groups].sort((a, b) => b.count - a.count).slice(0, 2), []);

  return (
    <main className="relative min-h-svh overflow-hidden bg-background pb-24">
      <style>{`
        @keyframes porto-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .porto-marquee:hover > div { animation-play-state: paused; }
        @keyframes porto-float { 0%,100% { transform: translate3d(0,-18px,0); } 50% { transform: translate3d(0,18px,0); } }
      `}</style>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_40%_at_50%_0%,rgba(216,235,243,0.07),transparent_70%)]"
      />
      {/* orb cahaya melayang */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full opacity-20 blur-[100px]"
        style={{ background: "#3D6B8C", animation: "porto-float 11s ease-in-out infinite" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-[42rem] h-[28rem] w-[28rem] rounded-full opacity-15 blur-[110px]"
        style={{ background: "#5A7FA6", animation: "porto-float 14s ease-in-out infinite reverse" }}
      />

      {/* HERO */}
      <div className="relative mx-auto w-full max-w-6xl px-[var(--gutter)] pt-28 text-center">
        <Reveal>
          <p className="overline">PORTOFOLIO — DESAIN</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="chrome-text mx-auto mt-4 max-w-4xl text-[clamp(2.4rem,8vw,5.5rem)] font-bold uppercase leading-[0.95]">
            Porto Desain
          </h1>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-pearl/70">
            Arsip karya visual — flyer, social media, kaos, motif & dokumentasi
            brand. Dikumpulkan dari berbagai brand dengan cerita berbeda.
          </p>
        </Reveal>

        {/* statistik */}
        <Reveal delay={0.2}>
          <div className="mx-auto mt-8 flex max-w-lg items-stretch justify-center gap-3">
            {[
              { n: total, l: "Karya" },
              { n: groups.length, l: "Kelompok" },
              { n: videos, l: "Video" },
            ].map((s) => (
              <div key={s.l} className="glass-panel flex-1 px-4 py-4">
                <p className="text-h3 font-medium text-pearl">
                  <CountUp to={s.n} />
                </p>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-cool-blue">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="primary" onClick={() => (window.location.href = "#semua")}>
              Jelajahi Karya
            </Button>
          </div>
        </Reveal>
      </div>

      {/* MARQUEE */}
      <div className="relative mt-14 space-y-3">
        <Marquee images={covers.slice(0, mid)} />
        <Marquee images={covers.slice(mid)} reverse />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-[var(--gutter)]">
        {/* UNGGULAN */}
        <Reveal>
          <div className="mb-8 mt-20 flex items-end justify-between">
            <div>
              <p className="overline mb-2">SOROTAN</p>
              <h2 className="text-h2 font-medium uppercase text-pearl">
                Kelompok Terbesar
              </h2>
            </div>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {featured.map((g, i) => (
            <Reveal key={g.slug} delay={i * 0.1}>
              <TiltLink
                href={`/projects/desain/${g.slug}`}
                className="glass-panel group relative block overflow-hidden"
              >
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={coverOf(g)}
                    alt={g.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <p className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1 font-mono text-xs text-pearl backdrop-blur-sm">
                    {g.count} karya
                  </p>
                  <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
                    <div>
                      <p className="overline mb-1">Kelompok {String(i + 1).padStart(2, "0")}</p>
                      <h3 className="text-h3 font-medium uppercase text-white transition-colors duration-500 group-hover:text-cool-blue">
                        {g.title}
                      </h3>
                    </div>
                    <span className="shrink-0 font-mono text-xl text-cool-blue transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </TiltLink>
            </Reveal>
          ))}
        </div>

        {/* SEMUA */}
        <Reveal>
          <div className="mb-8 mt-20 flex items-end justify-between">
            <div>
              <p className="overline mb-2">ARSIP</p>
              <h2 id="semua" className="scroll-mt-24 text-h2 font-medium uppercase text-pearl">
                Semua Kelompok
              </h2>
            </div>
            <p className="hidden font-mono text-xs tracking-[0.2em] text-pearl/40 sm:block">
              {groups.length} KELOMPOK
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((g, gi) => (
            <Reveal key={g.slug} delay={(gi % 3) * 0.08}>
              <TiltLink
                href={`/projects/desain/${g.slug}`}
                className="glass-panel group block overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={coverOf(g)}
                    alt={g.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="overline mb-1">
                      Kelompok {String(gi + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-h4 font-medium uppercase text-pearl transition-colors duration-500 group-hover:text-cool-blue">
                      {g.title}
                    </h3>
                  </div>
                  <p className="shrink-0 rounded-full border border-white/12 px-3 py-1 font-mono text-xs text-pearl/70">
                    {g.count}
                  </p>
                </div>
              </TiltLink>
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}

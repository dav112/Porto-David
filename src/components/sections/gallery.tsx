"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { artworks } from "@/data/gallery";
import AutoplayVideo from "@/components/ui/autoplay-video";

const IMG_W = "clamp(80px, 11vw, 150px)";
const IMG_H = "clamp(120px, 15vw, 210px)";
const OVERLAP = "clamp(-34px, -4vw, -48px)";

const PARAGRAPHS = [
  "Gambar-gambar ini adalah sebagian kecil dari karya yang pernah saya ciptakan, lahir dari berbagai brand dengan karakter dan cerita yang berbeda.",
  "Setiap brand membawa identitas dan vibes-nya sendiri. Di sanalah saya belajar beradaptasi—menerjemahkan karakter, cerita, dan harapan setiap brand ke dalam sebuah visual yang terasa tepat.",
  "Bagi saya, desain bukan tentang satu gaya, tetapi tentang bagaimana menemukan bahasa visual untuk setiap cerita.",
];

export default function Gallery() {
  const visible = artworks;
  const mid = (visible.length - 1) / 2;
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typed, setTyped] = useState<string[]>(Array(PARAGRAPHS.length).fill(""));
  const [typingDone, setTypingDone] = useState(false);
  const startedRef = useRef(false);

  function totalStart(i: number) {
    let s = 0;
    for (let k = 0; k < i; k++) s += PARAGRAPHS[k].length;
    return s;
  }

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibleCount(entry.isIntersecting ? visible.length : 0);
      },
      { threshold: 0.25 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [visible.length]);

  useEffect(() => {
    if (typingDone) return;
    const text = textRef.current;
    if (!text || startedRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const perChar = 28;
          PARAGRAPHS.forEach((p, i) => {
            for (let c = 0; c <= p.length; c++) {
              setTimeout(() => {
                setTyped((prev) => {
                  const next = [...prev];
                  next[i] = p.slice(0, c);
                  return next;
                });
                if (i === PARAGRAPHS.length - 1 && c === p.length) {
                  setTimeout(() => setTypingDone(true), 600);
                }
              }, totalStart(i) * perChar + c * perChar);
            }
          });
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(text);
    return () => observer.disconnect();
  }, [typingDone]);

  return (
    <section
      ref={sectionRef}
      id="gallery"
      className="relative flex min-h-[85vh] flex-col items-center justify-center bg-background px-[var(--gutter)] py-40 md:py-56"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_40%_at_80%_10%,rgba(216,235,243,0.03),transparent_70%)]"
      />

      <div
        className="relative mt-[-10rem] mb-6 w-full max-w-2xl md:mt-[-16rem] [mask-image:radial-gradient(ellipse_60%_60%_at_center,black_55%,transparent_100%)]"
      >
        <AutoplayVideo src="/videos/page2.mp4" />
      </div>

      <div className="mt-[-3rem] flex items-end justify-center md:mt-[-5rem]">
        {visible.map((art, i) => {
          const tilt = (i - mid) * 6;
          const isVisible = visibleCount > i;
          return (
            <div
              key={art.src}
              className={`gallery-card group relative overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)] hover:z-20 hover:scale-[1.06] ${
                isVisible ? "is-visible" : ""
              }`}
              style={
                {
                  width: IMG_W,
                  height: IMG_H,
                  marginLeft: i === 0 ? 0 : OVERLAP,
                  "--tilt": `${tilt}deg`,
                  "--delay": `${i * 0.1}s`,
                  zIndex: i,
                } as React.CSSProperties
              }
            >
              <Image
                src={art.thumb}
                alt={art.alt}
                fill
                loading="lazy"
                sizes="150px"
                className="object-cover object-top transition-transform duration-700 group-hover:scale-[1.08]"
              />
            </div>
          );
        })}
      </div>

      <div
        ref={textRef}
        className="mt-16 flex w-[clamp(360px,92%,960px)] flex-col items-center text-center md:mt-20"
      >
        {PARAGRAPHS.map((_, i) => (
          <p
            key={i}
            className="font-[SaboneText] text-[clamp(0.65rem,0.9vw,0.8rem)] leading-[1.9] tracking-wide text-white first:mt-0 [&:not(:first-child)]:mt-5"
          >
            {typed[i]}
          </p>
        ))}
      </div>
    </section>
  );
}

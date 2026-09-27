"use client";

import { useEffect, useRef, useState } from "react";

const V = (n: number) => `/videos/page3/${String(n).padStart(2, "0")}.mp4`;
const VIDEOS = Array.from({ length: 26 }, (_, i) => V(i + 1));

/** Video only downloads & plays while visible on screen. Off-screen = no download, no CPU. */
function LazyVideo({ src, label }: { src: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setActive(entry.isIntersecting);
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { rootMargin: "200px", threshold: 0.1 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-[38vh] max-h-[320px] min-h-[220px] w-[56vh] max-w-[420px] min-w-[300px] shrink-0 overflow-hidden rounded-xl bg-black">
      <video
        ref={ref}
        muted
        loop
        playsInline
        preload="none"
        draggable={false}
        className="pointer-events-none h-full w-full object-cover"
      >
        {active ? <source src={src} type="video/mp4" /> : null}
      </video>
      <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white/80">
        {label}
      </span>
    </div>
  );
}

export default function Page3Collage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);

  const onDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    isDown.current = true;
    el.style.cursor = "grabbing";
    startX.current = e.pageX - el.offsetLeft;
    startScroll.current = el.scrollLeft;
  };
  const onLeave = () => {
    isDown.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };
  const onUp = () => {
    isDown.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };
  const onMove = (e: React.MouseEvent) => {
    if (!isDown.current) return;
    e.preventDefault();
    const el = trackRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    el.scrollLeft = startScroll.current - walk;
  };

  return (
    <section
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#050507]"
      style={{ contentVisibility: "auto" }}
    >
      {/* belakang: track video bisa di-drag horizontal, lebih besar */}
      <div
        ref={trackRef}
        onMouseDown={onDown}
        onMouseLeave={onLeave}
        onMouseUp={onUp}
        onMouseMove={onMove}
        className="flex w-full gap-4 overflow-x-auto overflow-y-hidden px-8 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ cursor: "grab", userSelect: "none" as const }}
      >
        {VIDEOS.map((src, idx) => (
          <LazyVideo key={src} src={src} label={String(idx + 1).padStart(2, "0")} />
        ))}
      </div>

      {/* depan: gift tetap tidak bergeser */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <img
          src="/images/0921-transparent.gif"
          alt="gift character"
          draggable={false}
          className="h-[62vh] max-h-[560px] w-auto object-contain drop-shadow-[0_24px_60px_rgba(0,0,0,0.7)]"
        />
      </div>
    </section>
  );
}

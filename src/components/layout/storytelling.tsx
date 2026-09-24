"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STORY: { trigger: string; text: string }[] = [
  { trigger: "#about", text: "Learning Code" },
  { trigger: "#projects", text: "Building Products" },
];

export default function Storytelling() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current!;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let current = -1;

    const swapIn = (index: number) => {
      if (index === current) return;
      current = index;

      gsap.to(el, {
        opacity: 0,
        y: 28,
        duration: 0.28,
        ease: "power2.in",
        onComplete: () => {
          el.textContent = STORY[index].text;
          gsap.fromTo(
            el,
            { opacity: 0, y: -28 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }
          );
        },
      });
    };

    const triggers = STORY.map((story, i) =>
      ScrollTrigger.create({
        trigger: story.trigger,
        start: "top center",
        end: "bottom center",
        onEnter: () => swapIn(i),
        onEnterBack: () => swapIn(i),
      })
    );

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-6 right-6 z-30 text-right"
    >
      <span ref={ref} className="chrome-text text-sm font-medium uppercase opacity-0">
        Designer
      </span>
    </div>
  );
}
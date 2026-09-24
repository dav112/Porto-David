"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const MAGNET_RADIUS = 140;
const MAGNET_STRENGTH = 0.45;

type QuickTo = ReturnType<typeof gsap.quickTo>;

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reducedMotion) return;

    const dot = dotRef.current!;
    const ring = ringRef.current!;

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    let hasMoved = false;

    const onMove = (e: MouseEvent) => {
      if (!hasMoved) {
        hasMoved = true;
        dot.classList.add("is-visible");
        ring.classList.add("is-visible");
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    /* hover expansion over interactive elements */
    const onOver = (e: MouseEvent) => {
      const target = (e.target as Element).closest(
        "a, button, [data-cursor='hover'], input, textarea, select"
      );
      ring.classList.toggle("is-active", !!target);
    };

    /* magnetic pull on [data-magnetic] elements */
    const magnets = new WeakMap<Element, { x: QuickTo; y: QuickTo }>();
    const magnetMove = (e: MouseEvent) => {
      const target = (e.target as Element).closest("[data-magnetic]");
      if (!target) return;

      let quick = magnets.get(target);
      if (!quick) {
        quick = {
          x: gsap.quickTo(target, "x", { duration: 0.4, ease: "power3.out" }),
          y: gsap.quickTo(target, "y", { duration: 0.4, ease: "power3.out" }),
        };
        magnets.set(target, quick);
      }

      const rect = target.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      if (Math.hypot(relX, relY) < MAGNET_RADIUS) {
        quick.x(relX * MAGNET_STRENGTH);
        quick.y(relY * MAGNET_STRENGTH);
      } else {
        quick.x(0);
        quick.y(0);
      }
    };

    const magnetReset = (e: MouseEvent) => {
      const target = (e.target as Element).closest("[data-magnetic]");
      if (!target) return;
      const quick = magnets.get(target);
      if (quick) {
        quick.x(0);
        quick.y(0);
      }
    };

    const onDown = () => ring.classList.add("is-down");
    const onUp = () => ring.classList.remove("is-down");

    document.documentElement.classList.add("has-cursor");

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousemove", magnetMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", magnetReset);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", magnetMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", magnetReset);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-wrap">
        <span className="cursor-dot" />
      </div>
      <div ref={ringRef} className="cursor-wrap">
        <span className="cursor-ring" />
      </div>
    </>
  );
}
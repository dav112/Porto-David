"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function useLenis() {
  useEffect(() => {
    // Skip smooth-scroll on mobile / low-end / reduced-motion: native scroll is faster & lighter.
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (window.matchMedia("(max-width: 768px)").matches) return;
      // @ts-expect-error non-standard
      if (navigator.connection?.saveData) return;
    } catch {
      /* fall through */
    }
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    let frameId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      frameId = requestAnimationFrame(raf);
    };

    frameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);
}

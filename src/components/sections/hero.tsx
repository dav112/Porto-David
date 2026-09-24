"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import gsap from "gsap";
import Button from "@/components/ui/button";
import GlassPanel from "@/components/ui/glass-panel";

const Hero3DScene = dynamic(() => import("@/components/3d/hero/hero-3d-scene"), {
  ssr: false,
  loading: () => null,
});

const AnimatedAtelierTitle = dynamic(
  () => import("@/components/3d/hero/AnimatedAtelierTitle"),
  {
    ssr: false,
    loading: () => null,
  }
);

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.14, delayChildren: 0.3 },
  },
};

const fade: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE },
  },
};

export default function Hero() {
  const reduceMotion = useReducedMotion();
  const entrance = reduceMotion ? {} : { variants: container, initial: "hidden", animate: "visible" };
  const noMotion = reduceMotion ? { animate: { opacity: 1, y: 0 } } : {};

  /* cinematic intro → header handoff */
  const [introComplete, setIntroComplete] = useState(false);
  const titleWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = window.setTimeout(() => setIntroComplete(true), 8000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!introComplete) return;
    const el = titleWrapRef.current;
    if (!el) return;
    const vh = window.innerHeight;
    const mobile = window.innerWidth < 768;
    const targetTop = mobile ? 40 : 56;
    const scale = mobile ? 0.38 : 0.42;

    if (reduceMotion) return () => {};

    const tl = gsap.timeline();
    tl.to(el, {
      y: -(vh / 2 - targetTop),
      scale,
      opacity: 0.95,
      duration: 1.8,
      ease: "power3.inOut",
    });
    return () => {
      tl.kill();
    };
  }, [introComplete, reduceMotion]);

  return (
    <section className="relative h-svh w-full overflow-hidden bg-background">
      <Hero3DScene />

      {/* centered evolving typography — visual overlay only, never blocks interaction */}
      <div className="pointer-events-none absolute inset-0 z-[15] flex items-center justify-center">
<div ref={titleWrapRef} className="h-[46vh] w-[92vw] max-w-5xl">
              <AnimatedAtelierTitle text="The Slice Atelier" active={!introComplete} />
            </div>
      </div>

      {/* architectural HUD overlay */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        <motion.div
          className="absolute left-[var(--gutter)] top-8"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.6 }}
        >
          <p className="overline">FROM PIXELS TO CODE</p>
          <p className="mt-2 font-mono text-xs text-charcoal">PORTFOLIO / 2026</p>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-[var(--gutter)] h-16 w-px bg-gradient-to-t from-transparent to-cool-blue/50"
        />
        <div className="absolute right-[var(--gutter)] top-8 h-px w-16 bg-gradient-to-r from-cool-blue/50 to-transparent" />
      </div>

      {/* center glass panel + actions */}
      <motion.div
        className="absolute inset-x-0 bottom-[13vh] z-20 flex flex-col items-center gap-6 px-[var(--gutter)] text-center"
        {...entrance}
        {...noMotion}
      >
        <motion.div variants={fade}>
          <GlassPanel className="pointer-events-auto px-8 py-5">
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-pearl/80">
                Creative Designer
              </p>
              <span className="hidden h-px w-8 bg-pearl/30 sm:block" />
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-pearl/80">
                Full Stack Developer
              </p>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div
          className="pointer-events-auto flex flex-col gap-4 sm:flex-row"
          variants={fade}
        >
          <Button
            variant="primary"
            onClick={() => window.location.href = "/projects"}
          >
            View Projects
          </Button>
          <Button
            variant="primary"
            onClick={() => window.open("https://www.instagram.com/vdnwrd/", "_blank")}
          >
            My Instagram
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

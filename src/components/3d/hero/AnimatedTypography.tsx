"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import gsap from "gsap";
import {
  Audiowide,
  Bai_Jamjuree,
  Exo_2,
  Michroma,
  Orbitron,
  Oxanium,
  Rajdhani,
  Sora,
  Space_Grotesk,
  Syncopate,
} from "next/font/google";

/* ============================================================
   AnimatedTypography — "The Slice Atelier"
   A single logo continuously evolving through 10 futuristic
   font identities. Every 2s the machine fades/blurs/scale-morphs
   to the next typeface with a subtle material tint change from a
   fixed metallic palette. Parallax tilt follows the cursor,
   GSAP drives a slow float. Pure overlay: pointer-events none,
   never blocks the 3D scene behind it.
   ============================================================ */

const orbitron = Orbitron({ subsets: ["latin"], weight: ["600"], variable: "--font-orbitron", display: "swap" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], weight: ["500"], variable: "--font-space-grotesk", display: "swap" });
const michroma = Michroma({ subsets: ["latin"], weight: ["400"], variable: "--font-michroma", display: "swap" });
const audiowide = Audiowide({ subsets: ["latin"], weight: ["400"], variable: "--font-audiowide", display: "swap" });
const rajdhani = Rajdhani({ subsets: ["latin"], weight: ["600"], variable: "--font-rajdhani", display: "swap" });
const exo2 = Exo_2({ subsets: ["latin"], weight: ["600"], variable: "--font-exo-2", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["600"], variable: "--font-sora", display: "swap" });
const oxanium = Oxanium({ subsets: ["latin"], weight: ["600"], variable: "--font-oxanium", display: "swap" });
const syncopate = Syncopate({ subsets: ["latin"], weight: ["700"], variable: "--font-syncopate", display: "swap" });
const baiJamjuree = Bai_Jamjuree({ subsets: ["latin"], weight: ["600"], variable: "--font-bai-jamjuree", display: "swap" });

const PALETTE = ["#C0C0C0", "#FFFFFF", "#A3B1C2", "#D8EBF3", "#3A3A3A"];

const HOLD_MS = 2000;
const TRANSITION_S = 0.6;

interface FontSpec {
  id: string;
  className: string;
  tracking: string;
  fontSize: string;
}

const FONTS: FontSpec[] = [
  { id: "orbitron", className: orbitron.variable, tracking: "0.16em", fontSize: "clamp(2rem, 7vw, 4.6rem)" },
  { id: "space-grotesk", className: spaceGrotesk.variable, tracking: "0.12em", fontSize: "clamp(2.1rem, 7vw, 4.8rem)" },
  { id: "michroma", className: michroma.variable, tracking: "0.2em", fontSize: "clamp(1.7rem, 6vw, 4rem)" },
  { id: "audiowide", className: audiowide.variable, tracking: "0.1em", fontSize: "clamp(1.9rem, 6.5vw, 4.4rem)" },
  { id: "rajdhani", className: rajdhani.variable, tracking: "0.14em", fontSize: "clamp(2.3rem, 7.5vw, 5.2rem)" },
  { id: "exo-2", className: exo2.variable, tracking: "0.1em", fontSize: "clamp(2.1rem, 7vw, 4.8rem)" },
  { id: "sora", className: sora.variable, tracking: "0.08em", fontSize: "clamp(2.1rem, 7vw, 4.8rem)" },
  { id: "oxanium", className: oxanium.variable, tracking: "0.12em", fontSize: "clamp(2rem, 7vw, 4.6rem)" },
  { id: "syncopate", className: syncopate.variable, tracking: "0.08em", fontSize: "clamp(1.6rem, 5.5vw, 3.7rem)" },
  { id: "bai-jamjuree", className: baiJamjuree.variable, tracking: "0.1em", fontSize: "clamp(2rem, 7vw, 4.6rem)" },
];

interface AnimatedTypographyProps {
  text?: string;
}

export default function AnimatedTypography({ text = "The Slice Atelier" }: AnimatedTypographyProps) {
  const reducedMotion = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const floatRef = useRef<HTMLDivElement | null>(null);
  const fontClasses = useMemo(() => FONTS.map((f) => f.className).join(" "), []);

  /* parallax tilt following the cursor (springs = smooth inertia) */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useSpring(my, { stiffness: 60, damping: 16 });
  const rY = useSpring(mx, { stiffness: 60, damping: 16 });
  const rotateX = useTransform(rX, (v) => -v * 7);
  const rotateY = useTransform(rY, (v) => v * 9);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, mx, my]);

  /* machine timing: advance the font identity every 2.6s */
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % FONTS.length), HOLD_MS + TRANSITION_S * 1000);
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  /* GSAP slow float */
  useEffect(() => {
    if (reducedMotion || !floatRef.current) return;
    const tween = gsap.to(floatRef.current, {
      y: -10,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  const font = FONTS[idx];
  const color = PALETTE[idx % PALETTE.length];
  const glow = `${color}55`;

  const glyph = (f: FontSpec, key: string) => (
    <motion.span
      key={key}
      className="absolute inset-0 flex items-center justify-center whitespace-nowrap"
      initial={{ opacity: 0, y: 10, scale: 1.05, filter: `blur(10px) drop-shadow(0 8px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 22px ${glow})` }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: `blur(0px) drop-shadow(0 8px 18px rgba(0,0,0,0.5)) drop-shadow(0 0 26px ${glow})` }}
      exit={{ opacity: 0, y: -10, scale: 1.04, filter: `blur(10px) drop-shadow(0 8px 18px rgba(0,0,0,0.55)) drop-shadow(0 0 22px ${glow})` }}
      transition={{ duration: TRANSITION_S, ease: [0.22, 1, 0.36, 1] }}
      style={{ fontFamily: `var(--font-${f.id})` }}
    >
      <span
        style={{
          fontSize: f.fontSize,
          letterSpacing: f.tracking,
          backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, ${color} 50%, #3A3A3A 100%)`,
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          textShadow: "0 1px 0 rgba(255,255,255,0.18)",
        }}
      >
        {text}
      </span>
    </motion.span>
  );

  return (
    <div className={`${fontClasses} pointer-events-none relative flex h-full w-full select-none items-center justify-center`}>
      <motion.div
        style={{ transformPerspective: 900, rotateX, rotateY }}
        className="relative flex h-full w-full items-center justify-center"
      >
        <div ref={floatRef} className="relative flex h-full w-full items-center justify-center">
          {reducedMotion ? (
            <span
              style={{
                fontFamily: `var(--font-${FONTS[0].id})`,
                fontSize: FONTS[0].fontSize,
                letterSpacing: FONTS[0].tracking,
                backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, ${PALETTE[0]} 50%, #3A3A3A 100%)`,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 1px 0 rgba(255,255,255,0.18)",
              }}
            >
              {text}
            </span>
          ) : (
            <AnimatePresence mode="sync">
              {glyph(font, String(idx))}
            </AnimatePresence>
          )}
        </div>
      </motion.div>
    </div>
  );
}
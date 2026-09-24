"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from "react";
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
   AnimatedAtelierTitle — "The Slice Atelier"
   A futuristic studio logo manufactured by a digital machine.
   Ten font identities, each with its own premium entrance
   effect (holographic scan, liquid stretch, chrome assembly,
   mechanical shift, blueprint, calibration, glass, energy,
   editorial reveal, soft material). CSS transforms/filters only
   — no heavy shaders. Overlay only: never blocks the 3D scene.
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
const TRANS_S = 0.7;

interface FontSpec {
  id: string;
  className: string;
  tracking: string;
  fontSize: string;
}

const FONTS: FontSpec[] = [
  { id: "orbitron", className: orbitron.variable, tracking: "0.18em", fontSize: "clamp(2rem, 7.5vw, 5rem)" },
  { id: "space-grotesk", className: spaceGrotesk.variable, tracking: "0.14em", fontSize: "clamp(2.1rem, 7.5vw, 5.2rem)" },
  { id: "michroma", className: michroma.variable, tracking: "0.22em", fontSize: "clamp(1.75rem, 6.5vw, 4.3rem)" },
  { id: "audiowide", className: audiowide.variable, tracking: "0.12em", fontSize: "clamp(1.95rem, 7vw, 4.8rem)" },
  { id: "rajdhani", className: rajdhani.variable, tracking: "0.16em", fontSize: "clamp(2.35rem, 8vw, 5.6rem)" },
  { id: "exo-2", className: exo2.variable, tracking: "0.12em", fontSize: "clamp(2.1rem, 7.5vw, 5.2rem)" },
  { id: "sora", className: sora.variable, tracking: "0.1em", fontSize: "clamp(2.1rem, 7.5vw, 5.2rem)" },
  { id: "oxanium", className: oxanium.variable, tracking: "0.14em", fontSize: "clamp(2rem, 7.5vw, 5rem)" },
  { id: "syncopate", className: syncopate.variable, tracking: "0.1em", fontSize: "clamp(1.65rem, 6vw, 4rem)" },
  { id: "bai-jamjuree", className: baiJamjuree.variable, tracking: "0.12em", fontSize: "clamp(2rem, 7.5vw, 5rem)" },
];

interface EffectProps {
  text: string;
  spec: FontSpec;
  color: string;
}

const EASE_CINEMA: [number, number, number, number] = [0.16, 1, 0.3, 1];

function fontStyle(spec: FontSpec, color: string, extra: CSSProperties = {}): CSSProperties {
  return {
    fontFamily: `var(--font-${spec.id})`,
    fontSize: spec.fontSize,
    letterSpacing: spec.tracking,
    backgroundImage: `linear-gradient(180deg, #FFFFFF 0%, ${color} 50%, #3A3A3A 100%)`,
    backgroundSize: "220% 220%",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
    ...extra,
  };
}

function Center({ children, gap = "0.5em" }: { children: ReactNode; gap?: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center" style={{ gap }}>
      {children}
    </div>
  );
}

/* 1 — Orbitron: holographic scan (outline flashes, scan bar sweeps, metal pours in) */
function HolographicScan({ text, spec, color }: EffectProps) {
  return (
    <motion.div
      className="relative h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <Center>
        <span className="absolute" style={{ ...fontStyle(spec, color), color: "transparent", WebkitTextStroke: `1px ${color}`, backgroundImage: "none" }}>
          {text}
        </span>
      </Center>
      <Center>
        <motion.span
          style={fontStyle(spec, color)}
          initial={{ backgroundPosition: "200% 50%", opacity: 0 }}
          animate={{ backgroundPosition: "0% 50%", opacity: 1 }}
          transition={{ duration: 0.7, ease: EASE_CINEMA }}
        >
          {text}
        </motion.span>
      </Center>
      <motion.div
        className="absolute inset-y-0"
        style={{ width: "42%", background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)" }}
        initial={{ x: "-70%" }}
        animate={{ x: "230%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* 2 — Space Grotesk: liquid metal stretch (elastic horizontal expansion) */
function LiquidStretch({ text, spec, color }: EffectProps) {
  return (
    <Center>
      <motion.span
        style={fontStyle(spec, color)}
        initial={{ scaleX: 0.35, opacity: 0 }}
        animate={{ scaleX: [0.35, 1.08, 1], opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.68, -0.15, 0.27, 1.15] }}
      >
        {text}
      </motion.span>
    </Center>
  );
}

/* 3 — Michroma: chrome assembly (letters bolt in piece by piece) */
function ChromeAssembly({ text, spec, color }: EffectProps) {
  return (
    <Center>
      {text.split(" ").map((word, wi) => (
        <span key={wi} style={{ display: "inline-flex" }}>
          {word.split("").map((ch, ci) => (
            <motion.span
              key={ci}
              style={fontStyle(spec, color)}
              initial={{ opacity: 0, scale: 0.4, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.35, delay: wi * 0.06 + ci * 0.035, type: "spring", stiffness: 260, damping: 16 }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      ))}
    </Center>
  );
}

/* 4 — Audiowide: mechanical shift (rotates in, locks with overshoot) */
function MechanicalShift({ text, spec, color }: EffectProps) {
  return (
    <Center>
      <motion.span
        style={{ ...fontStyle(spec, color), transformPerspective: 700 }}
        initial={{ rotateY: 65, x: -14, opacity: 0 }}
        animate={{ rotateY: 0, x: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.34, 1.45, 0.64, 1] }}
      >
        {text}
      </motion.span>
    </Center>
  );
}

/* 5 — Rajdhani: architectural blueprint (outline, construction lines, solid rises) */
function Blueprint({ text, spec, color }: EffectProps) {
  return (
    <motion.div className="relative h-full w-full">
      <Center>
        <motion.span
          className="absolute"
          style={{ ...fontStyle(spec, color), color: "transparent", WebkitTextStroke: `1px ${color}88`, backgroundImage: "none" }}
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          {text}
        </motion.span>
      </Center>
      <Center>
        <motion.span
          style={fontStyle(spec, color)}
          initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0.6 }}
          animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {text}
        </motion.span>
      </Center>
      <motion.div
        className="absolute inset-y-0"
        style={{ width: 3, background: `linear-gradient(transparent, ${color}66, transparent)` }}
        initial={{ x: "-30%" }}
        animate={{ x: "310%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* 6 — Exo 2: digital calibration (precise scale, settle jitter, tracking adjusts) */
function Calibration({ text, spec, color }: EffectProps) {
  return (
    <Center>
      <motion.span
        style={{ ...fontStyle(spec, color), letterSpacing: "0.4em" }}
        initial={{ scale: 0.985, opacity: 0.4, x: 0 }}
        animate={{ scale: [0.985, 1.01, 0.998, 1], x: [0, -1.5, 1.5, 0], opacity: 1, letterSpacing: spec.tracking }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      >
        {text}
      </motion.span>
    </Center>
  );
}

/* 7 — Sora: glass refraction (blur + light bending reveal) */
function GlassRefraction({ text, spec, color }: EffectProps) {
  return (
    <Center>
      <motion.span
        style={{
          ...fontStyle(spec, color),
          backgroundImage: `linear-gradient(180deg, rgba(255,255,255,0.98) 0%, ${color} 55%, #3A3A3A 100%)`,
        }}
        initial={{ opacity: 0, filter: "blur(14px)", scale: 1.03 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.75, ease: EASE_CINEMA }}
      >
        {text}
      </motion.span>
    </Center>
  );
}

/* 8 — Oxanium: energy flow (glowing line pulses through the letters) */
function EnergyFlow({ text, spec, color }: EffectProps) {
  return (
    <motion.div
      className="relative h-full w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Center>
        <span style={fontStyle(spec, color)}>{text}</span>
      </Center>
      <motion.div
        className="absolute inset-y-0"
        style={{ width: 4, background: `linear-gradient(transparent, #FFFFFF, transparent)`, filter: `drop-shadow(0 0 8px ${color})` }}
        initial={{ x: "-35%", opacity: 0 }}
        animate={{ x: ["-35%", "300%"], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

/* 9 — Syncopate: editorial cinematic reveal (wide tracking collapses elegantly) */
function EditorialReveal({ text, spec, color }: EffectProps) {
  return (
    <Center>
      <motion.span
        style={{ ...fontStyle(spec, color), letterSpacing: "0.7em", opacity: 0 }}
        animate={{ letterSpacing: spec.tracking, opacity: 1, filter: ["blur(12px)", "blur(0px)"] }}
        transition={{ duration: 0.8, ease: EASE_CINEMA }}
      >
        {text}
      </motion.span>
    </Center>
  );
}

/* 10 — Bai Jamjuree: soft material transition (calm minimal finish) */
function SoftMaterial({ text, spec, color }: EffectProps) {
  return (
    <Center>
      <motion.span
        style={fontStyle(spec, color)}
        initial={{ opacity: 0.3, filter: "blur(8px)", scale: 1.02 }}
        animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      >
        {text}
      </motion.span>
    </Center>
  );
}

const EFFECTS: Record<string, (p: EffectProps) => ReactElement> = {
  orbitron: HolographicScan,
  "space-grotesk": LiquidStretch,
  michroma: ChromeAssembly,
  audiowide: MechanicalShift,
  rajdhani: Blueprint,
  "exo-2": Calibration,
  sora: GlassRefraction,
  oxanium: EnergyFlow,
  syncopate: EditorialReveal,
  "bai-jamjuree": SoftMaterial,
};

interface AnimatedAtelierTitleProps {
  text?: string;
  active?: boolean;
}

export default function AnimatedAtelierTitle({ text = "The Slice Atelier", active = true }: AnimatedAtelierTitleProps) {
  const reducedMotion = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const floatRef = useRef<HTMLDivElement | null>(null);
  const fontClasses = useMemo(() => FONTS.map((f) => f.className).join(" "), []);

  /* cursor parallax + light reflection */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rX = useSpring(my, { stiffness: 55, damping: 16 });
  const rY = useSpring(mx, { stiffness: 55, damping: 16 });
  const rotateX = useTransform(rX, (v) => -v * 6);
  const rotateY = useTransform(rY, (v) => v * 8);
  const lightX = useSpring(mx, { stiffness: 40, damping: 18 });
  const lightY = useSpring(my, { stiffness: 40, damping: 18 });
  const lightTx = useTransform(lightX, (v) => v * 90);
  const lightTy = useTransform(lightY, (v) => v * 55);

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      mx.set((e.clientX / window.innerWidth) * 2 - 1);
      my.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion, mx, my]);

  /* machine timing: 2s hold + transition (paused once the logo lands in the header) */
  useEffect(() => {
    if (reducedMotion || !active) return;
    const id = window.setInterval(() => setIdx((i) => (i + 1) % FONTS.length), HOLD_MS + TRANS_S * 1000);
    return () => window.clearInterval(id);
  }, [reducedMotion, active]);

  /* GSAP slow float */
  useEffect(() => {
    if (reducedMotion || !floatRef.current) return;
    const tween = gsap.to(floatRef.current, {
      y: -8,
      duration: 2.8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion]);

  const spec = FONTS[idx];
  const color = PALETTE[idx % PALETTE.length];
  const Effect = EFFECTS[spec.id];

  return (
    <div className={`${fontClasses} pointer-events-none relative flex h-full w-full select-none items-center justify-center`}>
      <motion.div
        style={{ transformPerspective: 1100, rotateX, rotateY }}
        className="relative flex h-full w-full items-center justify-center"
      >
        <div ref={floatRef} className="relative flex h-full w-full items-center justify-center">
          {reducedMotion ? (
            <span
              style={{
                ...fontStyle(FONTS[0], PALETTE[0]),
                opacity: 1,
              }}
            >
              {text}
            </span>
          ) : (
            <AnimatePresence mode="sync">
              <motion.div
                key={spec.id}
                className="absolute inset-0"
                style={{
                  filter: `drop-shadow(0 10px 20px rgba(0,0,0,0.5)) drop-shadow(0 0 26px ${color}66)`,
                }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeOut" } }}
              >
                <Effect text={text} spec={spec} color={color} />
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </motion.div>

      {/* cursor-following reflection light */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ x: lightTx, y: lightTy }}
      >
        <motion.div
          className="absolute"
          style={{
            width: "40%",
            height: "160%",
            left: "30%",
            top: "-30%",
            background: "radial-gradient(closest-side, rgba(255,255,255,0.14), transparent 70%)",
            mixBlendMode: "screen",
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
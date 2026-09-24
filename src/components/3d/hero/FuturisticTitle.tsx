"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type RefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import gsap from "gsap";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/use-media-query";

/* ============================================================
   FuturisticTitle — "The Slice Atelier"
   Premium studio logo. Letterforms slowly evolve (vertex morph
   between 5 treatments) while typographic parameters interpolate
   live (spacing / width / weight / italic), wrapped in cinematic
   float + rotation + breathing motion. Visual overlay only:
   never blocks clicks, hover, drag, or the raycaster.
   // ponytail: one font ships in the repo; "font styles" are
   geometric treatments of the same glyphs, interpolated in
   geometry space — no font files to swap.
   ============================================================ */

const DEFAULT_FONT = "/fonts/helvetiker_bold.typeface.json";
const FONT_SIZE = 1;
const CAMERA_Z = 10;
const BASE_GAP = FONT_SIZE * 0.2;
const WORD_GAP = FONT_SIZE * 0.72;
const HOLD_MS = 2000;
const MORPH_S = 0.65;
const STATE_COUNT = 5;

interface FuturisticTitleProps {
  text?: string;
  font?: string;
  size?: number;
  depth?: number;
}

interface LetterMorph {
  mesh: THREE.Mesh;
  base: Float32Array;
  count: number;
  targets: Float32Array[];
}

interface LayoutItem {
  baseX: number;
  line: number;
  idxInLine: number;
}

function StudioEnvironment() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {
    sceneRef.current = scene;
    const target = sceneRef.current;
    if (!target) return;
    const pmrem = new THREE.PMREMGenerator(gl);
    const envScene = new RoomEnvironment();
    const rt = pmrem.fromScene(envScene, 0.04);
    target.environment = rt.texture;
    return () => {
      target.environment = null;
      rt.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

/* cinematic chrome lighting + drifting reflections */
function Lights() {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const floatRef = useRef<THREE.PointLight>(null);

  useFrame((st) => {
    const t = st.clock.elapsedTime;
    const key = keyRef.current;
    if (key)
      key.position.set(5 + Math.sin(t * 0.4) * 2, 4 + Math.sin(t * 0.3) * 1.2, 6);
    const float = floatRef.current;
    if (float)
      float.position.set(
        st.pointer.x * 3 + Math.sin(t * 0.5) * 1.5,
        st.pointer.y * 2 + Math.cos(t * 0.5) * 1.5,
        4
      );
  });

  return (
    <>
      <ambientLight intensity={0.25} />
      <directionalLight ref={keyRef} position={[5, 4, 6]} intensity={2.6} color="#eef6ff" />
      <directionalLight position={[-6, -2, -4]} intensity={1.6} color="#4a7dff" />
      <pointLight position={[0, 3, 5]} intensity={16} color="#d8ebf3" />
      <pointLight ref={floatRef} position={[0, 0, 4]} intensity={12} distance={9} decay={1.4} color="#a3b1c2" />
      <hemisphereLight args={["#3a4a66", "#0b0b12", 0.45]} />
    </>
  );
}

/* soft dark + cool glow planes for gentle depth separation */
function makeTexture(inner: string, outer: string) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(128, 128, 8, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function buildAdjacency(geometry: THREE.BufferGeometry): number[][] {
  const pos = geometry.attributes.position;
  const idx = geometry.index;
  const count = pos.count;
  const adj: number[][] = Array.from({ length: count }, () => []);
  if (!idx) return adj;
  const index = idx.array;
  for (let i = 0; i < index.length; i += 3) {
    const a = index[i], b = index[i + 1], c = index[i + 2];
    adj[a].push(b, c);
    adj[b].push(a, c);
    adj[c].push(a, b);
  }
  return adj;
}

function smoothPass(base: Float32Array, adj: number[][], out: Float32Array) {
  for (let v = 0; v < base.length / 3; v++) {
    const nb = adj[v];
    if (nb.length === 0) {
      out[v * 3] = base[v * 3];
      out[v * 3 + 1] = base[v * 3 + 1];
      out[v * 3 + 2] = base[v * 3 + 2];
      continue;
    }
    let x = 0, y = 0, z = 0;
    for (let k = 0; k < nb.length; k++) {
      const i = nb[k] * 3;
      x += base[i];
      y += base[i + 1];
      z += base[i + 2];
    }
    out[v * 3] = x / nb.length;
    out[v * 3 + 1] = y / nb.length;
    out[v * 3 + 2] = z / nb.length;
  }
}

/* five letterform targets, all index-aligned with the base glyph */
function computeTargets(base: Float32Array, adj: number[][], size: number): Float32Array[] {
  const n = base.length;
  const targets: Float32Array[] = [];

  // 0 editorial — luxury sense letterform (original)
  targets.push(new Float32Array(base));

  // 1 architectural — faceted, geometric blueprint glyphs
  const geo = new Float32Array(base);
  const lat = size * 0.15;
  for (let i = 0; i < n; i += 3) {
    geo[i] = Math.round(geo[i] / lat) * lat;
    geo[i + 1] = Math.round(geo[i + 1] / lat) * lat;
  }
  targets.push(geo);

  // 2 mechanical — stepped, ribbed industrial extrusion
  const mec = new Float32Array(base);
  const step = size * 0.045;
  for (let i = 2; i < n; i += 3) mec[i] = Math.round(mec[i] / step) * step;
  targets.push(mec);

  // 3 liquid — laplacian-smoothed, flowing chrome
  let liq = new Float32Array(base);
  let tmp = new Float32Array(base);
  for (let p = 0; p < 3; p++) {
    smoothPass(liq, adj, tmp);
    const swap = liq;
    liq = tmp;
    tmp = swap;
  }
  targets.push(liq);

  // 4 minimal — thin, flat premium studio
  const min = new Float32Array(base);
  for (let i = 2; i < n; i += 3) min[i] *= 0.38;
  targets.push(min);

  return targets;
}

interface Title3DProps {
  lines: string[];
  font: string;
  size: number;
  depth: number;
  reducedMotion: boolean;
  titleBoxRef: RefObject<HTMLDivElement | null>;
}

function Title3D({ lines, font, size, depth, reducedMotion, titleBoxRef }: Title3DProps) {
  const groupFit = useRef<THREE.Group>(null);
  const groupMotion = useRef<THREE.Group>(null);
  const letterGroups = useRef<(THREE.Group | null)[]>([]);
  const letterMeshes = useRef<(THREE.Mesh | null)[]>([]);
  const layoutRef = useRef<LayoutItem[]>([]);
  const lineWidths = useRef<number[]>([]);
  const lineCounts = useRef<number[]>([]);
  const morphs = useRef<LetterMorph[]>([]);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const shadowRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const weights = useRef<{ v0: number; v1: number; v2: number; v3: number; v4: number }>({
    v0: 1,
    v1: 0,
    v2: 0,
    v3: 0,
    v4: 0,
  });
  const entrance = useRef({ y: 0, opacity: 0 });
  /* live typographic parameters — interpolated continuously by GSAP */
  const style = useRef({ spacing: 0, scaleX: 1, scaleY: 1, skew: 0, extrude: 1 });
  /* click-to-grow: held while the title area is pressed, damped back on release */
  const growHeld = useRef(false);
  const grow = useRef(1);
  const blackTex = useMemo(() => makeTexture("rgba(0,0,0,0.6)", "rgba(0,0,0,0)"), []);
  const glowTex = useMemo(() => makeTexture("rgba(180,215,255,0.32)", "rgba(180,215,255,0)"), []);
  useEffect(() => () => {
    blackTex.dispose();
    glowTex.dispose();
  }, [blackTex, glowTex]);

  const characters = useMemo(() => lines.map((l) => l.split("")), [lines]);
  const lineOffset: number[] = [];
  {
    let acc = 0;
    characters.forEach((c) => {
      lineOffset.push(acc);
      acc += c.length;
    });
  }
  const viewport = useThree((s) => s.viewport);

  /* detect press over the title area from the window — the canvas itself
     stays pointer-events:none so it never blocks the scene behind */
  useEffect(() => {
    const box = titleBoxRef.current;
    if (!box) return;
    const onDown = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      growHeld.current =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom;
    };
    const onUp = () => {
      growHeld.current = false;
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [titleBoxRef]);

  /* blend current weights into every letter's vertex positions */
  const applyMorph = () => {
    const ws = [weights.current.v0, weights.current.v1, weights.current.v2, weights.current.v3, weights.current.v4];
    for (const m of morphs.current) {
      const geo = m.mesh.geometry as THREE.BufferGeometry;
      const arr = (geo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      for (let i = 0; i < m.count; i++) {
        let x = 0, y = 0, z = 0;
        for (let s = 0; s < STATE_COUNT; s++) {
          const wgt = ws[s];
          if (wgt === 0) continue;
          const t = m.targets[s];
          x += t[i * 3] * wgt;
          y += t[i * 3 + 1] * wgt;
          z += t[i * 3 + 2] * wgt;
        }
        arr[i * 3] = x;
        arr[i * 3 + 1] = y;
        arr[i * 3 + 2] = z;
      }
      geo.attributes.position.needsUpdate = true;
      geo.computeVertexNormals();
    }
  };

  /* shared liquid-chrome material */
  useLayoutEffect(() => {
    if (materialRef.current) return;
    const mat = new THREE.MeshPhysicalMaterial({
      color: "#c0c0c0",
      metalness: 1,
      roughness: 0.28,
      envMapIntensity: 1.4,
      clearcoat: 0.6,
      clearcoatRoughness: 0.25,
      transparent: true,
    });
    letterMeshes.current.forEach((m) => {
      if (m) m.material = mat;
    });
    materialRef.current = mat;
    return () => {
      mat.dispose();
      materialRef.current = null;
    };
  }, []);

  /* layout: wide non-overlapping spacing, centered, auto-fit (+25% size), morphs */
  useLayoutEffect(() => {
    const fit = groupFit.current;
    const chars = lines.map((l) => l.split(""));
    const off: number[] = [];
    let acc = 0;
    chars.forEach((c) => {
      off.push(acc);
      acc += c.length;
    });
    const flat = chars.flat();
    if (!fit || letterMeshes.current.length !== flat.length) return;

    let line = 0;
    let cursor = 0;
    let idxInLine = 0;
    const lineW: number[] = [];
    const lineC: number[] = [];
    const info: LayoutItem[] = [];

    flat.forEach((ch, i) => {
      const mesh = letterMeshes.current[i];
      let w = size * 0.5;
      if (mesh) {
        mesh.geometry.computeBoundingBox();
        const bb = mesh.geometry.boundingBox;
        const span = bb ? bb.max.x - bb.min.x : 0;
        if (bb && isFinite(span) && span > 0) {
          w = span;
          mesh.position.set(-(bb.min.x + bb.max.x) / 2, -(bb.min.y + bb.max.y) / 2, 0);
        }
      }
      const advance = ch === " " ? WORD_GAP : w + BASE_GAP;
      info.push({ baseX: cursor + (ch === " " ? 0 : BASE_GAP / 2), line, idxInLine });
      cursor += advance;
      idxInLine++;
      const end = off[line] + chars[line].length;
      if (i === end - 1) {
        lineW.push(cursor);
        lineC.push(idxInLine);
        line++;
        cursor = 0;
        idxInLine = 0;
      }
    });

    layoutRef.current = info;
    lineWidths.current = lineW;
    lineCounts.current = lineC;

    // fixed vertical placement per line
    const isMulti = chars.length > 1;
    flat.forEach((_, i) => {
      const group = letterGroups.current[i];
      if (!group) return;
      const lineIdx = info[i].line;
      group.position.y = isMulti ? (lineIdx === 0 ? size * 0.55 : -size * 0.55) : 0;
    });

    const totalH = isMulti ? chars.length * size * 1.15 : size * 1.25;
    const maxW = Math.max(...lineW, 1);
    const scale = THREE.MathUtils.clamp(
      Math.min((viewport.width * 0.5) / maxW, (viewport.height * 0.29) / totalH),
      0.18,
      1.0
    );
    fit.scale.setScalar(scale);

    // depth planes follow the word
    const shadow = shadowRef.current;
    if (shadow) {
      shadow.position.set(0, -size * 0.28, -size * 0.35);
      shadow.scale.set(maxW * 1.1, size * 1.6, 1);
    }
    const glow = glowRef.current;
    if (glow) {
      glow.position.set(0, 0, -size * 1.0);
      glow.scale.set(maxW * 1.5, size * 2.6, 1);
    }

    // build morph targets once per set of glyphs
    if (morphs.current.length === 0) {
      const built: LetterMorph[] = [];
      flat.forEach((_, i) => {
        const mesh = letterMeshes.current[i];
        if (!mesh) return;
        const geo = mesh.geometry as THREE.BufferGeometry;
        const pos = geo.attributes.position as THREE.BufferAttribute;
        const base = new Float32Array(pos.array as Float32Array);
        built.push({
          mesh,
          base,
          count: pos.count,
          targets: computeTargets(base, buildAdjacency(geo), size),
        });
      });
      morphs.current = built;
      applyMorph();
    }
  }, [lines, size, viewport.width, viewport.height]);

  /* cinematic idle: float, breathing scale, pointer sway + depth inertia */
  useFrame((st, delta) => {
    const motion = groupMotion.current;
    const mat = materialRef.current;
    if (!motion) return;
    const t = st.clock.elapsedTime;
    if (mat) mat.opacity = entrance.current.opacity;

    if (reducedMotion) {
      grow.current = THREE.MathUtils.damp(grow.current, growHeld.current ? 1.45 : 1, 6, delta);
      motion.position.set(0, 0, 0);
      motion.rotation.set(0, 0, 0);
      motion.scale.setScalar(grow.current);
      return;
    }

    // slow float + breathing scale (1.00 → 1.03 → 1.00)
    motion.position.y = entrance.current.y + Math.sin(t * 0.4) * 0.08;

    // click-to-grow: press grows to 1.14, release eases back to normal
    grow.current = THREE.MathUtils.damp(grow.current, growHeld.current ? 1.45 : 1, 6, delta);
    motion.scale.setScalar((1.015 + Math.sin(t * 0.55) * 0.015) * grow.current);

    // subtle depth movement following the cursor (damped inertia)
    const depthTarget = Math.sin(t * 0.25) * 0.12 + st.pointer.x * 0.22;
    motion.position.z = THREE.MathUtils.damp(motion.position.z, depthTarget, 2.5, delta);

    // gentle X/Y rotation from pointer + idle sway
    motion.rotation.y = THREE.MathUtils.damp(
      motion.rotation.y,
      st.pointer.x * 0.14 + Math.sin(t * 0.15) * 0.03,
      3,
      delta
    );
    motion.rotation.x = THREE.MathUtils.damp(
      motion.rotation.x,
      -st.pointer.y * 0.08 + Math.sin(t * 0.2) * 0.02,
      3,
      delta
    );

    // live typographic interpolation: spacing / width / weight / italic
    const s = style.current;
    const info = layoutRef.current;
    const lineW = lineWidths.current;
    const lineC = lineCounts.current;
    if (info.length === 0) return;
    info.forEach((lt, i) => {
      const g = letterGroups.current[i];
      if (!g) return;
      const count = lineC[lt.line] ?? 1;
      const center = ((lineW[lt.line] ?? 0) + s.spacing * size * (count - 1)) / 2;
      g.position.x = lt.baseX + s.spacing * size * lt.idxInLine - center;
      const alt = i % 2 === 0 ? 1 : -1;
      g.rotation.z = s.skew * alt;
      g.scale.set(s.scaleX, s.scaleY, s.extrude);
    });
  });

  /* GSAP: entrance + letterform identity machine + continuous typography */
  useEffect(() => {
    gsap.fromTo(
      entrance.current,
      { y: -1.4, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.6, ease: "power3.out", delay: 0.25 }
    );

    if (reducedMotion) {
      gsap.set(entrance.current, { y: 0, opacity: 1 });
      return;
    }

    const w = weights.current;
    const mat = materialRef.current;
    const s = style.current;

    const setIdentity = () => applyMorph();
    const setMaterial = () => {
      if (!mat) return;
      const ws = [w.v0, w.v1, w.v2, w.v3, w.v4];
      mat.roughness = 0.22 + ws[4] * 0.45;
      mat.clearcoat = 0.5 + ws[2] * 0.5;
      mat.envMapIntensity = 1.2 + ws[3] * 0.6;
    };

    // letterform identity machine (vertex morph between 5 treatments)
    const tl = gsap.timeline({ repeat: -1 });
    for (let st = 0; st < STATE_COUNT - 1; st++) {
      const to: Record<string, number> = {};
      to[`v${st}`] = 0;
      to[`v${st + 1}`] = 1;
      tl.to(w, {
        ...to,
        duration: MORPH_S,
        ease: "sine.inOut",
        onUpdate: setIdentity,
        onComplete: setMaterial,
      });
      tl.to({}, { duration: HOLD_MS / 1000 });
    }
    tl.to(w, {
      v4: 0,
      v0: 1,
      duration: MORPH_S,
      ease: "sine.inOut",
      onUpdate: setIdentity,
      onComplete: setMaterial,
    });
    tl.to({}, { duration: HOLD_MS / 1000 });
    setMaterial();

    // continuous typographic interpolation — slow, elegant, never static
    const osc = (prop: keyof typeof s, to: number, dur: number) =>
      gsap.to(s, {
        [prop]: to,
        duration: dur,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    const tweens = [
      osc("spacing", 0.06, 7),
      osc("scaleX", 1.025, 9),
      osc("scaleY", 0.975, 11),
      osc("skew", 0.045, 8),
      osc("extrude", 1.12, 13),
    ];

    return () => {
      tl.kill();
      tweens.forEach((tw) => tw.kill());
    };
  }, [reducedMotion]);

  return (
    <group ref={groupFit}>
      {/* soft depth: dark shadow plane + cool ambient glow behind the word */}
      <mesh ref={shadowRef} position={[0, -0.28, -0.35]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={blackTex} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      <mesh ref={glowRef} position={[0, 0, -1]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glowTex}
          transparent
          opacity={0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <group ref={groupMotion}>
        {characters.map((lineChars, li) =>
          lineChars.map((ch, ci) => {
            const idx = lineOffset[li] + ci;
            return (
              <group
                key={`${li}-${ci}`}
                ref={(el) => {
                  letterGroups.current[idx] = el;
                }}
              >
                {ch !== " " && (
                  <Text3D
                    ref={(el) => {
                      letterMeshes.current[idx] = el;
                    }}
                    font={font}
                    size={size}
                    height={depth}
                    curveSegments={10}
                    bevelEnabled
                    bevelThickness={0.028}
                    bevelSize={0.03}
                    bevelSegments={3}
                    raycast={() => null}
                  >
                    {ch}
                  </Text3D>
                )}
              </group>
            );
          })
        )}
      </group>
    </group>
  );
}

export default function FuturisticTitle({
  text = "The Slice\nAtelier",
  font = DEFAULT_FONT,
  size = FONT_SIZE,
  depth = 0.18,
}: FuturisticTitleProps) {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const lines = useMemo(() => text.split("\n").map((l) => l.trim()), [text]);
  const titleBoxRef = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={titleBoxRef} className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: 40, near: 0.1, far: 100 }}
        dpr={isMobile ? [1, 1.5] : [1, 1.75]}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none", touchAction: "pan-y" }}
      >
        <StudioEnvironment />
        <Lights />
        <Suspense fallback={null}>
          <Title3D
            lines={lines}
            font={font}
            size={size}
            depth={depth}
            reducedMotion={!!reducedMotion}
            titleBoxRef={titleBoxRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
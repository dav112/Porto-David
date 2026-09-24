"use client";

import {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type MutableRefObject,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  PerformanceMonitor,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import type { OrbitControlsProps } from "@react-three/drei/core/OrbitControls";
import { useIsMobile, usePrefersReducedMotion } from "@/hooks/use-media-query";

/* ============================================================
   CONFIGURABLE LAYERED 2.5D SCENE
   ============================================================ */

export interface HeroLayerConfig {
  src: string;
  positionZ: number;
  opacity?: number;
}

export interface Hero3DConfig {
  layers: HeroLayerConfig[];
  camera?: {
    positionZ?: number;
    fov?: number;
  };
  parallaxIntensity?: number;
  focusZ?: number;
  planeMargin?: number;
  animation?: {
    float?: boolean;
    floatAmplitude?: number;
    entrance?: boolean;
    focusSweep?: boolean;
    zoom?: {
      amplitude?: number;
      speed?: number;
    };
  };
}

export const defaultHero3DConfig: Hero3DConfig = {
  layers: [
    { src: "/hero/latar-1.png", positionZ: -6 },
    { src: "/hero/latar-2.png", positionZ: -4 },
    { src: "/hero/latar-3.png", positionZ: -2 },
    { src: "/hero/latar-4.png", positionZ: 0 },
    { src: "/hero/latar-5.png", positionZ: 2 },
  ],
  camera: { positionZ: 24, fov: 40 },
  parallaxIntensity: 10,
  planeMargin: 1.1,
  animation: {
    float: true,
    floatAmplitude: 0.22,
    entrance: true,
    focusSweep: true,
    zoom: { amplitude: 0.55, speed: 0.28 },
  },
};

/* Pause the render loop when the hero leaves the viewport. */
function FrameLoopController() {
  const gl = useThree((state) => state.gl);
  const setFrameloop = useThree((state) => state.setFrameloop);

  useEffect(() => {
    const el = gl.domElement;
    const observer = new IntersectionObserver(
      ([entry]) => setFrameloop(entry.isIntersecting ? "always" : "demand"),
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [gl, setFrameloop]);

  return null;
}

/* Mobile: one finger scrolls the page, two fingers rotate the scene.
   Restore vertical touch scroll after OrbitControls sets touch-action:none. */
function TouchSettings() {
  const gl = useThree((state) => state.gl);
  const controls = useThree((state) => state.controls);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      gl.domElement.style.touchAction = "pan-y";
    });
    return () => cancelAnimationFrame(frame);
  }, [gl, controls]);

  return null;
}

/* Rack-focus blur. The texture keeps its raw sRGB bytes (NoColorSpace) and the
   shader samples + outputs them unchanged (no color-space math), matching what
   the color-managed built-in materials produce. uBlur (in texels) is animated
   per frame so the focus racking feels like a real lens. */
const LAYER_VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LAYER_FRAGMENT_SHADER = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D map;
  uniform vec2 uTexel;
  uniform float uBlur;

  void main() {
    vec2 step = uBlur * uTexel * 0.5;
    vec4 sum = vec4(0.0);
    float wsum = 0.0;
    for (int y = -1; y <= 1; y++) {
      for (int x = -1; x <= 1; x++) {
        float d = float(x * x + y * y);
        float w = exp(-d * 0.5);
        sum += texture2D(map, vUv + vec2(float(x), float(y)) * step) * w;
        wsum += w;
      }
    }
    vec4 color = sum / wsum;
    if (color.a > 0.001) color.rgb /= color.a;
    gl_FragColor = color;
  }
`;

/* Soft blue-white architectural glow behind the layers. */
function GlowSprite() {
  const texture = useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(216, 235, 243, 0.3)");
    gradient.addColorStop(0.4, "rgba(163, 177, 194, 0.1)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    return new THREE.CanvasTexture(canvas);
  }, []);

  return (
    <sprite position={[0, 0, -8]} scale={[14, 14, 1]}>
      <spriteMaterial
        map={texture}
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </sprite>
  );
}

interface LayerProps {
  layer: HeroLayerConfig;
  cameraZ: number;
  parallaxIntensity: number;
  isMobile: boolean;
  index: number;
  focus: MutableRefObject<{ z: number }>;
  blurStrength: number;
  blurMax: number;
  planeMargin: number;
}

function Layer({
  layer,
  cameraZ,
  parallaxIntensity,
  isMobile,
  index,
  focus,
  blurStrength,
  blurMax,
  planeMargin,
}: LayerProps) {
  const texture = useTexture(layer.src);
  const meshRef = useRef<THREE.Mesh>(null);
  const shift = useRef({ x: 0, y: 0 });
  const phase = useMemo(() => index * 1.7, [index]);

  // material is created imperatively (not in render scope) so per-frame
  // uniform updates in useFrame don't trip the immutability/refs rules
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        uTexel: { value: new THREE.Vector2(1, 1) },
        uBlur: { value: 0 },
      },
      vertexShader: LAYER_VERTEX_SHADER,
      fragmentShader: LAYER_FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    mesh.material = mat;
    return () => mat.dispose();
  }, [texture]);

  const viewportW = useThree((state) => state.viewport.width);
  const viewportH = useThree((state) => state.viewport.height);

  /* Size each plane to cover the camera frustum at its own depth,
     then add margin so parallax movement never reveals edges. */
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    const mat = mesh?.material as THREE.ShaderMaterial | undefined;
    if (!mesh || !mat || !texture.image) return;

    const img = texture.image as { width: number; height: number };
    const imgAspect = img.width / img.height;
    const d0 = cameraZ; // viewport is measured at z = 0
    const d = cameraZ - layer.positionZ;
    const vh = viewportH * (d / d0);
    const vw = viewportW * (d / d0);

    let w = vh * imgAspect;
    let h = vh;
    if (imgAspect < vw / vh) {
      w = vw;
      h = vw / imgAspect;
    }

    const margin = planeMargin;
    mesh.scale.set(w * margin, h * margin, 1);

    // store the real texel size for the blur shader
    mat.uniforms.uTexel.value.set(1 / img.width, 1 / img.height);
  }, [texture, layer.positionZ, cameraZ, viewportW, viewportH, planeMargin]);

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime;

    // billboard — always face the camera so no edges ever appear
    mesh.lookAt(state.camera.position);

    // per-layer autonomous float with a distinct phase → visible depth separation
    const driftX = Math.sin(t * 0.4 + phase) * 0.09 * (index + 1) * 0.5;
    const driftY = Math.sin(t * 0.5 + phase * 1.3) * 0.07 * (index + 1) * 0.5;

    // parallax — closer layers shift more than far layers
    if (!isMobile) {
      const depthFactor = 1 / (cameraZ - layer.positionZ);
      const targetX = state.pointer.x * parallaxIntensity * depthFactor;
      const targetY = state.pointer.y * parallaxIntensity * depthFactor;
      shift.current.x = THREE.MathUtils.damp(shift.current.x, targetX, 3, delta);
      shift.current.y = THREE.MathUtils.damp(shift.current.y, targetY, 3, delta);
      mesh.position.x = shift.current.x + driftX;
      mesh.position.y = shift.current.y + driftY;
    } else {
      mesh.position.x = driftX;
      mesh.position.y = driftY;
    }

    // animated rack-focus: blur rises with distance to the current focus depth
    const distance = Math.abs(layer.positionZ - focus.current.z);
    const targetBlur = THREE.MathUtils.clamp(distance * blurStrength, 0, blurMax);
    const mat = mesh.material as THREE.ShaderMaterial;
    mat.uniforms.uBlur.value = THREE.MathUtils.damp(
      mat.uniforms.uBlur.value as number,
      targetBlur,
      4,
      delta
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, layer.positionZ]}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

interface SceneProps {
  config: Hero3DConfig;
  isMobile: boolean;
}

function Scene({ config, isMobile }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const setDpr = useThree((state) => state.setDpr);
  const reducedMotion = usePrefersReducedMotion();

  const cameraZ = config.camera?.positionZ ?? 9;
  const parallaxIntensity = config.parallaxIntensity ?? 0.5;
  const planeMargin = config.planeMargin ?? 1.2;

  // focus plane — defaults to latar_3 (index 2); animated sweep re-targets it
  const focus = useRef({ z: config.focusZ ?? config.layers[2]?.positionZ ?? -2 });
  const blurStrength = 1.5;
  const blurMax = 7;

  /* smooth cinematic entrance */
  useEffect(() => {
    const g = group.current;
    if (!g || reducedMotion || config.animation?.entrance === false) return;

    const timeline = gsap.timeline();
    timeline
      .fromTo(
        g.position,
        { z: -2.4 },
        { z: 0, duration: 1.8, ease: "power3.out" }
      )
      .fromTo(
        g.rotation,
        { x: -0.1 },
        { x: 0, duration: 1.6, ease: "power3.out" },
        0
      );

    return () => {
      timeline.kill();
    };
  }, [config, reducedMotion]);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;

    // slow floating movement
    if (!reducedMotion && config.animation?.float !== false) {
      g.position.y = Math.sin(t * 0.5) * (config.animation?.floatAmplitude ?? 0.22);
    }

    // cinematic dolly zoom loop — slowly out, then back in, forever
    const zoom = config.animation?.zoom;
    if (!reducedMotion && zoom) {
      const amplitude = zoom.amplitude ?? 0.55;
      const speed = zoom.speed ?? 0.28;
      state.camera.position.z = cameraZ + Math.sin(t * speed) * amplitude;
    }

    // subtle camera rotation from pointer (desktop) / gentle drift (mobile)
    if (!isMobile) {
      g.rotation.y = THREE.MathUtils.damp(g.rotation.y, state.pointer.x * 0.3, 3, delta);
      g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -state.pointer.y * 0.18, 3, delta);
      g.rotation.z = THREE.MathUtils.damp(g.rotation.z, state.pointer.x * 0.08, 3, delta);
    } else {
      g.rotation.y = Math.sin(t * 0.1) * 0.06;
      g.rotation.x = Math.sin(t * 0.08) * 0.03;
    }

    // autofocus racking — the focus sweeps layer to layer, rests, then racks on,
    // exactly like a camera hunting for focus between near and far subjects.
    if (!reducedMotion && config.animation?.focusSweep !== false) {
      const zs = config.layers
        .map((l) => l.positionZ)
        .sort((a, b) => a - b);
      const n = zs.length;
      if (n > 1) {
        const period = 3.2; // seconds per layer: quick rack + rest
        const cycle = t % (period * n);
        const seg = Math.floor(cycle / period);
        const f = (cycle - seg * period) / period;
        const eased = THREE.MathUtils.smoothstep(f / 0.35, 0, 1);
        const from = zs[seg % n];
        const to = zs[(seg + 1) % n];
        focus.current.z = THREE.MathUtils.lerp(from, to, eased);
      }
    }
  });

  return (
    <PerformanceMonitor
      onDecline={() => setDpr(1)}
      onIncline={() => setDpr(isMobile ? 1.5 : 1.75)}
    >
      {/* atmospheric depth — far layers fade into the dark environment */}
      <fog attach="fog" args={["#000000", cameraZ + 3, cameraZ + 18]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={0.6} color="#d8ebf3" />

      <Suspense fallback={null}>
        <group ref={group}>
          {config.layers.map((layer, i) => (
            <Layer
              key={layer.src}
              layer={layer}
              cameraZ={cameraZ}
              parallaxIntensity={parallaxIntensity}
              isMobile={isMobile}
              index={i}
              focus={focus}
              blurStrength={blurStrength}
              blurMax={blurMax}
              planeMargin={planeMargin}
            />
          ))}
        </group>
        <GlowSprite />
      </Suspense>
    </PerformanceMonitor>
  );
}

interface Hero3DSceneProps {
  config?: Hero3DConfig;
}

export default function Hero3DScene({ config = defaultHero3DConfig }: Hero3DSceneProps) {
  const isMobile = useIsMobile();
  const touchRef = useRef(false);

  useEffect(() => {
    const onTouch = () => {
      touchRef.current = true;
    };
    window.addEventListener("touchstart", onTouch, { once: true, passive: true });
    return () => window.removeEventListener("touchstart", onTouch);
  }, []);

  const webglSupported = useMemo(() => {
    try {
      const canvas = document.createElement("canvas");
      return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
    } catch {
      return false;
    }
  }, []);

  const cameraZ = config.camera?.positionZ ?? 9;
  const fov = config.camera?.fov ?? 40;

  return (
    <div
      className="absolute inset-0 h-full w-full"
      role="img"
      aria-label="Interactive futuristic 2.5D artwork made of layered images"
    >
      {webglSupported ? (
        <Canvas
          camera={{ position: [0, 0, cameraZ], fov, near: 0.1, far: 100 }}
          dpr={isMobile ? [1, 1.25] : [1, 1.4]}
          gl={{ antialias: true, powerPreference: "high-performance" }}
          style={{ touchAction: "pan-y" }}
        >
          <color attach="background" args={["#000000"]} />

          <FrameLoopController />
          <TouchSettings />
          <Scene config={config} isMobile={isMobile} />

          <OrbitControls
            makeDefault
            enableZoom={false}
            enablePan={false}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.5}
            touches={
              { ONE: -1, TWO: 0 } as unknown as OrbitControlsProps["touches"]
            }
          />
        </Canvas>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_50%,rgba(216,235,243,0.12),transparent_70%)]" />
      )}
    </div>
  );
}
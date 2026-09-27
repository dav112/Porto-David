"use client";

/** True on low-end / data-saving devices where heavy 3D, smooth-scroll & autoplay must be skipped. */
export function isLiteDevice(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    // @ts-expect-error NetworkInformation.saveData is non-standard
    if (navigator.connection?.saveData) return true;
    // @ts-expect-error NetworkInformation.effectiveType is non-standard
    const et = navigator.connection?.effectiveType as string | undefined;
    if (et === "slow-2g" || et === "2g") return true;
    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    if (cores <= 4 && mem <= 4) return true;
    if (window.matchMedia("(max-width: 768px)").matches && cores <= 6) return true;
    if (!hasWebGL()) return true;
  } catch {
    return false;
  }
  return false;
}

export function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

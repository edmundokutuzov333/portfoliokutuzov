export const signatureEase = [0.16, 1, 0.3, 1] as const;

export const motionDuration = {
  fast: 180,
  base: 380,
  slow: 720,
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

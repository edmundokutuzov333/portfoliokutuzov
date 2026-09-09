import type { Variants } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
};

export const revealLine: Variants = {
  hidden: { scaleX: 0, transformOrigin: "left" },
  visible: { scaleX: 1, transition: { duration: 0.8, ease } },
};

export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)" },
  visible: { clipPath: "inset(0 0 0% 0)", transition: { duration: 0.9, ease } },
};

export const imageReveal: Variants = {
  hidden: { opacity: 0, scale: 1.025 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease } },
};

export const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.45, ease } },
  exit: { opacity: 0, transition: { duration: 0.25, ease } },
};

export const motionDurations = {
  instant: 0.1,
  fast: 0.25,
  base: 0.4,
  medium: 0.6,
  slow: 0.8,
  cinematic: 1.2,
} as const;

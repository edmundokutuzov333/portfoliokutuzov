import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import { trackStudioClientEvent } from "@/lib/studio/analytics";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Kutuzov Studio | Under Construction" },
      {
        name: "description",
        content:
          "Kutuzov Studio is under construction. A private creative environment by Edmundo Kutuzov.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: StudioLanding,
});

function MinimalSignal() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[560px]"
      aria-hidden="true"
      data-testid="studio-construction-signal"
    >
      <div className="absolute inset-[13%] rounded-full border border-cyan-300/[0.08]" />
      <div className="absolute inset-[21%] rounded-full border border-cyan-300/[0.06]" />

      <motion.div
        animate={reducedMotion ? undefined : { opacity: [0.2, 0.5, 0.2], scale: [0.98, 1.03, 0.98] }}
        transition={
          reducedMotion
            ? undefined
            : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
        }
        className="absolute left-1/2 top-1/2 h-[58%] w-[58%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/[0.045] blur-3xl"
      />

      <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <filter id="minimalSignalGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="minimalSignalStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        <motion.path
          d="M145 392V236C145 157 196 108 260 108C324 108 375 157 375 236V392"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2.2"
          strokeLinecap="round"
          filter="url(#minimalSignalGlow)"
          animate={reducedMotion ? undefined : { opacity: [0.48, 1, 0.48] }}
          transition={
            reducedMotion
              ? undefined
              : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <path
          d="M145 392V236C145 157 196 108 260 108C324 108 375 157 375 236V392"
          fill="none"
          stroke="url(#minimalSignalStroke)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />

        <rect
          x="126"
          y="392"
          width="268"
          height="8"
          rx="4"
          fill="#22d3ee"
          opacity="0.72"
          filter="url(#minimalSignalGlow)"
        />

        <motion.circle
          cx="260"
          cy="108"
          r="3"
          fill="#22d3ee"
          filter="url(#minimalSignalGlow)"
          animate={
            reducedMotion
              ? undefined
              : { cy: [108, 118, 108], opacity: [0.55, 1, 0.55] }
          }
          transition={
            reducedMotion
              ? undefined
              : { duration: 3.2, repeat: Infinity, ease: "easeInOut" }
          }
        />
      </svg>
    </div>
  );
}

function StudioLanding() {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    trackStudioClientEvent({ eventName: "studio_opened" });
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg)] px-5 pb-16 pt-28 sm:px-8 sm:pt-32">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(circle at 72% 44%, rgba(34,211,238,0.055), transparent 28%), radial-gradient(circle at 18% 12%, rgba(14,165,233,0.035), transparent 22%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[calc(100vh-11rem)] max-w-[1240px] flex-col justify-between">
        <div className="flex items-center justify-between border-b border-white/[0.07] pb-4">
          <span className="mono text-[9px] tracking-[0.28em] text-white/35">
            KUTUZOV STUDIO
          </span>
          <span className="mono text-[9px] tracking-[0.2em] text-cyan-300/60">
            PRIVATE BUILD
          </span>
        </div>

        <div className="grid items-center gap-10 py-16 lg:grid-cols-[1fr_0.95fr] lg:gap-4">
          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, y: 18 }}
            animate={reducedMotion ? undefined : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[700px]"
          >
            <p className="mono text-[9px] tracking-[0.24em] text-white/25">
              SOMETHING IS BEING BUILT
            </p>

            <h1 className="display mt-5 max-w-4xl text-[clamp(3.8rem,8.5vw,8.8rem)] font-medium leading-[0.86] tracking-[-0.065em] text-white">
              Something is
              <span className="block text-white/42">taking shape.</span>
            </h1>

            <p className="mt-7 max-w-[500px] text-sm leading-relaxed text-white/42 sm:text-base">
              A private creative space for the work behind the work.
            </p>

            <Link
              to="/portfolio"
              className="mt-9 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(255,255,255,0.08)]"
            >
              View portfolio
              <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </motion.div>

          <motion.div
            initial={reducedMotion ? undefined : { opacity: 0, scale: 0.96 }}
            animate={reducedMotion ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center"
          >
            <MinimalSignal />
          </motion.div>
        </div>

        <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
          <span className="mono text-[8px] tracking-[0.22em] text-white/20">
            MAPUTO / 2026
          </span>
          <span className="mono text-[8px] tracking-[0.22em] text-white/20">
            NOT PUBLIC YET
          </span>
        </div>
      </div>
    </main>
  );
}

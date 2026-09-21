import type { PointerEvent } from "react";
import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const SIGNALS = Array.from({ length: 8 }, (_, index) => {
  const angle = -90 + index * 45;
  const radians = (angle * Math.PI) / 180;
  return {
    angle,
    x: 50 + Math.cos(radians) * 43,
    y: 48 + Math.sin(radians) * 43,
    delay: index * 0.16,
    scale: 0.82 + (index % 3) * 0.08,
  };
});

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

const NETWORK_POINTS = Array.from({ length: 92 }, (_, index) => {
  const t = index / 91;
  const y = 58 + t * 218;
  const halfWidth = 148 - Math.pow(t, 1.7) * 12;
  const x = 200 - halfWidth + seeded(index, 11) * halfWidth * 2;
  const lift = seeded(index, 29) * 18;
  return { x, y: y - lift, r: 1.3 + seeded(index, 7) * 1.8, delay: seeded(index, 3) * 3.2 };
});

const NETWORK_LINES = NETWORK_POINTS.flatMap((point, index) => {
  if (index === NETWORK_POINTS.length - 1) return [];
  const next = NETWORK_POINTS[index + 1];
  const second = NETWORK_POINTS[(index + 7) % NETWORK_POINTS.length];
  return [
    { x1: point.x, y1: point.y, x2: next.x, y2: next.y, delay: point.delay },
    ...(index % 4 === 0
      ? [{ x1: point.x, y1: point.y, x2: second.x, y2: second.y, delay: point.delay + 0.15 }]
      : []),
  ];
});

export function StudioConstructionSignal() {
  const reducedMotion = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 120, damping: 20, mass: 0.7 });
  const springY = useSpring(pointerY, { stiffness: 120, damping: 20, mass: 0.7 });
  const rotateY = useTransform(springX, [-1, 1], [-11, 11]);
  const rotateX = useTransform(springY, [-1, 1], [8, -8]);

  const particles = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => ({
        left: (18 + seeded(index, 71) * 64) + "%",
        top: (12 + seeded(index, 89) * 72) + "%",
        size: (1 + seeded(index, 101) * 2.4) + "px",
        delay: (seeded(index, 113) * 3.5) + "s",
        duration: (2.4 + seeded(index, 127) * 2.8) + "s",
      })),
    [],
  );

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <section
      className="relative overflow-hidden rounded-[34px] border border-cyan-300/10 bg-[#02050c] px-5 py-8 shadow-[0_32px_120px_rgba(0,0,0,.45)] sm:px-8 sm:py-10 lg:px-10"
      aria-label="Kutuzov Studio construction notice"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(0,229,255,.12),transparent_34%),radial-gradient(circle_at_50%_50%,rgba(0,80,160,.2),transparent_66%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-cyan-300/30" />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[minmax(0,.88fr)_minmax(420px,1.12fr)] lg:gap-6">
        <div className="max-w-xl lg:order-1">
          <p className="mono text-[9px] uppercase tracking-[0.34em] text-cyan-300/70">
            KUTUZOV STUDIO / PRIVATE BUILD
          </p>
          <h1 className="display mt-5 max-w-xl text-5xl font-semibold leading-[0.93] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            Something is
            <span className="block text-cyan-300">taking shape.</span>
          </h1>
          <p className="mt-7 max-w-lg text-[15px] leading-7 text-white/48 sm:text-base">
            Kutuzov Studio is currently under construction. The tools are being refined in private before the full experience is released.
          </p>
          <p className="mt-3 max-w-lg text-[13px] leading-6 text-white/28">
            While the Studio is being built, you can explore the work, case studies and visual systems behind it.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/portfolio"
              className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#02050c] transition-transform hover:-translate-y-0.5"
            >
              Explore the portfolio
              <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white/72 transition-colors hover:border-white/20 hover:text-white"
            >
              Return home
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-2 text-[9px] uppercase tracking-[0.18em] text-white/25">
            <span>PRIVATE DEVELOPMENT</span>
            <span>PUBLIC PREVIEW</span>
            <span>LAUNCH WHEN READY</span>
          </div>
        </div>

        <motion.div
          className="relative mx-auto aspect-square w-full max-w-[670px] [perspective:1200px] lg:order-2"
          onPointerMove={handlePointerMove}
          onPointerLeave={resetPointer}
          style={{ rotateX, rotateY }}
        >
          <div className="absolute inset-[10%] rounded-full border border-cyan-300/10 [transform:translateZ(-40px)] studio-signal-orbit" />
          <div className="absolute inset-[19%] rounded-full border border-cyan-300/10 [transform:translateZ(-22px)] studio-signal-orbit-reverse" />

          {SIGNALS.map((signal, index) => (
            <motion.div
              key={signal.angle}
              className="absolute -translate-x-1/2 -translate-y-1/2 select-none font-black leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(0,229,255,.82)] [filter:drop-shadow(0_0_9px_rgba(0,229,255,.55))] [text-shadow:0_0_22px_rgba(0,229,255,.22)]"
              style={{
                left: signal.x + "%",
                top: signal.y + "%",
                scale: signal.scale,
                rotate: signal.angle + 90,
                transform: "translateZ(40px)",
              }}
              animate={reducedMotion ? undefined : { y: [0, -8, 0], opacity: [0.45, 1, 0.45] }}
              transition={{
                duration: 2.8 + index * 0.08,
                delay: signal.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <span className="block text-5xl sm:text-6xl">!</span>
            </motion.div>
          ))}

          {particles.map((particle, index) => (
            <span
              key={index}
              className="studio-signal-particle absolute rounded-full bg-cyan-300 shadow-[0_0_12px_rgba(0,229,255,.9)]"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                animationDelay: particle.delay,
                animationDuration: particle.duration,
              }}
            />
          ))}

          <motion.div
            className="absolute inset-[15%] [transform-style:preserve-3d]"
            animate={reducedMotion ? undefined : { y: [0, -6, 0] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-[14%] rounded-[28%] bg-cyan-300/8 blur-2xl [transform:translateZ(-35px)]" />
            <div className="absolute inset-[10%] rounded-[24%] border border-cyan-300/15 bg-[#021020]/90 shadow-[0_0_70px_rgba(0,229,255,.08)] [transform:translateZ(6px)]" />

            <div className="absolute left-[12%] right-[12%] top-[5%] bottom-[18%] overflow-hidden rounded-t-[42%] border-2 border-cyan-300/90 bg-[#04162a]/92 shadow-[0_0_35px_rgba(0,229,255,.45),inset_0_0_40px_rgba(0,229,255,.08)] [transform:translateZ(34px)]">
              <svg viewBox="0 0 400 330" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
                <defs>
                  <clipPath id="studio-arch-clip">
                    <path d="M62 330V135C62 61 117 21 200 21s138 40 138 114v195Z" />
                  </clipPath>
                  <linearGradient id="studio-signal-gradient" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="#00e5ff" stopOpacity=".95" />
                    <stop offset="45%" stopColor="#1688ff" stopOpacity=".65" />
                    <stop offset="100%" stopColor="#00e5ff" stopOpacity=".95" />
                  </linearGradient>
                </defs>
                <g clipPath="url(#studio-arch-clip)">
                  <rect width="400" height="330" fill="#03142a" />
                  <g className="studio-signal-grid" opacity=".28">
                    {Array.from({ length: 9 }, (_, index) => (
                      <path key={index} d={"M" + (78 + index * 31) + " 20V330"} stroke="#00e5ff" strokeWidth="0.6" />
                    ))}
                    {Array.from({ length: 9 }, (_, index) => (
                      <path key={index} d={"M50 " + (40 + index * 34) + "H350"} stroke="#00e5ff" strokeWidth="0.6" />
                    ))}
                  </g>
                  <g opacity=".72">
                    {NETWORK_LINES.map((line, index) => (
                      <line
                        key={index}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="url(#studio-signal-gradient)"
                        strokeWidth=".8"
                        className="studio-signal-network-line"
                        style={{ animationDelay: line.delay + "s" }}
                      />
                    ))}
                  </g>
                  <g>
                    {NETWORK_POINTS.map((point, index) => (
                      <circle
                        key={index}
                        cx={point.x}
                        cy={point.y}
                        r={point.r}
                        fill="#79f6ff"
                        className="studio-signal-node"
                        style={{ animationDelay: point.delay + "s" }}
                      />
                    ))}
                  </g>
                  <path
                    d="M70 292C126 255 164 279 205 250s82-20 125 14"
                    fill="none"
                    stroke="#66f5ff"
                    strokeWidth="1.2"
                    opacity=".75"
                    className="studio-signal-pulse-line"
                  />
                  <rect x="0" y="0" width="400" height="3" fill="#5df2ff" opacity=".7" className="studio-signal-scan" />
                </g>
                <path d="M62 330V135C62 61 117 21 200 21s138 40 138 114v195" fill="none" stroke="url(#studio-signal-gradient)" strokeWidth="3.4" />
              </svg>

              <div className="pointer-events-none absolute inset-[10%] rounded-t-[38%] border border-cyan-200/30 shadow-[inset_0_0_30px_rgba(0,229,255,.06)]" />
            </div>

            <div className="absolute left-[10%] right-[10%] bottom-[7%] h-[17%] rounded-[8px] border-2 border-cyan-300/90 bg-[#051a31] shadow-[0_0_30px_rgba(0,229,255,.32)] [transform:translateZ(26px)]">
              <div className="absolute inset-x-[6%] top-1/2 h-px -translate-y-1/2 bg-cyan-200/60 shadow-[0_0_12px_rgba(0,229,255,.55)]" />
              <div className="absolute inset-[8%] border border-cyan-300/10" />
            </div>

            <div className="absolute inset-x-[17%] bottom-[2%] h-[5%] rounded-full bg-cyan-300/30 blur-md [transform:translateZ(3px)]" />
          </motion.div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[42%] w-[64%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/10 blur-3xl" />
        </motion.div>
      </div>
    </section>
  );
}

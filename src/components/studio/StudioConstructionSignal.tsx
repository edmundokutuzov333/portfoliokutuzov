import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useMemo, useRef, type PointerEvent } from "react";

const CYAN = "#08E9FF";
const DEEP = "#00122C";

type Point = { x: number; y: number; r: number; delay: number };
type Edge = { a: Point; b: Point };

function buildNetwork() {
  const points: Point[] = [];
  for (let i = 0; i < 140; i += 1) {
    const col = i % 14;
    const row = Math.floor(i / 14);
    points.push({
      x: 146 + col * 23 + Math.sin(i * 1.73) * 5,
      y: 132 + row * 23 + Math.cos(i * 0.81) * 5,
      r: 1.2 + (i % 3) * 0.45,
      delay: (i % 17) * 0.045,
    });
  }

  const edges: Edge[] = [];
  for (let i = 0; i < points.length; i += 1) {
    if (i + 1 < points.length && i % 14 !== 13) edges.push({ a: points[i], b: points[i + 1] });
    if (i + 14 < points.length) edges.push({ a: points[i], b: points[i + 14] });
    if (i + 15 < points.length && i % 14 !== 13 && i % 3 === 0) {
      edges.push({ a: points[i], b: points[i + 15] });
    }
  }
  return { points, edges };
}

const SIGNALS = [0, 60, 120, 180, 240, 300].map((rotation, index) => ({
  rotation,
  index,
}));

const DUST = Array.from({ length: 34 }, (_, i) => ({
  cx: 90 + ((i * 73) % 420),
  cy: 90 + ((i * 47) % 390),
  r: 0.8 + (i % 3) * 0.7,
  delay: (i % 11) * 0.19,
}));

export function StudioConstructionSignal() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-1, 1], [7, -7]), {
    stiffness: 110,
    damping: 18,
    mass: 0.7,
  });
  const rotateY = useSpring(useTransform(pointerX, [-1, 1], [-9, 9]), {
    stiffness: 110,
    damping: 18,
    mass: 0.7,
  });

  const { points, edges } = useMemo(buildNetwork, []);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set((event.clientX - rect.left) / rect.width * 2 - 1);
    pointerY.set((event.clientY - rect.top) / rect.height * 2 - 1);
  }

  function handlePointerLeave() {
    pointerX.set(0);
    pointerY.set(0);
  }

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative mx-auto aspect-square w-full max-w-[640px] touch-pan-y select-none [perspective:1200px]"
      aria-hidden="true"
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className="relative h-full w-full [transform-style:preserve-3d]"
      >
        <motion.div
          animate={
            reducedMotion
              ? undefined
              : { rotateZ: 360, scale: [0.985, 1.015, 0.985] }
          }
          transition={
            reducedMotion
              ? undefined
              : {
                  rotateZ: { duration: 30, repeat: Infinity, ease: "linear" },
                  scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }
          }
          className="absolute inset-[7%] rounded-full border border-cyan-300/10"
        />

        <motion.div
          animate={reducedMotion ? undefined : { rotateZ: -360 }}
          transition={reducedMotion ? undefined : { duration: 42, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[13%] rounded-full border border-cyan-300/[0.07]"
        />

        <svg viewBox="0 0 600 600" className="absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <linearGradient id="studioSignalStroke" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CYAN} stopOpacity="0.95" />
              <stop offset="58%" stopColor={CYAN} stopOpacity="0.8" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0.22" />
            </linearGradient>
            <radialGradient id="studioSignalGlow">
              <stop offset="0%" stopColor={CYAN} stopOpacity="0.42" />
              <stop offset="62%" stopColor={CYAN} stopOpacity="0.08" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
            </radialGradient>
            <filter id="studioSignalBlur">
              <feGaussianBlur stdDeviation="10" />
            </filter>
            <filter id="studioSignalGlowFilter" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="3.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="studioSignalArchClip">
              <path d="M145 430V267C145 184 214 116 300 116C386 116 455 184 455 267V430Z" />
            </clipPath>
          </defs>

          <circle cx="300" cy="282" r="225" fill="url(#studioSignalGlow)" filter="url(#studioSignalBlur)" />

          <g clipPath="url(#studioSignalArchClip)" opacity="0.88">
            {edges.map((edge, index) => (
              <motion.line
                key={"edge-" + index}
                x1={edge.a.x}
                y1={edge.a.y}
                x2={edge.b.x}
                y2={edge.b.y}
                stroke={CYAN}
                strokeOpacity="0.23"
                strokeWidth="0.9"
                animate={reducedMotion ? undefined : { opacity: [0.2, 0.72, 0.2] }}
                transition={
                  reducedMotion
                    ? undefined
                    : { duration: 2.2 + (index % 7) * 0.18, repeat: Infinity, delay: (index % 21) * 0.03 }
                }
              />
            ))}

            {points.map((point, index) => (
              <motion.circle
                key={"point-" + index}
                cx={point.x}
                cy={point.y}
                r={point.r}
                fill={CYAN}
                filter={index % 5 === 0 ? "url(#studioSignalGlowFilter)" : undefined}
                animate={reducedMotion ? undefined : { opacity: [0.28, 1, 0.28], scale: [0.85, 1.35, 0.85] }}
                transition={
                  reducedMotion
                    ? undefined
                    : { duration: 1.8 + (index % 8) * 0.11, repeat: Infinity, delay: point.delay, ease: "easeInOut" }
                }
              />
            ))}

            <motion.rect
              x="140"
              y="150"
              width="320"
              height="3"
              fill={CYAN}
              opacity="0.7"
              animate={reducedMotion ? undefined : { y: [150, 416, 150], opacity: [0.08, 0.72, 0.08] }}
              transition={reducedMotion ? undefined : { duration: 5.8, repeat: Infinity, ease: "linear" }}
              filter="url(#studioSignalGlowFilter)"
            />
          </g>

          <motion.path
            d="M145 430V267C145 184 214 116 300 116C386 116 455 184 455 267V430"
            fill="none"
            stroke={CYAN}
            strokeWidth="5.5"
            strokeLinecap="round"
            filter="url(#studioSignalGlowFilter)"
          />
          <motion.path
            d="M145 430V267C145 184 214 116 300 116C386 116 455 184 455 267V430"
            fill="none"
            stroke="url(#studioSignalStroke)"
            strokeWidth="2.1"
            strokeLinecap="round"
            animate={reducedMotion ? undefined : { pathLength: [0.92, 1, 0.92] }}
            transition={reducedMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.rect
            x="128"
            y="430"
            width="344"
            height="54"
            rx="7"
            fill="none"
            stroke={CYAN}
            strokeWidth="5"
            filter="url(#studioSignalGlowFilter)"
          />
          <motion.rect
            x="134"
            y="436"
            width="332"
            height="42"
            rx="4"
            fill={DEEP}
            fillOpacity="0.32"
            stroke={CYAN}
            strokeOpacity="0.58"
            strokeWidth="1.3"
          />

          <g>
            {SIGNALS.map(({ rotation, index }) => (
              <motion.g
                key={"signal-" + index}
                transform={"translate(300 300) rotate(" + rotation + ") translate(0 -236)"}
                animate={
                  reducedMotion
                    ? undefined
                    : { y: [0, -4, 0], opacity: [0.72, 1, 0.72] }
                }
                transition={
                  reducedMotion
                    ? undefined
                    : { duration: 2.8 + index * 0.13, repeat: Infinity, delay: index * 0.16, ease: "easeInOut" }
                }
              >
                <rect
                  x="-18"
                  y="-58"
                  width="36"
                  height="95"
                  rx="8"
                  fill="none"
                  stroke={CYAN}
                  strokeWidth="4"
                  filter="url(#studioSignalGlowFilter)"
                />
                <rect
                  x="-12"
                  y="-51"
                  width="24"
                  height="82"
                  rx="5"
                  fill={DEEP}
                  fillOpacity="0.72"
                  stroke={CYAN}
                  strokeOpacity="0.5"
                  strokeWidth="1.2"
                />
                <path
                  d="M-7-39L8-24L-8-5L8 11L-8 28"
                  fill="none"
                  stroke={CYAN}
                  strokeOpacity="0.65"
                  strokeWidth="1.1"
                />
                {[[-8,-31],[7,-13],[-8,5],[7,22]].map(([cx,cy], nodeIndex) => (
                  <circle
                    key={"n-" + nodeIndex}
                    cx={cx}
                    cy={cy}
                    r="2.3"
                    fill={CYAN}
                    opacity="0.9"
                  />
                ))}
                <circle cx="0" cy="44" r="4" fill={CYAN} filter="url(#studioSignalGlowFilter)" />
              </motion.g>
            ))}
          </g>

          {DUST.map((particle, index) => (
            <motion.circle
              key={"dust-" + index}
              cx={particle.cx}
              cy={particle.cy}
              r={particle.r}
              fill={CYAN}
              animate={reducedMotion ? undefined : { opacity: [0.08, 0.9, 0.08], scale: [0.7, 1.6, 0.7] }}
              transition={
                reducedMotion
                  ? undefined
                  : { duration: 2 + (index % 5) * 0.4, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }
              }
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}

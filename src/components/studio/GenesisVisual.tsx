import { motion } from "framer-motion";

const nodes = [
  [74, 48], [156, 92], [258, 44], [372, 76], [468, 42],
  [116, 178], [214, 148], [324, 186], [430, 158], [506, 230],
  [62, 294], [172, 264], [282, 318], [392, 282], [470, 350],
  [126, 410], [244, 432], [362, 408],
] as const;

const edges = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 6], [2, 6], [3, 7], [6, 7],
  [6, 11], [7, 8], [8, 9], [7, 13], [10, 11], [11, 12], [12, 13],
  [13, 14], [11, 16], [12, 16], [12, 17], [15, 16], [16, 17],
] as const;

function pathFor([from, to]: readonly [number, number]) {
  const [x1, y1] = nodes[from];
  const [x2, y2] = nodes[to];
  const curve = Math.max(12, Math.abs(x2 - x1) * 0.18);
  return `M ${x1} ${y1} C ${x1 + curve} ${y1 - curve} ${x2 - curve} ${y2 + curve} ${x2} ${y2}`;
}

export function GenesisVisual({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="relative mx-auto w-full max-w-[620px]" aria-hidden="true" data-testid="studio-genesis-visual">
      <div className="absolute inset-[12%] rounded-full bg-[#25e3c2]/[0.035] blur-3xl" />
      <svg viewBox="0 0 560 480" className="relative h-auto w-full overflow-visible">
        <defs>
          <filter id="studio-node-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {edges.map((edge, index) => (
          <motion.path
            key={`${edge[0]}-${edge[1]}`}
            d={pathFor(edge)}
            fill="none"
            stroke="#25e3c2"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: reduceMotion ? 0.52 : 0, opacity: reduceMotion ? 0.34 : 0 }}
            animate={
              reduceMotion
                ? { pathLength: 0.52, opacity: 0.34 }
                : { pathLength: [0, 1, 1], opacity: [0, 0.62, 0.12] }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: 6.2,
                    delay: (index % 7) * 0.28,
                    repeat: Infinity,
                    repeatDelay: 1.2,
                    ease: "easeInOut",
                  }
            }
          />
        ))}
        {nodes.map(([cx, cy], index) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={index === 7 ? 3.2 : 2.2}
            fill={index === 7 ? "#25e3c2" : "#d8e2e0"}
            opacity={index === 7 ? 1 : 0.52}
            filter={index === 7 ? "url(#studio-node-glow)" : undefined}
          />
        ))}
        <motion.circle
          cx="324"
          cy="186"
          r="11"
          fill="none"
          stroke="#25e3c2"
          strokeWidth="0.8"
          initial={{ opacity: reduceMotion ? 0.25 : 0.1, scale: 0.8 }}
          animate={reduceMotion ? { opacity: 0.25, scale: 1 } : { opacity: [0.08, 0.32, 0.08], scale: [0.8, 1.6, 0.8] }}
          transition={reduceMotion ? undefined : { duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "324px 186px" }}
        />
      </svg>
      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-white/30">...</div>
    </div>
  );
}

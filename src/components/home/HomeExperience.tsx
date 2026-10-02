import * as React from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useReducedMotion,
  animate,
} from "framer-motion";

interface ExperienceItem {
  period: string;
  role: string;
  company: string;
  isCurrent?: boolean;
}

const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    period: "2024 – Present",
    role: "Art Director & Content Creator",
    company: "WEBMASTERS",
    isCurrent: true,
  },
  {
    period: "2023 – 2024",
    role: "Art Director",
    company: "SPOT Comunicação",
  },
  {
    period: "2023",
    role: "Senior Graphic Designer",
    company: "Ikigai Moçambique",
  },
  {
    period: "2023",
    role: "Marketing Assistant & Social Media Manager",
    company: "Imperial Seguros",
  },
  {
    period: "2020 – 2023",
    role: "Graphic Designer",
    company: "Agência Creer",
  },
];

interface MetricItem {
  num: number;
  suffix: string;
  label: string;
}

const NUMBERS_DATA: MetricItem[] = [
  {
    num: 6,
    suffix: "+",
    label: "Years of experience",
  },
  {
    num: 150,
    suffix: "+",
    label: "Projects delivered",
  },
  {
    num: 30,
    suffix: "+",
    label: "National and international brands",
  },
  {
    num: 3,
    suffix: "",
    label: "Continents",
  },
  {
    num: 360,
    suffix: "°",
    label: "Art direction, branding, strategy, AI, marketing",
  },
];

const EASE_EDITORIAL = [0.16, 1, 0.3, 1] as const;

function CountUpNumber({
  num,
  suffix,
  reducedMotion,
}: {
  num: number;
  suffix: string;
  reducedMotion: boolean | null;
}) {
  const [displayValue, setDisplayValue] = React.useState(reducedMotion ? num : 0);
  const ref = React.useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  React.useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(num);
      return;
    }
    if (!isInView) return;

    const controls = animate(0, num, {
      duration: 0.85,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(Math.round(latest));
      },
    });

    return () => controls.stop();
  }, [isInView, num, reducedMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {displayValue}
      {suffix}
    </span>
  );
}

export function HomeExperience() {
  const reducedMotion = useReducedMotion();
  const referenceSectionRef = React.useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: referenceSectionRef,
    offset: ["start end", "end start"],
  });

  const rawGodX = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const godX = reducedMotion ? 0 : rawGodX;

  return (
    <section className="relative px-5 md:px-8 py-24 bg-[var(--color-bg)] text-[var(--color-text-primary)]">
      <div className="max-w-[1240px] mx-auto">
        {/* ================================================
            EXPERIENCE
            ================================================ */}
        <div>
          <div className="mb-8">
            <motion.p
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
              className="mono text-[10px] tracking-[0.28em] text-sky-300/75 uppercase"
            >
              Experience
            </motion.p>
          </div>

          {/* Top Divider */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            whileInView={reducedMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.7, ease: EASE_EDITORIAL }}
            style={{ transformOrigin: "left" }}
            className="w-full h-px bg-white/[0.08]"
          />

          <div className="space-y-0">
            {EXPERIENCE_DATA.map((item, i) => (
              <div key={`${item.role}-${item.company}-${i}`}>
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-10% 0px" }}
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: reducedMotion ? 0 : 0.12,
                        delayChildren: i * 0.05,
                      },
                    },
                  }}
                  whileHover={
                    reducedMotion
                      ? undefined
                      : {
                          opacity: 1,
                          x: 4,
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 24,
                  }}
                  className={`group grid grid-cols-12 gap-4 py-6 items-baseline transition-colors px-4 -mx-4 rounded-lg cursor-default ${
                    item.isCurrent
                      ? "bg-white/[0.02] hover:bg-white/[0.04]"
                      : "hover:bg-white/[0.02]"
                  }`}
                >
                  {/* 1. YEAR */}
                  <motion.div
                    variants={{
                      hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.6,
                          ease: EASE_EDITORIAL,
                        },
                      },
                    }}
                    className="col-span-12 md:col-span-3 flex items-center gap-2"
                  >
                    <span
                      className={`mono text-[11px] tracking-[0.2em] uppercase ${
                        item.isCurrent
                          ? "text-sky-300 font-medium"
                          : "text-slate-400 group-hover:text-slate-300 transition-colors"
                      }`}
                    >
                      {item.period}
                    </span>
                    {item.isCurrent && (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold tracking-wider uppercase bg-sky-400/10 text-sky-300 border border-sky-400/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                        Present
                      </span>
                    )}
                  </motion.div>

                  {/* 2. ROLE */}
                  <motion.div
                    variants={{
                      hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.6,
                          ease: EASE_EDITORIAL,
                        },
                      },
                    }}
                    className={`col-span-12 md:col-span-6 display text-lg md:text-xl transition-colors ${
                      item.isCurrent
                        ? "text-white font-medium group-hover:text-sky-100"
                        : "text-[var(--color-text-primary)] group-hover:text-white"
                    }`}
                  >
                    {item.role}
                  </motion.div>

                  {/* 3. COMPANY */}
                  <motion.div
                    variants={{
                      hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.6,
                          ease: EASE_EDITORIAL,
                        },
                      },
                    }}
                    className={`col-span-12 md:col-span-3 text-sm md:text-right font-medium transition-all ${
                      item.isCurrent
                        ? "text-slate-200 group-hover:text-sky-300"
                        : "text-[var(--color-text-secondary)] group-hover:text-slate-200"
                    }`}
                  >
                    {item.company}
                  </motion.div>
                </motion.div>

                {/* 4. HORIZONTAL DIVIDER */}
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
                  whileInView={reducedMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-10% 0px" }}
                  transition={{
                    duration: 0.7,
                    ease: EASE_EDITORIAL,
                  }}
                  style={{ transformOrigin: "left" }}
                  className="w-full h-px bg-white/[0.08]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* ================================================
            IN NUMBERS
            ================================================ */}
        <div className="mt-28">
          <div className="flex items-center justify-between mb-8">
            <motion.p
              initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: EASE_EDITORIAL }}
              className="mono text-[10px] tracking-[0.28em] text-sky-300/75 uppercase"
            >
              In Numbers
            </motion.p>
          </div>

          {/* Section progress line */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            whileInView={reducedMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            style={{ transformOrigin: "left" }}
            className="w-full h-px bg-gradient-to-r from-sky-400/40 via-sky-400/10 to-transparent mb-6"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-px bg-white/[0.08] border border-white/[0.08] rounded-xl overflow-hidden shadow-2xl">
            {NUMBERS_DATA.map((c, i) => (
              <motion.div
                key={c.label}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-15%" }}
                transition={{
                  duration: 0.65,
                  delay: i * 0.08,
                  ease: EASE_EDITORIAL,
                }}
                className={`bg-[#030814] p-7 min-h-[180px] flex flex-col justify-between group hover:bg-[#06111f] transition-colors duration-300 ${
                  i === 4 ? "sm:col-span-2 lg:col-span-1" : "col-span-1"
                }`}
              >
                {/* 1 & 2: Number with short reveal & count-up */}
                <div className="display text-4xl md:text-5xl text-white tracking-[-0.02em] font-medium group-hover:scale-105 origin-left transition-transform duration-500">
                  <CountUpNumber num={c.num} suffix={c.suffix} reducedMotion={reducedMotion} />
                </div>

                {/* 3: Label enters after number */}
                <motion.div
                  initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08 + 0.15,
                    ease: EASE_EDITORIAL,
                  }}
                  className="mt-6"
                >
                  <div className="text-[13px] leading-snug text-slate-300 font-normal">
                    {c.label}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================================================
            REFERENCE / GOD
            ================================================ */}
        <div ref={referenceSectionRef} className="mt-32">
          {/* Subtle horizontal line reveal */}
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { scaleX: 0, opacity: 0 }}
            whileInView={reducedMotion ? { opacity: 1 } : { scaleX: 1, opacity: 1 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
            style={{ transformOrigin: "left" }}
            className="w-full h-px bg-white/[0.08]"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  duration: 0.6,
                },
              },
            }}
            className="flex items-center justify-between pt-8"
          >
            {/* 1. REFERENCE enters first */}
            <motion.p
              variants={{
                hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: EASE_EDITORIAL },
                },
              }}
              className="mono text-[10px] tracking-[0.28em] text-slate-500 uppercase"
            >
              Reference
            </motion.p>

            {/* 2 & 4. GOD appears afterwards and receives subtle scroll-linked horizontal movement */}
            <motion.p
              style={{ x: godX }}
              variants={{
                hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.7, ease: EASE_EDITORIAL },
                },
              }}
              className="display text-2xl md:text-3xl tracking-[0.05em] text-[var(--color-accent-base)] italic font-serif"
            >
              GOD
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

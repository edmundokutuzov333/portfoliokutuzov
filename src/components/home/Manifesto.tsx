import { motion } from "framer-motion";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";
import clsx from "clsx";

type Principle = { meta: string; key: string; value: string };

const FALLBACK_PRINCIPLES: Principle[] = [
  {
    meta: "01",
    key: "Clarity",
    value: "Every element must earn its place. Noise is the enemy of memory.",
  },
  { meta: "02", key: "Rhythm", value: "Pacing dictates attention. Contrast creates engagement." },
  { meta: "03", key: "Precision", value: "Execution defines positioning. God is in the details." },
  { meta: "04", key: "Memory", value: "Aesthetic survival requires a distinct point of view." },
];

export function Manifesto() {
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "manifesto", f, fb);
  const principles = r<Principle[]>("principles", FALLBACK_PRINCIPLES);

  return (
    <section className="relative px-4 md:px-8 py-32 md:py-48 overflow-hidden">
      {/* Background oversized word */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none opacity-[0.02] select-none z-0">
        <div className="display text-[20vw] font-bold leading-none tracking-tighter whitespace-nowrap">
          STRUCTURE
        </div>
      </div>

      <div className="mx-auto max-w-[var(--width-standard)] relative z-10">
        {/* Header Label */}
        <div className="flex justify-center mb-16">
          <p className="mono text-[10px] tracking-[0.3em] text-[var(--color-text-muted)] border border-[var(--color-border-base)] rounded-full px-4 py-2">
            {r("eyebrow", "Point of View")}
          </p>
        </div>

        {/* Giant Statement */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="display text-4xl sm:text-6xl md:text-8xl leading-[1.05] tracking-[-0.03em] max-w-4xl mx-auto"
          >
            <span className="text-[var(--color-text-primary)]">A brand does not need to </span>
            <span className="italic text-[var(--color-text-muted)]">shout</span>
            <span className="text-[var(--color-text-primary)]"> to be noticed.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="mt-10 md:mt-16 text-lg md:text-2xl text-[var(--color-accent-hover)] font-medium max-w-2xl mx-auto leading-relaxed"
          >
            It needs structure, clarity, and memory.
          </motion.div>
        </div>

        {/* Principles as a Philosophical System */}
        <div className="mt-32 md:mt-48 pt-16 border-t border-[var(--color-border-subtle)]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
            <div className="md:col-span-4">
              <h3 className="display text-3xl tracking-[-0.02em] text-[var(--color-text-primary)]">
                The Foundation
              </h3>
              <p className="mt-4 text-[15px] text-[var(--color-text-secondary)] leading-relaxed max-w-sm">
                Visual intelligence requires discipline. These four pillars guide every creative
                decision, ensuring the output is not just beautiful, but strategically inevitable.
              </p>
            </div>

            <div className="md:col-span-8 md:col-start-6">
              <div className="flex flex-col">
                {principles.map((item, index) => (
                  <motion.div
                    key={item.key}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className={clsx(
                      "group py-8 md:py-10 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-12",
                      index !== principles.length - 1
                        ? "border-b border-[var(--color-border-subtle)]"
                        : "",
                    )}
                  >
                    <div className="mono text-[11px] tracking-[0.2em] text-[var(--color-text-muted)] shrink-0 w-8">
                      {item.meta}
                    </div>
                    <div className="display text-3xl md:text-5xl text-[var(--color-text-primary)] tracking-[-0.02em] md:w-1/3 transition-colors group-hover:text-[var(--color-accent-hover)]">
                      {item.key}
                    </div>
                    <div className="text-[15px] text-[var(--color-text-secondary)] leading-relaxed md:w-2/3">
                      {item.value}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

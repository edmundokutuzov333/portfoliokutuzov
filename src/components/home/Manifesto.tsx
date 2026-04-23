import { motion } from "framer-motion";

const principles = [
  { key: "Clarity", value: "Idea before aesthetic.", meta: "01 / Strategy" },
  { key: "Rhythm", value: "Hierarchy, pause, tension.", meta: "02 / Composition" },
  { key: "Precision", value: "Every detail has a function.", meta: "03 / System" },
  { key: "Memory", value: "Recognition, on every touchpoint.", meta: "04 / Impact" },
];

export function Manifesto() {
  return (
    <section className="relative px-5 py-28 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="relative">
            <p className="mono text-[10px] font-medium tracking-[0.28em] text-sky-300/75">
              Manifesto
            </p>

            <div className="mt-8 hidden max-w-[260px] border-l border-white/[0.08] pl-5 lg:block">
              <p className="mono text-[10px] leading-5 tracking-[0.22em] text-slate-500">
                Strategy / Form / Motion / Identity Systems
              </p>
            </div>
          </div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="display max-w-5xl text-[38px] leading-[0.96] tracking-[-0.035em] text-slate-100 sm:text-5xl md:text-7xl"
            >
              <span className="text-metal">A brand doesn’t need to take up</span>{" "}
              <span className="text-sky-200">more space.</span>{" "}
              <span className="text-metal">It needs to occupy</span>{" "}
              <span className="text-slate-500">memory.</span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
              className="mt-12 h-px origin-left bg-gradient-to-r from-sky-300/80 via-blue-500/35 to-transparent"
            />

            <div className="mt-12 grid gap-8 md:grid-cols-2 md:gap-14">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.08, duration: 0.7 }}
                className="text-[15px] leading-7 text-slate-400 md:text-base"
              >
                I treat brands as decision systems: strategy translated into
                form, rhythm, contrast, typography and behaviour. Every element
                has to justify its own existence — from the first mark to the
                last touchpoint.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.16, duration: 0.7 }}
                className="text-[15px] leading-7 text-slate-400 md:text-base"
              >
                The process combines strategic thinking, editorial composition
                and technical precision. Strict grids, controlled ruptures, cool
                contrast and visual systems built to grow without losing
                identity.
              </motion.p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.08, duration: 0.75 }}
          className="mt-16 grid grid-cols-1 overflow-hidden border border-white/[0.08] bg-white/[0.02] sm:grid-cols-2 lg:grid-cols-4"
        >
          {principles.map((item) => (
            <div
              key={item.key}
              className="group relative min-h-[170px] border-b border-white/[0.08] bg-[#01040A]/90 p-5 transition duration-300 hover:bg-[#06111F]/95 sm:border-r lg:border-b-0"
            >
              <div className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r from-sky-300/70 to-transparent transition duration-500 group-hover:scale-x-100" />

              <div className="mono text-[10px] font-medium tracking-[0.24em] text-slate-600 transition group-hover:text-sky-300/80">
                {item.meta}
              </div>

              <div className="mt-12">
                <div className="mono text-[11px] font-medium tracking-[0.26em] text-sky-200/80">
                  {item.key}
                </div>
                <div className="mt-3 max-w-[14rem] text-sm leading-6 text-slate-300">
                  {item.value}
                </div>
              </div>

              <div className="absolute bottom-5 right-5 h-2 w-2 rounded-full border border-sky-300/40 opacity-40 transition group-hover:opacity-100 group-hover:shadow-[0_0_22px_rgba(56,189,248,0.45)]" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

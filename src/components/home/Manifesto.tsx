import { motion } from "framer-motion";

const principles = [
  {
    key: "CLAREZA",
    value: "ideia antes da estética",
    meta: "01 / STRATEGY",
  },
  {
    key: "RITMO",
    value: "hierarquia, pausa e tensão",
    meta: "02 / COMPOSITION",
  },
  {
    key: "PRECISÃO",
    value: "cada detalhe tem função",
    meta: "03 / SYSTEM",
  },
  {
    key: "MEMÓRIA",
    value: "presença visual consistente",
    meta: "04 / IMPACT",
  },
];

export function Manifesto() {
  return (
    <section className="relative px-5 py-28 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-16">
          <div className="relative">
            <p className="mono text-[10px] font-medium tracking-[0.28em] text-sky-300/75">
              /// MANIFESTO — N° 02
            </p>

            <div className="mt-8 hidden max-w-[260px] border-l border-white/[0.08] pl-5 lg:block">
              <p className="mono text-[10px] leading-5 tracking-[0.22em] text-slate-500">
                STRATEGY / FORM / MOTION / IDENTITY SYSTEMS
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
              <span className="text-metal">A marca não precisa ocupar</span>{" "}
              <span className="text-sky-200">mais espaço.</span>{" "}
              <span className="text-metal">Precisa ocupar melhor a</span>{" "}
              <span className="text-slate-500">memória.</span>
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
                Trabalho marcas como sistemas de decisão: estratégia traduzida
                em forma, ritmo, contraste, tipografia e comportamento. Cada
                elemento precisa justificar a própria existência, do primeiro
                traço ao último ponto de contacto.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: 0.16, duration: 0.7 }}
                className="text-[15px] leading-7 text-slate-400 md:text-base"
              >
                O processo combina pensamento estratégico, composição editorial
                e precisão técnica. Grelhas rígidas, rupturas controladas,
                contraste frio e sistemas visuais preparados para crescer sem
                perder identidade.
              </motion.p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ delay: 0.08, duration: 0.75 }}
          className="mt-16 grid grid-cols-1 overflow-hidden border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4"
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
                <div className="mt-3 max-w-[12rem] text-sm leading-6 text-slate-300">
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

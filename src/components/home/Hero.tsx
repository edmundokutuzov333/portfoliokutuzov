import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Send } from "lucide-react";

const capabilities = [
  "Direção de Arte",
  "Identidade Visual",
  "Campanhas",
  "Design Digital",
];

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] items-center px-5 pb-20 pt-32 md:px-8">
      <div className="pointer-events-none absolute inset-x-0 top-24 mx-auto h-px max-w-[1240px] bg-gradient-to-r from-transparent via-sky-300/20 to-transparent" />

      <div className="relative mx-auto w-full max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 flex flex-wrap items-center justify-between gap-4"
        >
          <p className="mono text-[10px] font-medium tracking-[0.28em] text-sky-300/75">
            EDMUNDO / DESIGNER & ART DIRECTOR
          </p>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_18px_rgba(125,211,252,0.7)]" />
            Disponível para projetos selecionados
          </div>
        </motion.div>

        <div className="grid items-end gap-12 lg:grid-cols-[1fr_340px]">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.08, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="display max-w-6xl text-[48px] font-semibold leading-[0.9] tracking-[-0.045em] text-slate-100 sm:text-[72px] md:text-[104px] lg:text-[126px]"
            >
              <span className="text-metal">Design visual</span>
              <br />
              <span className="text-metal">para marcas</span>
              <br />
              <span className="text-sky-200">memoráveis.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7 }}
              className="mt-8 max-w-2xl text-[15px] leading-7 text-slate-400 md:text-lg md:leading-8"
            >
              Identidades visuais, direção de arte, campanhas e experiências
              digitais construídas com clareza estratégica, precisão técnica e
              presença visual.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.46, duration: 0.7 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3.5 text-sm font-semibold text-[#01040A] transition duration-300 hover:bg-sky-200 hover:shadow-[0_0_42px_rgba(56,189,248,0.22)] focus:outline-none focus:ring-2 focus:ring-sky-300/70 focus:ring-offset-2 focus:ring-offset-[#01040A]"
              >
                Ver portfolio
                <ArrowUpRight
                  size={16}
                  strokeWidth={1.8}
                  className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slate-300 transition duration-300 hover:border-sky-300/35 hover:bg-sky-300/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/60 focus:ring-offset-2 focus:ring-offset-[#01040A]"
              >
                Enviar briefing
                <Send
                  size={15}
                  strokeWidth={1.8}
                  className="transition duration-300 group-hover:translate-x-0.5"
                />
              </Link>
            </motion.div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.38, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden border-l border-white/[0.08] pl-6 lg:pl-8"
          >
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-400/[0.08] blur-3xl"
            />

            <p className="mono text-[10px] font-medium tracking-[0.26em] text-slate-500">
              CORE PRACTICE
            </p>

            <div className="mt-6 space-y-3">
              {capabilities.map((item, index) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-6 border-b border-white/[0.07] pb-3"
                >
                  <span className="text-sm text-slate-300">{item}</span>
                  <span className="mono text-[10px] tracking-[0.18em] text-slate-600">
                    0{index + 1}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="mono text-[10px] font-medium tracking-[0.24em] text-slate-500">
                BASED IN
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Maputo · São Paulo · Remote
              </p>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

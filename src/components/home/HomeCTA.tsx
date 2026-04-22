import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowUpRight, Mail, MessageSquare } from "lucide-react";

export function HomeCTA() {
  return (
    <section className="relative px-5 py-28 md:px-8 md:py-32">
      <div className="mx-auto max-w-[1240px]">
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-[#030814] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] sm:p-8 md:p-14 lg:p-16"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(780px circle at 82% 18%, rgba(29,155,255,0.16), transparent 58%), radial-gradient(620px circle at 12% 88%, rgba(109,220,255,0.09), transparent 62%), linear-gradient(135deg, rgba(255,255,255,0.055), transparent 38%)",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(148,163,184,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.22) 1px, transparent 1px)",
              backgroundSize: "72px 72px",
              maskImage:
                "radial-gradient(circle at 70% 35%, black, transparent 68%)",
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-sky-300/10"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-sky-300/15"
          />

          <div className="relative grid gap-12 lg:grid-cols-[1fr_320px] lg:items-end">
            <div>
              <p className="mono text-[10px] font-medium tracking-[0.28em] text-sky-300/75">
                /// COLABORAÇÃO — N° 04
              </p>

              <h2 className="display mt-6 max-w-4xl text-4xl leading-[0.98] tracking-[-0.035em] text-slate-100 sm:text-5xl md:text-7xl">
                <span className="text-metal">
                  Vamos construir uma presença visual
                </span>{" "}
                <span className="text-sky-200">precisa, memorável</span>{" "}
                <span className="text-slate-500">e impossível de ignorar.</span>
              </h2>

              <div className="mt-10 flex flex-wrap items-center gap-3">
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 rounded-full bg-slate-100 px-6 py-3.5 text-sm font-semibold text-[#01040A] transition duration-300 hover:bg-sky-200 hover:shadow-[0_0_42px_rgba(56,189,248,0.24)] focus:outline-none focus:ring-2 focus:ring-sky-300/70 focus:ring-offset-2 focus:ring-offset-[#030814]"
                >
                  <MessageSquare size={16} strokeWidth={1.8} />
                  Começar conversa
                  <ArrowUpRight
                    size={16}
                    strokeWidth={1.8}
                    className="transition duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>

                <a
                  href="mailto:edmundo@studio.com"
                  className="group inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-5 py-3.5 text-sm text-slate-300 transition duration-300 hover:border-sky-300/35 hover:bg-sky-300/[0.06] hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-300/60 focus:ring-offset-2 focus:ring-offset-[#030814]"
                >
                  <Mail size={16} strokeWidth={1.8} />
                  edmundo@studio.com
                </a>
              </div>
            </div>

            <div className="relative border-t border-white/[0.08] pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
              <div className="mono text-[10px] font-medium tracking-[0.24em] text-slate-500">
                PROJECT INTAKE
              </div>

              <div className="mt-6 space-y-4">
                {[
                  ["STATUS", "Available for selected projects"],
                  ["LOCATION", "Maputo · Remote"],
                  ["RESPONSE", "Within 24–48h"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-5 border-b border-white/[0.07] pb-4"
                  >
                    <span className="mono text-[10px] tracking-[0.2em] text-slate-600">
                      {label}
                    </span>
                    <span className="max-w-[180px] text-right text-sm leading-5 text-slate-300">
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_20px_rgba(125,211,252,0.75)]" />
                <span className="mono text-[10px] tracking-[0.22em] text-slate-500">
                  CONTROLLED VISUAL SYSTEMS
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

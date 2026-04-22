import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Send } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-32 pb-20 px-5 md:px-8">
      <div className="max-w-[1240px] mx-auto relative">
        {/* Top bar with editorial coordinates */}
        <div className="flex items-start justify-between mono text-[10px] text-[var(--color-text-ghost)]">
          <div className="space-y-1">
            <div>N° 001 — INDEX</div>
            <div>EDMUNDO / DESIGNER &amp; ART DIRECTOR</div>
          </div>
          <div className="text-right space-y-1">
            <div>LAT -25.9692</div>
            <div>LON +32.5732</div>
            <div>VOL. XII / 2026</div>
          </div>
        </div>

        {/* Microcopy line */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-14 mono text-[11px] text-[var(--color-acc-cyan)]"
        >
          BRAND IDENTITY &nbsp;/&nbsp; EDITORIAL SYSTEMS &nbsp;/&nbsp; DIGITAL ART DIRECTION
        </motion.div>

        {/* Main headline + sidecar grid */}
        <div className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[112px] leading-[0.92] font-semibold tracking-[-0.02em]"
            >
              <span className="text-metal">Design systems</span>
              <br />
              <span className="text-metal">for brands that</span>
              <br />
              <span className="italic font-medium text-acid">refuse</span>{" "}
              <span className="text-metal">to look</span>
              <br />
              <span className="text-metal">ordinary.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10 max-w-xl text-[15px] md:text-base text-[var(--color-text-muted)] leading-relaxed"
            >
              Identidades visuais, direção de arte e experiências digitais para
              marcas que querem ser lembradas. Sistemas construídos com
              precisão, contraste e ritmo editorial.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-3 text-sm font-semibold hover:bg-[var(--color-acc-acid)] transition"
              >
                Ver portfolio
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium hover:border-[var(--color-acc-cyan)] hover:text-[var(--color-acc-cyan)] transition"
              >
                Enviar briefing <Send size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Sidecar */}
          <motion.aside
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="col-span-12 lg:col-span-3 lg:pl-6 lg:border-l border-white/8"
          >
            <div className="mono text-[10px] text-[var(--color-text-ghost)]">
              /// CURRENT STATUS
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-acc-acid)] opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-acc-acid)]" />
              </span>
              Available for selected projects
            </div>
            <div className="mt-6 space-y-2 text-sm text-[var(--color-text-muted)]">
              <div>Maputo · São Paulo · Remote</div>
              <div className="display text-3xl text-white">2026</div>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-3">
              {["08", "120+", "16", "03"].map((n, i) => (
                <div key={n} className="border border-white/8 p-3 rounded-md">
                  <div className="display text-xl">{n}</div>
                  <div className="mono text-[9px] text-[var(--color-text-ghost)] mt-1">
                    {["YEARS", "PROJECTS", "SECTORS", "CONTINENTS"][i]}
                  </div>
                </div>
              ))}
            </div>
          </motion.aside>
        </div>

        {/* Bottom hairline data */}
        <div className="mt-20 pt-6 border-t border-white/8 grid grid-cols-2 md:grid-cols-4 gap-4 mono text-[10px] text-[var(--color-text-ghost)]">
          <div>FRAME 001 / 004</div>
          <div>FORMAT — EDITORIAL</div>
          <div>GRID — 12 COL · 24PX</div>
          <div className="md:text-right">SCROLL ↓</div>
        </div>
      </div>
    </section>
  );
}

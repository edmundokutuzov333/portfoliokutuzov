import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Send } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] pt-32 pb-20 px-5 md:px-8">
      <div className="max-w-[1240px] mx-auto relative">
        {/* Top bar */}
        <div className="flex items-start justify-between mono text-[10px] tracking-[0.22em] text-slate-500">
          <div>Edmundo Kutuzov — Art Director</div>
          <div className="text-right">Maputo · Mozambique</div>
        </div>

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-14 mono text-[11px] tracking-[0.24em] text-sky-300/85"
        >
          Brand Identity · Art Direction · Campaign Design
        </motion.div>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
              className="display text-[44px] sm:text-[64px] md:text-[88px] lg:text-[108px] leading-[0.94] font-semibold tracking-[-0.025em]"
            >
              <span className="text-metal">I make ideas</span>
              <br />
              <span className="text-metal">stop, take notice,</span>
              <br />
              <span className="italic font-medium text-accent">and act.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10 max-w-xl text-[15px] md:text-base text-slate-400 leading-relaxed"
            >
              I’m Edmundo Kutuzov, an art director rooted in Mozambique’s
              creative ecosystem. I design visual identities and communication
              pieces that capture attention and drive action — blending
              storytelling, visual hierarchy, and typographic craft.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-slate-100 text-[#01040A] px-5 py-3 text-sm font-semibold hover:bg-sky-200 transition"
              >
                I’m ready for the immersion!
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-3 text-sm font-medium text-slate-200 hover:border-sky-300/50 hover:text-sky-200 transition"
              >
                View Portfolio <Send size={14} />
              </Link>
            </motion.div>
          </div>

          {/* Sidecar */}
          <motion.aside
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="col-span-12 lg:col-span-3 lg:pl-6 lg:border-l border-white/[0.08]"
          >
            <div className="mono text-[10px] tracking-[0.24em] text-slate-500">
              Current Status
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-sky-300 opacity-60 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-300" />
              </span>
              Available for selected projects
            </div>
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <div>Maputo · Remote</div>
              <div className="display text-2xl text-white mt-3">2026</div>
            </div>

            <div className="mt-10 space-y-3">
              <div className="mono text-[10px] tracking-[0.22em] text-slate-500">
                Disciplines
              </div>
              <ul className="space-y-2 text-[13px] text-slate-300">
                <li>Art Direction</li>
                <li>Brand Identity</li>
                <li>Campaign Design</li>
                <li>Audiovisual Direction</li>
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}

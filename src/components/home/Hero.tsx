import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteData";
import { readSetting } from "@/lib/cms";
import { ShinyButton } from "@/components/ui/shiny-button";

const EASE_EDITORIAL = [0.16, 1, 0.3, 1];

export function Hero() {
  const { data: settings } = useSiteSettings();
  const r = <T,>(f: string, fb: T) => readSetting<T>(settings, "hero", f, fb);
  return (
    <section className="relative pt-12 pb-20 px-4 md:px-8 flex flex-col justify-center bg-[var(--color-bg)]">
      <div className="max-w-[var(--width-wide)] mx-auto w-full relative z-10">
        {/* Stage 1: Identity metadata */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_EDITORIAL }}
          className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-muted)] mb-12 md:mb-16"
        >
          {r("top_left", "Edmundo Kutuzov · Art Director")}
        </motion.div>

        {/* Core Statement */}
        <div className="max-w-[1200px]">
          <h1 className="display text-[clamp(2.5rem,6vw+1rem,8rem)] leading-[0.95] font-medium tracking-[-0.03em]">
            {/* Stage 2: Main headline line by line */}
            <span className="block overflow-hidden pb-1">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: EASE_EDITORIAL }}
                className="block text-[var(--color-text-muted)] text-[clamp(1.5rem,4vw+1rem,4.5rem)] mb-2"
              >
                {r("title_1", "I shape ideas that")}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: EASE_EDITORIAL }}
                className="block text-[var(--color-text-primary)]"
              >
                {r("title_2", "cut through noise,")}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.2, ease: EASE_EDITORIAL }}
                className="block text-[var(--color-text-primary)]"
              >
                {r("title_3", "stay in memory,")}
              </motion.span>
            </span>

            {/* Stage 3: Accent phrase */}
            <span className="block overflow-hidden pb-2">
              <motion.span
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.35, ease: EASE_EDITORIAL }}
                className="block text-[var(--color-accent-base)] italic pr-4"
              >
                {r("title_accent", "and move people.")}
              </motion.span>
            </span>
          </h1>
        </div>

        {/* Lower section */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
          {/* Stage 4: Body copy */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: EASE_EDITORIAL }}
            className="md:col-span-5 lg:col-span-4"
          >
            <p className="text-[16px] md:text-[18px] text-[var(--color-text-secondary)] leading-relaxed">
              {r(
                "subtitle",
                "Building visual systems, digital products, and campaigns that establish authority on an international scale.",
              )}
            </p>
          </motion.div>

          {/* Stage 5 & 6: CTAs & Status */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: EASE_EDITORIAL }}
            className="md:col-span-7 lg:col-span-8 flex flex-col sm:flex-row items-start sm:items-center justify-end gap-6 sm:gap-8"
          >
            {/* Availability */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.65, ease: EASE_EDITORIAL }}
              className="flex items-center gap-3"
            >
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="mono text-[10px] tracking-[0.2em] uppercase text-[var(--color-text-secondary)]">
                {r("status", "Available for projects")}
              </span>
            </motion.div>

            <div className="flex items-center gap-4">
              <ShinyButton to="/portfolio">{r("cta_primary", "Explore work")}</ShinyButton>
              <Link
                to="/contact"
                className="group flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-border-base)] bg-[var(--color-surface)] text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-hover)] hover:bg-[var(--color-accent-subtle)]"
                aria-label="Start a project"
              >
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-[2px] group-hover:-translate-y-[2px]"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

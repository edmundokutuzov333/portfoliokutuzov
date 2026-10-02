import { createFileRoute } from "@tanstack/react-router";
import { PortfolioArchive } from "@/components/portfolio/PortfolioArchive";
import { motion } from "framer-motion";
import { createSeo } from "@/lib/seo";
import { z } from "zod";

export type PortfolioSearch = { category?: string; q?: string };
const portfolioSearchSchema = z.object({ category: z.string().optional(), q: z.string().optional() });

export const Route = createFileRoute("/portfolio/")({
  validateSearch: portfolioSearchSchema,
  head: () => createSeo({
    title: "Portfolio - Edmundo Kutuzov",
    description: "Selected art direction, brand identity and campaign work by Edmundo Kutuzov, art director based in Maputo, Mozambique.",
    path: "/portfolio",
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <section className="relative px-4 pt-48 pb-32 md:px-8" aria-labelledby="portfolio-title">
      <div className="mx-auto max-w-[var(--width-wide)]">
        <div className="mb-16 flex items-start justify-between mono text-[10px] uppercase tracking-[.2em] text-[var(--color-text-muted)]">
          <div>Archive</div>
          <div aria-label="Archive years">2018—2026</div>
        </div>
        <motion.h1
          id="portfolio-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="display text-[clamp(3rem,8vw+1rem,9rem)] leading-[.95] tracking-[-0.03em] text-[var(--color-text-primary)]"
        >
          Selected Work.
        </motion.h1>
        <div className="mt-20 md:mt-32">
          <PortfolioArchive />
        </div>
      </div>
    </section>
  );
}

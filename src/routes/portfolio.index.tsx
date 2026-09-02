import { createFileRoute } from "@tanstack/react-router";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { motion } from "framer-motion";

export type PortfolioSearch = {
  category?: string;
  q?: string;
};

export const Route = createFileRoute("/portfolio/")({
  validateSearch: (search: Record<string, unknown>): PortfolioSearch => ({
    category: typeof search.category === "string" && search.category ? search.category : undefined,
    q: typeof search.q === "string" && search.q ? search.q : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Portfolio - Edmundo Kutuzov" },
      {
        name: "description",
        content:
          "Selected art direction, brand identity and campaign work by Edmundo Kutuzov, art director based in Maputo, Mozambique.",
      },
      { property: "og:title", content: "Portfolio - Edmundo Kutuzov" },
      {
        property: "og:description",
        content: "A curated selection of campaigns, identities and visual systems.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <section className="relative px-4 md:px-8 pt-48 pb-32 bg-[var(--color-bg)]">
      <div className="max-w-[var(--width-wide)] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between mono text-[10px] tracking-[0.2em] text-[var(--color-text-muted)] uppercase mb-16"
        >
          <div>Archive</div>
          <div>2018—2026</div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="display text-[clamp(3rem,8vw+1rem,9rem)] leading-[0.95] tracking-[-0.03em] text-[var(--color-text-primary)]"
        >
          Selected Work.
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 md:mt-32"
        >
          <PortfolioGrid />
        </motion.div>
      </div>
    </section>
  );
}

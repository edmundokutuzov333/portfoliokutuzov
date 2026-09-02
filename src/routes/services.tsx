import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { ServicesInteractive } from "@/components/services/ServicesInteractive";
import { motion } from "framer-motion";

export const Route = createFileRoute("/services")({
  head: () => ({
    links: [{ rel: "canonical", href: "https://portfoliokutuzov.lovable.app/services" }],
    meta: [
      { property: "og:url", content: "https://portfoliokutuzov.lovable.app/services" },
      { title: "Capabilities - Edmundo Kutuzov" },
      {
        name: "description",
        content:
          "Capabilities and visual disciplines: art direction, brand identity, campaign design, and digital systems by Edmundo Kutuzov.",
      },
      { property: "og:title", content: "Capabilities - Edmundo Kutuzov" },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <div className="bg-[var(--color-bg)] min-h-screen">
      <section className="relative px-4 md:px-8 pt-44 md:pt-48 pb-12 md:pb-16 overflow-hidden">
        <div className="max-w-[var(--width-wide)] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-start justify-between mono text-[10px] tracking-[0.28em] text-sky-300/75 uppercase mb-12"
          >
            <div>Methodology · Practice</div>
            <div>Capabilities</div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="display text-[clamp(2.75rem,7vw+1rem,7.5rem)] leading-[0.96] tracking-[-0.025em] text-[var(--color-text-primary)] max-w-5xl"
          >
            Visual capabilities &amp;{" "}
            <span className="italic text-sky-300 font-normal">disciplines.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mt-8 max-w-2xl text-[16px] md:text-lg text-[var(--color-text-secondary)] leading-relaxed"
          >
            The core disciplines used to construct enduring brand identities, direct high-impact
            campaigns, and engineer modular digital systems. Hover each discipline to inspect
            relevant case studies.
          </motion.p>
        </div>
      </section>

      <ServicesInteractive />

      <section className="relative px-4 md:px-8 py-32 border-t border-[var(--color-border-subtle)]">
        <div className="max-w-[var(--width-standard)] mx-auto">
          <div className="text-center">
            <h2 className="display text-4xl md:text-6xl mt-8 max-w-3xl mx-auto leading-[1.05] tracking-[-0.02em]">
              <span className="text-[var(--color-text-primary)]">
                Tell me about your brand and{" "}
              </span>
              <span className="italic text-[var(--color-accent-hover)]">let's get to work.</span>
            </h2>
            <div className="mt-16 flex justify-center">
              <Link
                to="/contact"
                className="group flex h-14 items-center gap-3 rounded-full bg-[var(--color-text-primary)] px-8 text-[15px] font-semibold text-[var(--color-bg)] transition-all hover:bg-sky-300 hover:text-black focus:outline-none"
              >
                Send a project brief
                <ArrowUpRight
                  size={18}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

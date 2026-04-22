import { createFileRoute } from "@tanstack/react-router";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Edmundo" },
      {
        name: "description",
        content:
          "Selected visual systems, campaigns and editorial experiments por Edmundo.",
      },
      { property: "og:title", content: "Portfolio — Edmundo" },
      {
        property: "og:description",
        content: "Sistemas visuais, campanhas e experiências editoriais.",
      },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <section className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-start justify-between mono text-[10px] text-[var(--color-text-ghost)]">
          <div>N° 002 — INDEX</div>
          <div>VOL. XII / 2026</div>
        </div>
        <h1 className="display text-5xl md:text-7xl mt-6 leading-[0.98] tracking-[-0.02em] text-metal">
          Portfolio.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] text-[var(--color-text-muted)] leading-relaxed">
          Selected visual systems, campaigns and editorial experiments —
          construídos entre direção de arte, identidade e linguagem digital.
        </p>
        <div className="mt-12 border-t border-white/8 pt-10">
          <PortfolioGrid />
        </div>
      </div>
    </section>
  );
}

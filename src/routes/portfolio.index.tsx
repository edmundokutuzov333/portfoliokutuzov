import { createFileRoute } from "@tanstack/react-router";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";

export const Route = createFileRoute("/portfolio/")({
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
    <section className="relative px-5 md:px-8 pt-36 pb-24">
      <div className="max-w-[1240px] mx-auto">
        <div className="flex items-start justify-between mono text-[10px] tracking-[0.22em] text-slate-500">
          <div>Portfolio</div>
          <div>Selected work</div>
        </div>
        <h1 className="display text-5xl md:text-7xl mt-6 leading-[0.98] tracking-[-0.02em] text-metal">
          Selected work.
        </h1>
        <p className="mt-5 max-w-xl text-[15px] text-slate-400 leading-relaxed">
          A curated selection of campaigns, brand identity work and visual systems developed for
          local and international clients across Mozambique and beyond.
        </p>
        <div className="mt-12 border-t border-white/[0.08] pt-10">
          <PortfolioGrid />
        </div>
      </div>
    </section>
  );
}

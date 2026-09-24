import { createFileRoute } from "@tanstack/react-router";
import { PortfolioArchive } from "@/components/portfolio/PortfolioArchive";
import { createSeo } from "@/lib/seo";
import { z } from "zod";

const portfolioSearchSchema = z.object({
  view: z.enum(["grid", "index"]).optional(),
  d: z.string().optional(),
  y: z.string().optional(),
  c: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/portfolio/")({
  validateSearch: portfolioSearchSchema,
  head: () =>
    createSeo({
      title: "Portfolio - Edmundo Kutuzov",
      description:
        "Selected art direction, brand identity and campaign work by Edmundo Kutuzov, art director based in Maputo, Mozambique.",
      path: "/portfolio",
    }),
  component: PortfolioPage,
});

function PortfolioPage() {
  return (
    <section
      data-tone="betao"
      className="relative bg-[#d6d4ce] px-4 pb-28 pt-28 text-black md:px-8 md:pt-40"
      aria-labelledby="portfolio-title"
    >
      <div className="mx-auto max-w-[1600px]">
        <h1
          id="portfolio-title"
          className="font-cartaz text-[clamp(4rem,11vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.07em]"
        >
          Selected Work.
        </h1>
        <p className="mt-6 max-w-2xl font-livro text-xl leading-[1.55] text-[#3f3e3b]">
          The archive of published work, filtered by discipline, year, client and search.
        </p>
        <div className="mt-12">
          <PortfolioArchive />
        </div>
      </div>
    </section>
  );
}

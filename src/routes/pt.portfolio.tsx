import { createFileRoute } from "@tanstack/react-router";
import { PortfolioPage } from "@/routes/portfolio";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/pt/portfolio")({
  head: () => createSeo({
    title: "Portfolio - Edmundo Kutuzov",
    description: "Selected art direction, brand identity and campaign work by Edmundo Kutuzov.",
    path: "/pt/portfolio",
  }),
  component: PortfolioPage,
});

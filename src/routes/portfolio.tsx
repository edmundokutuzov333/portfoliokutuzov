import { createFileRoute, Navigate } from "@tanstack/react-router";
import { z } from "zod";

const portfolioSearchSchema = z.object({ category: z.string().optional(), q: z.string().optional() });

export const Route = createFileRoute("/portfolio")({
  validateSearch: portfolioSearchSchema,
  head: () => ({
    meta: [
      { title: "Portfolio - Edmundo Kutuzov" },
      { name: "robots", content: "index,follow" },
    ],
  }),
  component: PortfolioCompatibilityRoute,
});

function PortfolioCompatibilityRoute() {
  const search = Route.useSearch();
  return <Navigate to="/portfolio/" search={search} replace />;
}

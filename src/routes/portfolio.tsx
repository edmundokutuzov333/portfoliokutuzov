import { createFileRoute } from "@tanstack/react-router";
import { createSeo } from "@/lib/seo";
import { z } from "zod";

const portfolioSearchSchema = z.object({
  view: z.enum(["grid", "index"]).optional(),
  d: z.string().optional(),
  y: z.string().optional(),
  c: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/portfolio")({
  validateSearch: portfolioSearchSchema,
  head: () =>
    createSeo({
      title: "Portfolio - Edmundo Kutuzov",
      description:
        "Selected art direction, brand identity and campaign work by Edmundo Kutuzov, art director based in Maputo, Mozambique.",
      path: "/portfolio",
    }),
});

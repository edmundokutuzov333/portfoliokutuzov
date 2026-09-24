import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "@/routes/index";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/pt")({
  head: () => createSeo({
    title: "Edmundo Kutuzov - Art Director",
    description: "Edmundo Kutuzov is an art director based in Maputo, Mozambique.",
    path: "/pt",
  }),
  component: HomePage,
});

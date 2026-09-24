import { createFileRoute } from "@tanstack/react-router";
import { ServicesPage } from "@/routes/services";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/pt/services")({
  head: () => createSeo({
    title: "Capabilities - Edmundo Kutuzov",
    description: "Capabilities and visual disciplines by Edmundo Kutuzov.",
    path: "/pt/services",
  }),
  component: ServicesPage,
});

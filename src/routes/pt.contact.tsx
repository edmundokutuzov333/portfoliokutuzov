import { createFileRoute } from "@tanstack/react-router";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/pt/contact")({
  head: () => createSeo({
    title: "Contact - Edmundo Kutuzov",
    description: "Smart project briefing for new collaborations with Edmundo Kutuzov.",
    path: "/pt/contact",
  }),
});

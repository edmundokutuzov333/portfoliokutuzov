import { createFileRoute } from "@tanstack/react-router";
import { StudioLanding } from "@/routes/studio";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/pt/studio")({
  head: () => createSeo({
    title: "Kutuzov Studio | Edmundo Kutuzov",
    description: "Kutuzov Studio is being composed privately, line by line.",
    path: "/pt/studio",
  }),
  component: StudioLanding,
});

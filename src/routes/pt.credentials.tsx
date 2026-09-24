import { createFileRoute } from "@tanstack/react-router";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/pt/credentials")({
  head: () => createSeo({
    title: "The Credentials - Edmundo Kutuzov",
    description: "Experience, skills and selected brands worked with by Edmundo Kutuzov.",
    path: "/pt/credentials",
  }),
});

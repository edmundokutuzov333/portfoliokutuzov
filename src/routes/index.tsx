import { createFileRoute } from "@tanstack/react-router";
import { HomePhase5 } from "@/components/home/HomePhase5";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    createSeo({
      title: "Edmundo Kutuzov - Art Director",
      description:
        "Edmundo Kutuzov is an art director based in Maputo, Mozambique. Visual identities, art direction and campaign design for brands that want to be remembered.",
      path: "/",
    }),
  component: HomePage,
});

export function HomePage() {
  return <HomePhase5 />;
}

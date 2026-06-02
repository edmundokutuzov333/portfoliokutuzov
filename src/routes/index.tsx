import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Credentials } from "@/components/home/Credentials";
import { HomeCTA } from "@/components/home/HomeCTA";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { StudiosSection } from "@/components/home/StudiosSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Edmundo Kutuzov - Art Director" },
      {
        name: "description",
        content:
          "Edmundo Kutuzov is an art director based in Maputo, Mozambique. Visual identities, art direction and campaign design for brands that want to be remembered.",
      },
      { property: "og:title", content: "Edmundo Kutuzov - Art Director" },
      {
        property: "og:description",
        content:
          "Visual identities, art direction and campaign design built with strategic clarity and typographic craft.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedWork />
      <ClientLogos />
      <StudiosSection />
      <Credentials />
      <HomeCTA />
    </>
  );
}

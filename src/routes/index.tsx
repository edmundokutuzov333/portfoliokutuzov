import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { CinematicPortfolioReel } from "@/components/ui/cinematic-portfolio-reel";
import { CapabilitiesShort } from "@/components/home/CapabilitiesShort";
import { ClientLogos } from "@/components/home/ClientLogos";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HomeCTA } from "@/components/home/HomeCTA";

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
      <CinematicPortfolioReel />
      <Hero />
      <CapabilitiesShort />
      <ClientLogos />
      <HomeExperience />
      <HomeCTA />
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { DeferredReel } from "@/components/home/DeferredReel";
import { CapabilitiesShort } from "@/components/home/CapabilitiesShort";
import { ClientLogos } from "@/components/home/ClientLogos";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HomeCTA } from "@/components/home/HomeCTA";
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

function HomePage() {
  return (
    <>
      <Hero />
      <DeferredReel />
      <CapabilitiesShort />
      <ClientLogos />
      <HomeExperience />
      <HomeCTA />
    </>
  );
}

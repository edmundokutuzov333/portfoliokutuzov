import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/home/Hero";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Manifesto } from "@/components/home/Manifesto";
import { Services } from "@/components/home/Services";
import { HomeCTA } from "@/components/home/HomeCTA";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Edmundo — Designer & Art Director" },
      {
        name: "description",
        content:
          "Identidades visuais, direção de arte e experiências digitais para marcas que querem ser lembradas.",
      },
      { property: "og:title", content: "Edmundo — Designer & Art Director" },
      {
        property: "og:description",
        content: "Sistemas visuais editoriais, futuristas e autorais.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <Manifesto />
      <Services />
      <HomeCTA />
    </>
  );
}

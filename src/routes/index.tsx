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
      { property: "og:url", content: "https://portfoliokutuzov.lovable.app/" },
    ],
    links: [{ rel: "canonical", href: "https://portfoliokutuzov.lovable.app/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": "https://portfoliokutuzov.lovable.app/#person",
              name: "Edmundo Kutuzov",
              jobTitle: "Art Director",
              url: "https://portfoliokutuzov.lovable.app/",
              email: "contact@edmundokutuzov.art",
              telephone: "+258 87 601 312 1",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Maputo",
                addressCountry: "MZ",
              },
              knowsAbout: [
                "Art Direction",
                "Brand Identity",
                "Campaign Design",
                "Digital Design",
                "Creative Strategy",
              ],
              sameAs: [
                "https://www.linkedin.com/in/edmundo-kutuzov-3457351b4",
                "https://www.instagram.com/edmundo.kutuzov/",
                "https://www.facebook.com/edmundoku/",
              ],
            },
            {
              "@type": "Organization",
              "@id": "https://portfoliokutuzov.lovable.app/#studio",
              name: "Edmundo Kutuzov",
              url: "https://portfoliokutuzov.lovable.app/",
              founder: { "@id": "https://portfoliokutuzov.lovable.app/#person" },
              areaServed: "Worldwide",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Maputo",
                addressCountry: "MZ",
              },
            },
          ],
        }),
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

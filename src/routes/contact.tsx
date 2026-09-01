import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Edmundo Kutuzov" },
      {
        name: "description",
        content:
          "Smart project briefing for new collaborations with Edmundo Kutuzov, art director in Maputo.",
      },
      { property: "og:title", content: "Contact - Edmundo Kutuzov" },
      { property: "og:description", content: "Smart project briefing for new collaborations." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://portfoliokutuzov.lovable.app/contact" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://portfoliokutuzov.lovable.app/contact" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact - Edmundo Kutuzov",
          url: "https://portfoliokutuzov.lovable.app/contact",
          mainEntity: {
            "@type": "Person",
            "@id": "https://portfoliokutuzov.lovable.app/#person",
            name: "Edmundo Kutuzov",
            email: "contact@edmundokutuzov.art",
            telephone: "+258 87 601 312 1",
            address: {
              "@type": "PostalAddress",
              streetAddress: 'Magoanine "C"',
              addressLocality: "Maputo",
              addressCountry: "MZ",
            },
          },
        }),
      },
    ],
  }),
});
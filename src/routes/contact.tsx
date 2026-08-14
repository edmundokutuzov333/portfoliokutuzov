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
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
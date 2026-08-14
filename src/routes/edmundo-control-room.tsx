import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/edmundo-control-room")({
  head: () => ({
    meta: [
      { title: "Control Room - Edmundo Kutuzov" },
      { name: "description", content: "Private portfolio content management workspace." },
      { property: "og:title", content: "Control Room - Edmundo Kutuzov" },
      { property: "og:description", content: "Private portfolio content management workspace." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});
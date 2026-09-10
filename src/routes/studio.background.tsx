import { createFileRoute } from "@tanstack/react-router";
import { MagnificBackgroundEngine } from "@/components/studio/MagnificBackgroundEngine";

export const Route = createFileRoute("/studio/background")({
  head: () => ({
    meta: [
      { title: "Background Engine - Kutuzov Studio" },
      { name: "description", content: "Generate a professional visual background with the Magnific background engine." },
    ],
  }),
  component: MagnificBackgroundEngine,
});

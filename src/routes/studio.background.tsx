import { createFileRoute, redirect } from "@tanstack/react-router";
import { isStudioPublicEnabled } from "@/lib/studio/public-access";
import { MagnificBackgroundEngine } from "@/components/studio/MagnificBackgroundEngine";

export const Route = createFileRoute("/studio/background")({
  beforeLoad: () => {
    if (!isStudioPublicEnabled()) throw redirect({ to: "/studio" });
  },
  head: () => ({
    meta: [
      { title: "Background Engine - Kutuzov Studio" },
      { name: "description", content: "Generate a professional visual background with the Magnific background engine." },
    ],
  }),
  component: MagnificBackgroundEngine,
});

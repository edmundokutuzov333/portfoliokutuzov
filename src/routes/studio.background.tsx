import { createFileRoute, redirect } from "@tanstack/react-router";
import { MagnificBackgroundEngine } from "@/components/studio/MagnificBackgroundEngine";
import { STUDIO_PUBLIC_ENABLED } from "@/lib/studio/public-launch";

export const Route = createFileRoute("/studio/background")({
  beforeLoad: () => {
    if (!STUDIO_PUBLIC_ENABLED) throw redirect({ to: "/studio" });
  },
  head: () => ({
    meta: [
      { title: "Background Engine - Kutuzov Studio" },
      {
        name: "description",
        content: "Generate a professional visual background with the Magnific background engine.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: MagnificBackgroundEngine,
});

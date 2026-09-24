import { createFileRoute } from "@tanstack/react-router";
import { DesignSystemShowcase } from "@/components/design-system/DesignSystemShowcase";

export const Route = createFileRoute("/admin/design-system")({
  component: DesignSystemShowcase,
  head: () => ({
    meta: [
      { title: "Design System · Kutuzov Control Room" },
      { name: "description", content: "Authenticated design system and motion infrastructure showcase." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

import { createFileRoute, redirect } from "@tanstack/react-router";
import { BusinessCardEditor } from "@/components/studio/BusinessCardEditor";
import { STUDIO_PUBLIC_ENABLED } from "@/lib/studio/public-launch";

export const Route = createFileRoute("/studio/business-card")({
  beforeLoad: () => {
    if (!STUDIO_PUBLIC_ENABLED) throw redirect({ to: "/studio" });
  },
  head: () => ({
    meta: [
      { title: "Business Card Studio - Kutuzov Studio" },
      {
        name: "description",
        content: "Design and edit a professional business card with Kutuzov Studio.",
      },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: BusinessCardEditor,
});

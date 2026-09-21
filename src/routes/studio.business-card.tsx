import { createFileRoute, redirect } from "@tanstack/react-router";
import { isStudioPublicEnabled } from "@/lib/studio/public-access";
import { BusinessCardEditor } from "@/components/studio/BusinessCardEditor";

export const Route = createFileRoute("/studio/business-card")({
  beforeLoad: () => {
    if (!isStudioPublicEnabled()) throw redirect({ to: "/studio" });
  },
  head: () => ({
    meta: [
      { title: "Business Card Studio - Kutuzov Studio" },
      { name: "description", content: "Design and edit a professional business card with Kutuzov Studio." },
    ],
  }),
  component: BusinessCardEditor,
});

import { createFileRoute } from "@tanstack/react-router";
import { BusinessCardEditor } from "@/components/studio/BusinessCardEditor";

export const Route = createFileRoute("/studio/business-card")({
  head: () => ({
    meta: [
      { title: "Business Card Studio - Kutuzov Studio" },
      { name: "description", content: "Design and edit a professional business card with Kutuzov Studio." },
    ],
  }),
  component: BusinessCardEditor,
});

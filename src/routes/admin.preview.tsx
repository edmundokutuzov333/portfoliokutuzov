import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { AdminDraftPreviewPage } from "@/components/admin/Phase4ControlRoom";

const searchSchema = z.object({
  draft: z.string().uuid(),
});

export const Route = createFileRoute("/admin/preview")({
  validateSearch: searchSchema,
  component: PreviewRoute,
  head: () => ({
    meta: [
      { title: "Draft Preview | Kutuzov Control Room" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function PreviewRoute() {
  const { draft } = Route.useSearch();
  return <AdminDraftPreviewPage draftId={draft} />;
}

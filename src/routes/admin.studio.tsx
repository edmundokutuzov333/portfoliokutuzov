import { createFileRoute } from "@tanstack/react-router";
import { StudioAdminPage } from "@/components/admin/StudioIntelligenceSurface";

export const Route = createFileRoute("/admin/studio")({
  component: StudioAdminPage,
});

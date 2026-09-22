import { createFileRoute } from "@tanstack/react-router";
import { StudioIntelligenceSurface } from "@/components/admin/StudioIntelligenceSurface";

export const Route = createFileRoute("/admin/studio")({
  component: StudioAdminPage,
});

export const StudioAdminPage = StudioIntelligenceSurface;

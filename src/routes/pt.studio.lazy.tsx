import { createLazyFileRoute } from "@tanstack/react-router";
import { StudioLanding } from "@/routes/studio.lazy";

export const Route = createLazyFileRoute("/pt/studio")({
  component: StudioLanding,
});

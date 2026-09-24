import { createLazyFileRoute } from "@tanstack/react-router";
import { HomePhase5 } from "@/components/home/HomePhase5";

export const Route = createLazyFileRoute("/pt")({
  component: HomePhase5,
});

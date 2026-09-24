import { createLazyFileRoute } from "@tanstack/react-router";
import { HomePhase5 } from "@/components/home/HomePhase5";

export const Route = createLazyFileRoute("/")({
  component: HomePhase5,
});

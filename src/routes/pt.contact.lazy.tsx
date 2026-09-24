import { createLazyFileRoute } from "@tanstack/react-router";
import { ContactPagePhase11 } from "@/components/contact/ContactPagePhase11";

export const Route = createLazyFileRoute("/pt/contact")({
  component: ContactPagePhase11,
});

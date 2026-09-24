import { createLazyFileRoute } from "@tanstack/react-router";
import { ContactPagePhase11 } from "@/components/contact/ContactPagePhase11";

export const Route = createLazyFileRoute("/contact")({
  component: ContactPagePhase11,
});

export { ContactPagePhase11 as ContactPage };

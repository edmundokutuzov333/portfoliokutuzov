import { createFileRoute } from "@tanstack/react-router";
import { createSeo } from "@/lib/seo";
import { ServicesPagePhase9 } from "@/components/services/ServicesPagePhase9";

export const Route = createFileRoute("/services")({
  head: () =>
    createSeo({
      title: "Capabilities - Edmundo Kutuzov",
      description:
        "Capabilities and visual disciplines: art direction, brand identity, campaign design, and digital systems by Edmundo Kutuzov.",
      path: "/services",
    }),
  component: ServicesPagePhase9,
});

export { ServicesPagePhase9 as ServicesPage };
export default ServicesPagePhase9;

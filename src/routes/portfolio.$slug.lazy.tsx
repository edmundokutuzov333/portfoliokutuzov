import { createLazyFileRoute } from "@tanstack/react-router";
import { CaseStudyPage } from "@/components/portfolio/CaseStudyPage";

export const Route = createLazyFileRoute("/portfolio/$slug")({
  component: () => {
    const { slug } = Route.useParams();
    return <CaseStudyPage slug={slug} />;
  },
});

import { createFileRoute } from "@tanstack/react-router";
import { CaseStudyPage } from "@/components/portfolio/CaseStudyPage";
import { createSeo } from "@/lib/seo";
import { caseStudyOgImageUrl } from "@/lib/case-study";

export const Route = createFileRoute("/pt/portfolio/$slug")({
  head: ({ params }) =>
    createSeo({
      title: params.slug + " — Portfolio · Edmundo Kutuzov",
      description:
        "Case study: " +
        params.slug +
        " — trabalho publicado de Edmundo Kutuzov.",
      path: "/pt/portfolio/" + params.slug,
      image: caseStudyOgImageUrl(params.slug),
    }),
  component: PortugueseCaseStudyRoute,
});

function PortugueseCaseStudyRoute() {
  const { slug } = Route.useParams();
  return <CaseStudyPage slug={slug} />;
}

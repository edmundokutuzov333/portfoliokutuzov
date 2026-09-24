import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/newsreader/wght.css";
import { createFileRoute, Link } from "@tanstack/react-router";
import { caseStudyOgImageUrl } from "@/lib/case-study";
import { createSeo } from "@/lib/seo";
import { ProjectDetailPage } from "@/components/portfolio/CaseStudyPage";

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) =>
    createSeo({
      title: humanize(params.slug) + " — Portfolio · Edmundo Kutuzov",
      description:
        "Case study: " +
        humanize(params.slug) +
        " — art direction and visual systems by Edmundo Kutuzov.",
      path: "/portfolio/" + params.slug,
      image: caseStudyOgImageUrl(params.slug),
    }),
  component: CaseStudyRoute,
});

function humanize(slug: string): string {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function CaseStudyRoute() {
  const { slug } = Route.useParams();
  return <ProjectDetailPage slug={slug} />;
}

export default CaseStudyRoute;

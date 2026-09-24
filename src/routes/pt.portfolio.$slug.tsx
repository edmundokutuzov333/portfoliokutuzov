import { createFileRoute } from "@tanstack/react-router";
import { ProjectDetailPage } from "@/routes/portfolio.$slug";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/pt/portfolio/$slug")({
  head: ({ params }) => createSeo({
    title: `${params.slug} — Portfolio · Edmundo Kutuzov`,
    description: `Case study: ${params.slug} — art direction and visual systems by Edmundo Kutuzov.`,
    path: `/pt/portfolio/${params.slug}`,
  }),
  component: ProjectDetailPage,
});

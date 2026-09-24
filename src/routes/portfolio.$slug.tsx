import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { CaseStudyPage } from "@/components/portfolio/CaseStudyPage";
import { caseStudyOgImageUrl } from "@/lib/case-study";
import { createSeo } from "@/lib/seo";

function humanize(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function RoutePage() {
  const { slug } = Route.useParams();
  return <CaseStudyPage slug={slug} />;
}

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) => {
    const title = humanize(params.slug);
    return createSeo({
      title: title + " — Portfolio · Edmundo Kutuzov",
      description: "Case study: " + title + " — published work by Edmundo Kutuzov.",
      path: "/portfolio/" + params.slug,
      image: caseStudyOgImageUrl(params.slug),
    });
  },
  component: RoutePage,
  notFoundComponent: () => (
    <section className="min-h-screen bg-[#D6D4CE] px-5 pb-24 pt-36 text-black md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-sm">404</div>
        <h1 className="mt-8 font-cartaz text-[clamp(4rem,10vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.07em]">
          Project not found.
        </h1>
        <Link
          to="/portfolio"
          className="mt-12 inline-flex min-h-11 items-center gap-3 border-2 border-black bg-black px-5 py-3 text-sm font-semibold text-[#F2F2EF]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to archive
        </Link>
      </div>
    </section>
  ),
  errorComponent: ({ error }) => (
    <section className="min-h-screen bg-[#D6D4CE] px-5 pb-24 pt-36 text-black md:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="text-sm">Error</div>
        <h1 className="mt-8 font-cartaz text-[clamp(4rem,9vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.07em]">
          Could not load this project.
        </h1>
        <p className="mt-8 max-w-2xl font-livro text-lg text-[#3F3E3B]">{error.message}</p>
        <Link
          to="/portfolio"
          className="mt-12 inline-flex min-h-11 items-center gap-3 border-2 border-black bg-black px-5 py-3 text-sm font-semibold text-[#F2F2EF]"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to archive
        </Link>
      </div>
    </section>
  ),
});

export default Route;

import { useEffect, useMemo, useState } from "react";
import { Link, notFound } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { SITE_EMAIL } from "@/lib/cms";
import { useProjects } from "@/hooks/useSiteData";
import { useCaseStudy } from "@/hooks/useCaseStudy";
import {
  caseStudyPdfUrl,
  firstHexColor,
  getCaseStudyMedia,
  getCaseStudyTemplate,
  projectDisplayName,
  type CaseStudyMedia,
  type CaseStudyPayload,
} from "@/lib/case-study";
import { CaseStudyLightbox } from "@/components/portfolio/CaseStudyLightbox";
import { CaseStudyShareButton } from "@/components/portfolio/CaseStudyShareButton";
import { darkenWorkColor, pickFg, setWorkColor } from "@/lib/work-color";

function blockHeading(type: string): string {
  const labels: Record<string, string> = {
    context: "Context",
    challenge: "Challenge",
    direction: "Direction",
    execution: "Execution",
    outcome: "Outcome",
    custom: "Context",
  };

  return labels[type] || "Context";
}

function EditorialSections({ payload }: { payload: CaseStudyPayload }) {
  return (
    <div className="space-y-20 md:space-y-28">
      {payload.sections.map((section) => (
        <section
          key={section.id}
          className={
            section.section_type === "outcome"
              ? "bg-black px-6 py-10 text-[#F2F2EF] md:px-10 md:py-14"
              : ""
          }
        >
          <p
            className={
              section.section_type === "outcome"
                ? "text-sm text-[#B9B7B0]"
                : "text-sm text-[#3F3E3B]"
            }
          >
            {section.heading || blockHeading(section.section_type)}
          </p>

          {section.body ? (
            <p
              className={
                section.section_type === "outcome"
                  ? "mt-5 max-w-3xl text-2xl leading-[1.4] md:text-4xl"
                  : "mt-5 max-w-3xl text-xl leading-[1.6] text-black md:text-2xl"
              }
              style={{ fontFamily: '"Newsreader Variable", serif' }}
            >
              {section.body}
            </p>
          ) : null}
        </section>
      ))}
    </div>
  );
}

function FallbackSections({ payload }: { payload: CaseStudyPayload }) {
  const project = payload.project;
  const context = project.concept || project.description;
  const process = project.idea;
  const outcome = project.notes;

  return (
    <div className="space-y-20 md:space-y-28">
      {context ? (
        <section>
          <p className="text-sm text-[#3F3E3B]">Context</p>
          <p
            className="mt-5 max-w-3xl text-2xl leading-[1.35] text-black md:text-4xl"
            style={{ fontFamily: '"Newsreader Variable", serif' }}
          >
            {context}
          </p>
        </section>
      ) : null}

      {process ? (
        <section className="grid gap-6 md:grid-cols-12">
          <p className="text-sm text-[#3F3E3B] md:col-span-3">Process</p>
          <p
            className="max-w-3xl text-xl leading-[1.6] text-black md:col-span-8 md:col-start-5 md:text-2xl"
            style={{ fontFamily: '"Newsreader Variable", serif' }}
          >
            {process}
          </p>
        </section>
      ) : null}

      {outcome ? (
        <section className="bg-black px-6 py-10 text-[#F2F2EF] md:px-10 md:py-14">
          <p className="text-sm text-[#B9B7B0]">Outcome</p>
          <p
            className="mt-5 max-w-3xl text-2xl leading-[1.4] md:text-4xl"
            style={{ fontFamily: '"Newsreader Variable", serif' }}
          >
            {outcome}
          </p>
        </section>
      ) : null}

      {project.deliverables?.length ? (
        <section>
          <p className="text-sm text-[#3F3E3B]">Deliverables</p>
          <ul className="mt-5 grid gap-0 border-t-2 border-black md:grid-cols-2">
            {project.deliverables.map((item) => (
              <li key={item} className="border-b-2 border-black py-4 text-base">
                {item}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

function MediaGallery({
  media,
  title,
  onOpen,
}: {
  media: CaseStudyMedia[];
  title: string;
  onOpen: (item: CaseStudyMedia) => void;
}) {
  if (!media.length) return null;

  return (
    <section className="mt-20 border-t-2 border-black pt-8 md:mt-28">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="text-sm text-[#3F3E3B]">Gallery</p>
          <h2
            className="mt-2 text-4xl font-extrabold leading-none tracking-[-0.04em] md:text-6xl"
            style={{ fontFamily: '"Archivo Variable", sans-serif' }}
          >
            The work.
          </h2>
        </div>
        <span className="text-sm text-[#3F3E3B]">
          {media.length} {media.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="mt-8 grid gap-0 md:grid-cols-2">
        {media.map((item) => (
          <button
            type="button"
            key={item.id || item.url}
            className="group relative border-b-2 border-black text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)] focus-visible:ring-inset"
            onClick={() => onOpen(item)}
          >
            {item.media_type === "video" ? (
              <div className="bg-black p-5 md:p-8">
                <video
                  src={item.url}
                  poster={item.poster_url ?? undefined}
                  muted
                  playsInline
                  preload="metadata"
                  className="block max-h-[72vh] w-full object-contain"
                />
              </div>
            ) : item.media_type === "embed" ? (
              <div className="grid min-h-[260px] place-items-center bg-black p-6 text-[#F2F2EF]">
                <span className="text-sm">Open embedded media</span>
              </div>
            ) : (
              <div className="bg-[#F2F2EF]">
                <img
                  src={item.url}
                  alt={item.alt || title}
                  width={item.width || undefined}
                  height={item.height || undefined}
                  loading="lazy"
                  decoding="async"
                  className="block h-auto w-full object-contain"
                  style={{
                    aspectRatio:
                      item.width && item.height
                        ? String(item.width) + " / " + String(item.height)
                        : undefined,
                  }}
                />
              </div>
            )}

            {item.caption ? (
              <div className="border-t-2 border-black bg-[#D6D4CE] px-4 py-3 text-sm text-black">
                {item.caption}
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  );
}

function MetadataBlock({ payload }: { payload: CaseStudyPayload }) {
  const project = payload.project;

  const metadata = [
    ["Client", project.client_name],
    ["Year", project.year],
    ["Discipline", project.category],
    ["Role", project.role],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]));

  return (
    <aside className="border-t-2 border-black pt-5 md:border-l-2 md:border-t-0 md:pl-8">
      <div className="space-y-6">
        {metadata.map(([label, value]) => (
          <div key={label}>
            <p className="text-sm text-[#3F3E3B]">{label}</p>
            <p className="mt-1 text-lg text-black">{value}</p>
          </div>
        ))}

        {project.tags?.length ? (
          <div>
            <p className="text-sm text-[#3F3E3B]">Tags</p>
            <p className="mt-1 text-base leading-7 text-black">
              {project.tags.join(", ")}
            </p>
          </div>
        ) : null}

        {project.tools_used?.length ? (
          <div>
            <p className="text-sm text-[#3F3E3B]">Tools</p>
            <p className="mt-1 text-base leading-7 text-black">
              {project.tools_used.join(", ")}
            </p>
          </div>
        ) : null}

        {payload.credits.length ? (
          <div>
            <p className="text-sm text-[#3F3E3B]">Credits</p>
            <ul className="mt-1 space-y-1 text-base text-black">
              {payload.credits.map((credit) => (
                <li key={credit.id}>
                  {credit.role}: {credit.name}
                  {credit.organization ? " · " + credit.organization : ""}
                </li>
              ))}
            </ul>
          </div>
        ) : project.collaborators?.length ? (
          <div>
            <p className="text-sm text-[#3F3E3B]">Collaborators</p>
            <ul className="mt-1 space-y-1 text-base text-black">
              {project.collaborators.map((name) => (
                <li key={name}>{name}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </aside>
  );
}

function ResultsBlock({ metrics }: { metrics: CaseStudyPayload["metrics"] }) {
  if (!metrics.length) return null;

  return (
    <section className="mt-20 bg-[var(--case-work)] px-6 py-10 text-[var(--case-work-fg)] md:mt-28 md:px-10 md:py-14">
      <p className="text-sm opacity-80">Results</p>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {metrics.map((metric) => (
          <div key={metric.id} className="border-t-2 border-current pt-4">
            <div
              className="text-5xl font-extrabold leading-none tracking-[-0.04em] md:text-7xl"
              style={{ fontFamily: '"Archivo Variable", sans-serif' }}
            >
              {metric.value}
            </div>
            <div className="mt-2 text-base">{metric.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function RelatedProjects({ projects }: { projects: CaseStudyPayload["related"] }) {
  if (!projects.length) return null;

  return (
    <section className="mt-20 border-t-2 border-black pt-8 md:mt-28">
      <p className="text-sm text-[#3F3E3B]">Related work</p>

      <div className="mt-6 grid gap-0 md:grid-cols-3">
        {projects.map((project) => {
          const work = firstHexColor(project.palette);

          return (
            <Link
              key={project.id}
              to="/portfolio/$slug"
              params={{ slug: project.slug || project.id }}
              className="group border-b-2 border-black px-5 py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)] md:border-r-2"
              style={{ backgroundColor: darkWork, color: foreground }}
            >
              <p className="text-sm opacity-70">{project.year || "Project"}</p>
              <h3
                className="mt-16 text-3xl font-extrabold leading-none tracking-[-0.04em] transition-transform duration-200 group-hover:-translate-y-1 md:text-4xl"
                style={{ fontFamily: '"Archivo Variable", sans-serif' }}
              >
                {projectDisplayName(project)}
              </h3>
              <p className="mt-3 text-sm opacity-80">
                {project.category}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PreviousNext({
  previous,
  next,
}: {
  previous: CaseStudyPayload["previous"];
  next: CaseStudyPayload["next"];
}) {
  return (
    <nav
      aria-label="Project navigation"
      className="mt-20 border-t-2 border-black pt-8 md:mt-28"
    >
      <div className="grid gap-0 md:grid-cols-2">
        {previous ? (
          <Link
            to="/portfolio/$slug"
            params={{ slug: previous.slug || previous.id }}
            className="border-b-2 border-black py-8 pr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)] md:border-r-2 md:pr-10"
          >
            <span className="text-sm text-[#3F3E3B]">Previous</span>
            <h3
              className="mt-2 text-4xl font-extrabold leading-none tracking-[-0.04em]"
              style={{ fontFamily: '"Archivo Variable", sans-serif' }}
            >
              {projectDisplayName(previous)}
            </h3>
            <span className="mt-2 block text-sm text-[#3F3E3B]">
              {previous.year || ""}
            </span>
          </Link>
        ) : null}

        {next ? (
          <Link
            to="/portfolio/$slug"
            params={{ slug: next.slug || next.id }}
            className="border-b-2 border-black py-8 pl-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--case-work)] md:pl-10"
          >
            <span className="text-sm text-[#3F3E3B]">Next</span>
            <h3
              className="mt-2 text-4xl font-extrabold leading-none tracking-[-0.04em]"
              style={{ fontFamily: '"Archivo Variable", sans-serif' }}
            >
              {projectDisplayName(next)}
            </h3>
            <span className="mt-2 block text-sm text-[#3F3E3B]">
              {next.year || ""}
            </span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}

function ProjectDetailContent({ payload }: { payload: CaseStudyPayload }) {
  const [selectedMedia, setSelectedMedia] = useState<CaseStudyMedia | null>(null);
  const project = payload.project;
  const template = getCaseStudyTemplate(payload);
  const media = getCaseStudyMedia(project, payload.media);
  const work = firstHexColor(project.palette);
  const darkWork = darkenWorkColor(work);
  const foreground = pickFg(darkWork);
  const reference = project.description || project.subtitle || "";

  useEffect(() => {
    const root = document.documentElement;
    setWorkColor(work);
    root.style.setProperty("--case-work", darkWork);
    root.style.setProperty("--case-work-fg", foreground);
    root.style.setProperty("--case-cal", "#F2F2EF");

    return () => {
      root.style.removeProperty("--case-work");
      root.style.removeProperty("--case-work-fg");
      root.style.removeProperty("--case-cal");
    };
  }, [work]);

  return (
    <article className="bg-[#D6D4CE] text-black" data-testid="case-study-page">
      <section
        className="bg-black text-[#F2F2EF]"
        style={{ viewTransitionName: "case-" + (project.slug || project.id) }}
      >
        <div className="mx-auto grid min-h-[76vh] max-w-[1500px] gap-10 px-5 pb-14 pt-32 md:px-10 md:pt-40">
          <div className="max-w-6xl self-end">
            <p className="text-sm text-[#B9B7B0]">
              {(project.year ? project.year + " · " : "") + project.category}
            </p>

            <h1
              className="mt-5 max-w-6xl text-6xl font-extrabold leading-[0.86] tracking-[-0.055em] md:text-[112px]"
              style={{
                fontFamily: '"Archivo Variable", sans-serif',
                fontVariationSettings: '"wdth" 72, "wght" 800',
              }}
            >
              {projectDisplayName(project)}
            </h1>

            {project.title !== projectDisplayName(project) ? (
              <p
                className="mt-4 max-w-3xl text-2xl text-[#B9B7B0] md:text-4xl"
                style={{ fontFamily: '"Newsreader Variable", serif' }}
              >
                {project.title}
              </p>
            ) : null}

            {project.subtitle ? (
              <p className="mt-5 max-w-2xl text-base leading-7 text-[#F2F2EF]/80 md:text-xl md:leading-8">
                {project.subtitle}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 border-t-2 border-[#F2F2EF]/30 pt-4 md:grid-cols-3">
            {[
              ["Client", project.client_name],
              ["Year", project.year],
              ["Discipline", project.category],
            ]
              .filter((entry): entry is [string, string] => Boolean(entry[1]))
              .map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-[#B9B7B0]">{label}</p>
                  <p className="mt-1 text-base text-[#F2F2EF]">{value}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {project.cover_url ? (
        <section className="border-b-2 border-black bg-[#F2F2EF] px-5 py-5 md:px-10 md:py-10">
          <img
            src={project.cover_url}
            alt={project.title}
            width={project.cover_width || undefined}
            height={project.cover_height || undefined}
            className="mx-auto block h-auto max-h-[82vh] w-full object-contain"
            style={{
              viewTransitionName: "case-cover-" + (project.slug || project.id),
              aspectRatio:
                project.cover_width && project.cover_height
                  ? String(project.cover_width) + " / " + String(project.cover_height)
                  : undefined,
            }}
          />
        </section>
      ) : null}

      <section className="mx-auto grid max-w-[1500px] gap-12 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
        <div className="md:col-span-8">
          {template === "editorial" ? (
            <EditorialSections payload={payload} />
          ) : (
            <FallbackSections payload={payload} />
          )}

          {project.video_url ? (
            <div className="mt-20 border-t-2 border-black pt-8">
              <p className="text-sm text-[#3F3E3B]">Motion</p>
              <video
                src={project.video_url}
                poster={project.cover_url || undefined}
                controls
                playsInline
                preload="metadata"
                className="mt-5 block max-h-[78vh] w-full bg-black"
              />
            </div>
          ) : null}

          <ResultsBlock metrics={payload.metrics} />
          <MediaGallery
            media={media}
            title={project.title}
            onOpen={setSelectedMedia}
          />
        </div>

        <div className="md:col-span-4">
          <MetadataBlock payload={payload} />
        </div>
      </section>

      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <RelatedProjects projects={payload.related} />
        <PreviousNext previous={payload.previous} next={payload.next} />
      </div>

      <section className="mt-20 bg-[var(--case-work)] text-[var(--case-work-fg)] md:mt-28">
        <div className="mx-auto grid max-w-[1500px] gap-8 px-5 py-16 md:grid-cols-12 md:px-10 md:py-24">
          <div className="md:col-span-8">
            <p className="text-sm opacity-80">Continue the conversation</p>
            <h2
              className="mt-5 max-w-4xl text-5xl font-extrabold leading-[0.9] tracking-[-0.05em] md:text-8xl"
              style={{
                fontFamily: '"Archivo Variable", sans-serif',
                fontVariationSettings: '"wdth" 72, "wght" 800',
              }}
            >
              Tell me what you're building.
            </h2>
          </div>

          <div className="flex flex-wrap items-end gap-3 md:col-span-4 md:justify-end">
            <Link
              to="/contact"
              search={{ ref: project.slug || project.id } as never}
              className="inline-flex min-h-11 items-center border-2 border-current bg-black px-5 py-3 text-sm text-[#F2F2EF] hover:bg-[#F2F2EF] hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F2F2EF] focus-visible:ring-offset-2"
            >
              Start a project
            </Link>

            <a
              href={caseStudyPdfUrl(project.slug || project.id)}
              className="inline-flex min-h-11 items-center gap-2 border-2 border-current px-5 py-3 text-sm hover:bg-black hover:text-[#F2F2EF] focus:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
            >
              <Download size={16} aria-hidden="true" />
              PDF
            </a>

            <CaseStudyShareButton
              title={projectDisplayName(project)}
              text={reference}
            />
          </div>
        </div>
      </section>

      <footer className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 border-t-2 border-black px-5 py-8 text-sm md:px-10">
        <span>{SITE_EMAIL}</span>
        <span>edmundokutuzov.art</span>
      </footer>

      {selectedMedia ? (
        <CaseStudyLightbox
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      ) : null}
    </article>
  );
}

export function ProjectDetailPage({ slug }: { slug: string }) {
  const caseQuery = useCaseStudy(slug);
  const { data: projects = [], isLoading: projectsLoading } = useProjects();

  const fallbackProject = useMemo(
    () =>
      projects.find((candidate) => (candidate.slug || candidate.id) === slug) ||
      null,
    [projects, slug],
  );

  const fallbackPayload = useMemo<CaseStudyPayload | null>(() => {
    if (!fallbackProject) return null;

    const ordered = [...projects].sort(
      (a, b) => a.sort_order - b.sort_order,
    );

    const index = ordered.findIndex(
      (candidate) => candidate.id === fallbackProject.id,
    );

    return {
      project: fallbackProject,
      sections: [],
      media: [],
      metrics: [],
      credits: [],
      previous:
        index > 0
          ? ordered[index - 1]
          : ordered[ordered.length - 1] || null,
      next:
        index >= 0
          ? ordered[index + 1] || ordered[0] || null
          : null,
      related: ordered
        .filter(
          (candidate) =>
            candidate.id !== fallbackProject.id &&
            candidate.category === fallbackProject.category,
        )
        .slice(0, 3),
    };
  }, [fallbackProject, projects]);

  const payload = caseQuery.data || fallbackPayload;

  if (!payload && (caseQuery.isLoading || projectsLoading)) {
    return (
      <section className="min-h-screen bg-[#D6D4CE] px-5 pb-24 pt-40 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="h-5 w-32 bg-black/10" />
          <div className="mt-8 h-20 w-[80%] bg-black/10" />
          <div className="mt-5 h-8 w-[50%] bg-black/10" />
        </div>
      </section>
    );
  }

  if (!payload) throw notFound();

  return <ProjectDetailContent payload={payload} />;
}

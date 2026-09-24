import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Download, ExternalLink, Image as ImageIcon, Link2, Share2, X } from "lucide-react";
import { useProjects } from "@/hooks/useSiteData";
import { usePortfolioCase, type PortfolioCaseMedia, type PortfolioCaseSection } from "@/hooks/usePortfolioCase";
import { SITE_EMAIL, normalizeCategory, type DbProject } from "@/lib/cms";
import { ContextualCursor } from "@/components/portfolio/ContextualCursor";
import { createSeo, SITE_ORIGIN } from "@/lib/seo";
import { darkenWorkColor, pickFg, setWorkColor } from "@/lib/work-color";

const CASE_DESCRIPTION = "Case study from the published portfolio of Edmundo Kutuzov.";
const DEFAULT_WORK = "#2f4bff";

function humanize(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function paletteColor(project: DbProject) {
  const matches = project.palette?.match(/#[0-9a-f]{6}\b/gi) ?? [];
  return matches.at(-1) ?? DEFAULT_WORK;
}

function sectionBody(
  sections: PortfolioCaseSection[],
  types: string[],
  fallback: string | null | undefined,
) {
  const section = sections.find((item) => types.includes(item.section_type.toLowerCase()) && item.body?.trim());
  return section?.body?.trim() || fallback?.trim() || "";
}

function sectionHeading(sections: PortfolioCaseSection[], types: string[], fallback: string) {
  const section = sections.find((item) => types.includes(item.section_type.toLowerCase()) && item.heading?.trim());
  return section?.heading?.trim() || fallback;
}

function youtubeEmbed(url: string) {
  const match =
    url.match(/youtu\.be\/([\w-]{6,})/i) ||
    url.match(/youtube\.com\/(?:watch\?v=|embed\/|shorts\/)([\w-]{6,})/i);
  return match ? "https://www.youtube.com/embed/" + match[1] : null;
}

function vimeoEmbed(url: string) {
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  return match ? "https://player.vimeo.com/video/" + match[1] : null;
}

function videoSource(url: string, provider?: string | null) {
  const youtube = provider === "youtube" || /youtu/i.test(url) ? youtubeEmbed(url) : null;
  const vimeo = provider === "vimeo" || /vimeo/i.test(url) ? vimeoEmbed(url) : null;
  return youtube || vimeo || null;
}

function imageList(project: DbProject, media: PortfolioCaseMedia[]) {
  const raw = [
    ...(project.cover_url
      ? [{
          url: project.cover_url,
          width: project.cover_width ?? undefined,
          height: project.cover_height ?? undefined,
          alt: project.title,
          caption: null as string | null,
        }]
      : []),
    ...(project.gallery_meta ?? []).map((item) => ({
      url: item.url,
      width: item.width,
      height: item.height,
      alt: item.alt ?? project.title,
      caption: null,
    })),
    ...(project.gallery ?? []).map((url) => ({ url, alt: project.title, caption: null })),
    ...media
      .filter((item) => item.media_type.toLowerCase() === "image")
      .map((item) => ({
        url: item.url,
        width: item.width ?? undefined,
        height: item.height ?? undefined,
        alt: item.alt ?? project.title,
        caption: item.caption,
      })),
  ];
  const seen = new Set<string>();
  return raw.filter((item) => {
    if (!item.url || seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
}

function MediaStage({ project, media }: { project: DbProject; media: PortfolioCaseMedia[] }) {
  const featured = media.find((item) => item.is_featured) ?? media[0];
  const videoUrl = project.video_url || (featured?.media_type === "video" ? featured.url : null);
  if (videoUrl) {
    const embed = videoSource(videoUrl, project.video_provider ?? featured?.media_type);
    return embed ? (
      <div className="aspect-video w-full overflow-hidden border-2 border-black bg-black">
        <iframe
          src={embed}
          title={project.title}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    ) : (
      <video
        src={videoUrl}
        poster={project.cover_url ?? featured?.poster_url ?? undefined}
        controls
        playsInline
        preload="metadata"
        className="h-auto max-h-[78vh] w-full bg-black"
      />
    );
  }
  const image = project.cover_url ?? (featured?.media_type === "image" ? featured.url : null);
  if (image) {
    return (
      <img
        src={image}
        alt={project.title}
        width={project.cover_width ?? featured?.width ?? undefined}
        height={project.cover_height ?? featured?.height ?? undefined}
        className="block h-auto w-full object-contain"
        decoding="async"
        fetchPriority="high"
      />
    );
  }
  return (
    <div className="flex min-h-[48vh] items-end border-2 border-black p-6 md:p-10" style={{ background: "var(--work-dark)", color: "var(--work-foreground)" }}>
      <div className="max-w-4xl">
        <div className="font-livro text-lg md:text-xl">
          Published case study
        </div>
        <div className="mt-5 font-cartaz text-[clamp(4rem,10vw,10rem)] font-extrabold leading-[0.8] tracking-[-0.07em]">
          {project.title}
        </div>
        <div className="mt-6 max-w-2xl text-base md:text-lg">
          Visual media for this case study is not present in the current production dataset.
        </div>
      </div>
    </div>
  );
}

function GalleryLightbox({
  images,
  title,
}: {
  images: Array<{ url: string; width?: number; height?: number; alt?: string; caption?: string | null }>;
  title: string;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [index, setIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const current = images[index];

  const open = (nextIndex: number) => {
    setIndex(nextIndex);
    const dialog = dialogRef.current;
    if (dialog && typeof dialog.showModal === "function" && !dialog.open) dialog.showModal();
  };

  const close = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
  };

  const previous = () => setIndex((value) => (value - 1 + images.length) % images.length);
  const next = () => setIndex((value) => (value + 1) % images.length);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => setTouchStart(null);
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        {images.map((image, imageIndex) => (
          <button
            type="button"
            key={image.url}
            onClick={() => open(imageIndex)}
            className={imageIndex % 3 === 0 ? "group md:col-span-12" : "group md:col-span-6"}
            aria-label={"Open " + (image.alt || title) + " in full screen"}
          >
            <span className="block overflow-hidden border-2 border-black bg-[#f2f2ef]">
              <img
                src={image.url}
                alt={image.alt || title}
                width={image.width}
                height={image.height}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full object-contain transition-transform duration-500 ease-[var(--ease-signature)] group-hover:scale-[1.01]"
              />
            </span>
            {image.caption ? <span className="mt-2 block text-left font-livro text-sm text-[#3f3e3b]">{image.caption}</span> : null}
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        className="m-0 h-screen w-screen max-h-none max-w-none bg-black/95 p-0 text-white backdrop:bg-black/90"
        aria-label={title + " gallery"}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <div
          className="relative flex h-full w-full items-center justify-center p-4 md:p-10"
          onTouchStart={(event) => setTouchStart(event.changedTouches[0]?.clientX ?? null)}
          onTouchEnd={(event) => {
            if (touchStart === null) return;
            const end = event.changedTouches[0]?.clientX ?? touchStart;
            const delta = end - touchStart;
            if (Math.abs(delta) > 48) delta > 0 ? previous() : next();
            setTouchStart(null);
          }}
        >
          {current ? (
            <div className="max-h-full max-w-[min(92vw,1400px)]">
              <img
                src={current.url}
                alt={current.alt || title}
                width={current.width}
                height={current.height}
                className="max-h-[82vh] w-auto max-w-full object-contain"
              />
              {current.caption ? <p className="mt-4 font-livro text-sm text-white/80">{current.caption}</p> : null}
            </div>
          ) : null}
          <button type="button" onClick={close} className="absolute right-4 top-4 grid h-11 w-11 place-items-center border-2 border-white text-white" aria-label="Close gallery">
            <X size={20} />
          </button>
          {images.length > 1 ? (
            <>
              <button type="button" onClick={previous} className="absolute left-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border-2 border-white text-white" aria-label="Previous image">
                <ArrowLeft size={18} />
              </button>
              <button type="button" onClick={next} className="absolute right-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center border-2 border-white text-white" aria-label="Next image">
                <ArrowRight size={18} />
              </button>
            </>
          ) : null}
          <div className="absolute bottom-4 left-4 font-livro text-sm text-white/80" aria-live="polite">
            {index + 1} / {images.length}
          </div>
        </div>
      </dialog>
    </>
  );
}

function ShareButton({ projectTitle }: { projectTitle: string }) {
  const [status, setStatus] = useState("");
  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: projectTitle, text: "Edmundo Kutuzov — " + projectTitle, url });
        setStatus("Shared");
      } else {
        await navigator.clipboard.writeText(url);
        setStatus("Link copied");
      }
    } catch {
      setStatus("Share cancelled");
    }
    window.setTimeout(() => setStatus(""), 2400);
  };
  return (
    <button type="button" onClick={() => void share()} className="inline-flex min-h-11 items-center gap-3 border-2 border-black px-4 py-3 text-sm font-semibold transition-colors hover:bg-black hover:text-[#f2f2ef] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
      <Share2 size={16} />
      Share
      <span className="sr-only" aria-live="polite">{status}</span>
    </button>
  );
}

export const Route = createFileRoute("/portfolio/$slug")({
  head: ({ params }) => {
    const image = SITE_ORIGIN + "/api/portfolio-og/" + encodeURIComponent(params.slug);
    const seo = createSeo({
      title: humanize(params.slug) + " — Portfolio · Edmundo Kutuzov",
      description: CASE_DESCRIPTION,
      path: "/portfolio/" + params.slug,
      image,
    });
    return {
      ...seo,
      meta: [
        ...seo.meta,
        { property: "og:image:type", content: "image/svg+xml" },
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
      ],
    };
  },
  component: ProjectDetailPage,
  notFoundComponent: () => (
    <section className="min-h-screen bg-[#d6d4ce] px-4 pb-24 pt-36 text-black md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="font-livro text-xl">404</div>
        <h1 className="mt-8 font-cartaz text-[clamp(4rem,10vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.07em]">Project not found.</h1>
        <Link to="/portfolio" className="mt-12 inline-flex min-h-11 items-center gap-3 border-2 border-black bg-black px-5 py-3 text-sm font-semibold text-[#f2f2ef]">Back to archive</Link>
      </div>
    </section>
  ),
  errorComponent: ({ error }) => (
    <section className="min-h-screen bg-[#d6d4ce] px-4 pb-24 pt-36 text-black md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="font-livro text-xl">Error</div>
        <h1 className="mt-8 font-cartaz text-[clamp(4rem,9vw,8rem)] font-extrabold leading-[0.82] tracking-[-0.07em]">Could not load this project.</h1>
        <p className="mt-8 max-w-2xl font-livro text-lg text-[#3f3e3b]">{error.message}</p>
        <Link to="/portfolio" className="mt-12 inline-flex min-h-11 items-center gap-3 border-2 border-black bg-black px-5 py-3 text-sm font-semibold text-[#f2f2ef]">Back to archive</Link>
      </div>
    </section>
  ),
});

export function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const { data: rawProjects = [], isLoading: isProjectsLoading } = useProjects();
  const { data, isLoading: isCaseLoading } = usePortfolioCase(slug);
  const [shareStatus, setShareStatus] = useState("");

  const project = data?.project ?? null;
  const images = useMemo(() => (project ? imageList(project, data?.media ?? []) : []), [data?.media, project]);

  const { prev, next } = useMemo(() => {
    const published = rawProjects.filter((item) => item.is_published !== false);
    if (!project) return { prev: null, next: null };
    const index = published.findIndex((item) => (item.slug || item.id) === slug);
    if (index < 0) return { prev: null, next: null };
    return {
      prev: published[(index - 1 + published.length) % published.length] ?? null,
      next: published[(index + 1) % published.length] ?? null,
    };
  }, [project, rawProjects, slug]);

  const related = useMemo(() => {
    if (!project) return [];
    const explicit = data?.related ?? [];
    if (explicit.length) return explicit.slice(0, 3);
    const category = normalizeCategory(project.category);
    return rawProjects
      .filter((item) => item.id !== project.id && normalizeCategory(item.category) === category)
      .slice(0, 3);
  }, [data?.related, project, rawProjects]);

  const work = project ? paletteColor(project) : DEFAULT_WORK;
  const workDark = darkenWorkColor(work);
  const workForeground = pickFg(workDark);

  useEffect(() => {
    setWorkColor(work);
    return () => setWorkColor(DEFAULT_WORK);
  }, [work]);

  if (isCaseLoading || isProjectsLoading) {
    return (
      <section className="min-h-screen bg-[#d6d4ce] px-4 pb-24 pt-36 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="h-8 w-40 animate-pulse bg-black/10" />
          <div className="mt-10 h-32 w-3/4 animate-pulse bg-black/10" />
          <div className="mt-12 h-[42vh] animate-pulse bg-black/10" />
        </div>
      </section>
    );
  }

  if (!project || !data) throw notFound();

  const sections = data.sections ?? [];
  const metrics = data.metrics ?? [];
  const credits = data.credits ?? [];
  const process = sectionBody(sections, ["process", "approach", "method"], project.idea);
  const context = sectionBody(sections, ["context", "brief", "challenge", "problem"], project.concept || project.description);
  const result = sectionBody(sections, ["result", "results", "outcome", "impact"], project.notes);
  const contextHeading = sectionHeading(sections, ["context", "brief", "challenge", "problem"], "Context");
  const processHeading = sectionHeading(sections, ["process", "approach", "method"], "Process");
  const resultHeading = sectionHeading(sections, ["result", "results", "outcome", "impact"], "Results");
  const hasStructuredProcess = Boolean(process);
  const hasResults = Boolean(result) || metrics.length > 0 || credits.length > 0;
  const style = {
    "--work": work,
    "--work-dark": workDark,
    "--work-foreground": workForeground,
    viewTransitionName: "work-" + (project.slug || project.id),
  } as CSSProperties;

  return (
    <article className="bg-[#d6d4ce] text-black" style={style}>
      <ContextualCursor />

      <header className="grid grid-cols-4 gap-4 border-b-2 border-black bg-black px-4 pb-10 pt-36 text-[#f2f2ef] md:grid-cols-12 md:gap-6 md:px-8 md:pb-16 md:pt-40">
        <div className="col-span-4 md:col-span-12">
          <Link to="/portfolio" className="inline-flex min-h-11 items-center gap-3 border-b-2 border-transparent pb-1 text-sm text-[#b9b7b0] transition-colors hover:border-[#f2f2ef] hover:text-[#f2f2ef] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f2f2ef]">
            <ArrowLeft size={16} />
            Back to archive
          </Link>
        </div>
        <div className="col-span-4 md:col-span-8 md:mt-10">
          <div className="text-sm text-[#b9b7b0]">{[project.year, normalizeCategory(project.category)].filter(Boolean).join(" · ")}</div>
          <h1 className="mt-5 max-w-6xl font-cartaz text-[clamp(4rem,11vw,11rem)] font-extrabold leading-[0.8] tracking-[-0.075em]">
            {project.title}
          </h1>
          {project.client_name && project.client_name !== project.title ? (
            <p className="mt-6 max-w-3xl font-livro text-xl leading-[1.45] text-[#f2f2ef] md:text-2xl">{project.client_name}</p>
          ) : null}
          {project.subtitle ? <p className="mt-3 max-w-3xl font-livro text-base text-[#b9b7b0] md:text-lg">{project.subtitle}</p> : null}
        </div>
        <div className="col-span-4 md:col-span-4 md:mt-10">
          <div className="border-l-2 border-[#f2f2ef] pl-5 md:pl-6">
            <div className="text-sm text-[#b9b7b0]">Work Colour</div>
            <div className="mt-3 h-16 w-16 border-2 border-[#f2f2ef]" style={{ background: work }} aria-label={"Work Colour " + work} />
          </div>
        </div>
      </header>

      <section className="bg-[var(--work-dark)] px-4 py-6 text-[var(--work-foreground)] md:px-8 md:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-4 md:col-span-12">
            <MediaStage project={project} media={data.media ?? []} />
          </div>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-4 border-b-2 border-black bg-[#f2f2ef] px-4 py-14 md:grid-cols-12 md:gap-6 md:px-8 md:py-20">
        <div className="col-span-4 md:col-span-3">
          <div className="font-livro text-lg">Case record</div>
        </div>
        <dl className="col-span-4 grid grid-cols-1 gap-7 text-sm md:col-span-9 md:grid-cols-3">
          {project.client_name ? <div><dt className="font-semibold">Client</dt><dd className="mt-2 text-[#3f3e3b]">{project.client_name}</dd></div> : null}
          {project.year ? <div><dt className="font-semibold">Year</dt><dd className="mt-2 text-[#3f3e3b]">{project.year}</dd></div> : null}
          <div><dt className="font-semibold">Discipline</dt><dd className="mt-2 text-[#3f3e3b]">{normalizeCategory(project.category)}</dd></div>
          {project.role ? <div><dt className="font-semibold">Role</dt><dd className="mt-2 text-[#3f3e3b]">{project.role}</dd></div> : null}
          {project.tags?.length ? <div className="md:col-span-2"><dt className="font-semibold">Tags</dt><dd className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-[#3f3e3b]">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</dd></div> : null}
        </dl>
      </section>

      <section className="grid grid-cols-4 gap-4 border-b-2 border-black px-4 py-16 md:grid-cols-12 md:gap-6 md:px-8 md:py-24">
        <div className="col-span-4 md:col-span-3">
          <h2 className="font-cartaz text-4xl font-extrabold leading-none tracking-[-0.05em]">The story</h2>
        </div>
        <div className="col-span-4 space-y-14 md:col-span-8 md:col-start-5">
          {context ? (
            <section>
              <h3 className="font-cartaz text-2xl font-extrabold leading-none">{contextHeading}</h3>
              <p className="mt-4 max-w-3xl font-livro text-xl leading-[1.6] text-[#3f3e3b]">{context}</p>
            </section>
          ) : null}
          {hasStructuredProcess ? (
            <section>
              <h3 className="font-cartaz text-2xl font-extrabold leading-none">{processHeading}</h3>
              <p className="mt-4 max-w-3xl font-livro text-xl leading-[1.6] text-[#3f3e3b]">{process}</p>
            </section>
          ) : null}
          {result ? (
            <section className="border-l-2 border-black pl-5 md:pl-6">
              <h3 className="font-cartaz text-2xl font-extrabold leading-none">{resultHeading}</h3>
              <p className="mt-4 max-w-3xl font-livro text-xl leading-[1.6] text-[#3f3e3b]">{result}</p>
            </section>
          ) : null}
          {metrics.length ? (
            <section aria-labelledby="results-heading">
              <h3 id="results-heading" className="font-cartaz text-2xl font-extrabold leading-none">Measured results</h3>
              <div className="mt-6 grid grid-cols-1 gap-0 border-t-2 border-black md:grid-cols-2">
                {metrics.map((metric) => (
                  <div key={metric.id} className="border-b-2 border-black py-5 md:pr-8">
                    <div className="font-cartaz text-4xl font-extrabold leading-none tracking-[-0.04em]">{metric.value}</div>
                    <div className="mt-2 font-livro text-base text-[#3f3e3b]">{metric.label}</div>
                  </div>
                ))}
              </div>
            </section>
          ) : null}
          {!context && !hasStructuredProcess && !result && metrics.length === 0 ? (
            <p className="font-livro text-lg text-[#3f3e3b]">This case study currently contains published metadata only.</p>
          ) : null}
        </div>
      </section>

      {images.length ? (
        <section className="border-b-2 border-black bg-[#f2f2ef] px-4 py-16 md:px-8 md:py-24" aria-labelledby="gallery-heading">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
              <div className="col-span-4 md:col-span-3">
                <h2 id="gallery-heading" className="font-cartaz text-4xl font-extrabold leading-none tracking-[-0.05em]">Gallery</h2>
              </div>
              <div className="col-span-4 md:col-span-9">
                <GalleryLightbox images={images} title={project.title} />
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {(project.tools_used?.length || project.deliverables?.length || project.collaborators?.length || credits.length) ? (
        <section className="grid grid-cols-4 gap-4 border-b-2 border-black px-4 py-16 md:grid-cols-12 md:gap-6 md:px-8 md:py-24">
          <div className="col-span-4 md:col-span-3">
            <h2 className="font-cartaz text-4xl font-extrabold leading-none tracking-[-0.05em]">Credits</h2>
          </div>
          <div className="col-span-4 grid gap-10 md:col-span-9 md:grid-cols-2">
            {credits.length ? (
              <div>
                <h3 className="font-semibold">People and organisations</h3>
                <ul className="mt-4 space-y-3 font-livro text-lg text-[#3f3e3b]">
                  {credits.map((credit) => (
                    <li key={credit.id}>{credit.name}{credit.organization ? " — " + credit.organization : ""} <span className="text-[#6a6863]">({credit.role})</span></li>
                  ))}
                </ul>
              </div>
            ) : null}
            {project.collaborators?.length ? (
              <div>
                <h3 className="font-semibold">Collaborators</h3>
                <ul className="mt-4 space-y-3 font-livro text-lg text-[#3f3e3b]">{project.collaborators.map((person) => <li key={person}>{person}</li>)}</ul>
              </div>
            ) : null}
            {project.tools_used?.length ? (
              <div>
                <h3 className="font-semibold">Tools</h3>
                <ul className="mt-4 space-y-3 font-livro text-lg text-[#3f3e3b]">{project.tools_used.map((tool) => <li key={tool}>{tool}</li>)}</ul>
              </div>
            ) : null}
            {project.deliverables?.length ? (
              <div>
                <h3 className="font-semibold">Deliverables</h3>
                <ul className="mt-4 space-y-3 font-livro text-lg text-[#3f3e3b]">{project.deliverables.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {related.length ? (
        <section className="border-b-2 border-black bg-black px-4 py-16 text-[#f2f2ef] md:px-8 md:py-24" aria-labelledby="related-heading">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
              <div className="col-span-4 md:col-span-3">
                <h2 id="related-heading" className="font-cartaz text-4xl font-extrabold leading-none tracking-[-0.05em]">Related work</h2>
              </div>
              <div className="col-span-4 grid gap-0 md:col-span-9">
                {related.map((item) => (
                  <Link
                    key={item.id}
                    to="/portfolio/$slug"
                    params={{ slug: item.slug || item.id }}
                    viewTransition
                    className="grid min-h-24 grid-cols-1 border-b-2 border-white/20 py-5 md:grid-cols-12 md:items-center md:gap-6 hover:bg-[var(--work)] hover:text-black focus-visible:bg-[var(--work)] focus-visible:text-black"
                    style={{ ["--work" as string]: paletteColor(item) } as CSSProperties}
                  >
                    <span className="md:col-span-1 text-sm">{item.year ?? "—"}</span>
                    <span className="md:col-span-7 font-cartaz text-4xl font-extrabold leading-none tracking-[-0.05em]">{item.title}</span>
                    <span className="md:col-span-4 text-sm">{item.client_name || "—"}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-4 py-16 md:px-8 md:py-24" style={{ background: work, color: workForeground }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
            <div className="col-span-4 md:col-span-8">
              <h2 className="font-cartaz text-[clamp(4rem,9vw,9rem)] font-extrabold leading-[0.82] tracking-[-0.07em]">Start a project.</h2>
              <p className="mt-6 max-w-2xl font-livro text-xl leading-[1.55]">Use this case as the starting reference for a new brief.</p>
            </div>
            <div className="col-span-4 flex flex-col items-start justify-end gap-3 md:col-span-4 md:items-end">
              <Link to="/contact" search={{ ref: project.slug || project.id }} className="inline-flex min-h-11 items-center gap-3 border-2 border-current bg-current px-5 py-3 text-sm font-semibold text-[var(--work)] transition-colors hover:bg-transparent hover:text-current focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                Start a project
              </Link>
              <div className="flex flex-wrap gap-3">
                <ShareButton projectTitle={project.title} />
                <a href={"/api/portfolio-pdf/" + encodeURIComponent(project.slug || project.id)} className="inline-flex min-h-11 items-center gap-3 border-2 border-current px-4 py-3 text-sm font-semibold hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current" download>
                  <Download size={16} />
                  PDF
                </a>
                <a href={"mailto:" + SITE_EMAIL + "?subject=" + encodeURIComponent("Project inquiry inspired by " + project.title)} className="inline-flex min-h-11 items-center gap-3 border-2 border-current px-4 py-3 text-sm font-semibold hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current">
                  <Link2 size={16} />
                  Email
                </a>
              </div>
              <span className="sr-only" aria-live="polite">{shareStatus}</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="grid grid-cols-1 border-b-2 border-black bg-[#d6d4ce] md:grid-cols-2" aria-label="Project navigation">
        {prev ? (
          <Link to="/portfolio/$slug" params={{ slug: prev.slug || prev.id }} viewTransition className="min-h-48 border-b-2 border-black p-6 md:border-b-0 md:border-r-2 md:p-10 hover:bg-black hover:text-[#f2f2ef] focus-visible:bg-black focus-visible:text-[#f2f2ef]">
            <div className="flex items-center gap-3 text-sm"><ArrowLeft size={16} /> Previous project</div>
            <div className="mt-6 font-cartaz text-4xl font-extrabold leading-none tracking-[-0.05em]">{prev.title}</div>
          </Link>
        ) : <div />}
        {next ? (
          <Link to="/portfolio/$slug" params={{ slug: next.slug || next.id }} viewTransition className="min-h-48 p-6 md:p-10 hover:bg-black hover:text-[#f2f2ef] focus-visible:bg-black focus-visible:text-[#f2f2ef]">
            <div className="flex items-center justify-between text-sm"><span>Next project</span><ArrowRight size={16} /></div>
            <div className="mt-6 font-cartaz text-4xl font-extrabold leading-none tracking-[-0.05em]">{next.title}</div>
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
